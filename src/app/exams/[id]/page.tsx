import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { dbDateToDayKey, diffDays, toDayKey } from "@/lib/dates";
import { examDemand } from "@/lib/planner";
import { formatDay, formatDateTime, hours, statusLabel } from "@/lib/format";
import { courseColor } from "@/lib/colors";
import { DeleteButton } from "@/components/DeleteButton";
import { getT } from "@/i18n/server";
import { courseName, topicTitle } from "@/i18n/core";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { lang, t } = await getT();
  const { id } = await params;
  const exam = await prisma.exam.findFirst({
    where: { id, userId: user.id },
    include: { course: { include: { topics: { orderBy: { order: "asc" } } } }, tasks: true },
  });
  if (!exam) notFound();

  const tz = user.timezone;
  const topics = exam.course.topics.map((tp) => ({ ...tp, title: topicTitle(tp, lang) }));
  const demand = examDemand(exam.course.ects, topics, exam.lastTopicOrder);
  const st = statusLabel(exam.status, lang);
  const start = exam.startDate ? dbDateToDayKey(exam.startDate) : null;
  const examDay = toDayKey(exam.datetime, tz);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/plan" className="text-sm text-slate-500 hover:underline">← {t("Plano", "Plan")}</Link>
      <div className="card border-l-4" style={{ borderLeftColor: courseColor(exam.course.acronym) }}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{t(`Exame de ${exam.course.acronym}`, `${exam.course.acronym} exam`)}</h1>
            <p className="text-slate-600">{courseName(exam.course, lang)} · {exam.course.ects} ECTS</p>
            <p className="mt-1 text-sm">{formatDateTime(exam.datetime, tz, lang)} · {exam.durationMin} min</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.text}</span>
        </div>
        <p className="mt-3">
          {start ? (
            <>
              {t("Começa a estudar", "Start studying on")} <b>{formatDay(start, lang, { weekday: "long", day: "numeric", month: "long" })}</b> ({diffDays(examDay, start)} {t("dias antes", "days before")}).
            </>
          ) : (
            t("Não há sessões por agendar.", "There are no sessions to schedule.")
          )}
        </p>
        {exam.status === "infeasible" && <p className="mt-1 text-sm text-red-700">{t(`Faltam ${hours(exam.missingHours, lang)} que não cabem antes do exame.`, `${hours(exam.missingHours, lang)} don't fit before the exam.`)}</p>}
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold">{t(`Matéria (tópicos 1–${exam.lastTopicOrder})`, `Syllabus (topics 1–${exam.lastTopicOrder})`)}</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            {demand.map((d) => {
              const done = exam.tasks.filter((tk) => tk.done && tk.topicId === d.topicId).reduce((s, tk) => s + tk.hours, 0);
              return (
                <tr key={d.topicId ?? "rev"}>
                  <td className="py-1.5 pr-2">{d.topicId ? d.title : t("Revisão geral + exercícios de exames anteriores", "General review + past exam problems")}</td>
                  <td className="py-1.5 text-right whitespace-nowrap text-slate-500">{hours(done, lang)} / {hours(Math.round(d.hours * 2) / 2, lang)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DeleteButton url={`/api/exams/${exam.id}`} confirmText={t("Apagar este exame e o respetivo plano?", "Delete this exam and its plan?")} redirectTo="/plan" label={t("Apagar exame", "Delete exam")} />
    </div>
  );
}
