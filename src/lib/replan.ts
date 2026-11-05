/**
 * Orquestra o replaneamento de um utilizador:
 * BD → expande eventos → capacidade → scheduler → substitui as StudyTask por fazer.
 */
import { prisma } from "./db";
import { addDays, dayKeyToDbDate, dayRange, dbDateToDayKey, toDayKey, zonedToUtc, DayKey } from "./dates";
import { computeCapacity, BusyInterval, DayCapacity } from "./availability";
import { expandEvents } from "./events";
import { examDemand } from "./planner";
import { schedule, ScheduleExam } from "./scheduler";
import { toStoredEvent } from "./event-mapping";
import { dateLocale, Lang } from "@/i18n/core";


export interface ReplanSummary {
  moved: number;
  message: string | null;
  exams: { id: string; acronym: string; status: string; startDay: string | null; missingHours: number }[];
}

export async function replan(userId: string, now = new Date(), lang: Lang = "pt"): Promise<ReplanSummary> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const tz = user.timezone;
  const today = toDayKey(now, tz);

  const exams = await prisma.exam.findMany({
    where: { userId },
    include: { course: { include: { topics: true } }, tasks: true },
  });
  const upcoming = exams.filter((e) => toDayKey(e.datetime, tz) > today);

  const oldPending = exams.flatMap((e) => e.tasks.filter((t) => !t.done).map((t) => ({ ...t, acronym: e.course.acronym })));

  let scheduleResult: ReturnType<typeof schedule> = { tasks: [], exams: new Map() };
  if (upcoming.length > 0) {
    const lastDay = upcoming.map((e) => toDayKey(e.datetime, tz)).sort().at(-1)!;
    const days = dayRange(today, lastDay);
    const rangeStart = zonedToUtc(today, "00:00", tz);
    const rangeEnd = zonedToUtc(addDays(lastDay, 1), "00:00", tz);

    const stored = await prisma.calendarEvent.findMany({ where: { userId } });
    const busy: BusyInterval[] = [
      ...expandEvents(stored.map(toStoredEvent), rangeStart, rangeEnd, tz),
      // os próprios exames ocupam tempo (relevante quando há dois no mesmo dia)
      ...exams.map((e) => ({
        start: e.datetime,
        end: new Date(e.datetime.getTime() + e.durationMin * 60_000),
        allDay: false,
        blocksStudy: true,
      })),
    ];
    const capacity = computeCapacity(days, busy, user);

    // Tarefas já feitas em dias futuros continuam a ocupar esse tempo
    const doneOnDay = new Map<DayKey, number>();
    for (const e of exams)
      for (const t of e.tasks)
        if (t.done) {
          const d = dbDateToDayKey(t.day);
          if (d >= today) doneOnDay.set(d, (doneOnDay.get(d) ?? 0) + t.hours);
        }
    for (const [d, h] of doneOnDay) {
      const c = capacity.get(d);
      if (c) capacity.set(d, { hours: Math.max(0, c.hours - h), free: Math.max(0, c.free - h) } satisfies DayCapacity);
    }

    const input: ScheduleExam[] = upcoming.map((e) => {
      const doneByItem = new Map<string, number>();
      for (const t of e.tasks) if (t.done) doneByItem.set(t.topicId ?? "review", (doneByItem.get(t.topicId ?? "review") ?? 0) + t.hours);
      const demand = examDemand(e.course.ects, e.course.topics, e.lastTopicOrder)
        .map((i) => ({ ...i, hours: i.hours - (doneByItem.get(i.topicId ?? "review") ?? 0) }))
        .filter((i) => i.hours > 0.01);
      return { id: e.id, day: toDayKey(e.datetime, tz), demand };
    });
    scheduleResult = schedule(input, capacity, today);
  }

  const examIds = exams.map((e) => e.id);
  await prisma.$transaction([
    prisma.studyTask.deleteMany({ where: { examId: { in: examIds }, done: false } }),
    prisma.studyTask.createMany({
      data: scheduleResult.tasks.map((t) => ({
        examId: t.examId,
        topicId: t.topicId,
        day: dayKeyToDbDate(t.day),
        hours: t.hours,
        part: t.part,
        parts: t.parts,
      })),
    }),
    ...exams.map((e) => {
      const r = scheduleResult.exams.get(e.id);
      return prisma.exam.update({
        where: { id: e.id },
        data: {
          startDate: r?.startDay ? dayKeyToDbDate(r.startDay) : null,
          status: r?.status ?? "ok",
          missingHours: r?.missingHours ?? 0,
        },
      });
    }),
  ]);

  // Resumo do que mudou: sessões que passaram para dias onde antes não estavam
  const acronymOf = new Map(exams.map((e) => [e.id, e.course.acronym]));
  const oldDays = new Map<string, Set<DayKey>>();
  for (const t of oldPending) {
    const k = `${t.examId}|${t.topicId}`;
    if (!oldDays.has(k)) oldDays.set(k, new Set());
    oldDays.get(k)!.add(dbDateToDayKey(t.day));
  }
  const movedBy = new Map<string, { count: number; days: Set<DayKey> }>();
  let moved = 0;
  if (oldPending.length > 0) {
    for (const t of scheduleResult.tasks) {
      const prev = oldDays.get(`${t.examId}|${t.topicId}`);
      if (prev && !prev.has(t.day)) {
        moved++;
        const a = acronymOf.get(t.examId)!;
        if (!movedBy.has(a)) movedBy.set(a, { count: 0, days: new Set() });
        const m = movedBy.get(a)!;
        m.count++;
        m.days.add(t.day);
      }
    }
  }
  const weekday = (d: DayKey) => new Date(d + "T12:00:00Z").toLocaleDateString(dateLocale(lang), { weekday: "long", timeZone: "UTC" });
  const parts = [...movedBy].map(([a, { count: n, days }]) => {
    const names = [...new Set([...days].sort().map(weekday))].join(", ");
    return lang === "en" ? `${n} ${n === 1 ? "session" : "sessions"} of ${a} → ${names}` : `${n} ${n === 1 ? "sessão" : "sessões"} de ${a} → ${names}`;
  });

  return {
    moved,
    message: parts.length ? `${lang === "en" ? "Plan adjusted" : "Plano ajustado"}: ${parts.join("; ")}` : null,
    exams: exams.map((e) => {
      const r = scheduleResult.exams.get(e.id);
      return {
        id: e.id,
        acronym: e.course.acronym,
        status: r?.status ?? "ok",
        startDay: r?.startDay ?? null,
        missingHours: r?.missingHours ?? 0,
      };
    }),
  };
}
