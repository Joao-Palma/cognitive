import Link from "next/link";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isPremium } from "@/lib/premium";
import { hasGuide, isFreePreview } from "@/guides";
import { GuideRenderer } from "@/guides/GuideRenderer";
import { courseColor } from "@/lib/colors";

export default async function GuidePage({ params }: { params: Promise<{ topicId: string }> }) {
  const user = await requireUser();
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({ where: { id: topicId }, include: { course: { include: { topics: { orderBy: { order: "asc" } } } }, guide: true } });
  if (!topic) notFound();
  const { course } = topic;
  const interactive = hasGuide(course.acronym, topic.order);
  const unlocked = isPremium(user) || isFreePreview(course.acronym, topic.order);
  const withGuides = course.topics.filter((t) => hasGuide(course.acronym, t.order));
  const idx = withGuides.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? withGuides[idx - 1] : null;
  const next = idx >= 0 && idx < withGuides.length - 1 ? withGuides[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between text-sm">
        <Link href="/plan" className="text-slate-500 hover:underline">← Plano</Link>
        <Link href={`/courses/${course.id}`} className="text-slate-500 hover:underline">Todos os tópicos de {course.acronym}</Link>
      </div>
      <header className="mt-3 border-l-4 pl-3" style={{ borderLeftColor: courseColor(course.acronym) }}>
        <div className="text-sm font-medium text-slate-500">{course.acronym} · Tópico {topic.order} de {course.topics.length}</div>
        <h1 className="text-2xl font-bold sm:text-3xl">{topic.title}</h1>
        {interactive && unlocked && !isPremium(user) && <div className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Amostra grátis</div>}
      </header>

      {!unlocked ? (
        <div className="card mt-6 text-center">
          <div className="text-3xl">✨</div>
          <h2 className="mt-2 text-lg font-semibold">Guias de estudo — Premium</h2>
          <p className="mt-1 text-slate-600">
            {interactive
              ? "Este tópico tem um guia interativo: resumo, laboratório com gráficos que podes mexer, exemplo resolvido, exercícios com solução e erros comuns."
              : "Resumos, conceitos-chave, exercícios resolvidos e erros comuns para cada tópico. Além da to-do list."}
          </p>
          {withGuides.length > 0 && (
            <p className="mt-2 text-sm">
              Experimenta a amostra grátis:{" "}
              {withGuides.filter((t) => isFreePreview(course.acronym, t.order)).map((t) => (
                <Link key={t.id} href={`/guides/${t.id}`} className="text-blue-700 hover:underline">{t.title}</Link>
              ))}
            </p>
          )}
          <Link href="/settings" className="btn mt-4">Ativar Premium</Link>
        </div>
      ) : interactive ? (
        <GuideRenderer acronym={course.acronym} order={topic.order} />
      ) : topic.guide ? (
        <article className="card mt-4 whitespace-pre-wrap text-sm leading-relaxed">{topic.guide.content}</article>
      ) : (
        <p className="card mt-4 text-slate-600">O guia deste tópico ainda está a ser preparado. Por agora há guias interativos de Álgebra Linear.</p>
      )}

      {interactive && (
        <nav className="mt-10 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm">
          {prev ? <Link href={`/guides/${prev.id}`} className="btn-ghost max-w-[48%] truncate">← {prev.order}. {prev.title}</Link> : <span />}
          {next ? <Link href={`/guides/${next.id}`} className="btn-ghost max-w-[48%] truncate">{next.order}. {next.title} →</Link> : <span />}
        </nav>
      )}
      {interactive && (
        <p className="mt-6 text-xs text-slate-400">
          Guia escrito para o programa de {course.name} do Técnico (Fénix). Notação e organização inspiradas nos resumos da comunidade LEIC (resumos.leic.pt).
        </p>
      )}
    </div>
  );
}
