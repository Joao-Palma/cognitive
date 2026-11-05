/**
 * Helpers de datas com fuso horário explícito (sem dependências).
 * "dayKey" = "YYYY-MM-DD" no fuso do utilizador.
 */

export type DayKey = string;

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    fmtCache.set(tz, f);
  }
  return f;
}

export interface LocalParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function localParts(date: Date, tz: string): LocalParts {
  const p: Record<string, number> = {};
  for (const part of fmt(tz).formatToParts(date)) {
    if (part.type !== "literal") p[part.type] = Number(part.value);
  }
  return {
    year: p.year,
    month: p.month,
    day: p.day,
    hour: p.hour === 24 ? 0 : p.hour,
    minute: p.minute,
    second: p.second,
  };
}

/** Dia local (YYYY-MM-DD) de um instante. */
export function toDayKey(date: Date, tz: string): DayKey {
  const p = localParts(date, tz);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** Minutos desde a meia-noite local. */
export function minutesOfDay(date: Date, tz: string): number {
  const p = localParts(date, tz);
  return p.hour * 60 + p.minute;
}

/** Offset (ms) do fuso num instante: local - UTC. */
export function tzOffsetMs(date: Date, tz: string): number {
  const p = localParts(date, tz);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUTC - Math.floor(date.getTime() / 1000) * 1000;
}

/** Converte hora de parede local (dia + "HH:MM") para o instante UTC real. */
export function zonedToUtc(day: DayKey, hhmm: string, tz: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  let ts = wall - tzOffsetMs(new Date(wall), tz);
  ts = wall - tzOffsetMs(new Date(ts), tz); // 2ª iteração cobre transições de DST
  return new Date(ts);
}

/** Hora de parede local representada como se fosse UTC (para rrule "floating"). */
export function wallAsUtc(date: Date, tz: string): Date {
  const p = localParts(date, tz);
  return new Date(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second));
}

/** Inverso de wallAsUtc. */
export function wallUtcToReal(fake: Date, tz: string): Date {
  const day = fake.toISOString().slice(0, 10);
  const hhmm = fake.toISOString().slice(11, 16);
  return zonedToUtc(day, hhmm, tz);
}

export function addDays(day: DayKey, n: number): DayKey {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Lista de dias [from, to] inclusive. */
export function dayRange(from: DayKey, to: DayKey): DayKey[] {
  const out: DayKey[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

export function diffDays(a: DayKey, b: DayKey): number {
  return Math.round((Date.parse(a + "T00:00:00Z") - Date.parse(b + "T00:00:00Z")) / 86_400_000);
}

/** Representação de um dia na BD: meia-noite UTC desse dayKey. */
export function dayKeyToDbDate(day: DayKey): Date {
  return new Date(day + "T00:00:00.000Z");
}
export function dbDateToDayKey(date: Date): DayKey {
  return date.toISOString().slice(0, 10);
}

export function parseHHMM(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}
