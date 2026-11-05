import { describe, expect, it } from "vitest";
import { courseStudyHours, examDemand, TopicInput } from "../planner";
import { computeCapacity, StudySettings } from "../availability";
import { expandEvents, StoredEvent } from "../events";
import { schedule, ScheduleExam } from "../scheduler";
import { addDays, dayRange, diffDays, zonedToUtc } from "../dates";

const TZ = "Europe/Lisbon";
const topics = (n: number): TopicInput[] =>
  Array.from({ length: n }, (_, i) => ({ id: `t${i + 1}`, order: i + 1, title: `T${i + 1}`, weight: 1, difficulty: 2 }));
const settings: StudySettings = { dailyHours: 4, studyWindowStart: "09:00", studyWindowEnd: "23:00", timezone: TZ };
const at = (day: string, hhmm: string) => zonedToUtc(day, hhmm, TZ);
const busy = (day: string, a: string, b: string, extra: Partial<{ allDay: boolean; blocksStudy: boolean }> = {}) => ({
  start: at(day, a),
  end: at(day, b),
  allDay: false,
  blocksStudy: true,
  ...extra,
});

describe("planner", () => {
  it("6 ECTS, 10 tópicos iguais, até ao 5", () => {
    expect(courseStudyHours(6)).toBeCloseTo(25.2);
    const d = examDemand(6, topics(10), 5);
    expect(d).toHaveLength(6);
    expect(d.slice(0, 5).reduce((s, i) => s + i.hours, 0)).toBeCloseTo(12.6);
    expect(d[5].topicId).toBeNull();
    expect(d[5].hours).toBe(2);
  });

  it("dificuldade pesa nas horas", () => {
    const t = topics(2);
    t[0].difficulty = 3;
    t[1].difficulty = 1;
    const d = examDemand(6, t, 2);
    expect(d[0].hours).toBeCloseTo(3 * d[1].hours);
  });
});

describe("events", () => {
  it("aula semanal seg/qua com um exdate em 3 semanas → 5 ocorrências", () => {
    // 2026-11-09 é segunda-feira
    const ev: StoredEvent = {
      id: "e1",
      title: "IAED",
      start: at("2026-11-09", "09:00"),
      end: at("2026-11-09", "10:30"),
      allDay: false,
      category: "aula",
      blocksStudy: true,
      rrule: "FREQ=WEEKLY;BYDAY=MO,WE",
      exdates: [at("2026-11-18", "09:00").toISOString()],
    };
    const occ = expandEvents([ev], at("2026-11-09", "00:00"), at("2026-11-30", "00:00"), TZ);
    expect(occ).toHaveLength(5);
  });

  it("mantém a hora local através da mudança de hora", () => {
    const ev: StoredEvent = {
      id: "e2",
      title: "SO",
      start: at("2027-03-22", "09:00"), // antes da mudança (28/03/2027)
      end: at("2027-03-22", "10:00"),
      allDay: false,
      category: "aula",
      blocksStudy: true,
      rrule: "FREQ=WEEKLY;BYDAY=MO",
      exdates: [],
    };
    const occ = expandEvents([ev], at("2027-03-20", "00:00"), at("2027-04-06", "00:00"), TZ);
    expect(occ.map((o) => o.start.toISOString())).toEqual([
      at("2027-03-22", "09:00").toISOString(),
      at("2027-03-29", "09:00").toISOString(),
      at("2027-04-05", "09:00").toISOString(),
    ]);
    expect(at("2027-03-29", "09:00").getUTCHours()).toBe(8); // horário de verão
  });
});

describe("availability", () => {
  const day = "2026-11-10";
  const cap = (evs: ReturnType<typeof busy>[]) => computeCapacity([day], evs, settings).get(day)!;

  it("aulas 9–13 e 14–18 → livre 6, capacidade 4", () => {
    expect(cap([busy(day, "09:00", "13:00"), busy(day, "14:00", "18:00")])).toEqual({ hours: 4, free: 6 });
  });
  it("aulas 9–20 → 3", () => {
    expect(cap([busy(day, "09:00", "20:00")]).hours).toBe(3);
  });
  it("evento de dia inteiro → 0", () => {
    expect(cap([{ ...busy(day, "00:00", "00:00"), end: at(addDays(day, 1), "00:00"), allDay: true }]).hours).toBe(0);
  });
  it("blocksStudy=false não altera nada", () => {
    expect(cap([busy(day, "09:00", "22:00", { blocksStudy: false })]).hours).toBe(4);
  });
  it("sobreposições não contam a dobrar", () => {
    expect(cap([busy(day, "09:00", "18:00"), busy(day, "12:00", "20:00")]).free).toBe(3);
  });
  it("evento que atravessa a meia-noite afeta os dois dias", () => {
    const m = computeCapacity([day, addDays(day, 1)], [{ ...busy(day, "21:00", "00:00"), end: at(addDays(day, 1), "11:00") }], settings);
    expect(m.get(day)!.free).toBe(12);
    expect(m.get(addDays(day, 1))!.free).toBe(12);
  });
});

describe("scheduler", () => {
  const today = "2026-11-05";
  const flatCap = (from: string, to: string, hours: number, free = 14) =>
    new Map(dayRange(from, to).map((d) => [d, { hours, free }]));

  it("1 exame, 3 h/dia: começa 5 dias antes e acaba na véspera com revisão", () => {
    const exam: ScheduleExam = { id: "A", day: "2026-11-20", demand: examDemand(6, topics(10), 5) };
    const r = schedule([exam], flatCap(today, "2026-11-20", 3), today);
    const res = r.exams.get("A")!;
    expect(res.status).toBe("ok");
    expect(diffDays("2026-11-20", res.startDay!)).toBe(5);
    const last = r.tasks[r.tasks.length - 1];
    expect(last.topicId).toBeNull();
    expect(last.day).toBe("2026-11-19");
    // tópicos por ordem
    const order = r.tasks.filter((t) => t.topicId).map((t) => t.topicId);
    expect(order).toEqual([...order].sort((a, b) => Number(a!.slice(1)) - Number(b!.slice(1))));
    expect(r.tasks.reduce((s, t) => s + t.hours, 0)).toBe(res.totalHours);
  });

  it("2 exames na mesma semana: concilia sem exceder a capacidade", () => {
    const A: ScheduleExam = { id: "A", day: "2026-11-18", demand: examDemand(6, topics(10), 5) }; // quarta
    const B: ScheduleExam = { id: "B", day: "2026-11-20", demand: examDemand(6, topics(10), 5) }; // sexta
    const cap = flatCap(today, "2026-11-20", 3);
    const r = schedule([A, B], cap, today);

    const onDay = (d: string) => r.tasks.filter((t) => t.day === d);
    expect(new Set(onDay("2026-11-17").map((t) => t.examId))).toEqual(new Set(["A"])); // véspera de A
    expect(new Set(onDay("2026-11-19").map((t) => t.examId))).toEqual(new Set(["B"])); // véspera de B
    for (const d of cap.keys()) expect(onDay(d).reduce((s, t) => s + t.hours, 0)).toBeLessThanOrEqual(3);
    for (const id of ["A", "B"]) {
      const res = r.exams.get(id)!;
      expect(res.status).toBe("ok");
      expect(r.tasks.filter((t) => t.examId === id).reduce((s, t) => s + t.hours, 0)).toBe(res.totalHours);
    }
    // o exame mais próximo (A) mantém os seus dias; o B é empurrado para mais cedo
    expect(r.exams.get("A")!.startDay).toBe(schedule([A], cap, today).exams.get("A")!.startDay);
    expect(r.exams.get("B")!.startDay! < schedule([B], cap, today).exams.get("B")!.startDay!).toBe(true);
  });

  it("procura maior que a capacidade → compressed / infeasible", () => {
    const A: ScheduleExam = { id: "A", day: "2026-11-08", demand: [{ topicId: "x", title: "X", hours: 20 }] };
    const compressed = schedule([A], flatCap(today, "2026-11-08", 4, 10), today);
    expect(compressed.exams.get("A")!.status).toBe("compressed");
    const inf = schedule([A], flatCap(today, "2026-11-08", 4, 5), today);
    expect(inf.exams.get("A")!.status).toBe("infeasible");
    expect(inf.exams.get("A")!.missingHours).toBe(5);
  });

  it("exames passados são ignorados", () => {
    const r = schedule([{ id: "P", day: "2026-11-01", demand: examDemand(6, topics(3), 3) }], new Map(), today);
    expect(r.tasks).toHaveLength(0);
  });
});
