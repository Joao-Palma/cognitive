import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isPremium } from "@/lib/premium";

export default async function GuidePage({ params }: { params: Promise<{ topicId: string }> }) {
  const user = await requireUser();
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({ where: { id: topicId }, include: { course: true, guide: true } });
  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/plan" className="text-sm text-slate-500 hover:underline">← Plano</Link>
      <h1 className="mt-2 text-2xl font-bold">{topic.course.acronym} · {topic.title}</h1>
      {!isPremium(user) ? (
        <div className="card mt-4 text-center">
          <div className="text-3xl">✨</div>
          <h2 className="mt-2 text-lg font-semibold">Guias de estudo — Premium</h2>
          <p className="mt-1 text-slate-600">
            Resumos, conceitos-chave, exercícios resolvidos e erros comuns para cada tópico. Além da to-do list.
          </p>
          <button className="btn mt-4" disabled>Brevemente</button>
        </div>
      ) : topic.guide ? (
        <article className="card mt-4 whitespace-pre-wrap text-sm leading-relaxed">{topic.guide.content}</article>
      ) : (
        <p className="card mt-4 text-slate-600">O guia deste tópico ainda está a ser preparado.</p>
      )}
    </div>
  );
}
