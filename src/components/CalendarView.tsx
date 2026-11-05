"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";
import type { DateSelectArg, EventClickArg, EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import { Modal } from "./Modal";
import { EventForm, EventDraft } from "./EventForm";
import { ClassScheduleForm } from "./ClassScheduleForm";
import { Flash } from "./Flash";

const pad = (n: number) => String(n).padStart(2, "0");
const localDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const localTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function CalendarView({
  timezone,
  courses,
  defaultUntil,
}: {
  timezone: string;
  courses: { acronym: string; name: string }[];
  defaultUntil: string;
}) {
  const ref = useRef<FullCalendar>(null);
  const router = useRouter();
  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [showClasses, setShowClasses] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const done = (message: string | null) => {
    setDraft(null);
    setShowClasses(false);
    setFlash(message ?? "Calendário atualizado. O plano não precisou de mudanças.");
    ref.current?.getApi().refetchEvents();
    router.refresh();
  };

  const onSelect = (s: DateSelectArg) => {
    const end = s.allDay ? s.start : s.end;
    setDraft({
      title: "",
      date: localDate(s.start),
      start: s.allDay ? "09:00" : localTime(s.start),
      end: s.allDay ? "10:00" : localTime(end),
      allDay: s.allDay && s.view.type !== "dayGridMonth" ? true : false,
      category: "pessoal",
      blocksStudy: true,
      rrule: null,
    });
    s.view.calendar.unselect();
  };

  const onClick = async (c: EventClickArg) => {
    const p = c.event.extendedProps as Record<string, unknown>;
    if (p.kind === "exam") return router.push(`/exams/${p.examId}`);
    if (p.kind === "task") {
      await fetch(`/api/tasks/${p.taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !p.done }),
      });
      ref.current?.getApi().refetchEvents();
      return;
    }
    const res = await fetch(`/api/events/${p.eventId}`);
    if (!res.ok) return;
    const ev = await res.json();
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    setDraft({
      id: ev.id,
      title: ev.title,
      date: localDate(s),
      start: localTime(s),
      end: localTime(e),
      allDay: ev.allDay,
      category: ev.category,
      blocksStudy: ev.blocksStudy,
      rrule: ev.rrule,
      occurrenceStart: p.occurrenceStart as string,
    });
  };

  const onMove = async (info: EventDropArg | EventResizeDoneArg) => {
    const p = info.event.extendedProps as Record<string, unknown>;
    if (p.kind !== "event") return info.revert();
    if (p.recurring && !confirm("Este evento repete-se. Mover todas as ocorrências?")) return info.revert();
    const payload =
      "delta" in info
        ? { deltaStartMs: info.delta.milliseconds + info.delta.days * 86_400_000, deltaEndMs: info.delta.milliseconds + info.delta.days * 86_400_000 }
        : {
            deltaStartMs: info.startDelta.milliseconds + info.startDelta.days * 86_400_000,
            deltaEndMs: info.endDelta.milliseconds + info.endDelta.days * 86_400_000,
          };
    const res = await fetch(`/api/events/${p.eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return info.revert();
    const data = await res.json();
    done(data.summary?.message ?? null);
  };

  return (
    <div>
      <Flash message={flash} />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button className="btn" onClick={() => setDraft({ title: "", date: localDate(new Date()), start: "18:00", end: "19:00", allDay: false, category: "pessoal", blocksStudy: true, rrule: null })}>
          + Evento
        </button>
        <button className="btn-ghost" onClick={() => setShowClasses(true)}>🎓 Adicionar horário de aulas</button>
        <div className="ml-auto flex flex-wrap gap-3 text-xs text-slate-600">
          <Legend cls="bg-slate-200 border-slate-400" label="Aula" />
          <Legend cls="bg-amber-200 border-amber-500" label="Pessoal" />
          <Legend cls="bg-red-200 border-red-500" label="Trabalho" />
          <Legend cls="bg-violet-200 border-violet-500" label="Outro" />
          <Legend cls="bg-blue-600 border-slate-900 border-2" label="Exame" />
          <span>Sessões de estudo: cor da cadeira (clica para marcar feita)</span>
        </div>
      </div>
      <div className="card p-2">
        <FullCalendar
          ref={ref}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: "prev,next today", center: "title", right: "timeGridWeek,dayGridMonth" }}
          buttonText={{ today: "hoje", week: "semana", month: "mês" }}
          locale={ptLocale}
          firstDay={1}
          allDayText="dia"
          timeZone="local"
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="24:00:00"
          nowIndicator
          selectable
          selectMirror
          editable
          dayMaxEvents={4}
          events={(info, success, failure) => {
            fetch(`/api/events?start=${encodeURIComponent(info.start.toISOString())}&end=${encodeURIComponent(info.end.toISOString())}`)
              .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
              .then(success)
              .catch(failure);
          }}
          select={onSelect}
          eventClick={onClick}
          eventDrop={onMove}
          eventResize={onMove}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">Horas mostradas no fuso {timezone}. Arrasta um evento para o mudar — o plano ajusta-se logo.</p>

      {draft && (
        <Modal title={draft.id ? "Editar evento" : "Novo evento"} onClose={() => setDraft(null)}>
          <EventForm draft={draft} timezone={timezone} onDone={done} />
        </Modal>
      )}
      {showClasses && (
        <Modal title="Horário de aulas" onClose={() => setShowClasses(false)}>
          <ClassScheduleForm courses={courses} defaultUntil={defaultUntil} onDone={done} />
        </Modal>
      )}
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`inline-block h-3 w-3 rounded-sm border ${cls}`} />
      {label}
    </span>
  );
}
