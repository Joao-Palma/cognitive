/**
 * Operações elementares sobre linhas e redução (Gauss / Gauss-Jordan) com registo dos passos.
 */
import { Frac, FMatrix } from "./fraction";

export type RowOp =
  | { kind: "swap"; i: number; j: number }
  | { kind: "scale"; i: number; k: Frac }
  | { kind: "addMul"; i: number; j: number; k: Frac }; // L_i ← L_i + k·L_j

export interface Step {
  op: RowOp;
  matrix: FMatrix;
  note?: string;
  noteEn?: string;
}

export const clone = (m: FMatrix): FMatrix => m.map((r) => [...r]);

export function applyOp(m: FMatrix, op: RowOp): FMatrix {
  const r = clone(m);
  if (op.kind === "swap") [r[op.i], r[op.j]] = [r[op.j], r[op.i]];
  else if (op.kind === "scale") {
    if (op.k.isZero()) throw new Error("Não se pode multiplicar uma linha por 0");
    r[op.i] = r[op.i].map((x) => x.mul(op.k));
  } else {
    if (op.i === op.j) throw new Error("A linha somada tem de ser outra");
    r[op.i] = r[op.i].map((x, c) => x.add(op.k.mul(m[op.j][c])));
  }
  return r;
}

/** Notação usada no IST: L₁ ↔ L₂, 2L₁, L₂ − 3L₁ */
export function opTex(op: RowOp): string {
  const L = (i: number) => `L_{${i + 1}}`;
  if (op.kind === "swap") return `${L(op.i)} \\leftrightarrow ${L(op.j)}`;
  if (op.kind === "scale") return `${op.k.toTex()}\\,${L(op.i)}`;
  const k = op.k;
  const abs = new Frac(Math.abs(k.n), k.d);
  const coef = abs.eq(new Frac(1)) ? "" : abs.toTex();
  return `${L(op.i)} ${k.n < 0 ? "-" : "+"} ${coef}${L(op.j)}`;
}

/** Colunas com pivô numa matriz em escada (ignora colunas ≥ maxCol). */
export function pivotColumns(m: FMatrix, maxCol = m[0]?.length ?? 0): number[] {
  const out: number[] = [];
  for (const row of m) {
    const c = row.findIndex((x, j) => j < maxCol && !x.isZero());
    if (c >= 0) out.push(c);
  }
  return out;
}

export function isRowEchelon(m: FMatrix, maxCol = m[0]?.length ?? 0): boolean {
  let last = -1;
  let seenZero = false;
  for (const row of m) {
    const c = row.findIndex((x, j) => j < maxCol && !x.isZero());
    if (c < 0) {
      seenZero = true;
      continue;
    }
    if (seenZero || c <= last) return false;
    last = c;
  }
  return true;
}

/**
 * Gauss (escada de linhas) e, opcionalmente, Gauss-Jordan (escada reduzida).
 * pivotCols: só procura pivôs nas primeiras `pivotCols` colunas (p.ex. sem a coluna dos termos independentes).
 */
export function rowReduce(m0: FMatrix, opts: { pivotCols?: number; reduced?: boolean } = {}): Step[] {
  const pivotCols = opts.pivotCols ?? m0[0].length;
  const steps: Step[] = [];
  let m = clone(m0);
  const rows = m.length;
  const NOTES_EN: Record<string, string> = {
    "trocar linhas para ter pivô": "swap rows to get a pivot",
    "anular abaixo do pivô": "clear below the pivot",
    "pôr o pivô a 1": "make the pivot 1",
    "anular acima do pivô": "clear above the pivot",
  };
  const push = (op: RowOp, note?: string) => {
    m = applyOp(m, op);
    steps.push({ op, matrix: m, note, noteEn: note ? NOTES_EN[note] : undefined });
  };

  let r = 0;
  const pivots: [number, number][] = [];
  for (let c = 0; c < pivotCols && r < rows; c++) {
    // preferir um pivô igual a ±1, senão o primeiro não nulo
    let p = -1;
    for (let i = r; i < rows; i++) if (!m[i][c].isZero() && Math.abs(m[i][c].value) === 1 && m[i][c].d === 1) { p = i; break; }
    if (p < 0) for (let i = r; i < rows; i++) if (!m[i][c].isZero()) { p = i; break; }
    if (p < 0) continue;
    if (p !== r) push({ kind: "swap", i: r, j: p }, "trocar linhas para ter pivô");
    for (let i = r + 1; i < rows; i++) {
      if (m[i][c].isZero()) continue;
      push({ kind: "addMul", i, j: r, k: m[i][c].div(m[r][c]).neg() }, "anular abaixo do pivô");
    }
    pivots.push([r, c]);
    r++;
  }

  if (opts.reduced) {
    for (let k = pivots.length - 1; k >= 0; k--) {
      const [pr, pc] = pivots[k];
      if (!m[pr][pc].eq(new Frac(1))) push({ kind: "scale", i: pr, k: new Frac(1).div(m[pr][pc]) }, "pôr o pivô a 1");
      for (let i = pr - 1; i >= 0; i--) {
        if (m[i][pc].isZero()) continue;
        push({ kind: "addMul", i, j: pr, k: m[i][pc].neg() }, "anular acima do pivô");
      }
    }
  }
  return steps;
}

export type SystemClass = "SI" | "SPD" | "SPI";

/** Classifica um sistema dado pela matriz aumentada já em escada. */
export function classify(aug: FMatrix): { cls: SystemClass; free: number[]; rank: number } {
  const n = aug[0].length - 1;
  const piv = pivotColumns(aug, n + 1);
  if (piv.includes(n)) return { cls: "SI", free: [], rank: piv.filter((c) => c < n).length };
  const free = [...Array(n).keys()].filter((c) => !piv.includes(c));
  return { cls: free.length ? "SPI" : "SPD", free, rank: piv.length };
}

export const CLASS_LABEL: Record<SystemClass, string> = {
  SI: "Sistema impossível",
  SPD: "Sistema possível e determinado",
  SPI: "Sistema possível e indeterminado",
};
export const CLASS_LABEL_EN: Record<SystemClass, string> = {
  SI: "Inconsistent system",
  SPD: "Consistent system with a unique solution",
  SPI: "Consistent system with infinitely many solutions",
};

/** Determinante exato por eliminação. */
export function detFrac(m: FMatrix): Frac {
  const n = m.length;
  let a = clone(m);
  let det = new Frac(1);
  for (let c = 0; c < n; c++) {
    let p = -1;
    for (let i = c; i < n; i++) if (!a[i][c].isZero()) { p = i; break; }
    if (p < 0) return new Frac(0);
    if (p !== c) {
      a = applyOp(a, { kind: "swap", i: c, j: p });
      det = det.neg();
    }
    for (let i = c + 1; i < n; i++) {
      if (!a[i][c].isZero()) a = applyOp(a, { kind: "addMul", i, j: c, k: a[i][c].div(a[c][c]).neg() });
    }
    det = det.mul(a[c][c]);
  }
  return det;
}

/** Base do núcleo a partir da escada reduzida (vetores com uma variável livre = 1). */
export function nullBasis(m: FMatrix): FMatrix {
  const cols = m[0].length;
  const steps = rowReduce(m, { reduced: true });
  const R = steps.length ? steps[steps.length - 1].matrix : m;
  const piv = pivotColumns(R);
  const free = [...Array(cols).keys()].filter((c) => !piv.includes(c));
  return free.map((f) => {
    const v = Array.from({ length: cols }, () => new Frac(0));
    v[f] = new Frac(1);
    piv.forEach((pc, row) => (v[pc] = R[row][f].neg()));
    return v;
  });
}
