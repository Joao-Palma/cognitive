/**
 * Agendador multi-exame determinístico.
 *
 * 1. Alocação (backward / as-late-as-possible): percorre os dias do último exame
 *    para trás até hoje. Em cada dia, a capacidade vai primeiro para o exame com
 *    data mais próxima (a véspera de cada teste fica para essa cadeira); o que
 *    sobra passa para o exame seguinte.
 * 2. Se faltarem horas, segunda passagem sobre a folga (tempo livre na janela
 *    acima de dailyHours) → exame "compressed"; se mesmo assim faltar → "infeasible".
 * 3. Preenchimento: para cada exame, os itens (tópicos por ordem, revisão no fim)
 *    são despejados cronologicamente nos blocos alocados, partindo-os em partes.
 *
 * Trabalha em unidades de meia hora para evitar erros de vírgula flutuante.
 */
import { DayKey, dayRange } from "./dates";
import type { DayCapacity } from "./availability";
import type { DemandItem } from "./planner";

export type ExamStatus = "ok" | "compressed" | "infeasible";

export interface ScheduleExam {
  id: string;
  /** dia local do exame; só se estuda para ele em dias anteriores */
  day: DayKey;
  /** itens por ordem, revisão por último; horas já descontadas do que está feito */
  demand: DemandItem[];
}

export interface ScheduledTask {
  examId: string;
  topicId: string | null;
  title: string;
  day: DayKey;
  hours: number;
  part: number;
  parts: number;
}

export interface ExamResult {
  status: ExamStatus;
  startDay: DayKey | null;
  missingHours: number;
  totalHours: number;
}

export interface ScheduleResult {
  tasks: ScheduledTask[];
  exams: Map<string, ExamResult>;
}

const U = 2; // unidades por hora
const toUnits = (h: number) => Math.max(0, Math.round(h * U));

export function schedule(
  exams: ScheduleExam[],
  capacity: Map<DayKey, DayCapacity>,
  today: DayKey,
): ScheduleResult {
  const active = exams.filter((e) => e.day > today);
  const result: ScheduleResult = { tasks: [], exams: new Map() };
  for (const e of exams) {
    if (!active.includes(e)) {
      result.exams.set(e.id, { status: "ok", startDay: null, missingHours: 0, totalHours: 0 });
    }
  }
  if (active.length === 0) return result;

  const lastDay = active.reduce((m, e) => (e.day > m ? e.day : m), active[0].day);
  const days = dayRange(today, lastDay).reverse(); // de trás para a frente

  const demandUnits = new Map(active.map((e) => [e.id, e.demand.reduce((s, i) => s + toUnits(i.hours), 0)]));
  const remaining = new Map(demandUnits);
  const alloc = new Map<string, Map<DayKey, number>>(active.map((e) => [e.id, new Map()]));
  const used = new Map<DayKey, number>();

  const pass = (capOf: (d: DayKey) => number) => {
    for (const d of days) {
      let cap = capOf(d) - (used.get(d) ?? 0);
      if (cap <= 0) continue;
      const eligible = active
        .filter((e) => e.day > d && (remaining.get(e.id) ?? 0) > 0)
        .sort((a, b) => (a.day === b.day ? a.id.localeCompare(b.id) : a.day < b.day ? -1 : 1));
      for (const e of eligible) {
        if (cap <= 0) break;
        const take = Math.min(cap, remaining.get(e.id)!);
        remaining.set(e.id, remaining.get(e.id)! - take);
        const m = alloc.get(e.id)!;
        m.set(d, (m.get(d) ?? 0) + take);
        used.set(d, (used.get(d) ?? 0) + take);
        cap -= take;
      }
    }
  };

  // Passagem normal: respeita dailyHours
  pass((d) => toUnits(capacity.get(d)?.hours ?? 0));
  const shortAfterFirst = new Set(active.filter((e) => remaining.get(e.id)! > 0).map((e) => e.id));
  // Passagem de compressão: usa todo o tempo livre na janela de estudo
  if (shortAfterFirst.size > 0) pass((d) => toUnits(capacity.get(d)?.free ?? 0));

  for (const e of active) {
    // blocos cronológicos
    const slots = [...alloc.get(e.id)!.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    const items = e.demand.map((i) => ({ ...i, units: toUnits(i.hours) })).filter((i) => i.units > 0);
    const examTasks: ScheduledTask[] = [];
    let si = 0;
    let slotLeft = slots[0]?.[1] ?? 0;
    for (const item of items) {
      let left = item.units;
      const chunks: ScheduledTask[] = [];
      while (left > 0 && si < slots.length) {
        const take = Math.min(left, slotLeft);
        chunks.push({
          examId: e.id,
          topicId: item.topicId,
          title: item.title,
          day: slots[si][0],
          hours: take / U,
          part: 0,
          parts: 0,
        });
        left -= take;
        slotLeft -= take;
        if (slotLeft === 0) {
          si++;
          slotLeft = slots[si]?.[1] ?? 0;
        }
      }
      chunks.forEach((c, i) => {
        c.part = i + 1;
        c.parts = chunks.length;
      });
      examTasks.push(...chunks);
    }
    result.tasks.push(...examTasks);

    const missing = remaining.get(e.id)! / U;
    result.exams.set(e.id, {
      status: missing > 0 ? "infeasible" : shortAfterFirst.has(e.id) ? "compressed" : "ok",
      startDay: slots[0]?.[0] ?? null,
      missingHours: missing,
      totalHours: demandUnits.get(e.id)! / U,
    });
  }

  result.tasks.sort((a, b) => (a.day === b.day ? a.examId.localeCompare(b.examId) : a.day < b.day ? -1 : 1));
  return result;
}
