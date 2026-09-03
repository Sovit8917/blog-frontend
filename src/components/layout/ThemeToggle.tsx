"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Light/dark toggle. Renders a stable placeholder until mounted so
 * server and client markup match (resolvedTheme isn't knowable on the
 * server without risking a mismatch/flash).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-500 transition hover:bg-ink-50 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100 ${className}`}
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-200 ${
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-200 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
