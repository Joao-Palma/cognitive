import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { replan } from "@/lib/replan";
import { dbDateToDayKey, diffDays, toDayKey } from "@/lib/dates";
import { courseColor } from "@/lib/colors";
import { formatDay, formatDateTime, formatTime, hours, statusLabel } from "@/lib/format";
import { TaskCheckbox } from "@/components/TaskCheckbox";
import { Flash } from "@/components/Flash";
import { isPremium } from "@/lib/premium";
import { hasGuide } from "@/guides";
import { getT } from "@/i18n/server";
import { courseName, topicTitle } from "@/i18n/core";

export const dynamic = "force-dynamic";

export default async function PlanPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const user = await requireUser();
  const { lang, t } = await getT();
  const { msg } = await searchParams;
  const tz = user.timezone;
  const today = toDayKey(new Date(), tz);

  // Um novo dia pode ter deixado tarefas por fazer no passado → voltam a ser distribuídas
  const stale = await prisma.studyTask.count({
    where: { exam: { userId: user.id }, done: false, day: { lt: new Date(today + "T00:00:00Z") } },
  });
  if (stale > 0) await replan(user.id, new Date(), lang);

  const exams = await prisma.exam.findMany({
    where: { userId: user.id },
    include: { course: true, tasks: true },
    orderBy: { datetime: "asc" },
  });
  const upcoming = exams.filter((e) => toDayKey(e.datetime, tz) >= today);

  const tasks = await prisma.studyTask.findMany({
    where: { exam: { userId: user.id }, day: { gte: new Date(today + "T00:00:00Z") } },
    include: { exam: { include: { course: true } }, topic: true },
    orderBy: [{ day: "asc" }],
  });
  const byDay = new Map<string, typeof tasks>();
  for (const tk of tasks) {
    const d = dbDateToDayKey(tk.day);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(tk);
  }
  const examsByDay = new Map<string, typeof upcoming>();
  for (const e of upcoming) {
    const d = toDayKey(e.datetime, tz);
    if (!examsByDay.has(d)) examsByDay.set(d, []);
    examsByDay.get(d)!.push(e);
  }
  const allDays = [...new Set([...byDay.keys(), ...examsByDay.keys()])].sort();

  if (upcoming.length === 0) {
    return (
      <div className="card mx-auto max-w-lg text-center">
        <h1 className="text-xl font-semibold">{t("Ainda não tens exames", "No exams yet")}</h1>
        <p className="mt-2 text-slate-600">{t("Adiciona um exame e o plano de estudo é gerado automaticamente.", "Add an exam and your study plan is generated automatically.")}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/exams/new" className="btn">+ {t("Novo exame", "New exam")}</Link>
          <Link href="/calendar" className="btn-ghost">{t("Preencher calendário", "Fill in your calendar")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Flash message={msg} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("O teu plano", "Your plan")}</h1>
        <Link href="/exams/new" className="btn">+ {t("Novo exame", "New exam")}</Link>
      </div>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((e) => {
          const total = e.tasks.reduce((s, tk) => s + tk.hours, 0);
          const done = e.tasks.filter((tk) => tk.done).reduce((s, tk) => s + tk.hours, 0);
          const st = statusLabel(e.status, lang);
          const start = e.startDate ? dbDateToDayKey(e.startDate) : null;
          const examDay = toDayKey(e.datetime, tz);
          return (
            <Link key={e.id} href={`/exams/${e.id}`} className="card block border-l-4 hover:shadow" style={{ borderLeftColor: courseColor(e.course.acronym) }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{e.course.acronym} <span className="font-normal text-slate-500">· {courseName(e.course, lang)}</span></div>
                  <div className="text-sm text-slate-600">{formatDateTime(e.datetime, tz, lang)}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.text}</span>
              </div>
              <div className="mt-3 text-sm">
                {start ? (
                  <>{t("Começa", "Start on")} <b>{formatDay(start, lang)}</b> — {diffDays(examDay, start)} {t("dias antes", "days before")}</>
                ) : (
                  <span className="text-slate-500">{t("Sem sessões por agendar", "No sessions to schedule")}</span>
                )}
              </div>
              {e.status === "infeasible" && (
                <div className="mt-1 text-xs text-red-700">{t(`Faltam ${hours(e.missingHours, lang)}. Aumenta as horas/dia ou liberta o calendário.`, `${hours(e.missingHours, lang)} missing. Increase your hours/day or free up your calendar.`)}</div>
              )}
              {e.status === "compressed" && (
                <div className="mt-1 text-xs text-amber-700">{t("Alguns dias passam o teu limite diário para caber tudo.", "Some days go over your daily limit to fit everything in.")}</div>
              )}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full" style={{ width: `${total ? (100 * done) / total : 0}%`, background: courseColor(e.course.acronym) }} />
              </div>
              <div className="mt-1 text-xs text-slate-500">{t(`${hours(done, lang)} de ${hours(total, lang)} feitas`, `${hours(done, lang)} of ${hours(total, lang)} done`)}</div>
            </Link>
          );
        })}
      </section>

      <section className="space-y-4">
        {allDays.map((d) => {
          const list = byDay.get(d) ?? [];
          const sum = list.reduce((s, tk) => s + tk.hours, 0);
          return (
            <div key={d} className="card">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-semibold capitalize">
                  {d === today ? `${t("Hoje", "Today")} · ` : ""}
                  {formatDay(d, lang, { weekday: "long", day: "numeric", month: "long" })}
                </h2>
                {sum > 0 && <span className="text-sm text-slate-500">{hours(sum, lang)}</span>}
              </div>
              {(examsByDay.get(d) ?? []).map((e) => (
                <div key={e.id} className="mb-2 rounded-lg px-3 py-2 text-sm font-semibold text-white" style={{ background: courseColor(e.course.acronym) }}>
                  📝 {t(`Exame de ${e.course.acronym} às ${formatTime(e.datetime, tz, lang)}`, `${e.course.acronym} exam at ${formatTime(e.datetime, tz, lang)}`)}
                </div>
              ))}
              <ul className="divide-y divide-slate-100">
                {list.map((tk) => (
                  <li key={tk.id} className="flex items-center gap-3 py-2">
                    <TaskCheckbox id={tk.id} done={tk.done} />
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: courseColor(tk.exam.course.acronym) }} />
                    <div className={`min-w-0 flex-1 text-sm ${tk.done ? "text-slate-400 line-through" : ""}`}>
                      <span className="font-medium">{tk.exam.course.acronym}</span> · {tk.topic ? topicTitle(tk.topic, lang) : t("Revisão geral + exercícios de exames anteriores", "General review + past exam problems")}
                      {tk.parts > 1 && <span className="text-slate-500"> ({t("parte", "part")} {tk.part}/{tk.parts})</span>}
                    </div>
                    <span className="shrink-0 text-sm text-slate-500">{hours(tk.hours, lang)}</span>
                    {tk.topic && (
                      <Link href={`/guides/${tk.topic.id}`} className="shrink-0 text-xs text-blue-700 hover:underline">
                        {hasGuide(tk.exam.course.acronym, tk.topic.order) ? t("Guia interativo", "Interactive guide") : t("Guia", "Guide")}{isPremium(user) ? "" : " ✨"}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
