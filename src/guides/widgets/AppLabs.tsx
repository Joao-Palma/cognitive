"use client";
import { useMemo, useState } from "react";
import { M2, V2, mulMV, eigen2, fmt } from "../math/linalg2";
import { Plane, Path, Dot, Line, Handle, COLORS } from "../ui/Plane";
import { M } from "../ui/Tex";
import { Lab, Presets, Slider } from "../ui/blocks";
import { MatrixSliders, Readout, texM2, n } from "./common";

const r2 = (x: number) => Math.round(x * 100) / 100;

/** x_{k+1} = A x_k: estabilidade governada por |λ|. */
export function DynamicsLab() {
  const [A, setA] = useState<M2>([[0.9, 0.3], [-0.3, 0.9]]);
  const [x0, setX0] = useState<V2>([3, 0]);
  const [steps, setSteps] = useState(30);
  const traj = useMemo(() => {
    const pts: V2[] = [x0];
    for (let k = 0; k < steps; k++) pts.push(mulMV(A, pts[pts.length - 1]));
    return pts.map((p) => [Math.max(-50, Math.min(50, p[0])), Math.max(-50, Math.min(50, p[1]))] as V2);
  }, [A, x0, steps]);
  const e = eigen2(A);
  const rho = e.real ? Math.max(...e.values.map(Math.abs)) : Math.hypot(e.complex!.re, e.complex!.im);
  return (
    <Lab title="Sistema dinâmico discreto xₖ₊₁ = A xₖ" hint="Arrasta o ponto inicial x₀. Se todos os |λ| < 1 a trajetória converge para 0 (estável); se algum |λ| > 1 diverge. Valores complexos fazem espirais.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={5}>
          {e.real && e.vectors.map((vs, k) => vs.length === 1 && <Line key={k} d={vs[0]} color="#cbd5e1" dashed />)}
          <Path pts={traj} stroke={rho < 1 ? "#16a34a" : rho > 1 ? "#dc2626" : "#2563eb"} width={1.5} />
          {traj.map((p, k) => <Dot key={k} p={p} r={2.5} color={rho < 1 ? "#16a34a" : rho > 1 ? "#dc2626" : "#2563eb"} />)}
          <Handle p={x0} onChange={setX0} color={COLORS.u} label="x₀" />
        </Plane>
        <div className="space-y-3">
          <MatrixSliders A={A} onChange={setA} min={-1.5} max={1.5} step={0.05} />
          <Slider label="passos" value={steps} min={1} max={60} step={1} onChange={setSteps} />
          <Presets
            items={[
              { label: "Espiral estável", value: [[0.9, 0.3], [-0.3, 0.9]] as M2 },
              { label: "Espiral instável", value: [[1, 0.3], [-0.3, 1]] as M2 },
              { label: "Sela", value: [[1.2, 0], [0, 0.7]] as M2 },
              { label: "Nó estável", value: [[0.8, 0.1], [0.1, 0.6]] as M2 },
              { label: "Rotação pura", value: [[0.8, -0.6], [0.6, 0.8]] as M2 },
            ]}
            onPick={setA}
          />
          <Readout>
            <div>
              {e.real ? (
                <M>{`\\lambda_1 = ${n(e.values[0])},\\ \\lambda_2 = ${n(e.values[1])}`}</M>
              ) : (
                <M>{`\\lambda = ${n(e.complex!.re)} \\pm ${n(e.complex!.im)}i,\\ |\\lambda| = ${n(rho, 3)}`}</M>
              )}
            </div>
            <div>
              Raio espetral <M>{`\\rho(A) = \\max|\\lambda| = ${n(rho, 3)}`}</M> →{" "}
              <b className={rho < 1 ? "text-green-700" : rho > 1 ? "text-red-700" : "text-blue-700"}>
                {rho < 1 - 1e-9 ? "estável: xₖ → 0" : rho > 1 + 1e-9 ? "instável (para quase todo o x₀)" : "no limite: nem converge para 0 nem diverge"}
              </b>
            </div>
            <div className="text-slate-600">Porquê: se x₀ = c₁v₁ + c₂v₂ (vetores próprios), então <M>{"x_k = c_1\\lambda_1^k v_1 + c_2 \\lambda_2^k v_2"}</M>.</div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Cadeia de Markov com 2 estados: converge para o vetor próprio de λ = 1. */
export function MarkovLab() {
  const [p, setP] = useState(0.1); // A → B
  const [q, setQ] = useState(0.3); // B → A
  const [k, setK] = useState(0);
  const P: M2 = [[1 - p, q], [p, 1 - q]]; // colunas somam 1 (estocástica por colunas)
  const [x0a, setX0a] = useState(1);
  const series = useMemo(() => {
    const out: V2[] = [[x0a, 1 - x0a]];
    for (let i = 0; i < 40; i++) out.push(mulMV(P, out[out.length - 1]));
    return out;
  }, [p, q, x0a]); // eslint-disable-line react-hooks/exhaustive-deps
  const steady: V2 = p + q > 0 ? [q / (p + q), p / (p + q)] : [x0a, 1 - x0a];
  const xk = series[k];
  const W = 320;
  const H = 120;
  return (
    <Lab title="Cadeia de Markov: clientes entre duas operadoras" hint="Todos os meses, uma fração p dos clientes de A muda para B e uma fração q dos de B muda para A. A distribuição converge para o vetor próprio associado a λ = 1, seja qual for o início.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Slider label="p (A→B)" value={p} min={0} max={1} step={0.01} onChange={setP} display={fmt(p)} />
          <Slider label="q (B→A)" value={q} min={0} max={1} step={0.01} onChange={setQ} display={fmt(q)} />
          <Slider label="início A" value={x0a} min={0} max={1} step={0.05} onChange={setX0a} display={`${Math.round(x0a * 100)}%`} />
          <Slider label="mês k" value={k} min={0} max={40} step={1} onChange={setK} />
          <Readout>
            <div><M>{`P = ${texM2(P)}`}</M> (cada coluna soma 1)</div>
            <div><M>{`x_{${k}} = P^{${k}}x_0 = (${n(xk[0], 3)},\\ ${n(xk[1], 3)})`}</M></div>
            <div>Estado estacionário: <M>{`Pv = v \\Rightarrow v = \\left(\\tfrac{q}{p+q}, \\tfrac{p}{p+q}\\right) = (${n(steady[0], 3)},\\ ${n(steady[1], 3)})`}</M></div>
            <div className="text-slate-600">O outro valor próprio é <M>{`1 - p - q = ${n(1 - p - q)}`}</M>; quanto menor |1 − p − q|, mais rápida a convergência.</div>
          </Readout>
        </div>
        <svg viewBox={`0 0 ${W} ${H + 40}`} className="w-full rounded-lg border border-slate-200 bg-white">
          <line x1={20} y1={10 + H * (1 - steady[0])} x2={W - 5} y2={10 + H * (1 - steady[0])} stroke="#2563eb" strokeDasharray="4 4" />
          <polyline fill="none" stroke="#2563eb" strokeWidth={2} points={series.map((s, i) => `${r2(20 + (i * (W - 25)) / 40)},${r2(10 + H * (1 - s[0]))}`).join(" ")} />
          <polyline fill="none" stroke="#dc2626" strokeWidth={2} points={series.map((s, i) => `${r2(20 + (i * (W - 25)) / 40)},${r2(10 + H * (1 - s[1]))}`).join(" ")} />
          <line x1={20 + (k * (W - 25)) / 40} y1={5} x2={20 + (k * (W - 25)) / 40} y2={H + 15} stroke="#0f172a" />
          <text x={20} y={H + 32} fontSize={11} fill="#2563eb">— quota de A</text>
          <text x={120} y={H + 32} fontSize={11} fill="#dc2626">— quota de B</text>
          <text x={220} y={H + 32} fontSize={11} fill="#64748b">meses 0–40</text>
        </svg>
      </div>
    </Lab>
  );
}

const NODES = ["A", "B", "C", "D"];
const POS: [number, number][] = [[60, 50], [230, 50], [230, 170], [60, 170]];

/** PageRank num grafo de 4 páginas: o vetor próprio dominante da matriz do Google. */
export function PageRankLab() {
  const [links, setLinks] = useState<boolean[][]>([
    [false, true, true, false],
    [false, false, true, false],
    [true, false, false, true],
    [false, false, true, false],
  ]);
  const [damp, setDamp] = useState(0.85);
  const N = 4;
  const { rank, iters } = useMemo(() => {
    // Matriz de transição por colunas: página j distribui igualmente pelos links; sem links → uniforme
    const T = Array.from({ length: N }, () => Array(N).fill(0));
    for (let j = 0; j < N; j++) {
      const out = links[j].filter(Boolean).length;
      for (let i = 0; i < N; i++) T[i][j] = out ? (links[j][i] ? 1 / out : 0) : 1 / N;
    }
    let r = Array(N).fill(1 / N);
    let it = 0;
    for (; it < 200; it++) {
      const next = r.map((_, i) => (1 - damp) / N + damp * T[i].reduce((s, t, j) => s + t * r[j], 0));
      const diff = next.reduce((s, x, i) => s + Math.abs(x - r[i]), 0);
      r = next;
      if (diff < 1e-10) break;
    }
    return { rank: r, iters: it };
  }, [links, damp]);
  const toggle = (i: number, j: number) => i !== j && setLinks(links.map((row, a) => row.map((x, b) => (a === i && b === j ? !x : x))));
  const max = Math.max(...rank);
  return (
    <Lab title="PageRank" hint="Clica na tabela para criar ou remover links (linha → coluna). O ranking é o vetor próprio de valor próprio 1 da matriz do Google G = d·T + (1−d)/n·𝟙, calculado pelo método das potências.">
      <div className="grid gap-4 md:grid-cols-2">
        <svg viewBox="0 0 290 220" className="w-full rounded-lg border border-slate-200 bg-white">
          <defs>
            <marker id="pr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#64748b" /></marker>
          </defs>
          {links.map((row, i) =>
            row.map((on, j) => {
              if (!on) return null;
              const [x1, y1] = POS[i];
              const [x2, y2] = POS[j];
              const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
              const off = links[j][i] ? 6 : 0; // ligações nos dois sentidos: afastar
              const ox = (-dy / L) * off, oy = (dx / L) * off;
              const r = 18 + 4;
              return <line key={`${i}${j}`} x1={x1 + (dx / L) * r + ox} y1={y1 + (dy / L) * r + oy} x2={x2 - (dx / L) * r + ox} y2={y2 - (dy / L) * r + oy} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#pr-arrow)" />;
            }),
          )}
          {POS.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r2(12 + 14 * (rank[i] / max))} fill="#2563eb" fillOpacity={r2(0.15 + 0.6 * (rank[i] / max))} stroke="#2563eb" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">{NODES[i]}</text>
            </g>
          ))}
        </svg>
        <div className="space-y-3">
          <table className="text-sm">
            <thead>
              <tr><th className="px-2 text-xs text-slate-500">de \ para</th>{NODES.map((x) => <th key={x} className="px-2">{x}</th>)}</tr>
            </thead>
            <tbody>
              {links.map((row, i) => (
                <tr key={i}>
                  <th className="px-2">{NODES[i]}</th>
                  {row.map((on, j) => (
                    <td key={j} className="px-1">
                      <button disabled={i === j} onClick={() => toggle(i, j)} className={`h-7 w-7 rounded ${i === j ? "bg-slate-100" : on ? "bg-blue-600 text-white" : "border border-slate-300 bg-white"}`} aria-label={`link ${NODES[i]} para ${NODES[j]}`}>
                        {on ? "→" : ""}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Slider label="d" value={damp} min={0} max={0.99} step={0.01} onChange={setDamp} display={fmt(damp)} />
          <Readout>
            {rank
              .map((r, i) => [r, i] as const)
              .sort((a, b) => b[0] - a[0])
              .map(([r, i], pos) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 text-slate-500">{pos + 1}.</span>
                  <b className="w-4">{NODES[i]}</b>
                  <div className="h-2 flex-1 rounded bg-slate-200"><div className="h-2 rounded bg-blue-600" style={{ width: `${r2(100 * r)}%` }} /></div>
                  <span className="w-12 text-right tabular-nums">{fmt(r, 3)}</span>
                </div>
              ))}
            <div className="text-xs text-slate-500">Convergiu em {iters} iterações de <M>{"r \\leftarrow G r"}</M>. Os valores somam 1.</div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Potências de um bloco de Jordan: J^k = [[λ^k, kλ^{k-1}],[0, λ^k]]. */
export function JordanPowersLab() {
  const [lambda, setLambda] = useState(0.9);
  const [k, setK] = useState(5);
  const lk = lambda ** k;
  const off = k * lambda ** (k - 1);
  const J: M2 = [[lambda, 1], [0, lambda]];
  const W = 320, H = 130;
  const ks = Array.from({ length: 41 }, (_, i) => i);
  const valsJ = ks.map((i) => Math.hypot(lambda ** i, i * lambda ** (i - 1), lambda ** i));
  const valsD = ks.map((i) => Math.abs(lambda ** i) * Math.SQRT2);
  const maxV = Math.min(20, Math.max(...valsJ, ...valsD, 1));
  const y = (v: number) => 10 + H * (1 - Math.min(v, maxV) / maxV);
  return (
    <Lab title="Potências de um bloco de Jordan" hint="Compara λI (diagonalizável) com o bloco de Jordan J. O 1 fora da diagonal gera o termo kλᵏ⁻¹, que cresce antes de decair, mesmo com |λ| < 1.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Slider label={<M>{"\\lambda"}</M>} value={lambda} min={-1.2} max={1.2} step={0.05} onChange={setLambda} display={fmt(lambda)} />
          <Slider label="k" value={k} min={0} max={40} step={1} onChange={setK} />
          <Readout>
            <div><M>{`J = ${texM2(J)},\\quad J^{${k}} = \\begin{bmatrix} \\lambda^{k} & k\\lambda^{k-1} \\\\ 0 & \\lambda^{k}\\end{bmatrix} = \\begin{bmatrix} ${n(lk, 3)} & ${n(off, 3)} \\\\ 0 & ${n(lk, 3)}\\end{bmatrix}`}</M></div>
            <div><M>{`(\\lambda I)^{${k}} = ${texM2([[lk, 0], [0, lk]] as M2, 3)}`}</M></div>
            <div className="text-slate-600">Ambas têm o mesmo polinómio característico <M>{`p(t) = (t - ${n(lambda)})^2`}</M>, mas em J tem-se m.g. = 1 &lt; m.a. = 2: J não é semelhante a nenhuma matriz diagonal.</div>
          </Readout>
        </div>
        <svg viewBox={`0 0 ${W} ${H + 40}`} className="w-full rounded-lg border border-slate-200 bg-white">
          <polyline fill="none" stroke="#9333ea" strokeWidth={2} points={valsJ.map((v, i) => `${r2(20 + (i * (W - 25)) / 40)},${r2(y(v))}`).join(" ")} />
          <polyline fill="none" stroke="#16a34a" strokeWidth={2} strokeDasharray="4 3" points={valsD.map((v, i) => `${r2(20 + (i * (W - 25)) / 40)},${r2(y(v))}`).join(" ")} />
          <line x1={20 + (k * (W - 25)) / 40} y1={5} x2={20 + (k * (W - 25)) / 40} y2={H + 12} stroke="#0f172a" />
          <text x={20} y={H + 30} fontSize={11} fill="#9333ea">— ‖Jᵏ‖</text>
          <text x={90} y={H + 30} fontSize={11} fill="#16a34a">- - ‖(λI)ᵏ‖</text>
          <text x={200} y={H + 30} fontSize={11} fill="#64748b">k = 0…40</text>
        </svg>
      </div>
    </Lab>
  );
}
