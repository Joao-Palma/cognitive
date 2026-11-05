import { prisma } from "@/lib/db";
import { body, date, num, withUser, HttpError } from "@/lib/api";
import { replan } from "@/lib/replan";

export const POST = withUser(async (userId, req) => {
  const b = await body(req);
  const course = await prisma.course.findUnique({ where: { id: String(b.courseId) }, include: { topics: true } });
  if (!course) throw new HttpError(400, "Cadeira inválida");
  const exam = await prisma.exam.create({
    data: {
      userId,
      courseId: course.id,
      datetime: date(b.datetime, "Data"),
      durationMin: b.durationMin ? num(b.durationMin, "Duração", 15, 600) : 180,
      lastTopicOrder: num(b.lastTopicOrder, "Último tópico", 1, course.topics.length || 1),
    },
  });
  const summary = await replan(userId);
  return { exam, summary };
});
