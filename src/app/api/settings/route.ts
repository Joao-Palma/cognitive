import { prisma } from "@/lib/db";
import { body, num, withUser, HttpError } from "@/lib/api";
import { replan } from "@/lib/replan";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const PATCH = withUser(async (userId, req) => {
  const b = await body(req);
  const start = String(b.studyWindowStart ?? "");
  const end = String(b.studyWindowEnd ?? "");
  if (!HHMM.test(start) || !HHMM.test(end) || start >= end) throw new HttpError(400, "Janela de estudo inválida");
  await prisma.user.update({
    where: { id: userId },
    data: { dailyHours: num(b.dailyHours, "Horas por dia", 0.5, 16), studyWindowStart: start, studyWindowEnd: end },
  });
  return { summary: await replan(userId) };
});
