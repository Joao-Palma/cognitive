"use client";
import { M2, V2, mulMV, fmt } from "../math/linalg2";
import { Path, Poly } from "../ui/Plane";
import { M } from "../ui/Tex";
import { Slider } from "../ui/blocks";
import { useLang } from "@/i18n/client";

/** Grelha transformada por A (linhas da grelha inteira são mapeadas em retas). */
export function TransformedGrid({ A, range = 5, color = "#93c5fd" }: { A: M2; range?: number; color?: string }) {
  const lines = [];
  const R = Math.ceil(range) + 3;
  for (let t = -R; t <= R; t++) {
    lines.push(<Path key={`v${t}`} pts={[mulMV(A, [t, -R * 3]), mulMV(A, [t, R * 3])]} stroke={color} width={t === 0 ? 1.5 : 0.7} />);
    lines.push(<Path key={`h${t}`} pts={[mulMV(A, [-R * 3, t]), mulMV(A, [R * 3, t])]} stroke={color} width={t === 0 ? 1.5 : 0.7} />);
  }
  return <g>{lines}</g>;
}

export function UnitSquare({ A, fill, stroke }: { A: M2; fill?: string; stroke?: string }) {
  const pts: V2[] = [[0, 0], [1, 0], [1, 1], [0, 1]].map((p) => mulMV(A, p as V2));
  return <Poly pts={pts} fill={fill} stroke={stroke} />;
}

export const texM2 = (A: M2, d = 2) => `\\begin{bmatrix} ${fmt(A[0][0], d)} & ${fmt(A[0][1], d)} \\\\ ${fmt(A[1][0], d)} & ${fmt(A[1][1], d)} \\end{bmatrix}`.replace(/(\d),(\d)/g, "$1{,}$2");
export const texV2 = (v: V2, d = 2) => `(${fmt(v[0], d)},\\ ${fmt(v[1], d)})`.replace(/(\d),(\d)/g, "$1{,}$2");
export const n = (x: number, d = 2) => fmt(x, d).replace(/(\d),(\d)/g, "$1{,}$2");

export function MatrixSliders({ A, onChange, min = -3, max = 3, step = 0.1, names = ["a", "b", "c", "d"] }: { A: M2; onChange: (A: M2) => void; min?: number; max?: number; step?: number; names?: string[] }) {
  const set = (i: number, j: number) => (v: number) => {
    const B: M2 = [[...A[0]], [...A[1]]] as M2;
    B[i][j] = v;
    onChange(B);
  };
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      <Slider label={<M>{names[0]}</M>} value={A[0][0]} min={min} max={max} step={step} onChange={set(0, 0)} display={fmt(A[0][0], 1)} />
      <Slider label={<M>{names[1]}</M>} value={A[0][1]} min={min} max={max} step={step} onChange={set(0, 1)} display={fmt(A[0][1], 1)} />
      <Slider label={<M>{names[2]}</M>} value={A[1][0]} min={min} max={max} step={step} onChange={set(1, 0)} display={fmt(A[1][0], 1)} />
      <Slider label={<M>{names[3]}</M>} value={A[1][1]} min={min} max={max} step={step} onChange={set(1, 1)} display={fmt(A[1][1], 1)} />
    </div>
  );
}

export function Readout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5 rounded-lg bg-slate-50 p-3 text-sm">{children}</div>;
}

/** Soma de termos com sinais corretos: poly([[1,"x^2"],[-3,"x"],[2,""]]) → "x^2 - 3x + 2". */
export function poly(terms: [number, string][], d = 2): string {
  let out = "";
  for (const [c, term] of terms) {
    if (Math.abs(c) < 1e-9) continue;
    const abs = Math.abs(c);
    const coef = term && Math.abs(abs - 1) < 1e-9 ? "" : n(abs, d);
    if (!out) out = `${c < 0 ? "-" : ""}${coef}${term}`;
    else out += ` ${c < 0 ? "-" : "+"} ${coef}${term}`;
  }
  return out || "0";
}

/** Representante "bonito" de uma direção: menor componente não nula = ±1 e primeira componente positiva. */
export function niceDir(v: V2): V2 {
  const nz = v.filter((x) => Math.abs(x) > 1e-9).map(Math.abs);
  if (!nz.length) return [0, 0];
  const k = Math.min(...nz);
  let w: V2 = [v[0] / k, v[1] / k];
  const first = Math.abs(w[0]) > 1e-9 ? w[0] : w[1];
  if (first < 0) w = [-w[0], -w[1]];
  return Math.max(Math.abs(w[0]), Math.abs(w[1])) > 20 ? [v[0], v[1]] : w;
}

/** Notação da expansão linear: 𝓛{…} no IST (pt), span{…} em inglês. */
export function useSpan(): string {
  return useLang() === "en" ? "\\operatorname{span}" : "\\mathcal{L}";
}
