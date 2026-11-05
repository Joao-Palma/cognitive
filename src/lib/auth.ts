import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { redirect } from "next/navigation";
import { prisma } from "./db";

const isDev = process.env.NODE_ENV !== "production";
/** Login só com email, sem verificação. Ativo em dev, ou em produção com ALLOW_EMAIL_ONLY_LOGIN=true. */
export const emailOnlyLogin = isDev || process.env.ALLOW_EMAIL_ONLY_LOGIN === "true";

const providers: NextAuthOptions["providers"] = [];

if (emailOnlyLogin) {
  providers.push(
    CredentialsProvider({
      id: "email-only",
      name: "Email",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds) {
        const email = creds?.email?.trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
        return prisma.user.upsert({ where: { email }, create: { email }, update: {} });
      },
    }),
  );
}

// Magic link por email: só quando há SMTP configurado
if (process.env.EMAIL_SERVER) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM ?? "Estudo LEIC <no-reply@localhost>",
    }),
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.uid as string;
      return session;
    },
  },
};

export async function getUserId(): Promise<string | null> {
  const s = await getServerSession(authOptions);
  return (s?.user as { id?: string } | undefined)?.id ?? null;
}

/** Para páginas: devolve o utilizador ou redireciona para o login. */
export async function requireUser() {
  const id = await getUserId();
  const user = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!user) redirect("/login");
  return user;
}

export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase());
  return list.includes(email.toLowerCase()) || (isDev && list.length === 1 && list[0] === "");
}
