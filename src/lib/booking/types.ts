import type { TreatmentId } from "@/content/clinic";

/** Every field as the visitor is typing it — all optional, all strings. */
export interface BookingDraft {
  name: string;
  email: string;
  phone: string;
  treatment: TreatmentId | "";
  /** ISO date, YYYY-MM-DD (local) */
  date: string;
  /** HH:MM */
  time: string;
  message: string;
}

export type BookingField = keyof BookingDraft;

/** A validated request, ready to hand to a delivery channel. */
export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  treatment: TreatmentId;
  date: string;
  time: string;
  message?: string;
  /** ISO timestamp of submission */
  createdAt: string;
  /** Short human-friendly reference, e.g. "LM-7K3Q" */
  reference: string;
}

export type BookingErrors = Partial<Record<BookingField, string>>;

export type DeliveryStatus = "simulated" | "delivered" | "failed";

export interface DeliveryResult {
  status: DeliveryStatus;
  channel: string;
  reference: string;
  /** Optional detail for logs / UI */
  detail?: string;
}

export const emptyDraft: BookingDraft = {
  name: "",
  email: "",
  phone: "",
  treatment: "",
  date: "",
  time: "",
  message: "",
};
