"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { formatDateHu } from "@/lib/booking/format";
import { BOOKING_WINDOW_DAYS, fromIsoDate, isBookableDate, startOfToday, toIsoDate } from "@/lib/booking/schedule";
import { CalendarIcon, ChevronLeft, ChevronRight } from "../ui/icons";
import { useDismiss } from "../ui/useDismiss";
import styles from "./Booking.module.css";

const WEEKDAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const WEEKDAYS_LONG = ["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"];

interface Props {
  value: string;
  error?: string;
  onChange: (iso: string) => void;
  onBlur: () => void;
}

function firstBookable(): Date {
  const d = startOfToday();
  for (let i = 1; i <= BOOKING_WINDOW_DAYS; i++) {
    d.setDate(d.getDate() + 1);
    if (isBookableDate(toIsoDate(d))) return new Date(d);
  }
  return startOfToday();
}

function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** Calendar popover in the style of the macOS date picker. Monday-first, Hungarian. */
export function DatePicker({ value, error, onChange, onBlur }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => ({ y: 2026, m: 0 }));
  const [focusIso, setFocusIso] = useState("");
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [todayState, setTodayState] = useState<Date | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = useCallback(
    (focusButton = true) => {
      setOpen(false);
      if (focusButton) buttonRef.current?.focus();
      onBlur();
    },
    [onBlur],
  );

  useDismiss(open, wrapRef, (reason) => close(reason === "escape"));

  const openPicker = () => {
    const base = fromIsoDate(value) ?? firstBookable();
    setView({ y: base.getFullYear(), m: base.getMonth() });
    setFocusIso(toIsoDate(base));
    setTodayState(startOfToday());
    setOpen(true);
  };

  // Keep DOM focus on the roving day.
  useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]`)?.focus();
  }, [open, focusIso, view]);

  // "Today" is captured when the picker opens (never during prerender).
  const today = todayState ?? new Date(view.y, view.m, 1);
  const minMonth = { y: today.getFullYear(), m: today.getMonth() };
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW_DAYS);
  const canPrev = view.y > minMonth.y || (view.y === minMonth.y && view.m > minMonth.m);
  const canNext = view.y < maxDate.getFullYear() || (view.y === maxDate.getFullYear() && view.m < maxDate.getMonth());

  const shiftMonth = (delta: number) => {
    setDirection(delta > 0 ? "next" : "prev");
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const moveFocus = (days: number) => {
    const cur = fromIsoDate(focusIso) ?? firstBookable();
    const next = new Date(cur);
    next.setDate(cur.getDate() + days);
    if (next < today || next > maxDate) return;
    if (next.getMonth() !== view.m || next.getFullYear() !== view.y) {
      setDirection(days > 0 ? "next" : "prev");
      setView({ y: next.getFullYear(), m: next.getMonth() });
    }
    setFocusIso(toIsoDate(next));
  };

  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      moveFocus(map[e.key]);
    } else if (e.key === "PageDown" || e.key === "PageUp") {
      e.preventDefault();
      moveFocus(e.key === "PageDown" ? 28 : -28);
    }
  };

  const select = (iso: string) => {
    onChange(iso);
    close();
  };

  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString("hu-HU", { year: "numeric", month: "long" });
  const cells = monthGrid(view.y, view.m);

  return (
    <div ref={wrapRef} className={styles.row} data-error={!!error} data-open={open}>
      <span className={styles.label} id={`${id}-label`}>
        Nap
      </span>
      <button
        ref={buttonRef}
        id="field-date"
        type="button"
        className={styles.selectButton}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label field-date`}
        aria-describedby={error ? `${id}-err` : undefined}
        onClick={() => (open ? close() : openPicker())}
      >
        <span className={value ? undefined : styles.placeholder}>{value ? formatDateHu(value) : "Válasszon napot"}</span>
        <CalendarIcon size={18} className={styles.chevron} />
      </button>
      {error && (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      )}

      {open && (
        <div role="dialog" aria-label="Dátum kiválasztása" className={`${styles.popover} ${styles.calendar} glass`}>
          <div className={styles.calHead}>
            <p className={styles.calMonth} aria-live="polite">
              {monthLabel}
            </p>
            <div className={styles.calNav}>
              <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Előző hónap">
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Következő hónap">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className={styles.calWeekdays} aria-hidden>
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          <div
            ref={gridRef}
            key={`${view.y}-${view.m}`}
            role="grid"
            aria-label={monthLabel}
            className={styles.calGrid}
            data-direction={direction}
            onKeyDown={onGridKey}
          >
            {Array.from({ length: cells.length / 7 }, (_, row) => (
              <div role="row" key={row} className={styles.calRow}>
                {cells.slice(row * 7, row * 7 + 7).map((d, i) => {
                  if (!d) return <span role="gridcell" key={i} />;
                  const iso = toIsoDate(d);
                  const bookable = isBookableDate(iso);
                  const isToday = iso === toIsoDate(today);
                  return (
                    <span role="gridcell" key={iso} aria-selected={iso === value}>
                      <button
                        type="button"
                        data-iso={iso}
                        className={styles.day}
                        data-selected={iso === value}
                        data-today={isToday}
                        aria-disabled={!bookable || undefined}
                        tabIndex={iso === focusIso ? 0 : -1}
                        aria-label={`${formatDateHu(iso, false)} ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}${bookable ? "" : ", nem foglalható"}`}
                        onClick={() => bookable && select(iso)}
                        onFocus={() => setFocusIso(iso)}
                      >
                        {d.getDate()}
                      </button>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <p className={styles.calNote}>Vasárnap zárva tartunk. Szombaton 9 és 13 óra között rendelünk.</p>
        </div>
      )}
    </div>
  );
}
