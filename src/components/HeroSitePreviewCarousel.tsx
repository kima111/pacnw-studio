"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();

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

export default function HeroSitePreviewCarousel({
  items,
  intervalMs = 3500,
  fadeMs = 650,
  className = "",
}: {
  items: Project[];
  intervalMs?: number;
  fadeMs?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  const sites = useMemo(
    () => items.filter((p) => p.kind === "website" && !!p.siteUrl),
    [items],
  );

  const [active, setActive] = useState(0);
  const [front, setFront] = useState<0 | 1>(0);
  const [slotIdx, setSlotIdx] = useState<[number, number]>([0, 0]);

  const advancingRef = useRef(false);
  const waitingSlotRef = useRef<0 | 1 | null>(null);
  const waitingForRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const nextCandidateRef = useRef(1);

  useEffect(() => {
    // Reset if the source list changes.
    advancingRef.current = false;
    waitingSlotRef.current = null;
    waitingForRef.current = null;
    nextCandidateRef.current = 1;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    setActive(0);
    setFront(0);
    setSlotIdx([0, 0]);
  }, [sites.length]);

  useEffect(() => {
    if (reducedMotion) return;
    if (sites.length <= 1) return;

    const maxWaitMs = Math.max(1200, Math.min(4500, intervalMs - 250));

    const id = window.setInterval(() => {
      if (advancingRef.current) return;

      let next = nextCandidateRef.current % sites.length;
      if (next === active) next = (active + 1) % sites.length;

      const hidden: 0 | 1 = front === 0 ? 1 : 0;
      advancingRef.current = true;
      waitingSlotRef.current = hidden;
      waitingForRef.current = next;

      setSlotIdx((s) => (hidden === 0 ? [next, s[1]] : [s[0], next]));

      // If the next site never "loads" (blocked CSP/X-Frame-Options), don't swap—try another later.
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        advancingRef.current = false;
        const w = waitingForRef.current;
        if (typeof w === "number") nextCandidateRef.current = (w + 1) % sites.length;
        waitingSlotRef.current = null;
        waitingForRef.current = null;
      }, maxWaitMs);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [active, front, intervalMs, reducedMotion, sites.length]);

  if (!sites.length) return null;
  const current = sites[active];

  const onFrameLoad = (slot: 0 | 1) => {
    if (reducedMotion) return;
    if (!advancingRef.current) return;
    if (waitingSlotRef.current !== slot) return;

    const expected = waitingForRef.current;
    const actuallyLoaded = slotIdx[slot];
    if (expected === null || expected !== actuallyLoaded) return;

    // Swap visibility only after the hidden iframe reports loaded → no flash.
    setFront(slot);
    setActive(expected);
    nextCandidateRef.current = (expected + 1) % sites.length;

    advancingRef.current = false;
    waitingSlotRef.current = null;
    waitingForRef.current = null;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  return (
    <div className={"relative h-full w-full overflow-hidden bg-black " + className} aria-hidden>
      {/* Two persistent iframes: preload next in the hidden one, then crossfade on load. */}
      {[0, 1].map((slot) => {
        const s = slot as 0 | 1;
        const idx = slotIdx[s] ?? 0;
        const p = sites[idx];
        const isFront = s === front;

        return p?.siteUrl ? (
          <iframe
            key={`slot-${s}`}
            src={p.siteUrl}
            title={`${p.title} preview`}
            className={
              "absolute inset-0 h-full w-full pointer-events-none rounded-none bg-black transition-opacity " +
              (isFront ? "opacity-100" : "opacity-0")
            }
            style={!reducedMotion ? { transitionDuration: `${fadeMs}ms` } : undefined}
            onLoad={() => onFrameLoad(s)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups"
            referrerPolicy="no-referrer"
          />
        ) : null;
      })}

      {/* Always-on contrast + “chrome” */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />

      {/* Label */}
      <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
        <div className="min-w-0 rounded-md border border-white/15 bg-black/35 px-2.5 py-0.5 text-[11px] font-semibold text-white/85 backdrop-blur">
          <span className="truncate">{current.title}</span>
          <span className="text-white/55"> • {current.tag}</span>
        </div>
        <div className="shrink-0 rounded-md border border-white/15 bg-black/35 px-2 py-0.5 text-[10px] font-semibold text-white/70 backdrop-blur">
          {String(active + 1).padStart(2, "0")} / {String(sites.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}


