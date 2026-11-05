import { prisma } from "@/lib/db";
import { body, date, num, withUser, HttpError, Ctx } from "@/lib/api";
import { replan } from "@/lib/replan";

async function own(userId: string, id: string) {
  const exam = await prisma.exam.findFirst({ where: { id, userId } });
  if (!exam) throw new HttpError(404, "Exame não encontrado");
  return exam;
}

export const PATCH = withUser(async (userId, req, ctx: Ctx) => {
  const { id } = await ctx.params;
  await own(userId, id);
  const b = await body(req);
  await prisma.exam.update({
    where: { id },
    data: {
      ...(b.datetime !== undefined && { datetime: date(b.datetime, "Data") }),
      ...(b.durationMin !== undefined && { durationMin: num(b.durationMin, "Duração", 15, 600) }),
      ...(b.lastTopicOrder !== undefined && { lastTopicOrder: num(b.lastTopicOrder, "Último tópico", 1) }),
    },
  });
  return { summary: await replan(userId) };
});

export const DELETE = withUser(async (userId, _req, ctx: Ctx) => {
  const { id } = await ctx.params;
  await own(userId, id);
  await prisma.exam.delete({ where: { id } });
  return { summary: await replan(userId) };
});
