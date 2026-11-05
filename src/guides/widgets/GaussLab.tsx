"use client";
import { useMemo, useState } from "react";
import { Frac, FMatrix, toFrac } from "../math/fraction";
import { applyOp, classify, CLASS_LABEL, CLASS_LABEL_EN, isRowEchelon, opTex, pivotColumns, rowReduce, RowOp, nullBasis } from "../math/rowreduce";
import { useLang, useT } from "@/i18n/client";
import { useSpan } from "./common";
import { M } from "../ui/Tex";
import { Lab, Presets } from "../ui/blocks";
import { MatrixEditor, parseCell, toCells } from "../ui/MatrixEditor";

type Mode = "system" | "inverse" | "kernel";

interface Props {
  title?: string;
  hint?: string;
  initial: number[][];
  /** system: última coluna = termos independentes; inverse: junta I e procura A⁻¹; kernel: calcula N(A) */
  mode?: Mode;
  presets?: { label: string; value: number[][] }[];
}

function FracCell({ x, pivot, aug }: { x: Frac; pivot?: boolean; aug?: boolean }) {
  return (
    <td className={`px-2 py-1 text-center tabular-nums ${aug ? "border-l-2 border-slate-500" : ""} ${pivot ? "rounded bg-yellow-200 font-bold" : ""}`}>
      <M>{x.toTex()}</M>
    </td>
  );
}

function MatrixView({ m, augCol, pivotCols }: { m: FMatrix; augCol?: number; pivotCols: number }) {
  const piv = new Set<string>();
  m.forEach((row, i) => {
    const c = row.findIndex((x, j) => j < pivotCols && !x.isZero());
    if (c >= 0) piv.add(`${i},${c}`);
  });
  return (
    <table className="mx-auto border-x-2 border-slate-800">
      <tbody>
        {m.map((row, i) => (
          <tr key={i}>
            <td className="pr-1 text-xs text-slate-400">L{i + 1}</td>
            {row.map((x, j) => (
              <FracCell key={j} x={x} pivot={piv.has(`${i},${j}`)} aug={augCol !== undefined && j === augCol} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function GaussLab({ title: titleProp, hint, initial, mode = "system", presets }: Props) {
  const t = useT();
  const lang = useLang();
  const title = titleProp ?? t("Laboratório de eliminação", "Elimination lab");
  const S = useSpan();
  const [cells, setCells] = useState(toCells(initial));
  const base = useMemo<FMatrix | null>(() => {
    const parsed = cells.map((r) => r.map(parseCell));
    if (parsed.some((r) => r.some((x) => !x))) return null;
    const A = parsed as FMatrix;
    if (mode === "inverse") return A.map((r, i) => [...r, ...A.map((_, j) => new Frac(i === j ? 1 : 0))]);
    return A;
  }, [cells, mode]);

  const nCols = base?.[0].length ?? 0;
  const pivotCols = mode === "system" ? nCols - 1 : mode === "inverse" ? nCols / 2 : nCols;
  const augCol = mode === "system" ? nCols - 1 : mode === "inverse" ? nCols / 2 : undefined;

  const [history, setHistory] = useState<RowOp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const current = useMemo(() => {
    if (!base) return null;
    try {
      return history.reduce((m, op) => applyOp(m, op), base);
    } catch {
      return base;
    }
  }, [base, history]);

  // operação manual
  const [kind, setKind] = useState<RowOp["kind"]>("addMul");
  const [i, setI] = useState(1);
  const [j, setJ] = useState(0);
  const [k, setK] = useState("-1");

  const reset = (c?: string[][]) => {
    if (c) setCells(c);
    setHistory([]);
    setError(null);
  };

  if (!base || !current) {
    return (
      <Lab title={title} hint={hint}>
        <MatrixEditor cells={cells} onChange={(c) => reset(c)} augCol={mode === "system" ? cells[0].length - 1 : undefined} />
        <p className="mt-2 text-sm text-red-700">{t("Há entradas inválidas (usa inteiros, decimais ou frações como 1/2).", "Some entries are invalid (use integers, decimals or fractions like 1/2).")}</p>
      </Lab>
    );
  }

  const rows = current.length;
  const echelon = isRowEchelon(current, pivotCols);
  const auto = rowReduce(current, { pivotCols, reduced: true });
  const done = auto.length === 0;
  const piv = pivotColumns(current, pivotCols);

  const doManual = () => {
    setError(null);
    const kk = parseCell(k);
    let op: RowOp;
    if (kind === "swap") op = { kind, i, j };
    else if (kind === "scale") {
      if (!kk || kk.isZero()) return setError(t("O escalar tem de ser diferente de 0.", "The scalar must be non-zero."));
      op = { kind, i, k: kk };
    } else {
      if (!kk) return setError(t("Escalar inválido.", "Invalid scalar."));
      if (i === j) return setError(t("Escolhe duas linhas diferentes.", "Pick two different rows."));
      op = { kind, i, j, k: kk };
    }
    setHistory([...history, op]);
  };

  // resultado
  let result: React.ReactNode = null;
  if (echelon && mode === "system") {
    const c = classify(current);
    result = (
      <div>
        <b>{lang === "en" ? CLASS_LABEL_EN[c.cls] : CLASS_LABEL[c.cls]}</b>
        {c.cls === "SI" && <> — {t("há um pivô na coluna dos termos independentes (uma equação do tipo", "there is a pivot in the right-hand-side column (an equation of the form")} <M>{"0 = c \\neq 0"}</M>).</>}
        {c.cls === "SPI" && (
          <> — {t("incógnitas livres", "free variables")}: {c.free.map((f) => <M key={f}>{`x_{${f + 1}}`}</M>).reduce<React.ReactNode[]>((a, x, n) => (n ? [...a, ", ", x] : [x]), [])}. {t("Grau de indeterminação", "Degrees of freedom")} {c.free.length}.</>
        )}
        {c.cls === "SPD" && done && (
          <>
            {" "}— {t("solução única", "unique solution")} <M>{`(${current.map((r) => r[nCols - 1].toTex()).join(",\\,")})`}</M>.
          </>
        )}
        <div className="text-xs text-slate-500">{t("car", "rank")}(A) = {c.rank}, {t("car", "rank")}([A|b]) = {pivotColumns(current, nCols).length}</div>
      </div>
    );
  }
  if (mode === "inverse" && done) {
    const n = pivotCols;
    const leftIsI = current.every((r, a) => r.slice(0, n).every((x, b) => x.eq(new Frac(a === b ? 1 : 0))));
    result = leftIsI ? (
      <div>
        <b>{t("A é invertível.", "A is invertible.")}</b> {t("A parte da direita é", "The right-hand block is")} <M>{`A^{-1} = \\begin{bmatrix}${current.map((r) => r.slice(n).map((x) => x.toTex()).join(" & ")).join(" \\\\ ")}\\end{bmatrix}`}</M>
      </div>
    ) : (
      <div>
        <b>{t("A não é invertível:", "A is not invertible:")}</b> {t(`a escada tem só ${piv.length} pivô(s) para ${n} colunas`, `the echelon form has only ${piv.length} pivot(s) for ${n} columns`)} ({t("car", "rank")}(A) = {piv.length} &lt; {n}).
      </div>
    );
  }
  if (mode === "kernel" && done) {
    const basis = nullBasis(base);
    result = (
      <div>
        {t("Incógnitas livres ↔ colunas sem pivô.", "Free variables ↔ columns without a pivot.")} <M>{`\\dim N(A) = ${basis.length}`}</M>, <M>{`\\operatorname{${lang === "en" ? "rank" : "car"}}(A) = ${piv.length}`}</M> ({t("e", "and")} {piv.length} + {basis.length} = {nCols} {t("colunas", "columns")} ✔).
        <div className="mt-1">
          <M>{basis.length ? `N(A) = ${S}\\left\\{${basis.map((v) => `(${v.map((x) => x.toTex()).join(",")})`).join(",\;")}\\right\\}` : "N(A) = \\{\\vec 0\\}"}</M>
        </div>
      </div>
    );
  }

  return (
    <Lab title={title} hint={hint ?? t("Edita a matriz, aplica operações elementares à mão ou pede o próximo passo. Os pivôs ficam a amarelo.", "Edit the matrix, apply elementary row operations yourself or ask for the next step. Pivots are highlighted in yellow.")}>
      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500">{mode === "system" ? t("Matriz aumentada [A | b]", "Augmented matrix [A | b]") : t("Matriz A", "Matrix A")}</div>
          <MatrixEditor cells={cells} onChange={(c) => reset(c)} augCol={mode === "system" ? cells[0].length - 1 : undefined} />
          {presets && <Presets items={presets} onPick={(v) => reset(toCells(v))} />}
        </div>
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg bg-slate-50 p-3">
            <MatrixView m={current} augCol={augCol} pivotCols={pivotCols} />
            <div className="mt-2 text-center text-xs text-slate-500">
              {done ? t("Escada de linhas reduzida ✔", "Reduced row echelon form ✔") : echelon ? t("Em escada de linhas (falta reduzir para Gauss-Jordan)", "In row echelon form (still needs Gauss-Jordan reduction)") : t("Ainda não está em escada", "Not in echelon form yet")}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={kind} onChange={(e) => setKind(e.target.value as RowOp["kind"])} aria-label={t("Operação", "Operation")}>
              <option value="addMul">Lᵢ + k·Lⱼ</option>
              <option value="scale">k·Lᵢ</option>
              <option value="swap">Lᵢ ↔ Lⱼ</option>
            </select>
            <span>i</span>
            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={i} onChange={(e) => setI(Number(e.target.value))} aria-label={t("Linha i", "Row i")}>
              {[...Array(rows).keys()].map((r) => <option key={r} value={r}>L{r + 1}</option>)}
            </select>
            {kind !== "scale" && (
              <>
                <span>j</span>
                <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={j} onChange={(e) => setJ(Number(e.target.value))} aria-label={t("Linha j", "Row j")}>
                  {[...Array(rows).keys()].map((r) => <option key={r} value={r}>L{r + 1}</option>)}
                </select>
              </>
            )}
            {kind !== "swap" && (
              <>
                <span>k</span>
                <input className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={k} onChange={(e) => setK(e.target.value)} aria-label={t("Escalar k", "Scalar k")} />
              </>
            )}
            <button className="btn py-1" onClick={doManual}>{t("Aplicar", "Apply")}</button>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost py-1" disabled={done} onClick={() => setHistory([...history, auto[0].op])}>
              {t("Próximo passo", "Next step")} {auto[0] && <span className="ml-1 text-slate-500">({lang === "en" ? auto[0].noteEn : auto[0].note})</span>}
            </button>
            <button className="btn-ghost py-1" disabled={done} onClick={() => setHistory([...history, ...auto.map((s) => s.op)])}>{t("Resolver tudo", "Solve all")}</button>
            <button className="btn-ghost py-1" disabled={!history.length} onClick={() => setHistory(history.slice(0, -1))}>{t("Desfazer", "Undo")}</button>
            <button className="btn-ghost py-1" disabled={!history.length} onClick={() => reset()}>{t("Recomeçar", "Reset")}</button>
          </div>
          {history.length > 0 && (
            <ol className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600">
              {history.map((op, n) => (
                <li key={n}>
                  <span className="text-xs text-slate-400">{n + 1}.</span> <M>{opTex(op)}</M>
                </li>
              ))}
            </ol>
          )}
          {result && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">{result}</div>}
        </div>
      </div>
    </Lab>
  );
}

export { toFrac };
