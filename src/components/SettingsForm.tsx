"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/i18n/client";

export function SettingsForm(initial: { dailyHours: number; studyWindowStart: string; studyWindowEnd: string }) {
  const router = useRouter();
  const t = useT();
  const [v, setV] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="card space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
        const data = await res.json();
        setBusy(false);
        setMsg(res.ok ? { ok: true, text: data.summary?.message ?? t("Guardado. Plano atualizado.", "Saved. Plan updated.") } : { ok: false, text: data.error });
        router.refresh();
      }}
    >
      <div>
        <label className="label" htmlFor="dh">{t("Máximo de horas de estudo por dia", "Maximum study hours per day")}</label>
        <input id="dh" type="number" min={0.5} max={16} step={0.5} className="input" value={v.dailyHours} onChange={(e) => setV({ ...v, dailyHours: Number(e.target.value) })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="ws">{t("Estudo a partir das", "Study from")}</label>
          <input id="ws" type="time" className="input" value={v.studyWindowStart} onChange={(e) => setV({ ...v, studyWindowStart: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="we">{t("Até às", "Until")}</label>
          <input id="we" type="time" className="input" value={v.studyWindowEnd} onChange={(e) => setV({ ...v, studyWindowEnd: e.target.value })} />
        </div>
      </div>
      <p className="text-xs text-slate-500">
        {t(
          "Em cada dia, o tempo de estudo é o mínimo entre este máximo e o tempo livre na janela de estudo, depois de descontar os eventos do calendário.",
          "Each day, study time is the smaller of this maximum and the free time left in your study window after subtracting calendar events.",
        )}
      </p>
      {msg && <p className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.text}</p>}
      <button className="btn" disabled={busy}>{busy ? t("A guardar…", "Saving…") : t("Guardar", "Save")}</button>
    </form>
  );
}
