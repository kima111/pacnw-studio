import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import HeroVideo from "@/components/HeroVideo";
import GearTimeline from "@/components/GearTimeline";
import WorkCard from "@/components/WorkCard";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-black/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <Logo size={36} className="shrink-0" />
            <span className="text-base font-semibold leading-6 tracking-tight dark:text-white md:text-lg">PacNW Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
              <a href="#services" className="text-slate-700 hover:opacity-80 dark:text-slate-200">Services</a>
              <a href="#work" className="text-slate-700 hover:opacity-80 dark:text-slate-200">Work</a>
              <a href="#testimonials" className="text-slate-700 hover:opacity-80 dark:text-slate-200">Testimonials</a>
              <a href="#contact" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
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
      <section id="services" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="text-2xl font-semibold sm:text-3xl">Services built for impact</h2>
        <p className="mt-2 max-w-prose text-slate-600 dark:text-slate-300">
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
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Why our work hits harder</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Years of building the right tools—automation, collaboration, proven technology, and AI in the process—
            frees us to focus on the craft that moves people.
          </p>
        </div>
        <GearTimeline physicsLocked={false} freeSpinSpeeds={[0.8, -0.6, 1.2, -0.94]} />
      </section>

      {/* Selected Work */}
      <section id="work" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold sm:text-3xl">Selected work</h2>
          <span className="text-sm text-slate-500">click cards for more details</span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <WorkCard
            title="Summit Outfitters"
            tag="E‑commerce • Web"
            kind="website"
            siteUrl="https://example.com" 
            description="Modern e‑commerce with fast filters, rich product pages, and a frictionless checkout."
          />
          <WorkCard
            title="Cedar & Sea"
            tag="Brand Film • Video"
            kind="video"
            videoEmbedUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
            description="A narrative brand film that blends coastal visuals with founder voiceover to drive brand affinity."
          />
          <WorkCard
            title="Harbor Roasters"
            tag="Lifestyle • Photo"
            kind="photo"
            photos={[
              { src: "/media/hero/screen-poster.jpg", alt: "Lifestyle 1" },
              { src: "/media/hero/pacnw-poster.jpg", alt: "Lifestyle 2" },
              { src: "/media/hero/pacnw-poster.jpg", alt: "Lifestyle 3" },
            ]}
            description="Warm lifestyle photography for web and social, focused on ritual and craft."
          />
          <WorkCard
            title="Cascade Trails"
            tag="Marketing Site • Web"
            kind="website"
            siteUrl="https://example.org"
            description="A conversion‑focused marketing site with testimonials, guides, and a resource library."
          />
          <WorkCard
            title="North Co. Tools"
            tag="Product • Photo"
            kind="photo"
            photos={[
              { src: "/media/hero/pacnw-poster.jpg", alt: "Product 1" },
              { src: "/media/hero/screen-poster.jpg", alt: "Product 2" },
            ]}
            description="Clean studio product photos with consistent angles and color‑accurate retouching."
          />
          <WorkCard
            title="Soundside Clinic"
            tag="Recruiting Film • Video"
            kind="video"
            videoSources={[
              { src: "/media/hero/pacnw-hero.webm", type: "video/webm" },
              { src: "/media/hero/pacnw-hero.mp4", type: "video/mp4" },
            ]}
            poster="/media/hero/pacnw-poster.jpg"
            description="A recruiting spot highlighting team culture, impact, and growth—optimized for paid social."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
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
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <blockquote className="text-slate-700 dark:text-slate-200">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-slate-500">
                {t.name} • {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-6 pb-24 pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white shadow-md dark:border-slate-700">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <h2 className="text-2xl font-semibold sm:text-3xl">Let’s build something Pacific‑North‑Best</h2>
          <p className="mt-2 max-w-prose text-teal-50">
            Tell us about your goals and timeline. We’ll reply with a plan and a fixed quote.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:hello@pacnw.studio?subject=Project%20inquiry"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-teal-50"
            >
              hello@pacnw.studio
            </a>
            <a
              href="tel:+12065550123"
              className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              +1 (206) 555‑0123
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-800">
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
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-xl transition group-hover:opacity-30`} aria-hidden />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{tagline}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-teal-500" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
