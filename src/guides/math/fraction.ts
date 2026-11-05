/** Fração exata (números pequenos, típicos de exercícios). */
export class Frac {
  readonly n: number;
  readonly d: number;
  constructor(n: number, d = 1) {
    if (d === 0) throw new Error("denominador 0");
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      const f = Frac.fromNumber(n / d);
      n = f.n;
      d = f.d;
    }
    const g = gcd(Math.abs(n), Math.abs(d)) || 1;
    const s = d < 0 ? -1 : 1;
    this.n = (s * n) / g || 0; // evita -0
    this.d = (s * d) / g;
  }
  static of(x: number | Frac): Frac {
    return x instanceof Frac ? x : Frac.fromNumber(x);
  }
  /** Aproxima um decimal por uma fração com denominador ≤ 1000. */
  static fromNumber(x: number): Frac {
    if (Number.isInteger(x)) return new Frac(x, 1);
    let best = new Frac(Math.round(x), 1);
    let err = Math.abs(x - best.value);
    for (let d = 2; d <= 1000 && err > 1e-9; d++) {
      const n = Math.round(x * d);
      const e = Math.abs(x - n / d);
      if (e < err - 1e-12) {
        best = new Frac(n, d);
        err = e;
      }
    }
    return best;
  }
  get value() {
    return this.n / this.d;
  }
  isZero() {
    return this.n === 0;
  }
  add(o: Frac) {
    return new Frac(this.n * o.d + o.n * this.d, this.d * o.d);
  }
  sub(o: Frac) {
    return new Frac(this.n * o.d - o.n * this.d, this.d * o.d);
  }
  mul(o: Frac) {
    return new Frac(this.n * o.n, this.d * o.d);
  }
  div(o: Frac) {
    return new Frac(this.n * o.d, this.d * o.n);
  }
  neg() {
    return new Frac(-this.n, this.d);
  }
  eq(o: Frac) {
    return this.n === o.n && this.d === o.d;
  }
  toString() {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
  toTex() {
    if (this.d === 1) return String(this.n);
    const sign = this.n < 0 ? "-" : "";
    return `${sign}\\tfrac{${Math.abs(this.n)}}{${this.d}}`;
  }
}

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

export type FMatrix = Frac[][];

export const toFrac = (m: (number | Frac)[][]): FMatrix => m.map((r) => r.map(Frac.of));

export function matrixTex(m: FMatrix, augCol?: number): string {
  const cols = m[0]?.length ?? 0;
  const spec =
    augCol !== undefined && augCol > 0 && augCol < cols
      ? "c".repeat(augCol) + "|" + "c".repeat(cols - augCol)
      : "c".repeat(cols);
  const body = m.map((r) => r.map((x) => x.toTex()).join(" & ")).join(" \\\\ ");
  return `\\left[\\begin{array}{${spec}}${body}\\end{array}\\right]`;
}
