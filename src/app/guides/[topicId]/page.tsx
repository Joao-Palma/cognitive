import Link from "next/link";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isPremium } from "@/lib/premium";
import { hasGuide, isFreePreview } from "@/guides";
import { GuideRenderer } from "@/guides/GuideRenderer";
import { courseColor } from "@/lib/colors";
import { getT } from "@/i18n/server";
import { courseName, topicTitle } from "@/i18n/core";

export default async function GuidePage({ params }: { params: Promise<{ topicId: string }> }) {
  const user = await requireUser();
  const { lang, t } = await getT();
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({ where: { id: topicId }, include: { course: { include: { topics: { orderBy: { order: "asc" } } } }, guide: true } });
  if (!topic) notFound();
  const { course } = topic;
  const interactive = hasGuide(course.acronym, topic.order);
  const unlocked = isPremium(user) || isFreePreview(course.acronym, topic.order);
  const withGuides = course.topics.filter((tp) => hasGuide(course.acronym, tp.order));
  const idx = withGuides.findIndex((tp) => tp.id === topic.id);
  const prev = idx > 0 ? withGuides[idx - 1] : null;
  const next = idx >= 0 && idx < withGuides.length - 1 ? withGuides[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between text-sm">
        <Link href="/plan" className="text-slate-500 hover:underline">← {t("Plano", "Plan")}</Link>
        <Link href={`/courses/${course.id}`} className="text-slate-500 hover:underline">{t(`Todos os tópicos de ${course.acronym}`, `All ${course.acronym} topics`)}</Link>
      </div>
      <header className="mt-3 border-l-4 pl-3" style={{ borderLeftColor: courseColor(course.acronym) }}>
        <div className="text-sm font-medium text-slate-500">{course.acronym} · {t(`Tópico ${topic.order} de ${course.topics.length}`, `Topic ${topic.order} of ${course.topics.length}`)}</div>
        <h1 className="text-2xl font-bold sm:text-3xl">{topicTitle(topic, lang)}</h1>
        {interactive && unlocked && !isPremium(user) && <div className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">{t("Amostra grátis", "Free preview")}</div>}
      </header>

      {!unlocked ? (
        <div className="card mt-6 text-center">
          <div className="text-3xl">✨</div>
          <h2 className="mt-2 text-lg font-semibold">{t("Guias de estudo — Premium", "Study guides — Premium")}</h2>
          <p className="mt-1 text-slate-600">
            {interactive
              ? t(
                  "Este tópico tem um guia interativo: resumo, laboratório com gráficos que podes mexer, exemplo resolvido, exercícios com solução e erros comuns.",
                  "This topic has an interactive guide: summary, a lab with graphs you can play with, a worked example, exercises with solutions and common mistakes.",
                )
              : t("Resumos, conceitos-chave, exercícios resolvidos e erros comuns para cada tópico. Além da to-do list.", "Summaries, key concepts, worked exercises and common mistakes for every topic, on top of the to-do list.")}
          </p>
          {withGuides.length > 0 && (
            <p className="mt-2 text-sm">
              {t("Experimenta a amostra grátis:", "Try the free preview:")}{" "}
              {withGuides.filter((tp) => isFreePreview(course.acronym, tp.order)).map((tp) => (
                <Link key={tp.id} href={`/guides/${tp.id}`} className="text-blue-700 hover:underline">{topicTitle(tp, lang)}</Link>
              ))}
            </p>
          )}
          <Link href="/settings" className="btn mt-4">{t("Ativar Premium", "Get Premium")}</Link>
        </div>
      ) : interactive ? (
        <GuideRenderer acronym={course.acronym} order={topic.order} />
      ) : topic.guide ? (
        <article className="card mt-4 whitespace-pre-wrap text-sm leading-relaxed">{topic.guide.content}</article>
      ) : (
        <p className="card mt-4 text-slate-600">{t("O guia deste tópico ainda está a ser preparado. Por agora há guias interativos de Álgebra Linear.", "The guide for this topic is still being written. For now there are interactive guides for Linear Algebra.")}</p>
      )}

      {interactive && (
        <nav className="mt-10 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm">
          {prev ? <Link href={`/guides/${prev.id}`} className="btn-ghost max-w-[48%] truncate">← {prev.order}. {topicTitle(prev, lang)}</Link> : <span />}
          {next ? <Link href={`/guides/${next.id}`} className="btn-ghost max-w-[48%] truncate">{next.order}. {topicTitle(next, lang)} →</Link> : <span />}
        </nav>
      )}
      {interactive && (
        <p className="mt-6 text-xs text-slate-400">
          {t(
            `Guia escrito para o programa de ${courseName(course, lang)} do Técnico (Fénix). Notação e organização inspiradas nos resumos da comunidade LEIC (resumos.leic.pt).`,
            `Guide written for the ${courseName(course, lang)} syllabus at Técnico (Fénix). Notation and structure follow the LEIC community notes (resumos.leic.pt).`,
          )}
        </p>
      )}
    </div>
  );
}
