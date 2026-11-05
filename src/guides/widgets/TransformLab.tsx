"use client";
import { useState } from "react";
import { M2, V2, det2, mulMV, mulMM, eigen2, fmt } from "../math/linalg2";
import { Plane, Arrow, Handle, Line, Dot, COLORS, Seg as LineSeg } from "../ui/Plane";
import { M, MD } from "../ui/Tex";
import { Lab, Presets } from "../ui/blocks";
import { TransformedGrid, UnitSquare, MatrixSliders, Readout, texM2, texV2, n, poly, niceDir } from "./common";

const PRESETS: { label: string; value: M2 }[] = [
  { label: "Identidade", value: [[1, 0], [0, 1]] },
  { label: "Rotação 90°", value: [[0, -1], [1, 0]] },
  { label: "Reflexão (eixo x)", value: [[1, 0], [0, -1]] },
  { label: "Cisalhamento", value: [[1, 1], [0, 1]] },
  { label: "Escala 2×", value: [[2, 0], [0, 2]] },
  { label: "Projeção no eixo x", value: [[1, 0], [0, 0]] },
  { label: "Singular", value: [[1, 2], [0.5, 1]] },
];

/** A matriz como transformação: colunas = imagens de e1, e2; determinante = área com sinal. */
export function TransformLab({ initial = [[1, 1], [0, 1]], showDet = true, showVector = true }: { initial?: M2; showDet?: boolean; showVector?: boolean }) {
  const [A, setA] = useState<M2>(initial);
  const [x, setX] = useState<V2>([1, 1]);
  const d = det2(A);
  const Ax = mulMV(A, x);
  const e1: V2 = [A[0][0], A[1][0]];
  const e2: V2 = [A[0][1], A[1][1]];
  return (
    <Lab title="A matriz como transformação do plano" hint="Mexe nas entradas: a grelha azul é a imagem da grelha quadriculada. As colunas de A são para onde vão e₁ e e₂.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          <TransformedGrid A={A} />
          {showDet && <UnitSquare A={A} fill={d >= 0 ? "#22c55e33" : "#ef444433"} stroke={d >= 0 ? "#16a34a" : "#dc2626"} />}
          <Arrow to={e1} color={COLORS.u} label="Ae₁" />
          <Arrow to={e2} color={COLORS.v} label="Ae₂" />
          {showVector && (
            <>
              <Arrow to={x} color={COLORS.muted} width={1.5} dashed />
              <Arrow to={Ax} color={COLORS.x} label="Ax" />
              <Handle p={x} onChange={setX} color={COLORS.muted} label="x" />
            </>
          )}
        </Plane>
        <div className="space-y-3">
          <MatrixSliders A={A} onChange={setA} />
          <Presets items={PRESETS} onPick={setA} />
          <Readout>
            <div>
              <M>{`A = ${texM2(A, 1)}`}</M>
            </div>
            {showVector && (
              <div>
                <M>{`A${texV2(x, 1)} = ${n(x[0], 1)}${texV2(e1, 1)} + ${n(x[1], 1)}${texV2(e2, 1)} = ${texV2(Ax)}`}</M>
              </div>
            )}
            {showDet && (
              <div>
                <M>{`\\det A = ad - bc = ${n(d)}`}</M> →{" "}
                {Math.abs(d) < 1e-9 ? (
                  <b className="text-red-700">o quadrado colapsa: A não é invertível</b>
                ) : (
                  <>
                    a área do quadrado unitário é multiplicada por <b>{fmt(Math.abs(d))}</b>
                    {d < 0 && <> e a orientação <b>inverte</b> (sinal negativo)</>}
                  </>
                )}
              </div>
            )}
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Composição: aplicar B depois de A corresponde à matriz BA (não AB!). */
export function CompositionLab() {
  const [A, setA] = useState<M2>([[0, -1], [1, 0]]); // rotação 90°
  const [B, setB] = useState<M2>([[1, 1], [0, 1]]); // cisalhamento
  const BA = mulMM(B, A);
  const AB = mulMM(A, B);
  const same = BA.every((r, i) => r.every((v, j) => Math.abs(v - AB[i][j]) < 1e-9));
  const F: V2[] = [[0, 0], [1, 0], [1, 0.5], [0.4, 0.5], [0.4, 1.5], [0, 1.5]]; // um "F" para ver a orientação
  const shape = (T: M2) => F.map((p) => mulMV(T, p));
  return (
    <Lab title="Produto de matrizes = composição" hint="O 'F' cinzento é transformado primeiro por A e depois por B (resultado BA, a roxo). Compara com AB (laranja): em geral são diferentes.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={3}>
          <PolyShape pts={F} color="#64748b" />
          <PolyShape pts={shape(BA)} color={COLORS.x} />
          <PolyShape pts={shape(AB)} color={COLORS.y} dashed />
        </Plane>
        <div className="space-y-3">
          <div className="text-sm font-semibold">A (aplicada primeiro)</div>
          <MatrixSliders A={A} onChange={setA} />
          <div className="text-sm font-semibold">B (aplicada depois)</div>
          <MatrixSliders A={B} onChange={setB} />
          <Readout>
            <M>{`BA = ${texM2(BA, 1)}`}</M>
            <span className="mx-2" />
            <M>{`AB = ${texM2(AB, 1)}`}</M>
            <div>{same ? "Neste caso AB = BA (as matrizes comutam)." : <b>AB ≠ BA — o produto de matrizes não é comutativo.</b>}</div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

function PolyShape({ pts, color, dashed }: { pts: V2[]; color: string; dashed?: boolean }) {
  return (
    <g>
      {pts.map((p, i) => (
        <LineSeg key={i} a={p} b={pts[(i + 1) % pts.length]} color={color} dashed={dashed} />
      ))}
    </g>
  );
}

/** Núcleo e imagem de uma transformação de R² em R². */
export function KernelImageLab() {
  const [A, setA] = useState<M2>([[1, 2], [0.5, 1]]);
  const [x, setX] = useState<V2>([2, -1]);
  const d = det2(A);
  const singular = Math.abs(d) < 0.05;
  const zero = A.every((r) => r.every((v) => Math.abs(v) < 1e-9));
  const col: V2 = Math.hypot(A[0][0], A[1][0]) > 1e-9 ? [A[0][0], A[1][0]] : [A[0][1], A[1][1]];
  const ker: V2 = Math.hypot(A[0][0], A[0][1]) > 1e-9 ? [-A[0][1], A[0][0]] : [-A[1][1], A[1][0]];
  const Ax = mulMV(A, x);
  return (
    <Lab title="Núcleo e imagem" hint="Escolhe uma matriz singular (det = 0). Arrasta x: quando x está sobre a reta do núcleo (vermelha), Ax = 0. A imagem (verde) é o espaço das colunas.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          {!zero && singular && (
            <>
              <Line d={ker} color="#dc2626" width={3} />
              <Line d={col} color="#16a34a" width={3} />
            </>
          )}
          <Arrow to={x} color={COLORS.u} width={1.5} />
          <Arrow to={Ax} color={COLORS.x} label="Ax" />
          <Handle p={x} onChange={setX} color={COLORS.u} label="x" snap={0.25} />
          <Dot p={[0, 0]} r={3} />
        </Plane>
        <div className="space-y-3">
          <MatrixSliders A={A} onChange={setA} step={0.5} min={-3} max={3} />
          <Presets
            items={[
              { label: "Singular (car 1)", value: [[1, 2], [0.5, 1]] as M2 },
              { label: "Projeção", value: [[1, 0], [0, 0]] as M2 },
              { label: "Invertível", value: [[2, 1], [1, 1]] as M2 },
              { label: "Nula", value: [[0, 0], [0, 0]] as M2 },
            ]}
            onPick={setA}
          />
          <Readout>
            <div><M>{`\\det A = ${n(d)}`}</M></div>
            {zero ? (
              <div>A é nula: <M>{"N(A) = \\mathbb{R}^2"}</M>, <M>{"C(A) = \\{\\vec 0\\}"}</M>. car(A) = 0, nul(A) = 2.</div>
            ) : singular ? (
              <>
                <div><span className="font-semibold text-red-700">N(A)</span> <M>{`= \\mathcal{L}\\{${texV2(niceDir(ker))}\\}`}</M> — dimensão 1</div>
                <div><span className="font-semibold text-green-700">C(A)</span> <M>{`= \\mathcal{L}\\{${texV2(niceDir(col))}\\}`}</M> — dimensão 1</div>
                <div>car(A) + nul(A) = 1 + 1 = 2 = número de colunas ✔</div>
              </>
            ) : (
              <div>A é invertível: <M>{"N(A) = \\{\\vec 0\\}"}</M> e <M>{"C(A) = \\mathbb{R}^2"}</M>. car(A) = 2, nul(A) = 0.</div>
            )}
            <div><M>{`Ax = ${texV2(Ax)}`}</M>{Math.hypot(...Ax) < 1e-9 && <b className="ml-2 text-red-700">x ∈ N(A)!</b>}</div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Vetores próprios: arrasta v até Av ficar na mesma direção. */
export function EigenLab({ initial = [[2, 1], [1, 2]] as M2, presets }: { initial?: M2; presets?: { label: string; value: M2 }[] }) {
  const [A, setA] = useState<M2>(initial);
  const [v, setV] = useState<V2>([1, 0]);
  const Av = mulMV(A, v);
  const e = eigen2(A);
  const crossp = v[0] * Av[1] - v[1] * Av[0];
  const nv = Math.hypot(...v);
  const isEigen = nv > 1e-9 && Math.abs(crossp) < 1e-6 * Math.max(1, nv * Math.hypot(...Av));
  const lambda = isEigen ? (Math.abs(v[0]) > Math.abs(v[1]) ? Av[0] / v[0] : Av[1] / v[1]) : null;
  const t = A[0][0] + A[1][1];
  const d = det2(A);
  return (
    <Lab title="Caça aos vetores próprios" hint="Arrasta v. Quando Av (roxo) fica na mesma reta que v, encontraste um vetor próprio: Av = λv. As retas tracejadas são os espaços próprios.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          {e.real &&
            e.vectors.flat().length <= 2 &&
            e.vectors.map((vs, k) => vs.length === 1 && <Line key={k} d={vs[0]} color={k ? "#f59e0b" : "#10b981"} width={2} dashed />)}
          <Arrow to={Av} color={COLORS.x} label="Av" />
          <Arrow to={v} color={isEigen ? "#16a34a" : COLORS.u} label="v" width={3} />
          <Handle p={v} onChange={setV} color={isEigen ? "#16a34a" : COLORS.u} snap={0.25} />
        </Plane>
        <div className="space-y-3">
          <MatrixSliders A={A} onChange={setA} step={0.5} />
          <Presets
            items={
              presets ?? [
                { label: "Simétrica", value: [[2, 1], [1, 2]] as M2 },
                { label: "Valores 4 e 2", value: [[5, -1], [3, 1]] as M2 },
                { label: "Rotação (complexos)", value: [[0, -1], [1, 0]] as M2 },
                { label: "Jordan (m.g. < m.a.)", value: [[2, 1], [0, 2]] as M2 },
                { label: "2I (todo o plano)", value: [[2, 0], [0, 2]] as M2 },
              ]
            }
            onPick={setA}
          />
          <Readout>
            <div><M>{`p(\\lambda) = \\det(A - \\lambda I) = ${poly([[1, "\\lambda^2"], [-t, "\\lambda"], [d, ""]])}`}</M></div>
            {e.real ? (
              e.values[0] === e.values[1] || e.ma[0] === 2 ? (
                <div>
                  Valor próprio duplo <M>{`\\lambda = ${n(e.values[0])}`}</M>: m.a. = 2, m.g. = {e.mg[0]}
                  {e.mg[0] === 1 ? " → não diagonalizável (só uma reta de vetores próprios)" : " → todo o vetor não nulo é próprio"}
                </div>
              ) : (
                <div>
                  <M>{`\\lambda_1 = ${n(e.values[0])},\\ E(\\lambda_1) = \\mathcal{L}\\{${texV2(niceDir(e.vectors[0][0]))}\\}`}</M>
                  <br />
                  <M>{`\\lambda_2 = ${n(e.values[1])},\\ E(\\lambda_2) = \\mathcal{L}\\{${texV2(niceDir(e.vectors[1][0]))}\\}`}</M>
                </div>
              )
            ) : (
              <div>Discriminante negativo: <M>{`\\lambda = ${n(e.complex!.re)} \\pm ${n(e.complex!.im)}i`}</M>. Nenhum vetor real é próprio — nenhuma direção fica fixa.</div>
            )}
            <div className={isEigen ? "font-bold text-green-700" : "text-slate-600"}>
              {isEigen ? <>✔ v é vetor próprio com λ = {fmt(lambda!)}</> : "v não é vetor próprio (Av muda de direção)"}
            </div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

export { MD };
