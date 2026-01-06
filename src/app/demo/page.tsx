import { projects } from "@/data/projects";

export const dynamic = "force-static";

function safeHostname(siteUrl?: string) {
  if (!siteUrl) return "";
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return "";
  }
}

export default function DemoPage() {
  // This page is intentionally lightweight: it’s used as a hero underlay iframe.
  const sites = projects.filter((p) => p.kind === "website" && !!p.siteUrl);
  // Repeat for a seamless-ish scroll loop (but keep the count modest to avoid too many iframes).
  const items = [...sites, ...sites];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md border border-border bg-muted" />
            <div className="text-sm font-semibold tracking-tight">PacNW Studio</div>
          </div>
          <div className="hidden items-center gap-5 text-xs text-muted-foreground sm:flex">
            <span>Services</span>
            <span>Work</span>
            <span>Testimonials</span>
            <span className="rounded-md bg-primary px-2.5 py-0.5 text-primary-foreground">Get a quote</span>
          </div>
        </div>
      </div>

      {/* “Demo” body: auto-scroll real website previews (like Selected work cards) */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <div className="h-7 w-64 rounded-md bg-muted" />
          <div className="mt-3 h-4 w-[520px] max-w-full rounded-md bg-muted/70" />
        </div>

        <div className="relative overflow-hidden rounded-md border border-border bg-card p-4 shadow-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-card to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-card to-transparent" />

          <div className="demo-scroll">
            <div className="grid gap-6">
              {items.map((p, i) => (
                <article
                  key={`${p.title}-${i}`}
                  className="relative overflow-hidden rounded-md border border-border bg-background p-4"
                >
                  <div
                    aria-hidden
                    className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-teal-500/30 to-cyan-500/20 blur-2xl"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{p.title}</div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {p.tag} • {safeHostname(p.siteUrl)}
                      </div>
                    </div>
                    <div className="shrink-0 rounded-md border border-border bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      WEB
                    </div>
                  </div>

                  {/* Website preview (same idea as WorkCard's WebsitePreview) */}
                  <div className="relative mt-3 h-[260px] w-full overflow-hidden rounded-md border border-border bg-muted">
                    {/* fake browser chrome */}
                    <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center gap-2 border-b border-border bg-background/80 px-2.5 backdrop-blur">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                      <div className="ml-2 h-5 flex-1 rounded-md bg-muted/70" />
                    </div>

                    <iframe
                      src={p.siteUrl}
                      title={`${p.title} website preview`}
                      className="pointer-events-none absolute inset-0 h-full w-full rounded-md bg-background"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* soft fade for legibility */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/45 to-transparent opacity-70" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        html, body { height: 100%; overflow: hidden; }
        /* Smooth scroll loop inside the underlay iframe */
        .demo-scroll {
          will-change: transform;
          animation: demo-marquee 26s linear infinite;
        }
        @keyframes demo-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(0, -50%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .demo-scroll { animation: none; }
        }
      `}</style>
    </main>
  );
}


