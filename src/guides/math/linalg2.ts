/** Álgebra linear numérica em 2D (para os gráficos). */
export type V2 = [number, number];
export type M2 = [[number, number], [number, number]];

export const mulMV = (A: M2, v: V2): V2 => [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
export const mulMM = (A: M2, B: M2): M2 => [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];
export const det2 = (A: M2) => A[0][0] * A[1][1] - A[0][1] * A[1][0];
export const tr2 = (A: M2) => A[0][0] + A[1][1];
export const transpose = (A: M2): M2 => [
  [A[0][0], A[1][0]],
  [A[0][1], A[1][1]],
];
export const dot = (u: V2, v: V2) => u[0] * v[0] + u[1] * v[1];
export const norm = (u: V2) => Math.hypot(u[0], u[1]);
export const add = (u: V2, v: V2): V2 => [u[0] + v[0], u[1] + v[1]];
export const sub = (u: V2, v: V2): V2 => [u[0] - v[0], u[1] - v[1]];
export const scale = (k: number, u: V2): V2 => [k * u[0], k * u[1]];
export const unit = (u: V2): V2 => {
  const n = norm(u);
  return n < 1e-12 ? [0, 0] : [u[0] / n, u[1] / n];
};
export const cross = (u: V2, v: V2) => u[0] * v[1] - u[1] * v[0];

export interface Eigen2 {
  /** valores próprios reais (podem coincidir) ou complexos */
  real: boolean;
  values: number[]; // reais: [λ1, λ2] com λ1 ≥ λ2
  complex?: { re: number; im: number };
  /** vetores próprios (unitários) para cada valor próprio distinto; mais de um se mg = 2 */
  vectors: V2[][];
  ma: number[];
  mg: number[];
}

const EPS = 1e-9;

export function eigen2(A: M2): Eigen2 {
  const t = tr2(A);
  const d = det2(A);
  const disc = t * t - 4 * d;
  if (disc < -EPS) return { real: false, values: [], complex: { re: t / 2, im: Math.sqrt(-disc) / 2 }, vectors: [], ma: [], mg: [] };
  const s = Math.sqrt(Math.max(0, disc));
  const l1 = (t + s) / 2;
  const l2 = (t - s) / 2;
  const vecFor = (l: number): V2[] => {
    const a = A[0][0] - l, b = A[0][1], c = A[1][0], dd = A[1][1] - l;
    if (Math.abs(a) < EPS && Math.abs(b) < EPS && Math.abs(c) < EPS && Math.abs(dd) < EPS) return [[1, 0], [0, 1]];
    // linha não nula de (A - λI): (a, b) → vetor (-b, a), ou (c, dd) → (-dd, c)
    const v: V2 = Math.abs(a) + Math.abs(b) > EPS ? [-b, a] : [-dd, c];
    return [unit(v)];
  };
  if (s < 1e-7) {
    const vs = vecFor(l1);
    return { real: true, values: [l1, l1], vectors: [vs], ma: [2], mg: [vs.length] };
  }
  return { real: true, values: [l1, l2], vectors: [vecFor(l1), vecFor(l2)], ma: [1, 1], mg: [1, 1] };
}

/** Decomposição espectral de uma matriz simétrica [[a,b],[b,c]]: A = Q diag(λ) Qᵀ. */
export function symEigen(a: number, b: number, c: number): { values: [number, number]; Q: M2 } {
  const theta = 0.5 * Math.atan2(2 * b, a - c);
  const q1: V2 = [Math.cos(theta), Math.sin(theta)];
  const q2: V2 = [-Math.sin(theta), Math.cos(theta)];
  const l1 = a * q1[0] ** 2 + 2 * b * q1[0] * q1[1] + c * q1[1] ** 2;
  const l2 = a * q2[0] ** 2 + 2 * b * q2[0] * q2[1] + c * q2[1] ** 2;
  return l1 >= l2
    ? { values: [l1, l2], Q: [[q1[0], q2[0]], [q1[1], q2[1]]] }
    : { values: [l2, l1], Q: [[q2[0], q1[0]], [q2[1], q1[1]]] };
}

/** SVD 2×2: A = U Σ Vᵀ, σ1 ≥ σ2 ≥ 0, U e V ortogonais. */
export function svd2(A: M2): { U: M2; S: [number, number]; V: M2 } {
  const AtA = mulMM(transpose(A), A);
  const { values, Q: V } = symEigen(AtA[0][0], AtA[0][1], AtA[1][1]);
  const s1 = Math.sqrt(Math.max(0, values[0]));
  const s2 = Math.sqrt(Math.max(0, values[1]));
  const v1: V2 = [V[0][0], V[1][0]];
  const v2: V2 = [V[0][1], V[1][1]];
  let u1: V2 = s1 > EPS ? scale(1 / s1, mulMV(A, v1)) : [1, 0];
  let u2: V2;
  if (s2 > EPS) u2 = scale(1 / s2, mulMV(A, v2));
  else u2 = [-u1[1], u1[0]];
  if (s1 <= EPS) {
    u1 = [1, 0];
    u2 = [0, 1];
  }
  return { U: [[u1[0], u2[0]], [u1[1], u2[1]]], S: [s1, s2], V };
}

export const rot = (theta: number): M2 => [
  [Math.cos(theta), -Math.sin(theta)],
  [Math.sin(theta), Math.cos(theta)],
];

/** Formatação curta de números para os painéis. */
export function fmt(x: number, digits = 2): string {
  if (!Number.isFinite(x)) return "—";
  const r = Math.round(x * 10 ** digits) / 10 ** digits;
  return (Object.is(r, -0) ? 0 : r).toLocaleString("pt-PT", { maximumFractionDigits: digits });
}
