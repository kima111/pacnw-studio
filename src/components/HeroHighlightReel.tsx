"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/data/projects";

function safeHostname(siteUrl?: string) {
  if (!siteUrl) return undefined;
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return undefined;
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onChange = () => setReduced(mq.matches);
    onChange();

    // Safari < 14 fallback: DOM types always include addEventListener, so we runtime-check via a widened type.
    const anyMq = mq as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    if (typeof anyMq.addEventListener === "function") {
      anyMq.addEventListener("change", onChange);
      return () => anyMq.removeEventListener("change", onChange);
    }

    if (typeof anyMq.addListener === "function") {
      anyMq.addListener(onChange);
      return () => anyMq.removeListener?.(onChange);
    }
  }, []);

  return reduced;
}

export default function HeroHighlightReel({
  items,
  intervalMs = 2600,
  className = "",
  density = "roomy",
}: {
  items: Project[];
  intervalMs?: number;
  className?: string;
  density?: "roomy" | "tight";
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  const normalized = useMemo(() => items.filter(Boolean), [items]);
  const count = normalized.length;

  useEffect(() => {
    if (reducedMotion) return;
    if (count <= 1) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [count, intervalMs, reducedMotion]);

  if (!count) return null;

  return (
    <div
      className={
        "relative h-full w-full overflow-hidden " +
        (density === "tight" ? "rounded-sm" : "rounded-md") +
        " " +
        className
      }
      aria-hidden
    >
      {/* animated slides */}
      <div className="absolute inset-0">
        {normalized.map((p, i) => {
          const hostname = safeHostname(p.siteUrl);
          const faviconSrc = hostname
            ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`
            : undefined;

          return (
            <div
              key={p.title + i}
              className={
                "absolute inset-0 transition-opacity duration-700 ease-out will-change-[opacity] " +
                (i === active ? "opacity-100" : "opacity-0")
              }
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />

              {/* accent blobs */}
              <div
                aria-hidden
                className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -right-14 top-1/3 h-52 w-52 rounded-full bg-violet-400/20 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute bottom-0 left-1/3 h-64 w-64 -translate-y-10 rounded-full bg-teal-400/15 blur-3xl"
              />

              {/* subtle scanlines */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.10) 1px, transparent 1px, transparent 6px)",
                  backgroundSize: "100% 6px",
                }}
              />

              {/* content */}
              <div
                className={
                  "absolute inset-x-0 bottom-0 p-3 " +
                  (density === "tight" ? "sm:p-3.5" : "sm:p-4")
                }
              >
                <div className="flex items-center gap-3">
                  {faviconSrc ? (
                    // Use <img> (not next/image) to avoid Next image allowlist config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faviconSrc}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-sm border border-white/10 bg-white/5"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-sm border border-white/10 bg-white/5" />
                  )}

                  <div className="min-w-0">
                    <div
                      className={
                        "truncate font-semibold text-white " +
                        (density === "tight"
                          ? "text-sm sm:text-base"
                          : "text-base sm:text-lg")
                      }
                    >
                      {p.title}
                    </div>
                    <div className="truncate text-xs text-white/70 sm:text-sm">
                      {p.tag}
                      {hostname ? <span className="text-white/45"> • {hostname}</span> : null}
                    </div>
                  </div>

                  <div className="ml-auto shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-semibold text-white/70">
                    {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </div>
                </div>

                {/* bottom fade for legibility */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      {/* glass sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rotate-[-12deg] bg-gradient-to-b from-white/12 via-white/0 to-white/0"
        style={{ transform: "translate3d(0,0,0) rotate(-12deg)" }}
      />
    </div>
  );
}


