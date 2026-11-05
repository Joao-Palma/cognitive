import { prisma } from "@/lib/db";
import { body, date, num, withUser, HttpError } from "@/lib/api";
import { replan } from "@/lib/replan";

export const POST = withUser(async ({ userId, lang }, req) => {
  const b = await body(req);
  const course = await prisma.course.findUnique({ where: { id: String(b.courseId) }, include: { topics: true } });
  if (!course) throw new HttpError(400, "Cadeira inválida", "Invalid course");
  const exam = await prisma.exam.create({
    data: {
      userId,
      courseId: course.id,
      datetime: date(b.datetime, ["Data", "date"]),
      durationMin: b.durationMin ? num(b.durationMin, ["Duração", "duration"], 15, 600) : 180,
      lastTopicOrder: num(b.lastTopicOrder, ["Último tópico", "last topic"], 1, course.topics.length || 1),
    },
  });
  const summary = await replan(userId, new Date(), lang);
  return { exam, summary };
});
