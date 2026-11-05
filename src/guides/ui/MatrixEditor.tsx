"use client";
/** Editor de matriz pequena (inteiros ou frações "a/b"). */
import { Frac } from "../math/fraction";
import { useT } from "@/i18n/client";

export function parseCell(s: string): Frac | null {
  const t = s.trim().replace(",", ".");
  if (!t) return null;
  const m = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (m) return Number(m[2]) === 0 ? null : new Frac(Number(m[1]), Number(m[2]));
  const x = Number(t);
  return Number.isFinite(x) ? Frac.fromNumber(x) : null;
}

export function MatrixEditor({
  cells,
  onChange,
  augCol,
  highlight,
}: {
  cells: string[][];
  onChange: (cells: string[][]) => void;
  augCol?: number;
  highlight?: (i: number, j: number) => boolean;
}) {
  const t = useT();
  return (
    <div className="inline-block rounded-lg border-x-2 border-slate-700 px-1 py-1">
      {cells.map((row, i) => (
        <div key={i} className="flex">
          {row.map((v, j) => (
            <input
              key={j}
              aria-label={t(`linha ${i + 1}, coluna ${j + 1}`, `row ${i + 1}, column ${j + 1}`)}
              className={`m-0.5 w-12 rounded border px-1 py-1 text-center text-sm tabular-nums ${
                parseCell(v) ? "border-slate-200" : "border-red-400 bg-red-50"
              } ${highlight?.(i, j) ? "bg-yellow-100 font-bold" : ""} ${augCol !== undefined && j === augCol ? "ml-3" : ""}`}
              value={v}
              onChange={(e) => onChange(cells.map((r, a) => r.map((x, b) => (a === i && b === j ? e.target.value : x))))}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export const toCells = (m: (number | string)[][]) => m.map((r) => r.map(String));
