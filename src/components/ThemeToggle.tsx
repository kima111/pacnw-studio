"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = document.documentElement;
    setIsDark(el.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    setIsDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore
    }
    try {
      window.dispatchEvent(new CustomEvent("themechange", { detail: { dark: next } }));
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full border border-slate-300/70 bg-white/70 p-2 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {/* avoid hydration mismatch by hiding icon until mounted */}
      <span className="block h-5 w-5">
        {mounted && (isDark ? <MoonIcon /> : <SunIcon />)}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64l-1.41-1.41M19.78 19.78l-1.41-1.41M5.64 18.36l-1.41 1.41M19.78 4.22l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
    </svg>
  );
}
