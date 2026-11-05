import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserId, isAdmin } from "@/lib/auth";
import { courseStudyHours, estimateTopicHours } from "@/lib/planner";
import { hours } from "@/lib/format";
import { TopicWeightEditor } from "@/components/TopicWeightEditor";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id }, include: { topics: { orderBy: { order: "asc" } } } });
  if (!course) notFound();
  const uid = await getUserId();
  const user = uid ? await prisma.user.findUnique({ where: { id: uid } }) : null;
  const admin = isAdmin(user?.email);
  const est = estimateTopicHours(course.ects, course.topics);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/courses" className="text-sm text-slate-500 hover:underline">← Cadeiras</Link>
      <h1 className="mt-2 text-2xl font-bold">{course.acronym} · {course.name}</h1>
      <p className="text-sm text-slate-500">
        {course.ects} ECTS · {course.semester}.º semestre · ~{hours(Math.round(courseStudyHours(course.ects) * 2) / 2)} de estudo para a matéria toda
        {course.lastScrapedAt && <> · atualizado do Fénix a {course.lastScrapedAt.toLocaleDateString("pt-PT")}</>}
      </p>
      <div className="card mt-4">
        <ol className="divide-y divide-slate-100">
          {course.topics.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
              <span className="w-6 text-slate-400">{t.order}.</span>
              <span className="min-w-0 flex-1">{t.title}</span>
              <span className="text-slate-500">{hours(Math.round((est.get(t.id) ?? 0) * 10) / 10)}</span>
              {admin && <TopicWeightEditor id={t.id} weight={t.weight} difficulty={t.difficulty} />}
            </li>
          ))}
        </ol>
      </div>
      {admin && <p className="mt-2 text-xs text-slate-500">Admin: o peso e a dificuldade alteram as horas estimadas (∝ peso × dificuldade).</p>}
      {user && <Link href={`/exams/new`} className="btn mt-4">+ Marcar exame</Link>}
    </div>
  );
}
