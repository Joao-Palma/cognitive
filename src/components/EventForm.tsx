"use client";
import { useState } from "react";
import { localToIso } from "./ExamForm";
import { useLang, useT } from "@/i18n/client";
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
  ["aula", "Aula", "Class"],
  ["pessoal", "Pessoal", "Personal"],
  ["trabalho", "Trabalho", "Work"],
  ["outro", "Outro", "Other"],
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
  const t = useT();
  const lang = useLang();
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
      setError(data.error ?? t("Erro", "Error"));
      return;
    }
    onDone(data.summary?.message ?? null);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!v.title.trim()) return setError(t("Dá um título ao evento.", "Give the event a title."));
    let start: string, end: string;
    if (v.allDay) {
      start = localToIso(v.date, "00:00", timezone);
      const next = new Date(v.date + "T12:00:00Z");
      next.setUTCDate(next.getUTCDate() + 1);
      end = localToIso(next.toISOString().slice(0, 10), "00:00", timezone);
    } else {
      if (v.end <= v.start) return setError(t("A hora de fim tem de ser depois da de início.", "The end time must be after the start time."));
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
        <label className="label" htmlFor="ev-title">{t("Título", "Title")}</label>
        <input id="ev-title" className="input" autoFocus value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} placeholder={t("p.ex. Aula de SO, Jantar, Treino", "e.g. OS lecture, Dinner, Training")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="ev-cat">{t("Categoria", "Category")}</label>
          <select id="ev-cat" className="input" value={v.category} onChange={(e) => setV({ ...v, category: e.target.value })}>
            {CATEGORIES.map(([k, l, le]) => <option key={k} value={k}>{lang === "en" ? le : l}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ev-date">{repeat ? t("A partir de", "Starting") : t("Data", "Date")}</label>
          <input id="ev-date" type="date" className="input" value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={v.allDay} onChange={(e) => setV({ ...v, allDay: e.target.checked })} /> {t("Dia inteiro", "All day")}
      </label>
      {!v.allDay && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="ev-s">{t("Início", "Start")}</label>
            <input id="ev-s" type="time" className="input" value={v.start} onChange={(e) => setV({ ...v, start: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="ev-e">{t("Fim", "End")}</label>
            <input id="ev-e" type="time" className="input" value={v.end} onChange={(e) => setV({ ...v, end: e.target.value })} />
          </div>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={v.blocksStudy} onChange={(e) => setV({ ...v, blocksStudy: e.target.checked })} />
        {t("Bloqueia estudo", "Blocks study time")} <span className="text-slate-500">{t("(desmarca para lembretes)", "(untick for reminders)")}</span>
      </label>
      <div className="rounded-lg border border-slate-200 p-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} /> {t("Repete semanalmente", "Repeats weekly")}
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
                    title={lang === "en" ? w.labelEn : w.label}
                    aria-pressed={on}
                    onClick={() => setDays(on ? days.filter((d) => d !== w.code) : [...days, w.code])}
                    className={`h-8 w-8 rounded-full text-xs font-semibold ${on ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {lang === "en" ? w.shortEn : w.short}
                  </button>
                );
              })}
            </div>
            <div>
              <label className="label" htmlFor="ev-until">{t("Até (opcional)", "Until (optional)")}</label>
              <input id="ev-until" type="date" className="input" value={until} onChange={(e) => setUntil(e.target.value)} />
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        <button className="btn" disabled={busy}>{busy ? t("A guardar…", "Saving…") : t("Guardar", "Save")}</button>
        {v.id && draft.rrule && v.occurrenceStart && (
          <button
            type="button"
            className="btn-danger"
            disabled={busy}
            onClick={() => call(`/api/events/${v.id}?scope=one&occurrence=${encodeURIComponent(v.occurrenceStart!)}`, "DELETE")}
          >
            {t("Apagar só esta", "Delete this one only")}
          </button>
        )}
        {v.id && (
          <button
            type="button"
            className="btn-danger"
            disabled={busy}
            onClick={() => confirm(draft.rrule ? t("Apagar todas as ocorrências?", "Delete all occurrences?") : t("Apagar este evento?", "Delete this event?")) && call(`/api/events/${v.id}`, "DELETE")}
          >
            {draft.rrule ? t("Apagar todas", "Delete all") : t("Apagar", "Delete")}
          </button>
        )}
      </div>
    </form>
  );
}
