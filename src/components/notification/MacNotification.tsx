"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SummaryRow } from "@/lib/booking/format";
import { CheckIcon, ChevronDown, CloseIcon } from "../ui/icons";
import styles from "./MacNotification.module.css";

export interface MacNotificationProps {
  open: boolean;
  mode: "draft" | "submitted";
  rows: SummaryRow[];
  /** epoch ms the current state began (first input, or submission) */
  since: number | null;
  reference?: string;
  simulated: boolean;
  onDismiss: () => void;
}

function relativeTime(since: number | null, now: number) {
  if (!since) return "most";
  const mins = Math.floor((now - since) / 60000);
  if (mins < 1) return "most";
  if (mins < 60) return `${mins} perce`;
  return `${Math.floor(mins / 60)} órája`;
}

/** Mail-inspired app icon, drawn in CSS/SVG (no third-party artwork). */
function AppIcon({ success }: { success: boolean }) {
  return (
    <span className={styles.appIcon} data-success={success} aria-hidden>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="3" y="5.5" width="18" height="13" rx="2.6" fill="#fff" />
        <path d="m4.2 7.2 7.8 6 7.8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={styles.badge}>
        <CheckIcon size={10} />
      </span>
    </span>
  );
}

/**
 * Floating, macOS-style notification that mirrors the booking form live.
 * Presentational only: all data comes from the booking hook.
 */
export function MacNotification({ open, mode, rows, since, reference, simulated, onDismiss }: MacNotificationProps) {
  const [mounted, setMounted] = useState(false);
  const [present, setPresent] = useState(false); // stays true during exit animation
  const [now, setNow] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState<number | "auto">("auto");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target exists only after mount
  useEffect(() => setMounted(true), []);

  // Mount on open, unmount after the exit transition.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- coordinating enter/exit animation
      setPresent(true);
      return;
    }
    const t = window.setTimeout(() => setPresent(false), 420);
    return () => window.clearTimeout(t);
  }, [open]);

  // Relative timestamp ("most" → "1 perce").
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset clock when (re)shown
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(t);
  }, [open, since]);

  // Submitted state is shown in full on small screens too.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- follow mode change
    if (mode === "submitted") setExpanded(true);
  }, [mode]);

  // Smooth height animation as rows come and go: measure content, animate container.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBodyHeight(el.offsetHeight));
    ro.observe(el);
    setBodyHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [present]);

  if (!mounted || !present) return null;

  const submitted = mode === "submitted";
  const title = submitted ? "Foglalási igény rögzítve" : "Új foglalási igény";
  const compact = rows.map((r) => r.value).join(" · ");

  return createPortal(
    <div className={styles.viewport}>
      <section
        className={styles.notification}
        data-state={open ? "open" : "closed"}
        data-mode={mode}
        data-expanded={expanded}
        aria-label={`Értesítés: ${title}`}
      >
        <button type="button" className={styles.close} onClick={onDismiss} aria-label="Értesítés bezárása">
          <CloseIcon size={9} />
        </button>

        <div className={styles.inner}>
          <AppIcon success={submitted} />

          <div className={styles.content}>
            <header className={styles.header}>
              <p className={styles.title}>
                <span key={title} className={styles.titleText}>
                  {title}
                </span>
              </p>
              <time className={styles.time} dateTime={since ? new Date(since).toISOString() : undefined}>
                {relativeTime(since, now)}
              </time>
            </header>

            <p className={styles.subtitle}>
              <span className={styles.subtitleText}>
                Lumé Foglalás{reference && submitted ? ` · ${reference}` : ""}
              </span>
              {simulated && (
                <span className={styles.demoTag} title="Bemutató értesítés, valódi üzenet nem megy ki">
                  Demó
                </span>
              )}
            </p>

            {/* Compact one-liner for small screens; becomes "Kevesebb" below the details when expanded */}
            <button
              type="button"
              className={styles.compact}
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              aria-label={expanded ? "Részletek elrejtése" : "Részletek megjelenítése"}
            >
              <span className={styles.compactText}>{expanded ? "Kevesebb" : compact}</span>
              <ChevronDown size={14} className={styles.compactChevron} />
            </button>

            <div className={styles.bodyClip} style={{ height: bodyHeight }}>
              <div ref={innerRef}>
                <dl className={styles.rows}>
                  {rows.map((r) => (
                    <div key={r.key} className={styles.row}>
                      <dt>{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {simulated && (
              <p className={styles.demo}>
                {submitted
                  ? "Bemutató értesítés: valódi üzenet nem ment ki, időpontot sem foglaltunk."
                  : "Bemutató értesítés: az adatok a böngészőjében maradnak."}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
