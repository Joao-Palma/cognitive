import { date, HttpError } from "@/lib/api";

const CATEGORIES = ["aula", "pessoal", "trabalho", "outro"];

/** Valida os campos editáveis de um evento (todos opcionais, para PATCH). */
export function parseEventInput(b: Record<string, unknown>) {
  const out: {
    title?: string;
    start?: Date;
    end?: Date;
    allDay?: boolean;
    category?: string;
    blocksStudy?: boolean;
    rrule?: string | null;
  } = {};
  if (b.title !== undefined) {
    out.title = String(b.title).trim().slice(0, 200);
    if (!out.title) throw new HttpError(400, "Título obrigatório", "Title is required");
  }
  if (b.start !== undefined) out.start = date(b.start, ["Início", "start"]);
  if (b.end !== undefined) out.end = date(b.end, ["Fim", "end"]);
  if (out.start && out.end && out.end <= out.start) throw new HttpError(400, "O fim tem de ser depois do início", "End must be after start");
  if (b.allDay !== undefined) out.allDay = Boolean(b.allDay);
  if (b.category !== undefined) {
    if (!CATEGORIES.includes(String(b.category))) throw new HttpError(400, "Categoria inválida", "Invalid category");
    out.category = String(b.category);
  }
  if (b.blocksStudy !== undefined) out.blocksStudy = Boolean(b.blocksStudy);
  if (b.rrule !== undefined) {
    const r = b.rrule ? String(b.rrule) : null;
    if (r && !/^FREQ=WEEKLY(;BYDAY=(MO|TU|WE|TH|FR|SA|SU)(,(MO|TU|WE|TH|FR|SA|SU))*)?(;UNTIL=\d{8}T\d{6}Z)?$/.test(r))
      throw new HttpError(400, "Recorrência inválida", "Invalid recurrence");
    out.rrule = r;
  }
  return out;
}
