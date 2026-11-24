"use client";

import { useId, useMemo, useRef, type KeyboardEvent } from "react";
import { formatTime } from "@/lib/booking/format";
import { slotsForDate } from "@/lib/booking/schedule";
import styles from "./Booking.module.css";

interface Props {
  date: string;
  value: string;
  error?: string;
  onChange: (t: string) => void;
}

/** iOS-style slot chips, grouped into morning / afternoon. A radiogroup with roving focus. */
export function TimeSlots({ date, value, error, onChange }: Props) {
  const id = useId();
  const slots = useMemo(() => (date ? slotsForDate(date) : []), [date]);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const available = slots.filter((s) => s.available);
  const focusTarget = value || available[0]?.time;

  const groups = [
    { label: "Délelőtt", items: slots.filter((s) => Number(s.time.slice(0, 2)) < 12) },
    { label: "Délután", items: slots.filter((s) => Number(s.time.slice(0, 2)) >= 12) },
  ].filter((g) => g.items.length);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const i = available.findIndex((s) => s.time === (document.activeElement as HTMLElement)?.dataset.time);
    const next = available[(i + delta + available.length) % available.length];
    if (next) {
      onChange(next.time);
      refs.current[next.time]?.focus();
    }
  };

  return (
    <div className={styles.row} data-error={!!error}>
      <span className={styles.label} id={`${id}-label`}>
        Időpont
      </span>
      {!date ? (
        <p className={styles.slotHint}>Először válasszon napot, és megmutatjuk a szabad időpontokat.</p>
      ) : (
        <div
          id="field-time"
          role="radiogroup"
          aria-labelledby={`${id}-label`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={styles.slots}
          key={date}
          onKeyDown={onKey}
          tabIndex={-1}
        >
          {groups.map((g) => (
            <div key={g.label} className={styles.slotGroup}>
              <span className={styles.slotGroupLabel}>{g.label}</span>
              <div className={styles.slotGrid}>
                {g.items.map((s, i) => (
                  <button
                    key={s.time}
                    ref={(el) => {
                      refs.current[s.time] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={value === s.time}
                    aria-label={s.available ? formatTime(s.time) : `${formatTime(s.time)}, foglalt`}
                    data-time={s.time}
                    disabled={!s.available}
                    tabIndex={s.time === focusTarget ? 0 : -1}
                    className={styles.slot}
                    style={{ animationDelay: `${i * 18}ms` }}
                    onClick={() => onChange(s.time)}
                  >
                    {formatTime(s.time)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
