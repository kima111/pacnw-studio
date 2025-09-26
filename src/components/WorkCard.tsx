"use client";

import { useMemo, useState } from "react";

type VideoSource = { src: string; type: string };
type PhotoItem = { src: string; alt?: string };

export type WorkCardProps = {
  title: string;
  tag: string;
  kind: "website" | "video" | "photo";
  siteUrl?: string; // for website previews
  videoEmbedUrl?: string; // e.g. YouTube embed URL
  videoSources?: VideoSource[]; // for local video files
  poster?: string;
  photos?: PhotoItem[]; // for photo gallery
  description?: string; // short description shown on the back
};

export default function WorkCard(props: WorkCardProps) {
  const { title, tag, kind } = props;
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((f) => !f);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <article
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm outline-none transition hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={onKey}
   >
      {/* Preview area with flip */}
      <div className="relative h-56 w-full overflow-hidden rounded-xl bg-gradient-to-br from-teal-400/30 via-cyan-400/20 to-indigo-400/30 [perspective:1200px]">
        <div className={`absolute inset-0 rounded-xl [transform-style:preserve-3d] transition-transform duration-700 ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
          {/* front */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            {kind === "website" && <WebsitePreview {...props} />}
            {kind === "video" && <VideoPreview {...props} />}
            {kind === "photo" && <PhotoCarousel {...props} />}
          </div>
          {/* back */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur" />
            <div className="relative z-10 flex max-w-[90%] flex-col items-center gap-2 text-center">
              <div className="text-sm font-semibold text-white">{title}</div>
              <div className="text-[11px] uppercase tracking-wide text-white/70">{tag}</div>
              {props.description && (
                <p className="mt-1 text-xs leading-relaxed text-white/80">
                  {props.description}
                </p>
              )}
              {kind === "website" && props.siteUrl && (
                <a
                  href={props.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                >
                  Open site ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-slate-200">{title}</h3>
        <span className="text-xs text-slate-500">{tag}</span>
      </div>
    </article>
  );
}

function WebsitePreview({ siteUrl }: WorkCardProps) {
  if (!siteUrl) return null;
  // Many sites disallow embedding; we display an overlay hint and an Open button.
  return (
    <div className="absolute inset-0">
      <iframe
        src={siteUrl}
        title="Website preview"
        className="pointer-events-none absolute inset-0 h-full w-full rounded-xl bg-white dark:bg-slate-900"
        sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups"
        referrerPolicy="no-referrer"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

function VideoPreview({ videoEmbedUrl, videoSources, poster }: WorkCardProps) {
  if (videoEmbedUrl) {
    return (
      <div className="absolute inset-0">
        <iframe
          src={videoEmbedUrl}
          title="Video preview"
          className="absolute inset-0 h-full w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  const sources = videoSources ?? [];
  return (
    <video
      className="absolute inset-0 h-full w-full rounded-xl object-cover"
      controls
      playsInline
      poster={poster}
    >
      {sources.map((s, i) => (
        <source key={i} src={s.src} type={s.type} />
      ))}
    </video>
  );
}

function PhotoCarousel({ photos = [] }: WorkCardProps) {
  const valid = useMemo(() => photos.filter(Boolean), [photos]);
  const [idx, setIdx] = useState(0);
  const next = (e?: React.MouseEvent) => { e?.stopPropagation?.(); setIdx((i) => (i + 1) % Math.max(valid.length, 1)); };
  const prev = (e?: React.MouseEvent) => { e?.stopPropagation?.(); setIdx((i) => (i - 1 + Math.max(valid.length, 1)) % Math.max(valid.length, 1)); };

  if (!valid.length) return null;

  return (
    <div className="absolute inset-0">
      {/* current image */}
      <img
        src={valid[idx]?.src}
        alt={valid[idx]?.alt ?? "Gallery image"}
        className="absolute inset-0 h-full w-full rounded-xl object-cover"
      />

      {/* controls */}
      {valid.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white ring-1 ring-white/20 backdrop-blur hover:bg-black/70"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white ring-1 ring-white/20 backdrop-blur hover:bg-black/70"
          >
            ›
          </button>
        </>
      )}

      {/* dots */}
      {valid.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {valid.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              className={"h-1.5 w-1.5 rounded-full " + (i === idx ? "bg-white" : "bg-white/50")}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
