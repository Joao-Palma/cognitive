import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserId, isAdmin } from "@/lib/auth";
import { courseStudyHours, estimateTopicHours } from "@/lib/planner";
import { hours } from "@/lib/format";
import { TopicWeightEditor } from "@/components/TopicWeightEditor";
import { hasGuide } from "@/guides";
import { getT } from "@/i18n/server";
import { courseName, dateLocale, topicTitle } from "@/i18n/core";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { lang, t } = await getT();
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id }, include: { topics: { orderBy: { order: "asc" } } } });
  if (!course) notFound();
  const uid = await getUserId();
  const user = uid ? await prisma.user.findUnique({ where: { id: uid } }) : null;
  const admin = isAdmin(user?.email);
  const est = estimateTopicHours(course.ects, course.topics);
  const translated = course.topics.some((tp) => tp.titleEn);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/courses" className="text-sm text-slate-500 hover:underline">← {t("Cadeiras", "Courses")}</Link>
      <h1 className="mt-2 text-2xl font-bold">{course.acronym} · {courseName(course, lang)}</h1>
      <p className="text-sm text-slate-500">
        {course.ects} ECTS · {t(`${course.semester}.º semestre`, `Semester ${course.semester}`)} · ~{hours(Math.round(courseStudyHours(course.ects) * 2) / 2, lang)} {t("de estudo para a matéria toda", "of study for the whole syllabus")}
        {course.lastScrapedAt && <> · {t("atualizado do Fénix a", "updated from Fénix on")} {course.lastScrapedAt.toLocaleDateString(dateLocale(lang))}</>}
      </p>
      {lang === "en" && !translated && <p className="mt-2 text-xs text-amber-700">Topic titles are shown in Portuguese, as published on Fénix.</p>}
      <div className="card mt-4">
        <ol className="divide-y divide-slate-100">
          {course.topics.map((tp) => (
            <li key={tp.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
              <span className="w-6 text-slate-400">{tp.order}.</span>
              <span className="min-w-0 flex-1">{topicTitle(tp, lang)}</span>
              {hasGuide(course.acronym, tp.order) && (
                <Link href={`/guides/${tp.id}`} className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100">{t("Guia interativo", "Interactive guide")}</Link>
              )}
              <span className="text-slate-500">{hours(Math.round((est.get(tp.id) ?? 0) * 10) / 10, lang)}</span>
              {admin && <TopicWeightEditor id={tp.id} weight={tp.weight} difficulty={tp.difficulty} />}
            </li>
          ))}
        </ol>
      </div>
      {admin && <p className="mt-2 text-xs text-slate-500">{t("Admin: o peso e a dificuldade alteram as horas estimadas (∝ peso × dificuldade).", "Admin: weight and difficulty change the estimated hours (∝ weight × difficulty).")}</p>}
      {user && <Link href={`/exams/new`} className="btn mt-4">+ {t("Marcar exame", "Add exam")}</Link>}
    </div>
  );
}
