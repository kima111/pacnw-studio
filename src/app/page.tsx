import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import HeroVideo from "@/components/HeroVideo";
import GearTimeline from "@/components/GearTimeline";
import WorkCard from "@/components/WorkCard";
import ContactForm from "@/components/ContactForm";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:py-3">
          <div className="flex items-center gap-3">
            <Logo size={36} className="shrink-0" />
            <span className="text-base font-semibold leading-6 tracking-tight md:text-lg">PacNW Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
              <a href="#services" className="text-muted-foreground transition hover:text-foreground">Services</a>
              <a href="#work" className="text-muted-foreground transition hover:text-foreground">Work</a>
              <a href="#testimonials" className="text-muted-foreground transition hover:text-foreground">Testimonials</a>
              <a
                href="#contact"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                Get a quote
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero (video) */}
      <HeroVideo />

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Services built for impact</h2>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Strategy-first creative executed by a single team. Clean handoff, measurable results.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            title="Websites"
            tagline="Fast, accessible, conversion‑focused"
            points={[
              "Next.js + Tailwind for speed and maintainability",
              "Design systems, CMS, and analytics baked in",
              "SEO and Core Web Vitals from day one",
            ]}
            accent="from-teal-500 to-cyan-500"
          />
          <ServiceCard
            title="Video"
            tagline="Cinematic stories that sell"
            points={[
              "Concept → shoot → edit → color → delivery",
              "Brand, product, testimonial, and social cuts",
              "Captions, motion graphics, and platform specs",
            ]}
            accent="from-indigo-500 to-violet-500"
          />
          <ServiceCard
            title="Photography"
            tagline="Authentic visuals that feel like you"
            points={[
              "Brand, lifestyle, and product photography",
              "On‑location lighting and direction",
              "Retouching and export for web & print",
            ]}
            accent="from-emerald-500 to-teal-500"
          />
        </div>
      </section>

      {/* Why we’re effective (gear timeline) */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Why our work hits harder</h2>
          <p className="mt-2 text-muted-foreground">
            Years of building the right tools—automation, collaboration, proven technology, and AI in the process—
            frees us to focus on the craft that moves people.
          </p>
        </div>
        <GearTimeline physicsLocked={false} freeSpinSpeeds={[0.8, -0.6, 1.2, -0.94]} />
      </section>

      {/* Selected Work */}
      <section id="work" className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold sm:text-3xl">Selected work</h2>
          <span className="text-sm text-muted-foreground">click cards for more details</span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12">
          {projects.map((p) => (
            <WorkCard
              key={p.title}
              title={p.title}
              tag={p.tag}
              kind={p.kind}
              siteUrl={p.siteUrl}
              description={p.description}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Clients, on the record</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "PacNW delivered a site that loads instantly and converts. We saw a 38% lift in qualified leads.",
              name: "Elena R.",
              role: "VP Marketing, Summit Outfitters",
            },
            {
              quote:
                "The brand film captured our story perfectly. It’s the centerpiece of every campaign now.",
              name: "Marcus T.",
              role: "Founder, Cedar & Sea",
            },
            {
              quote:
                "Photography that actually looks like us. Consistent, on‑brand, and ready for any channel.",
              name: "Dana K.",
              role: "CMO, Soundside Clinic",
            },
          ].map((t, i) => (
            <figure
              key={i}
              className="rounded-md border border-border bg-card p-4 shadow-sm"
            >
              <blockquote className="text-sm leading-relaxed text-foreground">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">{t.name} • {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-12 pt-6">
        <div className="relative overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary to-primary/70 p-4 text-primary-foreground shadow-md">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Let’s build something Pacific‑North‑Best</h2>
              <p className="mt-2 max-w-prose text-primary-foreground/85">
                Tell us about your goals and timeline. We’ll reply with a plan and a fixed quote.
              </p>
            </div>

            <div className="text-foreground">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PacNW Studio. All rights reserved.
      </footer>
    </main>
  );
}

function ServiceCard({
  title,
  tagline,
  points,
  accent,
}: {
  title: string;
  tagline: string;
  points: string[];
  accent: string; // e.g. "from-teal-500 to-cyan-500"
}) {
  return (
    <article className="group relative overflow-hidden rounded-md border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-xl transition group-hover:opacity-25`} aria-hidden />
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-teal-500" />
            <span className="text-foreground/90">{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
