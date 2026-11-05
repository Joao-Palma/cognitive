/**
 * Expansão de eventos (incluindo recorrentes via RRULE) num intervalo.
 * A recorrência é calculada em hora de parede local, para que uma aula às 9h
 * continue às 9h depois da mudança de hora.
 */
import { RRule } from "rrule";
import { wallAsUtc, wallUtcToReal } from "./dates";

export interface StoredEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  category: string;
  blocksStudy: boolean;
  rrule: string | null;
  exdates: string[]; // ISO do início (UTC) das ocorrências removidas
}

export interface Occurrence {
  eventId: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  category: string;
  blocksStudy: boolean;
  recurring: boolean;
}

export function expandEvents(
  events: StoredEvent[],
  rangeStart: Date,
  rangeEnd: Date,
  tz: string,
): Occurrence[] {
  const out: Occurrence[] = [];
  for (const ev of events) {
    const durationMs = ev.end.getTime() - ev.start.getTime();
    const base = {
      eventId: ev.id,
      title: ev.title,
      allDay: ev.allDay,
      category: ev.category,
      blocksStudy: ev.blocksStudy,
      recurring: !!ev.rrule,
    };
    if (!ev.rrule) {
      if (ev.end > rangeStart && ev.start < rangeEnd) out.push({ ...base, start: ev.start, end: ev.end });
      continue;
    }
    const ex = new Set(ev.exdates.map((d) => new Date(d).toISOString()));
    const opts = RRule.parseString(ev.rrule);
    // UNTIL também em hora de parede local
    if (opts.until) opts.until = wallAsUtc(opts.until, tz);
    const rule = new RRule({ ...opts, dtstart: wallAsUtc(ev.start, tz) });
    // margem de um dia para apanhar eventos que começam antes do intervalo
    const fakeFrom = new Date(wallAsUtc(rangeStart, tz).getTime() - durationMs - 86_400_000);
    const fakeTo = new Date(wallAsUtc(rangeEnd, tz).getTime() + 86_400_000);
    for (const fake of rule.between(fakeFrom, fakeTo, true)) {
      const start = wallUtcToReal(fake, tz);
      const end = new Date(start.getTime() + durationMs);
      if (ex.has(start.toISOString())) continue;
      if (end > rangeStart && start < rangeEnd) out.push({ ...base, start, end });
    }
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}
