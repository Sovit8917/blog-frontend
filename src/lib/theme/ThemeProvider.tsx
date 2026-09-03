"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Thin wrapper around next-themes: adds/removes the `dark` class on
 * <html>, persists the choice to localStorage, defaults to the OS
 * preference, and injects its own pre-hydration script so there's no
 * flash of the wrong theme on load.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
