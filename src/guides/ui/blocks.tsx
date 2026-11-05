"use client";
import { useState } from "react";
import { useT } from "@/i18n/client";

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">{title}</h2>
      <div className="space-y-3 leading-relaxed text-slate-800">{children}</div>
    </section>
  );
}

function Box({ tone, label, title, children }: { tone: string; label: string; title?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border-l-4 px-4 py-3 ${tone}`}>
      <div className="mb-1 text-xs font-bold uppercase tracking-wide opacity-80">
        {label}
        {title && <span className="ml-1 normal-case tracking-normal">— {title}</span>}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

type BoxProps = { title?: string; children: React.ReactNode };
export const Def = (p: BoxProps) => <Box tone="border-blue-500 bg-blue-50" label={useT()("Definição", "Definition")} {...p} />;
export const Thm = (p: BoxProps) => <Box tone="border-violet-500 bg-violet-50" label={useT()("Teorema", "Theorem")} {...p} />;
export const Note = (p: BoxProps) => <Box tone="border-slate-400 bg-slate-50" label={useT()("Nota", "Note")} {...p} />;
export const Pitfall = (p: BoxProps) => <Box tone="border-red-500 bg-red-50" label={useT()("Erro comum", "Common mistake")} {...p} />;
export const Tip = (p: BoxProps) => <Box tone="border-emerald-500 bg-emerald-50" label={useT()("Truque", "Tip")} {...p} />;

export function Example({ title, children }: { title?: string; children: React.ReactNode }) {
  const t = useT();
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-800">{t("Exemplo resolvido", "Worked example")}{title && ` — ${title}`}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/** Exercício com solução escondida (tenta primeiro!). */
export function Exercise({ n, children, solution }: { n: number; children: React.ReactNode; solution: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">{t("Exercício", "Exercise")} {n}</div>
      <div className="space-y-2">{children}</div>
      <button onClick={() => setOpen(!open)} className="mt-2 text-sm font-medium text-blue-700 hover:underline">
        {open ? t("Esconder solução", "Hide solution") : t("Ver solução", "Show solution")}
      </button>
      {open && <div className="mt-2 space-y-2 border-t border-slate-100 pt-2 text-slate-700">{solution}</div>}
    </div>
  );
}

export function Checklist({ items }: { items: React.ReactNode[] }) {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i}>
          <label className="flex cursor-pointer items-start gap-2">
            <input type="checkbox" className="mt-1 accent-slate-900" checked={done[i]} onChange={() => setDone(done.map((d, j) => (j === i ? !d : d)))} />
            <span className={done[i] ? "text-slate-400 line-through" : ""}>{it}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

/** Moldura dos widgets interativos. */
export function Lab({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-2xl border-2 border-slate-900/10 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-900">🧪 {title}</div>
      {hint && <p className="mb-3 text-sm text-slate-600">{hint}</p>}
      {children}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  display,
}: {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="w-16 shrink-0 font-medium">{label}</span>
      <input type="range" className="min-w-0 flex-1 accent-slate-900" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="w-12 shrink-0 text-right tabular-nums">{display ?? value}</span>
    </label>
  );
}

export function Presets<T>({ items, onPick }: { items: { label: string; value: T }[]; onPick: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((p) => (
        <button key={p.label} onClick={() => onPick(p.value)} className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs hover:bg-slate-100">
          {p.label}
        </button>
      ))}
    </div>
  );
}
