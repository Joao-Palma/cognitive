/**
 * Eventos ocupados → horas livres para estudar em cada dia.
 */
import { DayKey, minutesOfDay, parseHHMM, toDayKey, addDays } from "./dates";

export interface BusyInterval {
  start: Date;
  end: Date;
  allDay: boolean;
  blocksStudy: boolean;
}

export interface StudySettings {
  dailyHours: number;
  studyWindowStart: string; // "09:00"
  studyWindowEnd: string; // "23:00"
  timezone: string;
}

export interface DayCapacity {
  /** horas que o planeador usa por omissão: min(dailyHours, livre) */
  hours: number;
  /** tempo livre total na janela de estudo (usado ao comprimir) */
  free: number;
}

/** Arredonda para baixo a múltiplos de 0.5 h. */
export const floorHalf = (h: number) => Math.floor(h * 2 + 1e-9) / 2;

export function computeCapacity(
  days: DayKey[],
  events: BusyInterval[],
  s: StudySettings,
): Map<DayKey, DayCapacity> {
  const tz = s.timezone;
  const winStart = parseHHMM(s.studyWindowStart);
  const winEnd = parseHHMM(s.studyWindowEnd);
  const daySet = new Set(days);

  const busy = new Map<DayKey, [number, number][]>();
  const blockedDays = new Set<DayKey>();

  for (const ev of events) {
    if (!ev.blocksStudy) continue;
    const firstDay = toDayKey(ev.start, tz);
    const lastDay = toDayKey(new Date(ev.end.getTime() - 1), tz);
    if (ev.allDay) {
      for (let d = firstDay; d <= lastDay; d = addDays(d, 1)) blockedDays.add(d);
      continue;
    }
    for (let d = firstDay; d <= lastDay; d = addDays(d, 1)) {
      if (!daySet.has(d)) continue;
      const from = d === firstDay ? minutesOfDay(ev.start, tz) : 0;
      const to = d === lastDay ? minutesOfDay(ev.end, tz) || 1440 : 1440;
      const a = Math.max(from, winStart);
      const b = Math.min(to, winEnd);
      if (b > a) {
        const list = busy.get(d) ?? [];
        list.push([a, b]);
        busy.set(d, list);
      }
    }
  }

  const out = new Map<DayKey, DayCapacity>();
  for (const d of days) {
    if (blockedDays.has(d)) {
      out.set(d, { hours: 0, free: 0 });
      continue;
    }
    const busyMin = mergedLength(busy.get(d) ?? []);
    const free = floorHalf(Math.max(0, winEnd - winStart - busyMin) / 60);
    out.set(d, { hours: Math.min(floorHalf(s.dailyHours), free), free });
  }
  return out;
}

/** Comprimento total de intervalos depois de fundir sobreposições. */
function mergedLength(intervals: [number, number][]): number {
  const sorted = [...intervals].sort((x, y) => x[0] - y[0]);
  let total = 0;
  let cur: [number, number] | null = null;
  for (const [a, b] of sorted) {
    if (!cur || a > cur[1]) {
      if (cur) total += cur[1] - cur[0];
      cur = [a, b];
    } else cur[1] = Math.max(cur[1], b);
  }
  if (cur) total += cur[1] - cur[0];
  return total;
}
