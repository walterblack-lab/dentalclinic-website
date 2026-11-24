import type { BookingChannel } from "./types";

/**
 * Local demo channel: nothing is sent anywhere. It only waits briefly so the
 * UI can show a realistic "sending" state, then reports a simulated result.
 */
export function createDemoChannel(latencyMs = 900): BookingChannel {
  return {
    id: "demo",
    label: "Helyi bemutató (nincs küldés)",
    isSimulated: true,
    deliver(request, options) {
      return new Promise((resolve, reject) => {
        const timer = window.setTimeout(
          () => resolve({ status: "simulated", channel: "demo", reference: request.reference }),
          latencyMs,
        );
        options?.signal?.addEventListener("abort", () => {
          window.clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    },
  };
}
