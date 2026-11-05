import { describe, expect, it } from "vitest";
import { Frac, toFrac } from "../fraction";
import { rowReduce, classify, detFrac, nullBasis, isRowEchelon } from "../rowreduce";
import { eigen2, svd2, symEigen, mulMM, transpose, M2 } from "../linalg2";

const last = (s: ReturnType<typeof rowReduce>) => s[s.length - 1].matrix.map((r) => r.map(String));

describe("Frac", () => {
  it("simplifica e normaliza o sinal", () => {
    expect(String(new Frac(4, -6))).toBe("-2/3");
    expect(String(new Frac(1, 2).add(new Frac(1, 3)))).toBe("5/6");
    expect(String(Frac.fromNumber(0.75))).toBe("3/4");
  });
});

describe("redução por linhas", () => {
  it("SPD: x+y=1, 2x+2y+z=0, 3x+z=1 → (1,0,-2)", () => {
    const steps = rowReduce(toFrac([[1, 1, 0, 1], [2, 2, 1, 0], [3, 0, 1, 1]]), { pivotCols: 3, reduced: true });
    const R = steps[steps.length - 1].matrix;
    expect(R.map((r) => r.map(String))).toEqual([["1", "0", "0", "1"], ["0", "1", "0", "0"], ["0", "0", "1", "-2"]]);
    expect(classify(R).cls).toBe("SPD");
  });
  it("SI e SPI", () => {
    const si = rowReduce(toFrac([[1, 2, 3], [2, 4, 7]]), { pivotCols: 2 });
    expect(classify(si[si.length - 1].matrix).cls).toBe("SI");
    const spi = rowReduce(toFrac([[1, 2, 3], [2, 4, 6]]), { pivotCols: 2 });
    const c = classify(spi[spi.length - 1].matrix);
    expect(c.cls).toBe("SPI");
    expect(c.free).toEqual([1]);
  });
  it("Gauss-Jordan em [A|I] dá a inversa", () => {
    const A = [[2, 1], [5, 3]];
    const steps = rowReduce(toFrac([[...A[0], 1, 0], [...A[1], 0, 1]]), { pivotCols: 2, reduced: true });
    expect(last(steps)).toEqual([["1", "0", "3", "-1"], ["0", "1", "-5", "2"]]);
  });
  it("escada", () => {
    expect(isRowEchelon(toFrac([[1, 2], [0, 3]]))).toBe(true);
    expect(isRowEchelon(toFrac([[0, 2], [1, 3]]))).toBe(false);
  });
});

describe("determinante e núcleo", () => {
  it("det exato", () => {
    expect(String(detFrac(toFrac([[3, 9, 3], [0, 0, 2], [2, 2, 1]])))).toBe("24");
    expect(String(detFrac(toFrac([[0, 0, 3, 0], [0, 6, 7, 8], [9, 0, 11, 12], [13, 14, 0, 16]])))).toBe("3240");
  });
  it("base do núcleo", () => {
    expect(nullBasis(toFrac([[-2, 0, 1], [1, 1, 0], [-1, 1, 1]])).map((v) => v.map(String))).toEqual([["1/2", "-1/2", "1"]]);
    expect(nullBasis(toFrac([[1, 2, -1], [0, 0, 0], [0, 0, 0]])).map((v) => v.map(String))).toEqual([["-2", "1", "0"], ["1", "0", "1"]]);
  });
});

describe("2×2 numérico", () => {
  it("valores próprios e multiplicidades", () => {
    const e = eigen2([[5, -1], [3, 1]]);
    expect(e.values.map((x) => Math.round(x))).toEqual([4, 2]);
    const j = eigen2([[2, 1], [0, 2]]);
    expect(j.ma).toEqual([2]);
    expect(j.mg).toEqual([1]);
    expect(eigen2([[2, 0], [0, 2]]).mg).toEqual([2]);
    expect(eigen2([[0, -1], [1, 0]]).real).toBe(false);
  });
  it("espetral e SVD reconstroem A", () => {
    const { values, Q } = symEigen(2, 1, 2);
    expect(values.map((x) => Math.round(x * 1e6) / 1e6)).toEqual([3, 1]);
    const D: M2 = [[values[0], 0], [0, values[1]]];
    const R = mulMM(mulMM(Q, D), transpose(Q));
    expect(R[0][1]).toBeCloseTo(1);
    const A: M2 = [[3, 0], [4, 5]];
    const { U, S, V } = svd2(A);
    const B = mulMM(mulMM(U, [[S[0], 0], [0, S[1]]]), transpose(V));
    for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) expect(B[i][k]).toBeCloseTo(A[i][k]);
    expect(S[0]).toBeCloseTo(Math.sqrt(45));
    expect(S[1]).toBeCloseTo(Math.sqrt(5));
  });
});
