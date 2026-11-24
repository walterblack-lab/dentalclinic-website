import type { TreatmentId } from "@/content/clinic";
import { resolveChannel, type BookingChannel } from "./channels";
import { createReference } from "./format";
import type { BookingDraft, BookingRequest, DeliveryResult } from "./types";

/** Normalises a validated draft into a request. Call only after validateBooking() passes. */
export function toRequest(draft: BookingDraft): BookingRequest {
  const message = draft.message.trim();
  return {
    name: draft.name.trim().replace(/\s+/g, " "),
    email: draft.email.trim().toLowerCase(),
    phone: draft.phone.trim(),
    treatment: draft.treatment as TreatmentId,
    date: draft.date,
    time: draft.time,
    ...(message ? { message } : {}),
    createdAt: new Date().toISOString(),
    reference: createReference(),
  };
}

let channel: BookingChannel | null = null;

/** The active channel (lazily resolved once per page load). */
export function getChannel(): BookingChannel {
  channel ??= resolveChannel();
  return channel;
}

export async function submitBooking(
  request: BookingRequest,
  options?: { signal?: AbortSignal; channel?: BookingChannel },
): Promise<DeliveryResult> {
  const active = options?.channel ?? getChannel();
  return active.deliver(request, { signal: options?.signal });
}
