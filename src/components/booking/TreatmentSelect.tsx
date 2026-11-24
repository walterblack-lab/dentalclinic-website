"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { treatmentById, treatments, type TreatmentId } from "@/content/clinic";
import { CheckIcon, ChevronDown } from "../ui/icons";
import { useDismiss } from "../ui/useDismiss";
import styles from "./Booking.module.css";

interface Props {
  value: TreatmentId | "";
  error?: string;
  onChange: (v: TreatmentId) => void;
  onBlur: () => void;
}

/** Accessible custom listbox (button + popover), styled like a macOS pop-up menu. */
export function TreatmentSelect({ value, error, onChange, onBlur }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const selected = treatmentById(value);

  const close = useCallback(
    (focusButton = true) => {
      setOpen(false);
      if (focusButton) buttonRef.current?.focus();
      onBlur();
    },
    [onBlur],
  );

  useDismiss(open, wrapRef, (reason) => close(reason === "escape"));

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, treatments.findIndex((t) => t.id === value)));
    setOpen(true);
  };

  const choose = (i: number) => {
    onChange(treatments[i].id);
    close();
  };

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = treatments.length - 1;
    if (e.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Tab") close(false);
    else if (e.key.length === 1) {
      const i = treatments.findIndex((t) => t.name.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
      return;
    } else return;
    if (e.key !== "Tab") e.preventDefault();
  };

  return (
    <div ref={wrapRef} className={styles.row} data-error={!!error} data-open={open}>
      <span className={styles.label} id={`${id}-label`}>
        Kezelés
      </span>
      <button
        ref={buttonRef}
        id="field-treatment"
        type="button"
        className={styles.selectButton}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label field-treatment`}
        aria-describedby={error ? `${id}-err` : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
          }
        }}
      >
        <span className={selected ? undefined : styles.placeholder}>{selected ? selected.name : "Válasszon kezelést"}</span>
        <ChevronDown className={styles.chevron} />
      </button>
      {error && (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      )}

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          className={`${styles.popover} ${styles.listbox} glass`}
          onKeyDown={onListKey}
        >
          {treatments.map((t, i) => (
            <li
              key={t.id}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={t.id === value}
              data-active={i === active}
              className={styles.option}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
            >
              <span className={styles.optionCheck}>{t.id === value && <CheckIcon size={15} />}</span>
              <span>
                <span className={styles.optionName}>{t.name}</span>
                <span className={styles.optionMeta}>{t.short}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
