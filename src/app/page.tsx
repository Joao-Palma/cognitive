import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";

export default async function Home() {
  if (await getUserId()) redirect("/plan");
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Sabe exatamente quando começar a estudar.</h1>
      <p className="mt-4 text-lg text-slate-600">
        Diz quando é o exame e até que matéria sai. A app usa o programa da cadeira no Fénix, o teu calendário e os
        outros testes da semana para te dizer quando começar e o que estudar em cada dia.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/login" className="btn px-5 py-3 text-base">Começar</Link>
        <Link href="/courses" className="btn-ghost px-5 py-3 text-base">Ver cadeiras</Link>
      </div>
      <ul className="mt-12 grid gap-4 text-left sm:grid-cols-3">
        {[
          ["🎯", "Plano por exame", "Horas estimadas por tópico a partir dos ECTS e do programa oficial."],
          ["🗓️", "Ajusta-se ao teu calendário", "Aulas e compromissos tiram horas; vários testes na mesma semana são conciliados."],
          ["✨", "Guias de estudo", "Plano premium (brevemente): guias por tópico, além da to-do list."],
        ].map(([icon, t, d]) => (
          <li key={t} className="card">
            <div className="text-2xl">{icon}</div>
            <div className="mt-2 font-semibold">{t}</div>
            <div className="mt-1 text-sm text-slate-600">{d}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
