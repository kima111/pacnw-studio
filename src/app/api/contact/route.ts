import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  company?: string; // honeypot (legacy)
  website?: string; // honeypot (preferred; less likely to be autofilled)
  formStartedAt?: number; // epoch ms, used to block instant bot submits
};

declare global {
  var __contactRateLimit: Map<string, { count: number; resetAt: number }> | undefined;
}

const rateLimitStore: Map<string, { count: number; resetAt: number }> =
  globalThis.__contactRateLimit ?? new Map();
globalThis.__contactRateLimit = rateLimitStore;

function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const xrip = headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}

function checkRateLimit(key: string, windowMs: number, max: number) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }
  if (entry.count >= max) return { ok: false, remaining: 0, resetAt: entry.resetAt };
  entry.count += 1;
  rateLimitStore.set(key, entry);
  return { ok: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

function isValidEmail(email: string) {
  // pragmatic, not perfect — enough for contact form validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendViaResend(args: {
  to: string;
  from: string;
  subject: string;
  replyTo?: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      // dev convenience: don't block local testing
      console.log("[contact] RESEND_API_KEY missing; logging message instead:", {
        to: args.to,
        from: args.from,
        subject: args.subject,
        replyTo: args.replyTo,
        text: args.text,
      });
      return { ok: true as const, skipped: "missing_api_key" as const };
    }
    return { ok: false as const, error: "email_not_configured" };
  }

  const sendOnce = async (from: string) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [args.to],
        subject: args.subject,
        reply_to: args.replyTo,
        text: args.text,
        html: args.html,
      }),
    });
    return { res, from };
  };

  const primary = args.from;
  const fallback = "PacNW Studio <onboarding@resend.dev>";

  let attempt = await sendOnce(primary);
  let res = attempt.res;
  let fromUsed = attempt.from;

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[contact] Resend error:", res.status, errText);

    // If the sender domain isn't authorized in Resend, try a known-good fallback sender.
    if (res.status === 403 && primary !== fallback) {
      console.warn("[contact] Sender not authorized; retrying with fallback sender:", fallback);
      attempt = await sendOnce(fallback);
      res = attempt.res;
      fromUsed = attempt.from;
      if (res.ok) {
        const json = (await res.json().catch(() => null)) as { id?: string } | null;
        return { ok: true as const, id: json?.id, fromUsed };
      }

      const errText2 = await res.text().catch(() => "");
      console.error("[contact] Resend error (fallback):", res.status, errText2);
      return { ok: false as const, error: "sender_not_authorized" };
    }

    if (res.status === 403) return { ok: false as const, error: "sender_not_authorized" };
    return { ok: false as const, error: "email_send_failed" };
  }

  const json = (await res.json().catch(() => null)) as { id?: string } | null;
  return { ok: true as const, id: json?.id, fromUsed };
}

export async function POST(req: Request) {
  let payload: ContactPayload | null = null;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (payload?.name || "").trim();
  const email = (payload?.email || "").trim();
  const message = (payload?.message || "").trim();
  const company = (payload?.company || "").trim(); // honeypot (legacy key)
  const website = (payload?.website || "").trim(); // honeypot (preferred key)
  const formStartedAt = typeof payload?.formStartedAt === "number" ? payload.formStartedAt : undefined;

  // Honeypot: if it's filled, it's probably a bot. However, password managers / autofill
  // can sometimes fill hidden fields, which would silently drop real leads. So:
  // - If honeypot is filled AND the submit was "instant", treat as bot and pretend success.
  // - Otherwise, continue and send, but flag the message as suspicious in the email body.
  const honeypotValue = website || company;
  const honeypotTripped = honeypotValue.length > 0;

  // Basic timing check: humans don't submit instantly.
  let elapsed: number | undefined;
  if (formStartedAt) {
    elapsed = Date.now() - formStartedAt;
    if (elapsed < 2500) {
      // If the honeypot is tripped and the submission is instant, swallow it.
      if (honeypotTripped) return NextResponse.json({ ok: true }, { status: 200 });
      return NextResponse.json({ ok: false, error: "too_fast" }, { status: 429 });
    }
  }

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  if (!isValidEmail(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (message.length < 10 || message.length > 4000) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
  }

  const ip = getClientIp(req.headers);
  const rl1 = checkRateLimit(`contact:minute:${ip}`, 60_000, 5);
  if (!rl1.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  const rl2 = checkRateLimit(`contact:hour:${ip}`, 60 * 60_000, 20);
  if (!rl2.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const to = process.env.CONTACT_TO_EMAIL || "";
  const from = process.env.CONTACT_FROM_EMAIL || "PacNW Studio <onboarding@resend.dev>";
  if (!to) return NextResponse.json({ ok: false, error: "missing_to_email" }, { status: 500 });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");
  const subject = `${honeypotTripped ? "[Possible spam] " : ""}New inquiry — ${name}`;

  const text =
    `New inquiry from ${name}\nReply-to: ${email}\nIP: ${ip}` +
    (elapsed != null ? `\nElapsed: ${elapsed}ms` : "") +
    (honeypotTripped ? `\nHoneypot filled: ${honeypotValue}` : "") +
    `\n\n${message}`;
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
      <h2 style="margin:0 0 12px;">New inquiry</h2>
      <p style="margin:0 0 12px;"><strong>Name:</strong> ${safeName}<br/>
      <strong>Email:</strong> ${safeEmail}<br/>
      <strong>IP:</strong> ${escapeHtml(ip)}${
        elapsed != null ? `<br/><strong>Elapsed:</strong> ${escapeHtml(String(elapsed))}ms` : ""
      }${
        honeypotTripped
          ? `<br/><strong style="color:#b45309;">Honeypot filled:</strong> ${escapeHtml(honeypotValue)}`
          : ""
      }</p>
      <div style="padding:12px 14px; border:1px solid #e5e7eb; border-radius:12px;">
        ${safeMessage}
      </div>
    </div>
  `.trim();

  const sent = await sendViaResend({
    to,
    from,
    subject,
    replyTo: email,
    text,
    html,
  });

  if (!sent.ok) return NextResponse.json({ ok: false, error: sent.error }, { status: 500 });

  console.log("[contact] owner email", {
    to,
    fromUsed: "fromUsed" in sent ? sent.fromUsed : from,
    id: "id" in sent ? sent.id : undefined,
    skipped: "skipped" in sent ? sent.skipped : undefined,
  });

  // Send a confirmation ("thank you") email to the submitter.
  // Important: don't auto-reply to suspicious submissions; it can confirm addresses to spammers.
  let confirmation:
    | { ok: true; id?: string; fromUsed?: string; skipped?: "missing_api_key" }
    | { ok: false; error: string }
    | null = null;

  if (!honeypotTripped) {
    const confirmSubject = "Thanks for reaching out — PacNW Studio";
    const confirmText =
      `Hi ${name},\n\n` +
      `Thanks for reaching out. We received your message and will reply as soon as possible.\n\n` +
      `— PacNW Studio\n\n` +
      `Your message:\n` +
      `${message}\n`;

    const confirmHtml = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
        <p style="margin:0 0 12px;">Hi ${safeName},</p>
        <p style="margin:0 0 12px;">
          Thanks for reaching out. We received your message and will reply as soon as possible.
        </p>
        <p style="margin:0 0 12px;">— PacNW Studio</p>
        <div style="margin-top:16px; padding:12px 14px; border:1px solid #e5e7eb; border-radius:12px;">
          ${safeMessage}
        </div>
      </div>
    `.trim();

    confirmation = await sendViaResend({
      to: email,
      from,
      subject: confirmSubject,
      replyTo: to,
      text: confirmText,
      html: confirmHtml,
    });

    if (!confirmation.ok) {
      // Don't fail the entire request if only the confirmation email fails.
      console.error("[contact] confirmation email failed:", confirmation.error);
    } else {
      console.log("[contact] confirmation email", {
        to: email,
        fromUsed: "fromUsed" in confirmation ? confirmation.fromUsed : from,
        id: "id" in confirmation ? confirmation.id : undefined,
        skipped: "skipped" in confirmation ? confirmation.skipped : undefined,
      });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json(
      {
        ok: true,
        debug: {
          owner: {
            id: "id" in sent ? sent.id : undefined,
            fromUsed: "fromUsed" in sent ? sent.fromUsed : undefined,
            skipped: "skipped" in sent ? sent.skipped : undefined,
          },
          confirmation:
            confirmation == null
              ? { skipped: honeypotTripped ? "spam_suspected" : "not_sent" }
              : confirmation.ok
                ? {
                    id: "id" in confirmation ? confirmation.id : undefined,
                    fromUsed: "fromUsed" in confirmation ? confirmation.fromUsed : undefined,
                    skipped: "skipped" in confirmation ? confirmation.skipped : undefined,
                  }
                : { error: confirmation.error },
        },
      },
      { status: 200 },
    );
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}


