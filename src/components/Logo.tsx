"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  variant?: "mark" | "full";
  size?: number; // pixel size for mark; ignored for full (uses width:100%)
  className?: string;
};

export default function Logo({ variant = "mark", size = 44, className = "" }: Props) {
  // Try multiple filenames in order: SVG (best), then PNG.
  const sources = ["/pacnw-logo.svg", "/pacnw-logo.png"];
  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  const markError = () => {
    if (idx < sources.length - 1) setIdx(idx + 1);
    else setIdx(sources.length); // trigger fallback
  };

  if (idx >= sources.length) {
    return variant === "mark" ? (
      <FallbackMark size={size} className={className} />
    ) : (
      <FallbackFull className={className} />
    );
  }

  if (variant === "mark") {
    return (
      <Image
        src={src}
        alt="PacNW Studio"
        width={size}
        height={size}
        // Tailwind preflight may set only `height:auto` on img; set both to avoid Next/Image warnings.
        className={"h-auto w-auto " + className + " rounded-md"}
        onError={markError}
        priority
      />
    );
  }

  return (
    <Image
      src={src}
      alt="PacNW Studio logo"
      width={800}
      height={600}
      className={"h-auto w-auto " + className}
      onError={markError}
      priority
    />
  );
}

function FallbackMark({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="PacNW Studio logo"
    >
      <rect width="64" height="64" rx="12" fill="#0f172a" className="dark:fill-white/10" />
      <path d="M8 36c4-6 10-12 16-16l6 6 8-8c6 4 10 8 16 16" stroke="#0e7490" strokeWidth="3" fill="none" strokeLinejoin="round" />
      <path d="M10 44c12 0 12-8 24-8s12 8 24 8" fill="none" stroke="#14b8a6" strokeWidth="3" />
    </svg>
  );
}

function FallbackFull({ className = "" }: { className?: string }) {
  return (
    <div className={"flex items-center gap-3 " + className}>
      <FallbackMark size={44} />
      <div>
        <div className="text-xl font-semibold dark:text-white">PacNW Studio</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">WEB • VIDEO • PHOTO</div>
      </div>
    </div>
  );
}
