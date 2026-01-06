"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

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
      className="group relative cursor-pointer overflow-hidden rounded-md border border-border bg-card p-4 shadow-sm outline-none transition hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-5"
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={onKey}
   >
      {/* Preview area with flip */}
      <div className="relative h-[360px] w-full overflow-hidden rounded-md bg-muted [perspective:1200px] md:h-[440px] lg:h-[520px] xl:h-[560px]">
        <div
          className={`absolute inset-0 rounded-md [transform-style:preserve-3d] transition-transform duration-700 ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* front */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            {kind === "website" && <WebsitePreview {...props} />}
            {kind === "video" && <VideoPreview {...props} />}
            {kind === "photo" && <PhotoCarousel {...props} />}
          </div>
          {/* back */}
          <div className="absolute inset-0 flex items-center justify-center rounded-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="absolute inset-0 rounded-md bg-background/85 backdrop-blur-md" />
            <div className="relative z-10 flex w-full max-w-[92%] flex-col items-center gap-2 text-center">
              <div className="text-lg font-semibold text-foreground md:text-xl">{title}</div>
              <div className="inline-flex items-center rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {tag}
              </div>
              {props.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {props.description}
                </p>
              )}
              {kind === "website" && props.siteUrl && (
                <a
                  href={props.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  Open site ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold leading-tight text-card-foreground md:text-3xl">{title}</h3>
        <span className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1 text-sm font-medium text-muted-foreground">
          {tag}
        </span>
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
        className="pointer-events-none absolute inset-0 h-full w-full rounded-md bg-background"
        sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups"
        referrerPolicy="no-referrer"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 to-transparent opacity-0 transition group-hover:opacity-100" />
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
          className="absolute inset-0 h-full w-full rounded-md"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  const sources = videoSources ?? [];
  return (
    <video
      className="absolute inset-0 h-full w-full rounded-md object-cover"
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
      <Image
        src={valid[idx]?.src}
        alt={valid[idx]?.alt ?? "Gallery image"}
        fill
        className="rounded-md object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={idx === 0}
      />

      {/* controls */}
      {valid.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background/70 p-1 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background/70 p-1 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
          >
            ›
          </button>
        </>
      )}

      {/* dots */}
      {valid.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1 backdrop-blur">
          {valid.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              className={"h-1.5 w-1.5 rounded-full " + (i === idx ? "bg-foreground" : "bg-foreground/35")}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
