"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/i18n/client";

export interface CourseOption {
  id: string;
  acronym: string;
  name: string;
  semester: number | null;
  topics: { order: number; title: string }[];
}

export function ExamForm({ courses, timezone }: { courses: CourseOption[]; timezone: string }) {
  const router = useRouter();
  const t = useT();
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(180);
  const [lastTopic, setLastTopic] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const course = useMemo(() => courses.find((c) => c.id === courseId), [courses, courseId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!course || !date || !lastTopic) return setError(t("Preenche a cadeira, a data e até que matéria sai.", "Fill in the course, the date and up to which topic the exam covers."));
    setBusy(true);
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, datetime: localToIso(date, time, timezone), durationMin: duration, lastTopicOrder: lastTopic }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? t("Erro ao criar o exame", "Could not create the exam"));
    const msg = data.summary?.message ?? t(`Plano de ${course.acronym} criado.`, `${course.acronym} plan created.`);
    router.push(`/plan?msg=${encodeURIComponent(msg)}`);
    router.refresh();
  }

  const bySemester = [1, 2].map((s) => ({ s, list: courses.filter((c) => (c.semester ?? 1) === s) }));

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div>
        <label className="label" htmlFor="course">{t("Cadeira", "Course")}</label>
        <select id="course" className="input" value={courseId} onChange={(e) => { setCourseId(e.target.value); setLastTopic(0); }}>
          <option value="">{t("Escolhe…", "Choose…")}</option>
          {bySemester.map(({ s, list }) => (
            <optgroup key={s} label={t(`${s}.º semestre`, `Semester ${s}`)}>
              {list.map((c) => (
                <option key={c.id} value={c.id}>{c.acronym} — {c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="date">{t("Data", "Date")}</label>
          <input id="date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="time">{t("Hora", "Time")}</label>
          <input id="time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="dur">{t("Duração (min)", "Duration (min)")}</label>
          <input id="dur" type="number" min={15} max={600} step={15} className="input" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </div>
      </div>
      {course && (
        <div>
          <span className="label">{t("Até que matéria sai?", "Up to which topic does it cover?")}</span>
          {course.topics.length === 0 ? (
            <p className="text-sm text-slate-500">{t("Esta cadeira não tem tópicos importados.", "This course has no imported topics.")}</p>
          ) : (
            <ol className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
              {course.topics.map((t) => (
                <li key={t.order}>
                  <label className={`flex cursor-pointer items-start gap-2 rounded px-2 py-1 text-sm ${lastTopic && t.order <= lastTopic ? "bg-blue-50" : ""}`}>
                    <input type="radio" name="last" className="mt-1" checked={lastTopic === t.order} onChange={() => setLastTopic(t.order)} />
                    <span><span className="text-slate-500">{t.order}.</span> {t.title}</span>
                  </label>
                </li>
              ))}
            </ol>
          )}
          {lastTopic > 0 && <p className="mt-1 text-xs text-slate-500">{t(`Saem os tópicos 1 a ${lastTopic}.`, `Topics 1 to ${lastTopic} are covered.`)}</p>}
        </div>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? t("A planear…", "Planning…") : t("Criar exame e planear", "Create exam and plan")}</button>
    </form>
  );
}

/** "YYYY-MM-DD" + "HH:MM" no fuso do utilizador → ISO UTC. */
export function localToIso(day: string, hhmm: string, tz: string) {
  const [y, m, d] = day.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  const offset = (ts: number) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
        .formatToParts(new Date(ts))
        .filter((x) => x.type !== "literal")
        .map((x) => [x.type, Number(x.value)]),
    );
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(ts / 60000) * 60000;
  };
  let ts = wall - offset(wall);
  ts = wall - offset(ts);
  return new Date(ts).toISOString();
}
