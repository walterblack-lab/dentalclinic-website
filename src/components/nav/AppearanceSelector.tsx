"use client";

import { useRef, type KeyboardEvent } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import type { Appearance } from "@/lib/theme/theme";
import { MoonIcon, SunIcon, SystemIcon } from "../ui/icons";
import styles from "./AppearanceSelector.module.css";

const OPTIONS: { value: Appearance; label: string; Icon: typeof SunIcon }[] = [
  { value: "light", label: "Világos", Icon: SunIcon },
  { value: "dark", label: "Sötét", Icon: MoonIcon },
  { value: "system", label: "Automatikus", Icon: SystemIcon },
];

/**
 * iOS-style segmented control. The thumb position is driven by
 * html[data-appearance] (set before paint), so it never jumps on load.
 */
export function AppearanceSelector({ size = "md", showLabels = false }: { size?: "md" | "lg"; showLabels?: boolean }) {
  const { appearance, setAppearance } = useTheme();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = OPTIONS.findIndex((o) => o.value === appearance);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % OPTIONS.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + OPTIONS.length) % OPTIONS.length;
    if (next < 0) return;
    e.preventDefault();
    setAppearance(OPTIONS[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Megjelenés"
      className={`${styles.group} ${size === "lg" ? styles.lg : ""} ${showLabels ? styles.labelled : ""}`}
      onKeyDown={onKeyDown}
    >
      <span className={styles.thumb} aria-hidden />
      {OPTIONS.map(({ value, label, Icon }, i) => {
        const checked = appearance === value;
        return (
          <button
            key={value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={showLabels ? undefined : label}
            title={label}
            tabIndex={checked ? 0 : -1}
            data-value={value}
            className={styles.option}
            onClick={() => setAppearance(value)}
          >
            <Icon size={size === "lg" ? 18 : 16} />
            {showLabels && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
