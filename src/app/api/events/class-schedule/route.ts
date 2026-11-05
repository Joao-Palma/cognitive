import { prisma } from "@/lib/db";
import { body, withUser, HttpError } from "@/lib/api";
import { replan } from "@/lib/replan";
import { zonedToUtc, toDayKey, addDays } from "@/lib/dates";

const DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

interface Slot {
  title: string;
  weekday: string; // MO..SU
  start: string; // HH:MM
  end: string;
}

/** Cria o horário de aulas do semestre como eventos semanais recorrentes. */
export const POST = withUser(async ({ userId, lang }, req) => {
  const b = await body<{ slots: Slot[]; until: string }>(req);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const tz = user.timezone;
  if (!Array.isArray(b.slots) || b.slots.length === 0) throw new HttpError(400, "Sem aulas", "No classes");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.until)) throw new HttpError(400, "Data de fim inválida", "Invalid end date");
  const today = toDayKey(new Date(), tz);
  const untilUtc = zonedToUtc(b.until, "23:59", tz).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const data = b.slots.map((s) => {
    const idx = DAYS.indexOf(s.weekday);
    if (idx < 0 || !HHMM.test(s.start) || !HHMM.test(s.end) || s.start >= s.end || !s.title?.trim())
      throw new HttpError(400, `Aula inválida: ${s.title ?? ""}`, `Invalid class: ${s.title ?? ""}`);
    // primeira ocorrência: próximo dia da semana a partir de hoje
    const todayIdx = (new Date(today + "T12:00:00Z").getUTCDay() + 6) % 7; // 0 = segunda
    const first = addDays(today, (idx - todayIdx + 7) % 7);
    return {
      userId,
      title: s.title.trim().slice(0, 200),
      start: zonedToUtc(first, s.start, tz),
      end: zonedToUtc(first, s.end, tz),
      category: "aula",
      blocksStudy: true,
      rrule: `FREQ=WEEKLY;BYDAY=${s.weekday};UNTIL=${untilUtc}`,
    };
  });
  await prisma.calendarEvent.createMany({ data });
  return { created: data.length, summary: await replan(userId, new Date(), lang) };
});
