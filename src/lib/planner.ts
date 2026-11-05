/**
 * Estimativa determinística de horas de estudo por tópico.
 */

export const HOURS_PER_ECTS = 28; // IST: 1 ECTS = 28 h de trabalho
export const EXAM_STUDY_FRACTION = 0.15; // fração das horas da cadeira dedicada a preparar o exame
export const REVIEW_FRACTION = 0.15;
export const MIN_REVIEW_HOURS = 2;

export interface TopicInput {
  id: string;
  order: number;
  title: string;
  weight: number;
  difficulty: number; // 1–3
}

export interface DemandItem {
  /** topicId, ou null para o bloco de revisão */
  topicId: string | null;
  title: string;
  hours: number;
}

export function courseStudyHours(ects: number): number {
  return ects * HOURS_PER_ECTS * EXAM_STUDY_FRACTION;
}

/** Horas estimadas para cada tópico, proporcionais a weight × difficulty. */
export function estimateTopicHours(ects: number, topics: TopicInput[]): Map<string, number> {
  const total = courseStudyHours(ects);
  const score = (t: TopicInput) => Math.max(0, t.weight) * clamp(t.difficulty, 1, 3);
  const sum = topics.reduce((s, t) => s + score(t), 0);
  const out = new Map<string, number>();
  for (const t of topics) out.set(t.id, sum > 0 ? (total * score(t)) / sum : 0);
  return out;
}

/** Itens a estudar para um exame (até lastTopicOrder, por ordem), com revisão no fim. */
export function examDemand(ects: number, topics: TopicInput[], lastTopicOrder: number): DemandItem[] {
  const hours = estimateTopicHours(ects, topics);
  const items: DemandItem[] = [...topics]
    .filter((t) => t.order <= lastTopicOrder)
    .sort((a, b) => a.order - b.order)
    .map((t) => ({ topicId: t.id, title: t.title, hours: hours.get(t.id) ?? 0 }));
  const topicHours = items.reduce((s, i) => s + i.hours, 0);
  items.push({
    topicId: null,
    title: "Revisão geral + exercícios de exames anteriores",
    hours: Math.max(MIN_REVIEW_HOURS, topicHours * REVIEW_FRACTION),
  });
  return items;
}

function clamp(x: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, x));
}
