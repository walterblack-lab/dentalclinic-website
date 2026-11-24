import { treatmentById } from "@/content/clinic";
import { isBookableDate, slotsForDate } from "./schedule";
import type { BookingDraft, BookingErrors, BookingField } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MESSAGE_MAX = 500;

export function validateField(field: BookingField, draft: BookingDraft): string | undefined {
  const v = draft[field].trim();
  switch (field) {
    case "name":
      if (!v) return "Kérjük, adja meg a nevét.";
      if (v.length < 3 || !/\s/.test(v)) return "Kérjük, a teljes nevét adja meg (vezeték- és keresztnév).";
      return;
    case "email":
      if (!v) return "Kérjük, adja meg az e-mail-címét.";
      if (!EMAIL_RE.test(v)) return "Ez az e-mail-cím nem tűnik érvényesnek.";
      return;
    case "phone": {
      if (!v) return "Kérjük, adjon meg egy telefonszámot.";
      const digits = v.replace(/\D/g, "");
      if (!/^[+\d\s()/-]+$/.test(v) || digits.length < 9 || digits.length > 13)
        return "Ellenőrizze a számot, például: +36 30 123 4567.";
      return;
    }
    case "treatment":
      if (!treatmentById(v)) return "Válassza ki, milyen kezelésre érkezne.";
      return;
    case "date":
      if (!v) return "Válasszon egy napot.";
      if (!isBookableDate(v)) return "Ezen a napon nem rendelünk. Kérjük, válasszon másikat.";
      return;
    case "time":
      if (!v) return "Válasszon időpontot.";
      if (draft.date && !slotsForDate(draft.date).some((s) => s.time === v && s.available))
        return "Ez az időpont már nem szabad. Kérjük, válasszon másikat.";
      return;
    case "message":
      if (v.length > MESSAGE_MAX) return `Legfeljebb ${MESSAGE_MAX} karakter.`;
      return;
  }
}

export const requiredFields: BookingField[] = ["name", "email", "phone", "treatment", "date", "time"];

export function validateBooking(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {};
  for (const field of [...requiredFields, "message"] as BookingField[]) {
    const e = validateField(field, draft);
    if (e) errors[field] = e;
  }
  return errors;
}
