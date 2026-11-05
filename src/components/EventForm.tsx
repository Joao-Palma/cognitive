"use client";
import { useState } from "react";
import { localToIso } from "./ExamForm";
import { WEEKDAYS, buildWeeklyRrule, parseWeeklyRrule, weekdayCode } from "@/lib/rrule-form";

export interface EventDraft {
  id?: string;
  title: string;
  date: string; // YYYY-MM-DD (local)
  start: string; // HH:MM
  end: string;
  allDay: boolean;
  category: string;
  blocksStudy: boolean;
  rrule: string | null;
  /** ocorrência clicada (para "apagar só esta") */
  occurrenceStart?: string;
}

const CATEGORIES = [
  ["aula", "Aula"],
  ["pessoal", "Pessoal"],
  ["trabalho", "Trabalho"],
  ["outro", "Outro"],
];

export function EventForm({
  draft,
  timezone,
  onDone,
}: {
  draft: EventDraft;
  timezone: string;
  onDone: (message: string | null) => void;
}) {
  const parsed = parseWeeklyRrule(draft.rrule);
  const [v, setV] = useState(draft);
  const [repeat, setRepeat] = useState(!!draft.rrule);
  const [days, setDays] = useState<string[]>(parsed.days.length ? parsed.days : [weekdayCode(draft.date)]);
  const [until, setUntil] = useState(parsed.until ? parsed.until.toISOString().slice(0, 10) : "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function call(url: string, method: string, payload?: unknown) {
    setBusy(true);
    setError(null);
    const res = await fetch(url, {
      method,
      headers: payload ? { "Content-Type": "application/json" } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Erro");
      return;
    }
    onDone(data.summary?.message ?? null);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!v.title.trim()) return setError("Dá um título ao evento.");
    let start: string, end: string;
    if (v.allDay) {
      start = localToIso(v.date, "00:00", timezone);
      const next = new Date(v.date + "T12:00:00Z");
      next.setUTCDate(next.getUTCDate() + 1);
      end = localToIso(next.toISOString().slice(0, 10), "00:00", timezone);
    } else {
      if (v.end <= v.start) return setError("A hora de fim tem de ser depois da de início.");
      start = localToIso(v.date, v.start, timezone);
      end = localToIso(v.date, v.end, timezone);
    }
    const rrule = repeat ? buildWeeklyRrule(days, until ? localToIso(until, "23:59", timezone) : null) : null;
    const payload = { title: v.title, start, end, allDay: v.allDay, category: v.category, blocksStudy: v.blocksStudy, rrule };
    call(v.id ? `/api/events/${v.id}` : "/api/events", v.id ? "PATCH" : "POST", payload);
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <label className="label" htmlFor="ev-title">Título</label>
        <input id="ev-title" className="input" autoFocus value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} placeholder="p.ex. Aula de SO, Jantar, Treino" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="ev-cat">Categoria</label>
          <select id="ev-cat" className="input" value={v.category} onChange={(e) => setV({ ...v, category: e.target.value })}>
            {CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ev-date">{repeat ? "A partir de" : "Data"}</label>
          <input id="ev-date" type="date" className="input" value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={v.allDay} onChange={(e) => setV({ ...v, allDay: e.target.checked })} /> Dia inteiro
      </label>
      {!v.allDay && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="ev-s">Início</label>
            <input id="ev-s" type="time" className="input" value={v.start} onChange={(e) => setV({ ...v, start: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="ev-e">Fim</label>
            <input id="ev-e" type="time" className="input" value={v.end} onChange={(e) => setV({ ...v, end: e.target.value })} />
          </div>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={v.blocksStudy} onChange={(e) => setV({ ...v, blocksStudy: e.target.checked })} />
        Bloqueia estudo <span className="text-slate-500">(desmarca para lembretes)</span>
      </label>
      <div className="rounded-lg border border-slate-200 p-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} /> Repete semanalmente
        </label>
        {repeat && (
          <div className="mt-2 space-y-2">
            <div className="flex gap-1">
              {WEEKDAYS.map((w) => {
                const on = days.includes(w.code);
                return (
                  <button
                    type="button"
                    key={w.code}
                    title={w.label}
                    aria-pressed={on}
                    onClick={() => setDays(on ? days.filter((d) => d !== w.code) : [...days, w.code])}
                    className={`h-8 w-8 rounded-full text-xs font-semibold ${on ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {w.short}
                  </button>
                );
              })}
            </div>
            <div>
              <label className="label" htmlFor="ev-until">Até (opcional)</label>
              <input id="ev-until" type="date" className="input" value={until} onChange={(e) => setUntil(e.target.value)} />
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        <button className="btn" disabled={busy}>{busy ? "A guardar…" : "Guardar"}</button>
        {v.id && draft.rrule && v.occurrenceStart && (
          <button
            type="button"
            className="btn-danger"
            disabled={busy}
            onClick={() => call(`/api/events/${v.id}?scope=one&occurrence=${encodeURIComponent(v.occurrenceStart!)}`, "DELETE")}
          >
            Apagar só esta
          </button>
        )}
        {v.id && (
          <button
            type="button"
            className="btn-danger"
            disabled={busy}
            onClick={() => confirm(draft.rrule ? "Apagar todas as ocorrências?" : "Apagar este evento?") && call(`/api/events/${v.id}`, "DELETE")}
          >
            {draft.rrule ? "Apagar todas" : "Apagar"}
          </button>
        )}
      </div>
    </form>
  );
}
