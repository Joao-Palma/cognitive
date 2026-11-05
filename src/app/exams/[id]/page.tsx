import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { dbDateToDayKey, diffDays, toDayKey } from "@/lib/dates";
import { examDemand } from "@/lib/planner";
import { formatDay, formatDateTime, hours, STATUS_LABEL } from "@/lib/format";
import { courseColor } from "@/lib/colors";
import { DeleteButton } from "@/components/DeleteButton";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const exam = await prisma.exam.findFirst({
    where: { id, userId: user.id },
    include: { course: { include: { topics: { orderBy: { order: "asc" } } } }, tasks: true },
  });
  if (!exam) notFound();

  const tz = user.timezone;
  const demand = examDemand(exam.course.ects, exam.course.topics, exam.lastTopicOrder);
  const st = STATUS_LABEL[exam.status] ?? STATUS_LABEL.ok;
  const start = exam.startDate ? dbDateToDayKey(exam.startDate) : null;
  const examDay = toDayKey(exam.datetime, tz);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/plan" className="text-sm text-slate-500 hover:underline">← Plano</Link>
      <div className="card border-l-4" style={{ borderLeftColor: courseColor(exam.course.acronym) }}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Exame de {exam.course.acronym}</h1>
            <p className="text-slate-600">{exam.course.name} · {exam.course.ects} ECTS</p>
            <p className="mt-1 text-sm">{formatDateTime(exam.datetime, tz)} · {exam.durationMin} min</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.text}</span>
        </div>
        <p className="mt-3">
          {start ? <>Começa a estudar <b>{formatDay(start, { weekday: "long", day: "numeric", month: "long" })}</b> ({diffDays(examDay, start)} dias antes).</> : "Não há sessões por agendar."}
        </p>
        {exam.status === "infeasible" && <p className="mt-1 text-sm text-red-700">Faltam {hours(exam.missingHours)} que não cabem antes do exame.</p>}
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold">Matéria (tópicos 1–{exam.lastTopicOrder})</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            {demand.map((d) => {
              const done = exam.tasks.filter((t) => t.done && t.topicId === d.topicId).reduce((s, t) => s + t.hours, 0);
              return (
                <tr key={d.topicId ?? "rev"}>
                  <td className="py-1.5 pr-2">{d.title}</td>
                  <td className="py-1.5 text-right whitespace-nowrap text-slate-500">{hours(done)} / {hours(Math.round(d.hours * 2) / 2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DeleteButton url={`/api/exams/${exam.id}`} confirmText="Apagar este exame e o respetivo plano?" redirectTo="/plan" label="Apagar exame" />
    </div>
  );
}
