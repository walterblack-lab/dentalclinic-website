"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { getChannel, submitBooking, toRequest } from "./service";
import type { BookingDraft, BookingErrors, BookingField, BookingRequest } from "./types";
import { emptyDraft } from "./types";
import { requiredFields, validateBooking, validateField } from "./validation";

export type FormStatus = "editing" | "submitting" | "success" | "error";

export interface NotificationState {
  visible: boolean;
  /** When the notification first appeared (for the "most / 2 perce" stamp). */
  since: number | null;
}

/**
 * All booking state in one place. UI components stay presentational; this hook
 * owns validation, submission (via the active channel) and notification visibility.
 */
export function useBookingForm() {
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<FormStatus>("editing");
  const [submitted, setSubmitted] = useState<BookingRequest | null>(null);
  const [notification, setNotification] = useState<NotificationState>({ visible: false, since: null });
  const dismissedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const showNotification = useCallback((force = false) => {
    if (dismissedRef.current && !force) return;
    if (force) dismissedRef.current = false;
    setNotification((n) => (n.visible ? n : { visible: true, since: n.since ?? Date.now() }));
  }, []);

  const setField = useCallback(
    <K extends BookingField>(field: K, value: BookingDraft[K]) => {
      const next = { ...draft, [field]: value };
      // Changing the day can invalidate the chosen time.
      if (field === "date" && draft.date !== value) next.time = "";
      setDraft(next);
      // Re-validate live only once a field has been touched, to avoid nagging while typing.
      setErrors((errs) => {
        const out = { ...errs };
        const recheck: BookingField[] = field === "date" ? ["date", "time"] : [field];
        for (const f of recheck) {
          if (touched[f] || errs[f]) {
            const e = validateField(f, next);
            if (e && (f !== "time" || next.time)) out[f] = e;
            else delete out[f];
          }
        }
        return out;
      });
      // First meaningful interaction → show the live notification.
      if (String(value).trim()) showNotification();
    },
    [draft, showNotification, touched],
  );

  const blurField = useCallback(
    (field: BookingField) => {
      setTouched((t) => ({ ...t, [field]: true }));
      setErrors((errs) => {
        const e = validateField(field, draft);
        const out = { ...errs };
        if (e && (draft[field].trim() || errs[field])) out[field] = e;
        else if (!e) delete out[field];
        return out;
      });
    },
    [draft],
  );

  const submit = useCallback(async (): Promise<BookingField | null> => {
    const all = validateBooking(draft);
    setErrors(all);
    setTouched(Object.fromEntries([...requiredFields, "message"].map((f) => [f, true])));
    const firstInvalid = ([...requiredFields, "message"] as BookingField[]).find((f) => all[f]) ?? null;
    if (firstInvalid) return firstInvalid;

    const request = toRequest(draft);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("submitting");
    try {
      const result = await submitBooking(request, { signal: controller.signal });
      if (result.status === "failed") throw new Error(result.detail);
      setSubmitted(request);
      setStatus("success");
      showNotification(true);
    } catch (err) {
      if ((err as Error).name === "AbortError") return null;
      setStatus("error");
    }
    return null;
  }, [draft, showNotification]);

  const dismissNotification = useCallback(() => {
    dismissedRef.current = true;
    setNotification((n) => ({ ...n, visible: false }));
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    dismissedRef.current = false;
    setDraft(emptyDraft);
    setTouched({});
    setErrors({});
    setSubmitted(null);
    setStatus("editing");
    setNotification({ visible: false, since: null });
  }, []);

  const isSimulated = useMemo(() => getChannel().isSimulated, []);

  return {
    draft,
    errors,
    status,
    submitted,
    notification,
    isSimulated,
    setField,
    blurField,
    submit,
    reset,
    dismissNotification,
  };
}

export type BookingForm = ReturnType<typeof useBookingForm>;
