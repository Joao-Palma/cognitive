import { prisma } from "@/lib/db";
import { body, withUser, HttpError } from "@/lib/api";
import { emailOnlyLogin } from "@/lib/auth";

/** Enquanto não há pagamentos: ligar/desligar premium só em dev (ou com ALLOW_EMAIL_ONLY_LOGIN). */
export const POST = withUser(async (userId, req) => {
  if (!emailOnlyLogin) throw new HttpError(403, "Os pagamentos ainda não estão disponíveis");
  const b = await body(req);
  const user = await prisma.user.update({ where: { id: userId }, data: { isPremium: Boolean(b.enabled) } });
  return { isPremium: user.isPremium };
});
