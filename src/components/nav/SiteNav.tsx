"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { clinic, navLinks } from "@/content/clinic";
import { LumeMark } from "../ui/icons";
import { AppearanceSelector } from "./AppearanceSelector";
import styles from "./SiteNav.module.css";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Like apple.com: the bar switches to dark glass while it floats over a dark band.
    const darkBands = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-tone="dark"]'));
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const line = 44; // vertical centre of the floating bar
      setOnDark(
        darkBands.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= line && r.bottom >= line;
        }),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Mobile sheet: Escape closes, focus stays inside, page doesn't scroll behind.
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    sheet?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !sheet) return;
      const items = Array.from(sheet.querySelectorAll<HTMLElement>('a, button:not([tabindex="-1"])'));
      const first = items[0];
      const last = items[items.length - 1];
      const nodes = [toggleRef.current, ...items];
      if (!nodes.includes(document.activeElement as HTMLElement)) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        toggleRef.current?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 960 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  return (
    <header className={styles.header} data-scrolled={scrolled || open} data-open={open} data-tone={onDark && !open ? "dark" : "auto"}>
      <nav className={`${styles.bar} glass`} aria-label="Fő navigáció">
        <a href="#top" className={styles.brand} aria-label={`${clinic.fullName}, vissza az oldal tetejére`}>
          <LumeMark size={28} />
          <span className={styles.brandText}>
            {clinic.name}
            <span className={styles.brandSub}>Fogászati Stúdió</span>
          </span>
        </a>

        <ul className={styles.links}>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <div className={styles.appearance}>
            <AppearanceSelector />
          </div>
          <a href="#foglalas" className={`btn ${styles.cta}`}>
            Időpontfoglalás
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={styles.burger} aria-hidden />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={sheetRef}
        className={`${styles.sheet} glass`}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
      >
        <ul className={styles.sheetLinks}>
          {navLinks.map((l, i) => (
            <li key={l.href} style={{ "--i": i } as CSSProperties}>
              <a href={l.href} onClick={() => close(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.sheetFooter}>
          <p className={styles.sheetLabel}>Megjelenés</p>
          <AppearanceSelector size="lg" showLabels />
          <a href="#foglalas" className="btn" onClick={() => close(false)}>
            Időpontfoglalás
          </a>
        </div>
      </div>
      {open && <div className={styles.scrim} onClick={() => close()} aria-hidden />}
    </header>
  );
}
