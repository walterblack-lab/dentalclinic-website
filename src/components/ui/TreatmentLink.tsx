"use client";

import type { ReactNode } from "react";
import type { TreatmentId } from "@/content/clinic";

export const SELECT_TREATMENT_EVENT = "lume:select-treatment";

/** Jumps to the booking form with a treatment preselected (decoupled via a DOM event). */
export function TreatmentLink({
  treatment,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  treatment: TreatmentId;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <a
      href="#foglalas"
      className={className}
      aria-label={ariaLabel}
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_TREATMENT_EVENT, { detail: treatment }))}
    >
      {children}
    </a>
  );
}
