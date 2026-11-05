import { prisma } from "@/lib/db";
import { body, date, num, withUser, HttpError, Ctx } from "@/lib/api";
import { replan } from "@/lib/replan";
import { parseEventInput } from "../parse";

async function own(userId: string, id: string) {
  const ev = await prisma.calendarEvent.findFirst({ where: { id, userId } });
  if (!ev) throw new HttpError(404, "Evento não encontrado", "Event not found");
  return ev;
}

export const GET = withUser(async ({ userId }, _req, ctx: Ctx) => {
  const { id } = await ctx.params;
  return own(userId, id);
});

/**
 * Editar um evento. Arrastar/redimensionar no calendário envia { deltaStartMs, deltaEndMs }:
 * aplica-se à série inteira (num evento recorrente) ou ao evento único.
 */
export const PATCH = withUser(async ({ userId, lang }, req, ctx: Ctx) => {
  const { id } = await ctx.params;
  const ev = await own(userId, id);
  const b = await body(req);
  const data = parseEventInput(b);
  if (b.deltaStartMs !== undefined || b.deltaEndMs !== undefined) {
    const ds = b.deltaStartMs !== undefined ? num(b.deltaStartMs, ["delta", "delta"]) : 0;
    const de = b.deltaEndMs !== undefined ? num(b.deltaEndMs, ["delta", "delta"]) : ds;
    data.start = new Date(ev.start.getTime() + ds);
    data.end = new Date(ev.end.getTime() + de);
    if (data.end <= data.start) throw new HttpError(400, "O fim tem de ser depois do início", "End must be after start");
  }
  const event = await prisma.calendarEvent.update({ where: { id }, data });
  return { event, summary: await replan(userId, new Date(), lang) };
});

/** DELETE ?scope=one&occurrence=ISO apaga só uma ocorrência; senão apaga tudo. */
export const DELETE = withUser(async ({ userId, lang }, req, ctx: Ctx) => {
  const { id } = await ctx.params;
  const ev = await own(userId, id);
  const url = new URL(req.url);
  if (url.searchParams.get("scope") === "one" && ev.rrule) {
    const occ = date(url.searchParams.get("occurrence"), ["Ocorrência", "occurrence"]).toISOString();
    const ex: string[] = JSON.parse(ev.exdates || "[]");
    await prisma.calendarEvent.update({ where: { id }, data: { exdates: JSON.stringify([...new Set([...ex, occ])]) } });
  } else {
    await prisma.calendarEvent.delete({ where: { id } });
  }
  return { summary: await replan(userId, new Date(), lang) };
});
