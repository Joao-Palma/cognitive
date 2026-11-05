"use client";
import { useMemo, useState } from "react";
import { Frac, FMatrix } from "../math/fraction";
import { detFrac } from "../math/rowreduce";
import { M } from "../ui/Tex";
import { Lab, Presets } from "../ui/blocks";
import { useT } from "@/i18n/client";
import { MatrixEditor, parseCell, toCells } from "../ui/MatrixEditor";

const parse = (c: string[][]): FMatrix | null => {
  const m = c.map((r) => r.map(parseCell));
  return m.some((r) => r.some((x) => !x)) ? null : (m as FMatrix);
};

/** Produto AB: passa o rato sobre uma entrada do resultado para ver linha · coluna. */
export function MultiplyLab() {
  const t = useT();
  const [a, setA] = useState(toCells([[1, 2, 0], [-1, 3, 1]]));
  const [b, setB] = useState(toCells([[2, 1], [0, -1], [4, 2]]));
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const A = parse(a), B = parse(b);
  const ok = A && B && A[0].length === B.length;
  const C = ok ? A.map((row) => B[0].map((_, j) => row.reduce((s, x, k) => s.add(x.mul(B[k][j])), new Frac(0)))) : null;
  const [si, sj] = sel;
  const resize = (cells: string[][], rows: number, cols: number) =>
    Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => cells[i]?.[j] ?? "0"));
  return (
    <Lab title={t("Produto de matrizes: linha × coluna", "Matrix product: row × column")} hint={t("Clica numa entrada de AB para ver de onde vem: [AB]ᵢⱼ = Σₖ aᵢₖ bₖⱼ (linha i de A com a coluna j de B). Só existe se nº de colunas de A = nº de linhas de B.", "Click an entry of AB to see where it comes from: [AB]ᵢⱼ = Σₖ aᵢₖ bₖⱼ (row i of A with column j of B). It only exists if the number of columns of A = the number of rows of B.")}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span>A:</span>
        {[[2, 3], [3, 3], [2, 2]].map(([r, c]) => <button key={`${r}${c}`} className="rounded border px-2 py-0.5" onClick={() => setA(resize(a, r, c))}>{r}×{c}</button>)}
        <span className="ml-2">B:</span>
        {[[3, 2], [3, 3], [2, 2], [2, 3]].map(([r, c]) => <button key={`${r}${c}`} className="rounded border px-2 py-0.5" onClick={() => setB(resize(b, r, c))}>{r}×{c}</button>)}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <MatrixEditor cells={a} onChange={setA} highlight={(i) => !!C && i === si} />
        <span className="text-lg">·</span>
        <MatrixEditor cells={b} onChange={setB} highlight={(_, j) => !!C && j === sj} />
        <span className="text-lg">=</span>
        {C ? (
          <table className="border-x-2 border-slate-800">
            <tbody>
              {C.map((row, i) => (
                <tr key={i}>
                  {row.map((x, j) => (
                    <td key={j} className="p-0.5">
                      <button onClick={() => setSel([i, j])} className={`w-12 rounded px-1 py-1 text-sm ${i === si && j === sj ? "bg-yellow-200 font-bold" : "hover:bg-slate-100"}`}>
                        <M>{x.toTex()}</M>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span className="text-sm text-red-700">{A && B ? t(`Impossível: A tem ${A[0].length} colunas e B tem ${B.length} linhas.`, `Impossible: A has ${A[0].length} columns and B has ${B.length} rows.`) : t("Entradas inválidas.", "Invalid entries.")}</span>
        )}
      </div>
      {C && A && B && si < A.length && sj < B[0].length && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
          <M>{`[AB]_{${si + 1}${sj + 1}} = ${A[si].map((x, k) => `(${x.toTex()})(${B[k][sj].toTex()})`).join(" + ")} = ${C[si][sj].toTex()}`}</M>
          <div className="mt-1 text-slate-600">{t("AB é", "AB is")} {A.length}×{B[0].length}. {A.length === B[0].length && A[0].length === B.length ? t("BA também existe — mas em geral é diferente!", "BA exists too — but in general it is different!") : t("BA nem sequer existe com estas dimensões (ou tem outro tamanho).", "BA doesn't even exist with these sizes (or has a different size).")}</div>
        </div>
      )}
    </Lab>
  );
}

/** Regra de Laplace num 3×3: escolhe a linha ou coluna para expandir. */
export function LaplaceLab() {
  const t = useT();
  const [cells, setCells] = useState(toCells([[2, 0, 1], [1, 3, 0], [-1, 0, 4]]));
  const [along, setAlong] = useState<{ type: "row" | "col"; k: number }>({ type: "col", k: 1 });
  const A = parse(cells);
  const terms = useMemo(() => {
    if (!A) return null;
    return [0, 1, 2].map((idx) => {
      const i = along.type === "row" ? along.k : idx;
      const j = along.type === "row" ? idx : along.k;
      const minor = A.filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== j));
      const md = detFrac(minor);
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      return { i, j, a: A[i][j], minor, md, sign, cof: sign === 1 ? md : md.neg() };
    });
  }, [A, along]);
  if (!A || !terms) return <Lab title={t("Regra de Laplace", "Laplace expansion")}><MatrixEditor cells={cells} onChange={setCells} /><p className="text-sm text-red-700">{t("Entradas inválidas.", "Invalid entries.")}</p></Lab>;
  const det = terms.reduce((s, tm) => s.add(tm.a.mul(tm.cof)), new Frac(0));
  const zeros = terms.filter((tm) => tm.a.isZero()).length;
  const mtex = (m: FMatrix) => `\\begin{vmatrix}${m.map((r) => r.map((x) => x.toTex()).join(" & ")).join(" \\\\ ")}\\end{vmatrix}`;
  return (
    <Lab title={t("Regra de Laplace (expansão em cofatores)", "Laplace (cofactor) expansion")} hint={t("Escolhe a linha ou coluna. Cada termo é aᵢⱼ·Cᵢⱼ com Cᵢⱼ = (−1)ⁱ⁺ʲ·det(Aᵢⱼ). Experimenta escolher a que tem mais zeros: o trabalho diminui.", "Pick a row or column. Each term is aᵢⱼ·Cᵢⱼ with Cᵢⱼ = (−1)ⁱ⁺ʲ·det(Aᵢⱼ). Try the one with the most zeros: there is less work.")}>
      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="space-y-2">
          <MatrixEditor cells={cells} onChange={setCells} highlight={(i, j) => (along.type === "row" ? i === along.k : j === along.k)} />
          <div className="flex flex-wrap gap-1">
            {[0, 1, 2].map((k) => <button key={`r${k}`} onClick={() => setAlong({ type: "row", k })} className={`rounded border px-2 py-0.5 text-xs ${along.type === "row" && along.k === k ? "bg-slate-900 text-white" : ""}`}>{t("linha", "row")} {k + 1}</button>)}
            {[0, 1, 2].map((k) => <button key={`c${k}`} onClick={() => setAlong({ type: "col", k })} className={`rounded border px-2 py-0.5 text-xs ${along.type === "col" && along.k === k ? "bg-slate-900 text-white" : ""}`}>{t("coluna", "column")} {k + 1}</button>)}
          </div>
          <Presets items={[{ label: t("Com zeros", "With zeros"), value: [[2, 0, 1], [1, 3, 0], [-1, 0, 4]] }, { label: t("Triangular", "Triangular"), value: [[2, 5, 1], [0, 3, 7], [0, 0, -1]] }, { label: t("Singular", "Singular"), value: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }]} onPick={(v) => setCells(toCells(v))} />
        </div>
        <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
          {terms.map((tm) => (
            <div key={`${tm.i}${tm.j}`} className={tm.a.isZero() ? "text-slate-400" : ""}>
              <M>{`a_{${tm.i + 1}${tm.j + 1}}C_{${tm.i + 1}${tm.j + 1}} = (${tm.a.toTex()})\\cdot(${tm.sign > 0 ? "+" : "-"}1)${mtex(tm.minor)} = (${tm.a.toTex()})(${tm.cof.toTex()}) = ${tm.a.mul(tm.cof).toTex()}`}</M>
              {tm.a.isZero() && <span className="ml-2 text-xs">{t("(nem é preciso calcular)", "(no need to compute)")}</span>}
            </div>
          ))}
          <div className="border-t pt-2 font-semibold"><M>{`\\det A = ${terms.map((tm) => `(${tm.a.mul(tm.cof).toTex()})`).join(" + ")} = ${det.toTex()}`}</M></div>
          <div className="text-xs text-slate-500">{t(`Esta escolha tem ${zeros} zero(s). Confirmação por eliminação:`, `This choice has ${zeros} zero(s). Check by elimination:`)} det = {detFrac(A).toString()} ✔</div>
        </div>
      </div>
    </Lab>
  );
}
