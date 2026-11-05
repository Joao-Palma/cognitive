import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Estudo LEIC",
  description: "Planeia o estudo para os exames de Engenharia Informática no Técnico.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const userId = await getUserId();
  return (
    <html lang="pt">
      <body className="antialiased">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
            <Link href="/" className="mr-2 text-base font-bold">📚 Estudo LEIC</Link>
            {userId ? (
              <>
                <Link href="/plan" className="hover:underline">Plano</Link>
                <Link href="/calendar" className="hover:underline">Calendário</Link>
                <Link href="/exams/new" className="hover:underline">Novo exame</Link>
                <Link href="/courses" className="hover:underline">Cadeiras</Link>
                <Link href="/settings" className="hover:underline">Definições</Link>
                <Link href="/api/auth/signout" prefetch={false} className="ml-auto text-slate-500 hover:underline">Sair</Link>
              </>
            ) : (
              <Link href="/api/auth/signin" prefetch={false} className="ml-auto btn">Entrar</Link>
            )}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
