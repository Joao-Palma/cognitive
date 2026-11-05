"use client";
import { useState } from "react";
import { V2, add, scale, cross, fmt } from "../math/linalg2";
import { Plane, Arrow, Handle, Line, Path, Dot, Poly, COLORS } from "../ui/Plane";
import { M } from "../ui/Tex";
import { Lab, Presets, Slider } from "../ui/blocks";
import { Readout, texV2, n, poly, niceDir } from "./common";

type SetId = "reta0" | "reta1" | "eixos" | "parabola" | "semiplano" | "zero";
const SETS: Record<SetId, { label: string; tex: string; test: (p: V2) => boolean; draw: React.ReactNode; isSub: boolean; why: string }> = {
  reta0: {
    label: "Reta pela origem",
    tex: "W = \\{(x,y) : x + y = 0\\}",
    test: (p) => Math.abs(p[0] + p[1]) < 1e-9,
    draw: <Line d={[1, -1]} color="#16a34a" width={3} />,
    isSub: true,
    why: "Contém 0, e somas e múltiplos de vetores da reta ficam na reta.",
  },
  reta1: {
    label: "Reta sem a origem",
    tex: "W = \\{(x,y) : x + y = 1\\}",
    test: (p) => Math.abs(p[0] + p[1] - 1) < 1e-9,
    draw: <Line p={[1, 0]} d={[1, -1]} color="#16a34a" width={3} />,
    isSub: false,
    why: "Não contém o vetor nulo (0 + 0 ≠ 1) — falha logo à partida.",
  },
  eixos: {
    label: "União dos eixos",
    tex: "W = \\{(x,y) : xy = 0\\}",
    test: (p) => Math.abs(p[0] * p[1]) < 1e-9,
    draw: (
      <>
        <Line d={[1, 0]} color="#16a34a" width={3} />
        <Line d={[0, 1]} color="#16a34a" width={3} />
      </>
    ),
    isSub: false,
    why: "Fechado para múltiplos, mas não para a soma: (1,0) + (0,1) = (1,1) ∉ W.",
  },
  parabola: {
    label: "Parábola",
    tex: "W = \\{(x,y) : y = x^2\\}",
    test: (p) => Math.abs(p[1] - p[0] ** 2) < 1e-9,
    draw: <Path pts={Array.from({ length: 81 }, (_, i) => { const x = -2 + i * 0.05; return [x, x * x] as V2; })} stroke="#16a34a" width={3} />,
    isSub: false,
    why: "Contém 0, mas 2·(1,1) = (2,2) e 2 ≠ 2² — não é fechado para múltiplos.",
  },
  semiplano: {
    label: "Semiplano y ≥ 0",
    tex: "W = \\{(x,y) : y \\ge 0\\}",
    test: (p) => p[1] >= -1e-9,
    draw: <Poly pts={[[-9, 0], [9, 0], [9, 9], [-9, 9]]} fill="#16a34a22" stroke="#16a34a" />,
    isSub: false,
    why: "Fechado para a soma, mas (−1)·(0,1) = (0,−1) ∉ W.",
  },
  zero: {
    label: "Só o vetor nulo",
    tex: "W = \\{\\vec 0\\}",
    test: (p) => Math.abs(p[0]) < 1e-9 && Math.abs(p[1]) < 1e-9,
    draw: <Dot p={[0, 0]} color="#16a34a" r={6} />,
    isSub: true,
    why: "0 + 0 = 0 e α·0 = 0: é o subespaço trivial.",
  },
};

/** Subespaço? Testar 0 ∈ W, fecho para a soma e para a multiplicação por escalar. */
export function SubspaceLab() {
  const [id, setId] = useState<SetId>("eixos");
  const [u, setU] = useState<V2>([1, 0]);
  const [v, setV] = useState<V2>([0, 1]);
  const [alpha, setAlpha] = useState(-1);
  const S = SETS[id];
  const uv = add(u, v);
  const au = scale(alpha, u);
  const ok = (p: V2) => (S.test(p) ? "✔" : "✘");
  return (
    <Lab title="É subespaço?" hint="Escolhe um conjunto e arrasta u e v. Procura um contra-exemplo: u, v ∈ W mas u + v ∉ W, ou αu ∉ W.">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(Object.keys(SETS) as SetId[]).map((k) => (
          <button key={k} onClick={() => setId(k)} className={`rounded-full border px-2.5 py-1 text-xs ${k === id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"}`}>
            {SETS[k].label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={3}>
          {S.draw}
          <Arrow to={uv} color={COLORS.w} label="u+v" />
          <Arrow to={au} color={COLORS.y} label="αu" />
          <Arrow to={u} color={COLORS.u} />
          <Arrow to={v} color={COLORS.v} />
          <Handle p={u} onChange={setU} color={COLORS.u} label="u" />
          <Handle p={v} onChange={setV} color={COLORS.v} label="v" />
        </Plane>
        <div className="space-y-3">
          <div><M>{S.tex}</M></div>
          <Slider label={<M>{"\\alpha"}</M>} value={alpha} min={-3} max={3} step={0.5} onChange={setAlpha} />
          <Readout>
            <div>{ok([0, 0])} <M>{"\\vec 0 \\in W"}</M></div>
            <div>{ok(u)} <M>{`u = ${texV2(u, 1)} \\in W`}</M> &nbsp; {ok(v)} <M>{`v = ${texV2(v, 1)} \\in W`}</M></div>
            <div>{ok(uv)} <M>{`u+v = ${texV2(uv, 1)} \\in W`}</M></div>
            <div>{ok(au)} <M>{`\\alpha u = ${texV2(au, 1)} \\in W`}</M></div>
            {S.test(u) && S.test(v) && (!S.test(uv) || !S.test(au)) && <div className="font-bold text-red-700">Encontraste um contra-exemplo! W não é subespaço.</div>}
          </Readout>
          <div className={`rounded-lg p-3 text-sm ${S.isSub ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
            <b>{S.isSub ? "É subespaço." : "Não é subespaço."}</b> {S.why}
          </div>
        </div>
      </div>
    </Lab>
  );
}

/** Combinações lineares, expansão linear e (in)dependência em R². */
export function SpanLab() {
  const [v1, setV1] = useState<V2>([2, 1]);
  const [v2, setV2] = useState<V2>([-1, 1]);
  const [c1, setC1] = useState(1);
  const [c2, setC2] = useState(1);
  const w = add(scale(c1, v1), scale(c2, v2));
  const d = cross(v1, v2);
  const indep = Math.abs(d) > 1e-9;
  const zero1 = Math.hypot(...v1) < 1e-9;
  return (
    <Lab title="Combinações lineares e independência" hint="Mexe c₁ e c₂ para chegar a qualquer ponto. Se v₁ e v₂ ficarem colineares (arrasta um para cima da reta do outro), só consegues chegar aos pontos dessa reta.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={5}>
          {!indep && !zero1 && <Line d={v1} color="#f59e0b" width={4} />}
          <Arrow to={scale(c1, v1)} color={COLORS.u} width={1.5} dashed />
          <Arrow from={scale(c1, v1)} to={w} color={COLORS.v} width={1.5} dashed />
          <Arrow to={w} color={COLORS.x} label="w" width={3} />
          <Arrow to={v1} color={COLORS.u} />
          <Arrow to={v2} color={COLORS.v} />
          <Handle p={v1} onChange={setV1} color={COLORS.u} label="v₁" />
          <Handle p={v2} onChange={setV2} color={COLORS.v} label="v₂" />
        </Plane>
        <div className="space-y-3">
          <Slider label={<M>{"c_1"}</M>} value={c1} min={-3} max={3} step={0.25} onChange={setC1} />
          <Slider label={<M>{"c_2"}</M>} value={c2} min={-3} max={3} step={0.25} onChange={setC2} />
          <Presets
            items={[
              { label: "Base canónica", value: [[1, 0], [0, 1]] as [V2, V2] },
              { label: "Colineares", value: [[1, 2], [-0.5, -1]] as [V2, V2] },
              { label: "Base inclinada", value: [[2, 1], [-1, 1]] as [V2, V2] },
            ]}
            onPick={([a, b]) => { setV1(a); setV2(b); }}
          />
          <Readout>
            <div><M>{`w = ${n(c1)}${texV2(v1, 1)} + ${n(c2)}${texV2(v2, 1)} = ${texV2(w)}`}</M></div>
            <div><M>{`\\det[v_1\\ v_2] = ${n(d)}`}</M></div>
            {indep ? (
              <div className="text-emerald-800">
                <b>Linearmente independentes.</b> <M>{"\\mathcal{L}\\{v_1, v_2\\} = \\mathbb{R}^2"}</M>: são uma <b>base</b> de <M>{"\\mathbb{R}^2"}</M>, e cada w tem coordenadas únicas <M>{`(w)_B = (${n(c1)}, ${n(c2)})`}</M>.
              </div>
            ) : (
              <div className="text-amber-800">
                <b>Linearmente dependentes</b> (um é múltiplo do outro). A expansão linear é só {zero1 && Math.hypot(...v2) < 1e-9 ? <M>{"\\{\\vec 0\\}"}</M> : "uma reta"} — dimensão {zero1 && Math.hypot(...v2) < 1e-9 ? 0 : 1}.
              </div>
            )}
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Ax = b em R²: solução geral = solução particular + N(A). */
export function SolutionSpaceLab() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [c, setC] = useState(2);
  const [t, setT] = useState(0);
  const nrm = Math.hypot(a, b);
  const dir: V2 = [-b, a]; // direção do núcleo
  const xp: V2 = nrm > 1e-9 ? [(a * c) / (nrm * nrm), (b * c) / (nrm * nrm)] : [0, 0]; // solução particular (a mais curta)
  const x = add(xp, scale(t, unit(dir)));
  return (
    <Lab title="Espaço de soluções de ax + by = c" hint="N(A) é a reta pela origem (c = 0). Mudar c desloca a reta de soluções paralelamente: x = xₚ + t·(vetor de N(A)). Mexe t para percorrer todas as soluções.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          {nrm > 1e-9 && (
            <>
              <Line d={dir} color="#dc2626" width={2} dashed />
              <Line p={xp} d={dir} color="#2563eb" width={3} />
              <Arrow to={xp} color={COLORS.w} label="xₚ" />
              <Arrow from={xp} to={x} color={COLORS.y} />
              <Dot p={x} color={COLORS.x} r={5} label="x" />
            </>
          )}
        </Plane>
        <div className="space-y-3">
          <Slider label={<M>a</M>} value={a} min={-3} max={3} step={0.5} onChange={setA} />
          <Slider label={<M>b</M>} value={b} min={-3} max={3} step={0.5} onChange={setB} />
          <Slider label={<M>c</M>} value={c} min={-4} max={4} step={0.5} onChange={setC} />
          <Slider label={<M>t</M>} value={t} min={-4} max={4} step={0.1} onChange={setT} display={fmt(t, 1)} />
          <Readout>
            {nrm < 1e-9 ? (
              <div>{Math.abs(c) < 1e-9 ? "0x + 0y = 0: todo o plano é solução." : <b className="text-red-700">0 = {c}: sistema impossível.</b>}</div>
            ) : (
              <>
                <div><span className="font-semibold text-red-700">N(A)</span> <M>{`= \\{(x,y): ${poly([[a, "x"], [b, "y"]])} = 0\\} = \\mathcal{L}\\{${texV2(niceDir(dir))}\\}`}</M></div>
                <div><span className="font-semibold text-blue-700">Soluções</span> <M>{`= ${texV2(xp)} + N(A)`}</M></div>
                <div><M>{`x = ${texV2(x)}`}</M>, e de facto <M>{`${n(a)}\\cdot${n(x[0])} + ${n(b)}\\cdot${n(x[1])} = ${n(a * x[0] + b * x[1])}`}</M></div>
                <div className="text-slate-600">{Math.abs(c) < 1e-9 ? "c = 0: sistema homogéneo — as soluções formam um subespaço." : "c ≠ 0: as soluções não formam subespaço (não contêm 0), mas são um 'subespaço deslocado'."}</div>
              </>
            )}
          </Readout>
        </div>
      </div>
    </Lab>
  );
}
const unit = (v: V2): V2 => { const k = Math.hypot(...v); return k < 1e-12 ? [0, 0] : [v[0] / k, v[1] / k]; };
