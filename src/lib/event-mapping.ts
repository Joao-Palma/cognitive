import type { CalendarEvent } from "@prisma/client";
import type { StoredEvent } from "./events";

export function toStoredEvent(e: CalendarEvent): StoredEvent {
  let exdates: string[] = [];
  try {
    exdates = JSON.parse(e.exdates);
  } catch {}
  return {
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    allDay: e.allDay,
    category: e.category,
    blocksStudy: e.blocksStudy,
    rrule: e.rrule,
    exdates,
  };
}
