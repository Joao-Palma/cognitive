import type { DayKey } from "./dates";
import { dateLocale, Lang } from "@/i18n/core";

export function formatDay(day: DayKey, lang: Lang, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return new Date(day + "T12:00:00Z").toLocaleDateString(dateLocale(lang), { ...opts, timeZone: "UTC" });
}

export function formatDateTime(d: Date, tz: string, lang: Lang) {
  return d.toLocaleString(dateLocale(lang), { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function formatTime(d: Date, tz: string, lang: Lang) {
  return d.toLocaleTimeString(dateLocale(lang), { timeZone: tz, hour: "2-digit", minute: "2-digit" });
}

export function hours(h: number, lang: Lang = "pt") {
  const s = Number.isInteger(h) ? String(h) : h.toFixed(1);
  return `${lang === "pt" ? s.replace(".", ",") : s} h`;
}

export function statusLabel(status: string, lang: Lang): { text: string; cls: string } {
  const en = lang === "en";
  if (status === "compressed") return { text: en ? "Compressed" : "Comprimido", cls: "bg-amber-100 text-amber-800" };
  if (status === "infeasible") return { text: en ? "Doesn't fit" : "Não cabe", cls: "bg-red-100 text-red-800" };
  return { text: en ? "Plan OK" : "Plano OK", cls: "bg-green-100 text-green-800" };
}
