import { toPlainText } from "../format";
import type { BookingChannel, ChannelConfig } from "./types";

const LABELS = {
  email: "E-mail értesítés",
  whatsapp: "WhatsApp értesítés",
  api: "Egyedi API",
} as const;

/**
 * Generic HTTP channel for real deployments. It POSTs one JSON payload to an
 * endpoint the client controls; that endpoint performs the actual delivery:
 *
 *  - email:    e.g. a serverless function calling Resend / Postmark / SMTP
 *  - whatsapp: e.g. a function calling the WhatsApp Business Cloud API
 *  - api:      the clinic's own booking system, CRM or practice software
 *
 * Payload: { channel, booking, text } — `text` is a ready-to-send Hungarian
 * plain-text body, so simple email/WhatsApp relays need no formatting logic.
 *
 * Not active in this demo (see resolveChannel).
 */
export function createHttpChannel(config: Extract<ChannelConfig, { endpoint: string }>): BookingChannel {
  return {
    id: config.kind,
    label: LABELS[config.kind],
    isSimulated: false,
    async deliver(request, options) {
      const res = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...config.headers },
        body: JSON.stringify({ channel: config.kind, booking: request, text: toPlainText(request) }),
        signal: options?.signal,
      });
      if (!res.ok) {
        return { status: "failed", channel: config.kind, reference: request.reference, detail: `HTTP ${res.status}` };
      }
      return { status: "delivered", channel: config.kind, reference: request.reference };
    },
  };
}
