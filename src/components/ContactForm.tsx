"use client";

import { type FormEvent, useMemo, useState } from "react";

type ApiResponse =
  | {
      ok: true;
      debug?: {
        owner?: { id?: string; fromUsed?: string; skipped?: string };
        confirmation?: { id?: string; fromUsed?: string; skipped?: string; error?: string };
      };
    }
  | { ok: false; error: string };

type DebugInfo = NonNullable<Extract<ApiResponse, { ok: true }>["debug"]>;

export default function ContactForm() {
  const startedAt = useMemo(() => Date.now(), []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // honeypot: should remain empty (use a name that's less likely to be autofilled)
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  function formatError(code: string) {
    switch (code) {
      case "too_fast":
        return "Please wait a couple seconds and try again.";
      case "rate_limited":
        return "Too many attempts. Please wait a minute and try again.";
      case "sender_not_authorized":
        return "Email sending isn’t authorized for the current sender address. Use a verified sender/domain in Resend (or use onboarding@resend.dev).";
      case "email_not_configured":
        return "Email sending isn’t configured on the server yet.";
      case "missing_to_email":
        return "Server is missing CONTACT_TO_EMAIL.";
      case "email_send_failed":
        return "Email sending failed. Double-check your Resend API key and verified sender/domain.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorText("");
    setDebugInfo(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website,
          formStartedAt: startedAt,
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;
      if (!res.ok || !data || data.ok === false) {
        const code = !data ? "unknown" : data.ok ? "unknown" : data.error;
        throw new Error(code);
      }

      if (process.env.NODE_ENV !== "production" && data.debug) setDebugInfo(data.debug);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "unknown";
      setErrorText(formatError(msg));
    }
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  const nameTooShort = trimmedName.length < 2;
  const emailTooShort = trimmedEmail.length < 5;
  const messageTooShort = trimmedMessage.length < 10;

  const disabledReason =
    status === "submitting"
      ? "Sending…"
      : nameTooShort
        ? "Add your name (at least 2 characters)."
        : emailTooShort
          ? "Add a valid email."
          : messageTooShort
            ? "Message must be at least 10 characters."
            : "";

  const isDisabled = Boolean(disabledReason);

  return (
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold">Send a message</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Your email stays private — this form sends your note directly to us.
      </p>

      {status === "success" ? (
        <div className="mt-4 rounded-md border border-border bg-secondary p-3 text-sm">
          <div className="font-semibold">Message sent.</div>
          <div className="mt-1 text-muted-foreground">
            We’ll reply as soon as possible. You should also receive a confirmation email.
          </div>

          {process.env.NODE_ENV !== "production" ? (
            <div className="mt-2 text-xs text-muted-foreground">
              {debugInfo?.owner?.skipped === "missing_api_key" ? (
                <div className="text-destructive">
                  Dev note: emails were not sent because <code>RESEND_API_KEY</code> is missing (messages are
                  only logged in the server console).
                </div>
              ) : null}
              {debugInfo?.owner?.id ? (
                <div className="mt-1">
                  Owner email id{" "}
                  <code className="rounded bg-muted px-1 py-0.5">{debugInfo.owner.id}</code>
                  {debugInfo.owner.fromUsed ? (
                    <>
                      {" "}
                      • from{" "}
                      <code className="rounded bg-muted px-1 py-0.5">{debugInfo.owner.fromUsed}</code>
                    </>
                  ) : null}
                </div>
              ) : null}
              {debugInfo?.confirmation?.id ? (
                <div className="mt-1">
                  Confirmation email id{" "}
                  <code className="rounded bg-muted px-1 py-0.5">{debugInfo.confirmation.id}</code>
                </div>
              ) : null}
              {debugInfo?.confirmation?.error ? (
                <div className="mt-1 text-destructive">
                  Confirmation email failed: <code>{debugInfo.confirmation.error}</code>
                </div>
              ) : null}
              {debugInfo?.confirmation?.skipped ? (
                <div className="mt-1">Confirmation: {debugInfo.confirmation.skipped}</div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {/* Honeypot (hidden) */}
          <div
            className="absolute left-[-10000px] top-auto h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                inputMode="none"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Name
              <input
                className="h-10 rounded-md border border-input bg-background px-2.5 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Email
              <input
                type="email"
                className="h-10 rounded-md border border-input bg-background px-2.5 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm font-medium">
            What are you building?
            <textarea
              className="min-h-[120px] resize-y rounded-md border border-input bg-background px-2.5 py-2.5 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Project goals, timeline, links, and anything helpful…"
              required
              minLength={10}
              maxLength={4000}
            />
          </label>

          <p className="text-xs text-muted-foreground">
            Spam protection is enabled.
          </p>

          {status === "error" ? (
            <p className="text-sm text-destructive">
              {errorText}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            title={disabledReason || undefined}
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>

          {isDisabled && status !== "submitting" ? (
            <p className="text-xs text-muted-foreground">{disabledReason}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}


