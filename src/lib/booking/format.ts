import { treatmentById } from "@/content/clinic";
import { fromIsoDate } from "./schedule";
import type { BookingDraft, BookingRequest } from "./types";

const capitalize = (s: string) => (s ? s[0].toLocaleUpperCase("hu-HU") + s.slice(1) : s);

/** "December 12., péntek" */
export function formatDateHu(iso: string, withWeekday = true): string {
  const d = fromIsoDate(iso);
  if (!d) return "";
  const month = d.toLocaleDateString("hu-HU", { month: "long" });
  const base = `${capitalize(month)} ${d.getDate()}.`;
  if (!withWeekday) return base;
  return `${base}, ${d.toLocaleDateString("hu-HU", { weekday: "long" })}`;
}

/** "07:30" → "7:30" */
export const formatTime = (t: string) => t.replace(/^0(\d)/, "$1");

export interface SummaryRow {
  key: "name" | "treatment" | "date" | "email" | "phone" | "message";
  label: string;
  value: string;
}

/**
 * Turns a (partial) draft into display rows. Empty fields never appear.
 * Shared by the live notification and outgoing message templates.
 */
export function summarize(draft: Partial<BookingDraft>): SummaryRow[] {
  const rows: SummaryRow[] = [];
  const name = draft.name?.trim();
  if (name) rows.push({ key: "name", label: "Név", value: name });

  const treatment = treatmentById(draft.treatment || undefined);
  if (treatment) rows.push({ key: "treatment", label: "Kezelés", value: treatment.name });

  if (draft.date) {
    const date = formatDateHu(draft.date, false);
    const value = draft.time ? `${date}, ${formatTime(draft.time)}` : date;
    if (date) rows.push({ key: "date", label: "Időpont", value });
  }

  const email = draft.email?.trim();
  if (email) rows.push({ key: "email", label: "E-mail", value: email });

  const phone = draft.phone?.trim();
  if (phone) rows.push({ key: "phone", label: "Telefon", value: phone });

  const message = draft.message?.trim();
  if (message) rows.push({ key: "message", label: "Üzenet", value: message });

  return rows;
}

/** Plain-text body used by future email / WhatsApp channels. */
export function toPlainText(request: BookingRequest): string {
  const lines = summarize(request).map((r) => `${r.label}: ${r.value}`);
  return [`Új foglalási igény (${request.reference})`, "", ...lines].join("\n");
}

export function createReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "";
  for (let i = 0; i < 4; i++) ref += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `LM-${ref}`;
}
