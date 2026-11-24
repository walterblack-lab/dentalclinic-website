"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { treatmentById, type TreatmentId } from "@/content/clinic";
import { summarize } from "@/lib/booking/format";
import type { BookingField } from "@/lib/booking/types";
import { useBookingForm } from "@/lib/booking/useBookingForm";
import { MESSAGE_MAX } from "@/lib/booking/validation";
import { MacNotification } from "../notification/MacNotification";
import { CheckIcon } from "../ui/icons";
import { SELECT_TREATMENT_EVENT } from "../ui/TreatmentLink";
import { DatePicker } from "./DatePicker";
import { TimeSlots } from "./TimeSlots";
import { TreatmentSelect } from "./TreatmentSelect";
import styles from "./Booking.module.css";

interface TextFieldProps {
  field: "name" | "email" | "phone";
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  inputMode?: "text" | "email" | "tel";
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function TextField({ field, label, type, autoComplete, placeholder, inputMode, value, error, onChange, onBlur }: TextFieldProps) {
  const errId = useId();
  return (
    <div className={styles.row} data-error={!!error}>
      <label className={styles.label} htmlFor={`field-${field}`}>
        {label}
      </label>
      <input
        id={`field-${field}`}
        name={field}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={styles.input}
        value={value}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        aria-required="true"
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && (
        <p id={errId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

const STEPS_NEXT = [
  { title: "Visszaigazolás", text: "Egy élő oldalon munkaidőben két órán belül visszahívnánk vagy e-mailt írnánk." },
  { title: "Emlékeztető", text: "A kezelés előtti napon SMS-ben emlékeztetnénk az időpontra." },
  { title: "Első találkozás", text: "Az első alkalom 45 perces konzultáció, írásos kezelési tervvel." },
];

export function BookingSection() {
  const form = useBookingForm();
  const { draft, errors, status, submitted, notification, isSimulated, setField, blurField, submit, reset, dismissNotification } = form;
  const [announce, setAnnounce] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const msgId = useId();

  // Preselect a treatment when a service tile's "Időpontot kérek" is used.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<TreatmentId>).detail;
      if (treatmentById(id) && status !== "success") setField("treatment", id);
    };
    window.addEventListener(SELECT_TREATMENT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_TREATMENT_EVENT, onSelect);
  }, [setField, status]);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- screen reader announcement after async submit
      setAnnounce("Foglalási igény rögzítve. Ez egy bemutató, valódi üzenet nem került elküldésre.");
    }
  }, [status]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const firstInvalid = await submit();
    if (firstInvalid) focusField(firstInvalid);
  };

  // Live rows: draft while editing, the validated request after submission.
  const rows = useMemo(() => summarize(submitted ?? draft), [submitted, draft]);
  const since = submitted ? Date.parse(submitted.createdAt) : notification.since;
  const errorCount = Object.keys(errors).length;

  return (
    <section id="foglalas" className={styles.section} aria-labelledby="booking-title">
      <div className={styles.backdrop} aria-hidden>
        <span />
        <span />
      </div>
      <div className="wrap">
        <header className={styles.head} data-reveal>
          <p className="eyebrow">Időpontfoglalás</p>
          <h2 id="booking-title" className="section-title">
            Két perc, és <span className="serif">megvan az időpont.</span>
          </h2>
          <p className="section-lead">
            Válassza ki a kezelést és a napot, mi pedig visszaigazoljuk. Ha bizonytalan, válassza az általános
            fogászatot, az első alkalommal mindent átbeszélünk.
          </p>
        </header>

        <div className={styles.layout}>
          <div className={`${styles.sheet} glass`}>
            {status === "success" && submitted ? (
              <div ref={successRef} tabIndex={-1} className={styles.success}>
                <svg className={styles.successMark} viewBox="0 0 56 56" aria-hidden>
                  <circle cx="28" cy="28" r="26" />
                  <path d="M17 29l7.5 7.5L39.5 21" />
                </svg>
                <h3 className={styles.successTitle}>Foglalási igényét rögzítettük</h3>
                <p className={styles.successText}>
                  {isSimulated
                    ? "Ez egy bemutató oldal, ezért valódi üzenet nem ment ki, és időpontot sem foglaltunk. Egy élő oldalon ezen a ponton értesítené a rendelőt, amely visszaigazolná az időpontot."
                    : "Köszönjük! Munkaidőben két órán belül visszaigazoljuk az időpontot."}
                </p>
                <dl className={styles.successList}>
                  {summarize(submitted).map((r) => (
                    <div key={r.key}>
                      <dt>{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                  <div>
                    <dt>Azonosító</dt>
                    <dd>{submitted.reference}</dd>
                  </div>
                </dl>
                <button type="button" className="btn btn--quiet" onClick={reset}>
                  Új igény indítása
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className={styles.form} aria-describedby="booking-demo-note">
                <fieldset className={styles.group}>
                  <legend className={styles.groupTitle}>Elérhetőség</legend>
                  <div className={styles.rows}>
                    <TextField
                      field="name"
                      label="Teljes név"
                      type="text"
                      autoComplete="name"
                      placeholder="Kovács Anna"
                      value={draft.name}
                      error={errors.name}
                      onChange={(v) => setField("name", v)}
                      onBlur={() => blurField("name")}
                    />
                    <TextField
                      field="email"
                      label="E-mail-cím"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="anna@pelda.hu"
                      value={draft.email}
                      error={errors.email}
                      onChange={(v) => setField("email", v)}
                      onBlur={() => blurField("email")}
                    />
                    <TextField
                      field="phone"
                      label="Telefonszám"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+36 30 123 4567"
                      value={draft.phone}
                      error={errors.phone}
                      onChange={(v) => setField("phone", v)}
                      onBlur={() => blurField("phone")}
                    />
                  </div>
                </fieldset>

                <fieldset className={styles.group}>
                  <legend className={styles.groupTitle}>Kezelés és időpont</legend>
                  <div className={styles.rows}>
                    <TreatmentSelect
                      value={draft.treatment}
                      error={errors.treatment}
                      onChange={(v) => setField("treatment", v)}
                      onBlur={() => blurField("treatment")}
                    />
                    <DatePicker
                      value={draft.date}
                      error={errors.date}
                      onChange={(v) => setField("date", v)}
                      onBlur={() => blurField("date")}
                    />
                    <TimeSlots date={draft.date} value={draft.time} error={errors.time} onChange={(v) => setField("time", v)} />
                  </div>
                </fieldset>

                <fieldset className={styles.group}>
                  <legend className={styles.groupTitle}>
                    Megjegyzés <span className={styles.optional}>nem kötelező</span>
                  </legend>
                  <div className={styles.rows}>
                    <div className={styles.row} data-error={!!errors.message}>
                      <label className="sr-only" htmlFor="field-message">
                        Megjegyzés
                      </label>
                      <textarea
                        id="field-message"
                        name="message"
                        rows={3}
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder="Van valami, amit előre tudnunk kell? Például fogérzékenység vagy szorongás."
                        value={draft.message}
                        maxLength={MESSAGE_MAX + 50}
                        aria-invalid={!!errors.message}
                        aria-describedby={`${msgId}-count${errors.message ? ` ${msgId}-err` : ""}`}
                        onChange={(e) => setField("message", e.target.value)}
                        onBlur={() => blurField("message")}
                      />
                      <p id={`${msgId}-count`} className={styles.counter} data-over={draft.message.length > MESSAGE_MAX}>
                        {draft.message.length} / {MESSAGE_MAX}
                      </p>
                      {errors.message && (
                        <p id={`${msgId}-err`} className={styles.error}>
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>
                </fieldset>

                {status === "error" && (
                  <p className={styles.formError} role="alert">
                    Most nem sikerült elküldeni az igényt. Kérjük, próbálja újra, vagy írjon nekünk e-mailt.
                  </p>
                )}

                <div className={styles.submitRow}>
                  <button type="submit" className={`btn ${styles.submit}`} disabled={status === "submitting"} aria-busy={status === "submitting"}>
                    {status === "submitting" ? (
                      <>
                        <span className={styles.spinner} aria-hidden />
                        Rögzítés…
                      </>
                    ) : (
                      "Foglalási igény elküldése"
                    )}
                  </button>
                  {errorCount > 0 && (
                    <p className={styles.errorSummary} aria-live="polite">
                      {errorCount === 1 ? "Egy mezőt még ki kell javítani." : `${errorCount} mezőt még ki kell javítani.`}
                    </p>
                  )}
                </div>
                <p id="booking-demo-note" className={styles.demoNote}>
                  Bemutató űrlap: az adatai nem hagyják el a böngészőt, és valódi időpont nem jön létre.
                </p>
              </form>
            )}
          </div>

          <aside className={styles.aside} aria-label="A foglalás menete">
            <h3 className={styles.asideTitle}>Mi történik ezután?</h3>
            <ol className={styles.next}>
              {STEPS_NEXT.map((s, i) => (
                <li key={s.title}>
                  <span className={styles.nextIcon} aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.assurance}>
              <CheckIcon size={16} />
              <p>Az időpontot díjmentesen lemondhatja vagy módosíthatja, legkésőbb 24 órával előtte.</p>
            </div>
          </aside>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      <MacNotification
        open={notification.visible && (rows.length > 0 || status === "success")}
        mode={status === "success" ? "submitted" : "draft"}
        rows={rows}
        since={since}
        reference={submitted?.reference}
        simulated={isSimulated}
        onDismiss={dismissNotification}
      />
    </section>
  );
}

function focusField(field: BookingField) {
  const el = document.getElementById(`field-${field}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const target =
    field === "time" ? el.querySelector<HTMLElement>('[role="radio"][tabindex="0"]') ?? el : el;
  target.focus({ preventScroll: true });
}
