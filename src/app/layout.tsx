import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getUserId } from "@/lib/auth";
import { getT } from "@/i18n/server";
import { LangProvider, LangSwitch } from "@/i18n/client";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("Estudo LEIC", "LEIC Study Planner"),
    description: t("Planeia o estudo para os exames de Engenharia Informática no Técnico.", "Plan your exam study for Computer Science and Engineering at Técnico."),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const userId = await getUserId();
  const { lang, t } = await getT();
  return (
    <html lang={lang === "en" ? "en" : "pt-PT"}>
      <body className="antialiased">
        <LangProvider lang={lang}>
          <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
              <Link href="/" className="mr-2 text-base font-bold">📚 {t("Estudo LEIC", "LEIC Study")}</Link>
              {userId && (
                <>
                  <Link href="/plan" className="hover:underline">{t("Plano", "Plan")}</Link>
                  <Link href="/calendar" className="hover:underline">{t("Calendário", "Calendar")}</Link>
                  <Link href="/exams/new" className="hover:underline">{t("Novo exame", "New exam")}</Link>
                  <Link href="/courses" className="hover:underline">{t("Cadeiras", "Courses")}</Link>
                  <Link href="/settings" className="hover:underline">{t("Definições", "Settings")}</Link>
                </>
              )}
              <div className="ml-auto flex items-center gap-3">
                <LangSwitch />
                {userId ? (
                  <Link href="/api/auth/signout" prefetch={false} className="text-slate-500 hover:underline">{t("Sair", "Sign out")}</Link>
                ) : (
                  <Link href="/login" className="btn">{t("Entrar", "Sign in")}</Link>
                )}
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
