"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { APPEARANCE_STORAGE_KEY, type Appearance, type ResolvedTheme } from "./theme";

interface ThemeContextValue {
  appearance: Appearance;
  resolved: ResolvedTheme;
  setAppearance: (next: Appearance) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStored(): Appearance {
  try {
    const v = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** Applies the theme to <html>, cross-fading via View Transitions where supported. */
function applyTheme(theme: ResolvedTheme, appearance: Appearance, animate: boolean) {
  const root = document.documentElement;
  const commit = () => {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-appearance", appearance);
    document
      .querySelector('meta[name="theme-color"]:not([media])')
      ?.setAttribute("content", theme === "dark" ? "#0d0d0f" : "#f7f5f2");
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!animate || reduced || root.getAttribute("data-theme") === theme) {
    commit();
    return;
  }

  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(commit);
    return;
  }

  root.classList.add("theme-animating");
  commit();
  window.setTimeout(() => root.classList.remove("theme-animating"), 500);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server render assumes "system"; the inline head script has already painted the right theme.
  const [appearance, setAppearanceState] = useState<Appearance>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  // Hydrate from storage / DOM once mounted.
  useEffect(() => {
    const stored = readStored();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with external storage after hydration
    setAppearanceState(stored);
    setResolved(stored === "system" ? systemTheme() : stored);
  }, []);

  // Keep "system" in sync with OS changes, and other tabs in sync with storage.
  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY);
    const onSystemChange = () => {
      if (readStored() !== "system") return;
      const t = systemTheme();
      setResolved(t);
      applyTheme(t, "system", true);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== APPEARANCE_STORAGE_KEY) return;
      const next = readStored();
      const t = next === "system" ? systemTheme() : next;
      setAppearanceState(next);
      setResolved(t);
      applyTheme(t, next, true);
    };
    mq.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setAppearance = useCallback((next: Appearance) => {
    try {
      if (next === "system") localStorage.removeItem(APPEARANCE_STORAGE_KEY);
      else localStorage.setItem(APPEARANCE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode): still apply for this visit */
    }
    const t = next === "system" ? systemTheme() : next;
    setAppearanceState(next);
    setResolved(t);
    applyTheme(t, next, true);
  }, []);

  const value = useMemo(() => ({ appearance, resolved, setAppearance }), [appearance, resolved, setAppearance]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
