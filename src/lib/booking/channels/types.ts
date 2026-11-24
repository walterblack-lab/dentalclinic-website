import type { BookingRequest, DeliveryResult } from "../types";

/**
 * A delivery channel decides where a validated booking request goes.
 * The booking UI only ever talks to this interface, so a client can switch
 * from the local demo to email, WhatsApp or their own API without UI changes.
 */
export interface BookingChannel {
  readonly id: ChannelId;
  /** Human-readable name, shown in logs/devtools only. */
  readonly label: string;
  /** True when nothing leaves the browser (demo). The UI uses this to label notifications honestly. */
  readonly isSimulated: boolean;
  deliver(request: BookingRequest, options?: { signal?: AbortSignal }): Promise<DeliveryResult>;
}

export type ChannelId = "demo" | "email" | "whatsapp" | "api";

export type ChannelConfig =
  | { kind: "demo" }
  | {
      kind: "email" | "whatsapp" | "api";
      /**
       * Your own server endpoint (serverless function, form backend, CRM webhook).
       * Provider secrets (SMTP, Resend, WhatsApp Cloud API tokens) belong there,
       * never in browser code.
       */
      endpoint: string;
      headers?: Record<string, string>;
    };
