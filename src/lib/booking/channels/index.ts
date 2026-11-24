import { createDemoChannel } from "./demo";
import { createHttpChannel } from "./http";
import type { BookingChannel, ChannelConfig } from "./types";

export type { BookingChannel, ChannelConfig, ChannelId } from "./types";

/**
 * Reads the channel from build-time env. Defaults to the local demo.
 *
 *   NEXT_PUBLIC_BOOKING_CHANNEL = demo | email | whatsapp | api
 *   NEXT_PUBLIC_BOOKING_ENDPOINT = https://… (required for non-demo channels)
 */
export function channelConfigFromEnv(): ChannelConfig {
  const kind = process.env.NEXT_PUBLIC_BOOKING_CHANNEL;
  const endpoint = process.env.NEXT_PUBLIC_BOOKING_ENDPOINT;
  if ((kind === "email" || kind === "whatsapp" || kind === "api") && endpoint) {
    return { kind, endpoint };
  }
  return { kind: "demo" };
}

export function resolveChannel(config: ChannelConfig = channelConfigFromEnv()): BookingChannel {
  return config.kind === "demo" ? createDemoChannel() : createHttpChannel(config);
}
