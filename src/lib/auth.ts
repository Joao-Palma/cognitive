import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { redirect } from "next/navigation";
import { prisma } from "./db";

const isDev = process.env.NODE_ENV !== "production";

const providers: NextAuthOptions["providers"] = [
  EmailProvider({
    server: process.env.EMAIL_SERVER ?? "",
    from: process.env.EMAIL_FROM ?? "Estudo LEIC <no-reply@localhost>",
    // Sem SMTP configurado (dev), o link de login aparece na consola do servidor.
    ...(process.env.EMAIL_SERVER
      ? {}
      : {
          async sendVerificationRequest({ identifier, url }) {
            console.log(`\n🔑 Link de login para ${identifier}:\n${url}\n`);
          },
        }),
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
  );
}

if (isDev) {
  // Login rápido só em desenvolvimento: basta o email.
  providers.push(
    CredentialsProvider({
      id: "dev",
      name: "Dev (só email)",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds) {
        const email = creds?.email?.trim().toLowerCase();
        if (!email) return null;
        return prisma.user.upsert({ where: { email }, create: { email }, update: {} });
      },
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
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
  if (!user) redirect("/api/auth/signin");
  return user;
}

export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase());
  return list.includes(email.toLowerCase()) || (isDev && list.length === 1 && list[0] === "");
}
