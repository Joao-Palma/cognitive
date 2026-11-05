import { prisma } from "@/lib/db";
import { body, withUser, HttpError, Ctx } from "@/lib/api";

export const PATCH = withUser(async ({ userId }, req, ctx: Ctx) => {
  const { id } = await ctx.params;
  const task = await prisma.studyTask.findFirst({ where: { id, exam: { userId } } });
  if (!task) throw new HttpError(404, "Tarefa não encontrada", "Task not found");
  const b = await body(req);
  return prisma.studyTask.update({ where: { id }, data: { done: Boolean(b.done) } });
});
