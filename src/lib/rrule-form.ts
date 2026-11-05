/** Conversão entre o formulário simples de recorrência e uma RRULE semanal. */
export const WEEKDAYS = [
  { code: "MO", short: "S", label: "segunda" },
  { code: "TU", short: "T", label: "terça" },
  { code: "WE", short: "Q", label: "quarta" },
  { code: "TH", short: "Q", label: "quinta" },
  { code: "FR", short: "S", label: "sexta" },
  { code: "SA", short: "S", label: "sábado" },
  { code: "SU", short: "D", label: "domingo" },
] as const;

export function buildWeeklyRrule(days: string[], untilIso: string | null): string {
  let r = "FREQ=WEEKLY";
  if (days.length) r += `;BYDAY=${WEEKDAYS.map((w) => w.code).filter((c) => days.includes(c)).join(",")}`;
  if (untilIso) r += `;UNTIL=${untilIso.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`;
  return r;
}

export function parseWeeklyRrule(rrule: string | null): { days: string[]; until: Date | null } {
  if (!rrule) return { days: [], until: null };
  const days = rrule.match(/BYDAY=([A-Z,]+)/)?.[1].split(",") ?? [];
  const u = rrule.match(/UNTIL=(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/);
  const until = u ? new Date(Date.UTC(+u[1], +u[2] - 1, +u[3], +u[4], +u[5], +u[6])) : null;
  return { days, until };
}

/** Código RRULE do dia da semana de uma data local (YYYY-MM-DD). */
export function weekdayCode(day: string): string {
  return WEEKDAYS[(new Date(day + "T12:00:00Z").getUTCDay() + 6) % 7].code;
}
