import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import { getT } from "@/i18n/server";

export default async function Home() {
  if (await getUserId()) redirect("/plan");
  const { t } = await getT();
  const features: [string, string, string][] = [
    ["🎯", t("Plano por exame", "A plan per exam"), t("Horas estimadas por tópico a partir dos ECTS e do programa oficial.", "Hours estimated per topic from the ECTS credits and the official syllabus.")],
    ["🗓️", t("Ajusta-se ao teu calendário", "Fits your calendar"), t("Aulas e compromissos tiram horas; vários testes na mesma semana são conciliados.", "Classes and commitments take time away; several exams in the same week are reconciled.")],
    ["✨", t("Guias de estudo interativos", "Interactive study guides"), t("Premium: guias por tópico com gráficos que podes mexer, além da to-do list.", "Premium: per-topic guides with graphs you can play with, on top of the to-do list.")],
  ];
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{t("Sabe exatamente quando começar a estudar.", "Know exactly when to start studying.")}</h1>
      <p className="mt-4 text-lg text-slate-600">
        {t(
          "Diz quando é o exame e até que matéria sai. A app usa o programa da cadeira no Fénix, o teu calendário e os outros testes da semana para te dizer quando começar e o que estudar em cada dia.",
          "Tell it when the exam is and up to which topic it covers. The app uses the course syllabus from Fénix, your calendar and the week's other exams to tell you when to start and what to study each day.",
        )}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/login" className="btn px-5 py-3 text-base">{t("Começar", "Get started")}</Link>
        <Link href="/courses" className="btn-ghost px-5 py-3 text-base">{t("Ver cadeiras", "Browse courses")}</Link>
      </div>
      <ul className="mt-12 grid gap-4 text-left sm:grid-cols-3">
        {features.map(([icon, title, d]) => (
          <li key={title} className="card">
            <div className="text-2xl">{icon}</div>
            <div className="mt-2 font-semibold">{title}</div>
            <div className="mt-1 text-sm text-slate-600">{d}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
