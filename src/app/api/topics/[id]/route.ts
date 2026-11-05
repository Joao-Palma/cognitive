import { prisma } from "@/lib/db";
import { body, num, withUser, HttpError, Ctx } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { replan } from "@/lib/replan";

/** Admin: ajustar peso/dificuldade de um tópico (o scraping só dá a ordem). */
export const PATCH = withUser(async (userId, req, ctx: Ctx) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!isAdmin(user?.email)) throw new HttpError(403, "Só administradores");
  const { id } = await ctx.params;
  const b = await body(req);
  const topic = await prisma.topic.update({
    where: { id },
    data: {
      ...(b.weight !== undefined && { weight: num(b.weight, "Peso", 0, 10) }),
      ...(b.difficulty !== undefined && { difficulty: num(b.difficulty, "Dificuldade", 1, 3) }),
    },
  });
  // as estimativas mudaram: replanear quem tem exames desta cadeira
  const affected = await prisma.exam.findMany({ where: { courseId: topic.courseId }, distinct: ["userId"], select: { userId: true } });
  for (const { userId: uid } of affected) await replan(uid);
  return topic;
});
