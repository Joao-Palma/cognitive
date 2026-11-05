import { prisma } from "@/lib/db";
import { body, date, withUser, HttpError } from "@/lib/api";
import { replan } from "@/lib/replan";
import { expandEvents } from "@/lib/events";
import { toStoredEvent } from "@/lib/event-mapping";
import { courseColor } from "@/lib/colors";
import { addDays, dbDateToDayKey } from "@/lib/dates";
import { parseEventInput } from "./parse";

/** Feed para o FullCalendar: eventos do aluno + exames + sessões de estudo. */
export const GET = withUser(async (userId, req) => {
  const url = new URL(req.url);
  const start = date(url.searchParams.get("start"), "start");
  const end = date(url.searchParams.get("end"), "end");
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const stored = await prisma.calendarEvent.findMany({ where: { userId } });
  const occurrences = expandEvents(stored.map(toStoredEvent), start, end, user.timezone).map((o) => ({
    id: `ev:${o.eventId}:${o.start.toISOString()}`,
    title: o.title,
    start: o.start.toISOString(),
    end: o.end.toISOString(),
    allDay: o.allDay,
    classNames: [`cat-${o.category}`, o.blocksStudy ? "blocks" : "noblock"],
    extendedProps: { kind: "event", eventId: o.eventId, recurring: o.recurring, occurrenceStart: o.start.toISOString(), category: o.category, blocksStudy: o.blocksStudy },
  }));

  const exams = await prisma.exam.findMany({
    where: { userId, datetime: { gte: new Date(start.getTime() - 86_400_000), lt: end } },
    include: { course: true },
  });
  const examEvents = exams.map((e) => ({
    id: `exam:${e.id}`,
    title: `📝 Exame ${e.course.acronym}`,
    start: e.datetime.toISOString(),
    end: new Date(e.datetime.getTime() + e.durationMin * 60_000).toISOString(),
    backgroundColor: courseColor(e.course.acronym),
    borderColor: "#111827",
    classNames: ["exam"],
    editable: false,
    extendedProps: { kind: "exam", examId: e.id },
  }));

  const tasks = await prisma.studyTask.findMany({
    where: { exam: { userId }, day: { gte: new Date(start.getTime() - 86_400_000), lt: end } },
    include: { exam: { include: { course: true } }, topic: true },
  });
  const taskEvents = tasks.map((t) => {
    const day = dbDateToDayKey(t.day);
    const title = t.topic?.title ?? "Revisão geral";
    const part = t.parts > 1 ? ` (${t.part}/${t.parts})` : "";
    return {
      id: `task:${t.id}`,
      title: `${t.done ? "✔ " : ""}${t.exam.course.acronym} · ${title}${part} — ${t.hours}h`,
      start: day,
      end: addDays(day, 1),
      allDay: true,
      backgroundColor: courseColor(t.exam.course.acronym),
      borderColor: courseColor(t.exam.course.acronym),
      classNames: ["task", t.done ? "done" : "todo"],
      editable: false,
      extendedProps: { kind: "task", taskId: t.id, done: t.done },
    };
  });

  return [...occurrences, ...examEvents, ...taskEvents];
});

export const POST = withUser(async (userId, req) => {
  const data = parseEventInput(await body(req));
  if (!data.title || !data.start || !data.end) throw new HttpError(400, "Título, início e fim são obrigatórios");
  const event = await prisma.calendarEvent.create({ data: { ...data, userId } as never });
  return { event, summary: await replan(userId) };
});
