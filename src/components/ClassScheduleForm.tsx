"use client";
import { useState } from "react";
import { WEEKDAYS } from "@/lib/rrule-form";

interface Row {
  title: string;
  weekday: string;
  start: string;
  end: string;
}

/** Atalho: horário de aulas do semestre → eventos semanais recorrentes. */
export function ClassScheduleForm({
  courses,
  defaultUntil,
  onDone,
}: {
  courses: { acronym: string; name: string }[];
  defaultUntil: string;
  onDone: (message: string | null) => void;
}) {
  const [rows, setRows] = useState<Row[]>([{ title: "", weekday: "MO", start: "09:30", end: "11:00" }]);
  const [until, setUntil] = useState(defaultUntil);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const slots = rows.filter((r) => r.title.trim());
        if (!slots.length) return setError("Adiciona pelo menos uma aula.");
        setBusy(true);
        setError(null);
        const res = await fetch("/api/events/class-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slots, until }),
        });
        const data = await res.json();
        setBusy(false);
        if (!res.ok) return setError(data.error ?? "Erro");
        onDone(data.summary?.message ?? `${data.created} aulas semanais adicionadas.`);
      }}
    >
      <datalist id="course-acronyms">
        {courses.map((c) => <option key={c.acronym} value={c.acronym}>{c.name}</option>)}
      </datalist>
      <p className="text-sm text-slate-600">Uma linha por aula (teórica, prática, laboratório…).</p>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-slate-200 p-2">
            <input className="input col-span-2" list="course-acronyms" placeholder="Cadeira / tipo (p.ex. SO — T)" value={r.title} onChange={(e) => update(i, { title: e.target.value })} aria-label="Aula" />
            <div className="col-span-2 grid grid-cols-3 gap-2">
              <select className="input" value={r.weekday} onChange={(e) => update(i, { weekday: e.target.value })} aria-label="Dia da semana">
                {WEEKDAYS.slice(0, 6).map((w) => <option key={w.code} value={w.code}>{w.label}</option>)}
              </select>
              <input type="time" className="input" value={r.start} onChange={(e) => update(i, { start: e.target.value })} aria-label="Início" />
              <input type="time" className="input" value={r.end} onChange={(e) => update(i, { end: e.target.value })} aria-label="Fim" />
            </div>
            {rows.length > 1 && (
              <button type="button" className="col-span-2 text-left text-xs text-red-700" onClick={() => setRows(rows.filter((_, j) => j !== i))}>Remover</button>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="btn-ghost" onClick={() => setRows([...rows, { ...rows[rows.length - 1], title: "" }])}>+ Outra aula</button>
      <div>
        <label className="label" htmlFor="cs-until">Até ao fim do semestre</label>
        <input id="cs-until" type="date" className="input" value={until} onChange={(e) => setUntil(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "A criar…" : "Adicionar horário"}</button>
    </form>
  );
}
