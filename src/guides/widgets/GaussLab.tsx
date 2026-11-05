"use client";
import { useMemo, useState } from "react";
import { Frac, FMatrix, toFrac } from "../math/fraction";
import { applyOp, classify, CLASS_LABEL, isRowEchelon, opTex, pivotColumns, rowReduce, RowOp, nullBasis } from "../math/rowreduce";
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

export function GaussLab({ title = "Laboratório de eliminação", hint, initial, mode = "system", presets }: Props) {
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
        <p className="mt-2 text-sm text-red-700">Há entradas inválidas (usa inteiros, decimais ou frações como 1/2).</p>
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
      if (!kk || kk.isZero()) return setError("O escalar tem de ser diferente de 0.");
      op = { kind, i, k: kk };
    } else {
      if (!kk) return setError("Escalar inválido.");
      if (i === j) return setError("Escolhe duas linhas diferentes.");
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
        <b>{CLASS_LABEL[c.cls]}</b>
        {c.cls === "SI" && <> — há um pivô na coluna dos termos independentes (uma equação do tipo <M>{"0 = c \\neq 0"}</M>).</>}
        {c.cls === "SPI" && (
          <> — incógnitas livres: {c.free.map((f) => <M key={f}>{`x_{${f + 1}}`}</M>).reduce<React.ReactNode[]>((a, x, n) => (n ? [...a, ", ", x] : [x]), [])}. Grau de indeterminação {c.free.length}.</>
        )}
        {c.cls === "SPD" && done && (
          <>
            {" "}— solução única <M>{`(${current.map((r) => r[nCols - 1].toTex()).join(",\\,")})`}</M>.
          </>
        )}
        <div className="text-xs text-slate-500">car(A) = {c.rank}, car([A|b]) = {pivotColumns(current, nCols).length}</div>
      </div>
    );
  }
  if (mode === "inverse" && done) {
    const n = pivotCols;
    const leftIsI = current.every((r, a) => r.slice(0, n).every((x, b) => x.eq(new Frac(a === b ? 1 : 0))));
    result = leftIsI ? (
      <div>
        <b>A é invertível.</b> A parte da direita é <M>{`A^{-1} = \\begin{bmatrix}${current.map((r) => r.slice(n).map((x) => x.toTex()).join(" & ")).join(" \\\\ ")}\\end{bmatrix}`}</M>
      </div>
    ) : (
      <div>
        <b>A não é invertível:</b> a escada tem só {piv.length} pivô(s) para {n} colunas (car(A) = {piv.length} &lt; {n}).
      </div>
    );
  }
  if (mode === "kernel" && done) {
    const basis = nullBasis(base);
    result = (
      <div>
        Incógnitas livres ↔ colunas sem pivô. <M>{`\\dim N(A) = ${basis.length}`}</M>, <M>{`\\operatorname{car}(A) = ${piv.length}`}</M> (e {piv.length} + {basis.length} = {nCols} colunas ✔).
        <div className="mt-1">
          <M>{basis.length ? `N(A) = \\mathcal{L}\\left\\{${basis.map((v) => `(${v.map((x) => x.toTex()).join(",")})`).join(",\;")}\\right\\}` : "N(A) = \\{\\vec 0\\}"}</M>
        </div>
      </div>
    );
  }

  return (
    <Lab title={title} hint={hint ?? "Edita a matriz, aplica operações elementares à mão ou pede o próximo passo. Os pivôs ficam a amarelo."}>
      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500">{mode === "system" ? "Matriz aumentada [A | b]" : "Matriz A"}</div>
          <MatrixEditor cells={cells} onChange={(c) => reset(c)} augCol={mode === "system" ? cells[0].length - 1 : undefined} />
          {presets && <Presets items={presets} onPick={(v) => reset(toCells(v))} />}
        </div>
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg bg-slate-50 p-3">
            <MatrixView m={current} augCol={augCol} pivotCols={pivotCols} />
            <div className="mt-2 text-center text-xs text-slate-500">
              {done ? "Escada de linhas reduzida ✔" : echelon ? "Em escada de linhas (falta reduzir para Gauss-Jordan)" : "Ainda não está em escada"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={kind} onChange={(e) => setKind(e.target.value as RowOp["kind"])} aria-label="Operação">
              <option value="addMul">Lᵢ + k·Lⱼ</option>
              <option value="scale">k·Lᵢ</option>
              <option value="swap">Lᵢ ↔ Lⱼ</option>
            </select>
            <span>i</span>
            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={i} onChange={(e) => setI(Number(e.target.value))} aria-label="Linha i">
              {[...Array(rows).keys()].map((r) => <option key={r} value={r}>L{r + 1}</option>)}
            </select>
            {kind !== "scale" && (
              <>
                <span>j</span>
                <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={j} onChange={(e) => setJ(Number(e.target.value))} aria-label="Linha j">
                  {[...Array(rows).keys()].map((r) => <option key={r} value={r}>L{r + 1}</option>)}
                </select>
              </>
            )}
            {kind !== "swap" && (
              <>
                <span>k</span>
                <input className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={k} onChange={(e) => setK(e.target.value)} aria-label="Escalar k" />
              </>
            )}
            <button className="btn py-1" onClick={doManual}>Aplicar</button>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost py-1" disabled={done} onClick={() => setHistory([...history, auto[0].op])}>
              Próximo passo {auto[0] && <span className="ml-1 text-slate-500">({auto[0].note})</span>}
            </button>
            <button className="btn-ghost py-1" disabled={done} onClick={() => setHistory([...history, ...auto.map((s) => s.op)])}>Resolver tudo</button>
            <button className="btn-ghost py-1" disabled={!history.length} onClick={() => setHistory(history.slice(0, -1))}>Desfazer</button>
            <button className="btn-ghost py-1" disabled={!history.length} onClick={() => reset()}>Recomeçar</button>
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
