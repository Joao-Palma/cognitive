import type { DayKey } from "./dates";

export function formatDay(day: DayKey, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return new Date(day + "T12:00:00Z").toLocaleDateString("pt-PT", { ...opts, timeZone: "UTC" });
}

export function formatDateTime(d: Date, tz: string) {
  return d.toLocaleString("pt-PT", { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function hours(h: number) {
  return `${Number.isInteger(h) ? h : h.toFixed(1).replace(".", ",")} h`;
}

export const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  ok: { text: "Plano OK", cls: "bg-green-100 text-green-800" },
  compressed: { text: "Comprimido", cls: "bg-amber-100 text-amber-800" },
  infeasible: { text: "Não cabe", cls: "bg-red-100 text-red-800" },
};
