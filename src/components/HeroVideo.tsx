import HeroSitePreviewCarousel from "@/components/HeroSitePreviewCarousel";
import { projects } from "@/data/projects";

export default function HeroVideo() {
  return (
    <section className="relative isolate h-[80vh] min-h-[540px] w-full overflow-hidden">
      {/* Background: static cinematic gradient (slider moved into the screen) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Edge fade */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        }}
      />

      {/* Motion spotlights */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div
          className="absolute h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            left: "15%",
            top: "20%",
            background:
              "radial-gradient(closest-side,#22d3ee,transparent 70%)",
            animation: "float 24s ease-in-out infinite",
          }}
        />
        <div
          className="absolute h-[70vmin] w-[70vmin] translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            right: "10%",
            top: "35%",
            background:
              "radial-gradient(closest-side,#a78bfa,transparent 70%)",
            animation: "float 30s ease-in-out -5s infinite",
          }}
        />
        <div
          className="absolute h-[60vmin] w-[60vmin] -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl"
          style={{
            left: "35%",
            bottom: "-10%",
            background:
              "radial-gradient(closest-side,#14b8a6,transparent 70%)",
            animation: "float 28s ease-in-out -12s infinite",
          }}
        />
      </div>

      {/* Subtle grid (separate layers per theme for optimal contrast) */}
      {/* Light mode grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff1a 1px,transparent 1px),linear-gradient(90deg,#ffffff1a 1px,transparent 1px)",
          backgroundSize: "80px 80px, 80px 80px",
          backgroundPosition: "0 0, 0 0",
          animation: "grid-pan 40s linear infinite",
        }}
      />
      {/* Dark mode grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-30 mix-blend-overlay dark:block"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff26 1px,transparent 1px),linear-gradient(90deg,#ffffff26 1px,transparent 1px)",
          backgroundSize: "80px 80px, 80px 80px",
          backgroundPosition: "0 0, 0 0",
          animation: "grid-pan 40s linear infinite",
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay dark:opacity-15"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')",
        }}
      />

      {/* Dark veil for contrast */}
      <div className="absolute inset-0 bg-slate-950/45 dark:bg-background/70" />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-4 md:pr-[580px]">
        <div className="inline-flex items-center gap-3 rounded-md border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur md:text-xs">
          <span>WEB</span><span>•</span><span>VIDEO</span><span>•</span><span>PHOTO</span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Pacific Northwest stories and cinematic visuals with stunning websites
        </h1>

        <p className="mt-4 max-w-prose text-white/80">
          High‑impact websites, cinematic video, and photography built to convert. One team, end‑to‑end.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white px-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-white/90"
          >
            Start a project
          </a>
          <a
            href="#work"
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/25 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
          >
            See our work
          </a>
        </div>

        {/* Brand lockup removed by request */}

        {/* 3D stage: tilted “highlight reel” screen */}
        <div className="mt-10 w-full md:absolute md:right-6 md:top-1/2 md:mt-0 md:w-[560px] md:-translate-y-1/2 md:z-0">
          <div className="relative h-[320px] w-full [perspective:1400px]">
            {/* glow */}
            <div aria-hidden className="absolute -inset-12 rounded-md bg-teal-400/25 blur-3xl" />
            {/* screen */}
            <div className="relative h-full w-full rounded-md border border-white/20 bg-black/70 shadow-2xl ring-1 ring-white/10 [transform-style:preserve-3d] [transform:rotateY(-18deg)_rotateX(8deg)]">
              <div aria-hidden className="absolute -inset-px rounded-[inherit] bg-gradient-to-b from-white/40 to-white/5 opacity-20" />
              <div className="absolute inset-2.5 h-[calc(100%-20px)] w-[calc(100%-20px)] rounded-sm overflow-hidden">
                {/* In-screen demo: site preview carousel (each slide is a live website preview) */}
                <HeroSitePreviewCarousel items={projects} intervalMs={3600} fadeMs={650} />
                {/* subtle contrast veil for readability */}
                <div aria-hidden className="absolute inset-0 bg-black/15" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grid-pan { from { background-position: 0 0, 0 0; } to { background-position: 1600px 0, 0 1600px; } }
        @keyframes float { 0% { transform: translate3d(0,0,0) scale(1); }
                           50% { transform: translate3d(4%, -6%, 0) scale(1.05); }
                           100% { transform: translate3d(0,0,0) scale(1); } }
      `}</style>
    </section>
  );
}