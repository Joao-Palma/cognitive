import { prisma } from "@/lib/db";
import { body, date, num, withUser, HttpError, Ctx } from "@/lib/api";
import { replan } from "@/lib/replan";

async function own(userId: string, id: string) {
  const exam = await prisma.exam.findFirst({ where: { id, userId } });
  if (!exam) throw new HttpError(404, "Exame não encontrado", "Exam not found");
  return exam;
}

export const PATCH = withUser(async ({ userId, lang }, req, ctx: Ctx) => {
  const { id } = await ctx.params;
  await own(userId, id);
  const b = await body(req);
  await prisma.exam.update({
    where: { id },
    data: {
      ...(b.datetime !== undefined && { datetime: date(b.datetime, ["Data", "date"]) }),
      ...(b.durationMin !== undefined && { durationMin: num(b.durationMin, ["Duração", "duration"], 15, 600) }),
      ...(b.lastTopicOrder !== undefined && { lastTopicOrder: num(b.lastTopicOrder, ["Último tópico", "last topic"], 1) }),
    },
  });
  return { summary: await replan(userId, new Date(), lang) };
});

export const DELETE = withUser(async ({ userId, lang }, _req, ctx: Ctx) => {
  const { id } = await ctx.params;
  await own(userId, id);
  await prisma.exam.delete({ where: { id } });
  return { summary: await replan(userId, new Date(), lang) };
});
