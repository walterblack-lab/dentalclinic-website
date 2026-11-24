/**
 * Opening-hours model used by the date and time pickers. In a real deployment
 * `slotsForDate` would be replaced by availability from the clinic's calendar.
 */

export interface TimeSlot {
  time: string;
  available: boolean;
}

const WEEKDAY_HOURS: Record<number, [string, string] | null> = {
  0: null, // vasárnap
  1: ["07:30", "19:00"],
  2: ["07:30", "19:00"],
  3: ["07:30", "19:00"],
  4: ["07:30", "19:00"],
  5: ["07:30", "15:30"],
  6: ["09:00", "12:30"],
};

/** Days ahead that can be booked. */
export const BOOKING_WINDOW_DAYS = 90;

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isBookableDate(iso: string): boolean {
  const d = fromIsoDate(iso);
  if (!d) return false;
  const today = startOfToday();
  const last = new Date(today);
  last.setDate(last.getDate() + BOOKING_WINDOW_DAYS);
  // Bookable from tomorrow, within the window, on opening days.
  return d > today && d <= last && WEEKDAY_HOURS[d.getDay()] !== null;
}

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(n: number) {
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`.padStart(5, "0");
}

/** Small deterministic hash so the same day always shows the same "taken" slots. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function slotsForDate(iso: string): TimeSlot[] {
  const d = fromIsoDate(iso);
  if (!d) return [];
  const hours = WEEKDAY_HOURS[d.getDay()];
  if (!hours) return [];
  const [open, close] = hours.map(toMinutes);
  const slots: TimeSlot[] = [];
  for (let t = open; t <= close; t += 30) {
    const time = fromMinutes(t);
    // Roughly a third of slots appear taken — a realistic-looking demo calendar.
    const available = hash(`${iso}-${time}`) % 3 !== 0;
    slots.push({ time, available });
  }
  return slots;
}
