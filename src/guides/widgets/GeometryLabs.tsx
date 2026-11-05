"use client";
import { useMemo, useState } from "react";
import { M2, V2, add, sub, scale, dot, norm, unit, mulMV, mulMM, transpose, det2, symEigen, svd2, rot, fmt } from "../math/linalg2";
import { Plane, Arrow, Handle, Line, Seg, Path, Dot, COLORS } from "../ui/Plane";
import { M } from "../ui/Tex";
import { Lab, Presets, Slider } from "../ui/blocks";
import { MatrixSliders, Readout, TransformedGrid, texM2, texV2, n, poly } from "./common";

const circle = (r = 1, N = 96): V2[] => Array.from({ length: N + 1 }, (_, i) => [r * Math.cos((2 * Math.PI * i) / N), r * Math.sin((2 * Math.PI * i) / N)] as V2);

/** Produto interno, norma, ângulo e projeção ortogonal. */
export function InnerProductLab() {
  const [u, setU] = useState<V2>([3, 1]);
  const [v, setV] = useState<V2>([1, 2]);
  const uv = dot(u, v);
  const nu = norm(u), nv = norm(v);
  const cos = nu && nv ? uv / (nu * nv) : 0;
  const ang = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  const proj = nu > 1e-9 ? scale(uv / (nu * nu), u) : ([0, 0] as V2);
  return (
    <Lab title="Produto interno e projeção" hint="Arrasta u e v. A projeção de v sobre u (verde) é a 'sombra' de v na direção de u; o resto (laranja) é ortogonal a u.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          <Line d={u} color="#e2e8f0" />
          <Seg a={v} b={proj} color={COLORS.y} width={2} dashed />
          <Arrow to={proj} color={COLORS.w} label="proj" width={3} />
          <Arrow to={u} color={COLORS.u} />
          <Arrow to={v} color={COLORS.v} />
          <Handle p={u} onChange={setU} color={COLORS.u} label="u" snap={0.25} />
          <Handle p={v} onChange={setV} color={COLORS.v} label="v" snap={0.25} />
        </Plane>
        <div className="space-y-3">
          <Presets items={[{ label: "Ortogonais", value: [[2, 1], [-1, 2]] as [V2, V2] }, { label: "Colineares", value: [[2, 1], [-2, -1]] as [V2, V2] }, { label: "Agudo", value: [[3, 1], [1, 2]] as [V2, V2] }]} onPick={([a, b]) => { setU(a); setV(b); }} />
          <Readout>
            <div><M>{`\\langle u, v\\rangle = ${n(u[0])}\\cdot${n(v[0])} + ${n(u[1])}\\cdot${n(v[1])} = ${n(uv)}`}</M></div>
            <div><M>{`\\|u\\| = ${n(nu)},\\ \\|v\\| = ${n(nv)}`}</M></div>
            <div><M>{`\\cos\\theta = \\frac{\\langle u,v\\rangle}{\\|u\\|\\|v\\|} = ${n(cos, 3)} \\Rightarrow \\theta \\approx ${n(ang, 1)}^\\circ`}</M></div>
            <div><M>{`\\operatorname{proj}_u v = \\frac{\\langle v,u\\rangle}{\\|u\\|^2}u = ${texV2(proj)}`}</M></div>
            <div><M>{`|\\langle u,v\\rangle| = ${n(Math.abs(uv))} \\le \\|u\\|\\|v\\| = ${n(nu * nv)}`}</M> (Cauchy-Schwarz){Math.abs(Math.abs(uv) - nu * nv) < 1e-6 && " — igualdade: são colineares"}</div>
            {Math.abs(uv) < 1e-9 && <b className="text-green-700">⟨u, v⟩ = 0: u ⊥ v</b>}
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Gram-Schmidt em R², passo a passo. */
export function GramSchmidtLab() {
  const [v1, setV1] = useState<V2>([3, 1]);
  const [v2, setV2] = useState<V2>([1, 2]);
  const [step, setStep] = useState(3);
  const w1 = v1;
  const p = norm(w1) > 1e-9 ? scale(dot(v2, w1) / dot(w1, w1), w1) : ([0, 0] as V2);
  const w2 = sub(v2, p);
  const q1 = unit(w1), q2 = unit(w2);
  return (
    <Lab title="Ortogonalização de Gram-Schmidt" hint="Avança passo a passo: w₁ = v₁; w₂ = v₂ − proj_{w₁} v₂; depois normaliza-se. A expansão linear nunca muda: 𝓛{w₁, w₂} = 𝓛{v₁, v₂}.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          <Arrow to={v1} color={step >= 1 ? "#cbd5e1" : COLORS.u} width={1.5} />
          <Arrow to={v2} color={COLORS.v} width={step >= 2 ? 1.5 : 2.5} label={step < 2 ? "v₂" : undefined} />
          {step >= 1 && <Arrow to={w1} color={COLORS.u} label={step >= 3 ? undefined : "w₁"} />}
          {step >= 2 && (
            <>
              <Arrow to={p} color={COLORS.w} label="proj" width={1.5} dashed />
              <Seg a={p} b={v2} color={COLORS.y} dashed />
              <Arrow to={w2} color={COLORS.y} label={step >= 3 ? undefined : "w₂"} />
            </>
          )}
          {step >= 3 && (
            <>
              <Path pts={circle(1)} stroke="#e2e8f0" />
              <Arrow to={q1} color={COLORS.x} label="q₁" width={3} />
              <Arrow to={q2} color={COLORS.x} label="q₂" width={3} />
            </>
          )}
          <Handle p={v1} onChange={setV1} color={COLORS.u} label="v₁" snap={0.25} />
          <Handle p={v2} onChange={setV2} color={COLORS.v} snap={0.25} />
        </Plane>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {["Vetores", "1. w₁ = v₁", "2. w₂ = v₂ − proj", "3. Normalizar"].map((l, i) => (
              <button key={l} onClick={() => setStep(i)} className={`rounded-full border px-2.5 py-1 text-xs ${step === i ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"}`}>{l}</button>
            ))}
          </div>
          <Readout>
            <div><M>{`w_1 = v_1 = ${texV2(w1)}`}</M></div>
            {step >= 2 && (
              <>
                <div><M>{`w_2 = v_2 - \\frac{\\langle v_2, w_1\\rangle}{\\langle w_1, w_1\\rangle}w_1 = ${texV2(v2)} - \\frac{${n(dot(v2, w1))}}{${n(dot(w1, w1))}}${texV2(w1)} = ${texV2(w2)}`}</M></div>
                <div>Verificação: <M>{`\\langle w_1, w_2\\rangle = ${n(dot(w1, w2), 6)}`}</M> ✔</div>
              </>
            )}
            {step >= 3 && <div><M>{`q_1 = \\frac{w_1}{\\|w_1\\|} = ${texV2(q1, 3)},\\quad q_2 = \\frac{w_2}{\\|w_2\\|} = ${texV2(q2, 3)}`}</M></div>}
            {norm(w2) < 1e-9 && <b className="text-red-700">w₂ = 0: v₁ e v₂ são linearmente dependentes.</b>}
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Mínimos quadrados: reta y = α + βx que minimiza a soma dos quadrados dos resíduos. */
export function LeastSquaresLab() {
  const [pts, setPts] = useState<V2[]>([[-3, -1.5], [-1, -1], [0, 0.5], [1, 1], [2.5, 1.5], [3.5, 3]]);
  const [manual, setManual] = useState(false);
  const [ma, setMa] = useState(0);
  const [mb, setMb] = useState(0.5);
  const fit = useMemo(() => {
    const N = pts.length;
    const sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
    const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
    const D = N * sxx - sx * sx;
    if (Math.abs(D) < 1e-12) return null;
    return { a: (sxx * sy - sx * sxy) / D, b: (N * sxy - sx * sy) / D, N, sx, sy, sxx, sxy };
  }, [pts]);
  const a = manual || !fit ? ma : fit.a;
  const b = manual || !fit ? mb : fit.b;
  const err = pts.reduce((s, p) => s + (p[1] - (a + b * p[0])) ** 2, 0);
  const best = fit ? pts.reduce((s, p) => s + (p[1] - (fit.a + fit.b * p[0])) ** 2, 0) : NaN;
  return (
    <Lab title="Método dos mínimos quadrados" hint="Arrasta os pontos. A reta a roxo minimiza ‖b − Ax‖². Ativa 'ajustar à mão' e tenta bater o erro mínimo — não vais conseguir.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          {pts.map((p, i) => <Seg key={`r${i}`} a={p} b={[p[0], a + b * p[0]]} color="#f97316" width={2} />)}
          <Line p={[0, a]} d={[1, b]} color={COLORS.x} width={3} />
          {pts.map((p, i) => <Handle key={i} p={p} onChange={(q) => setPts(pts.map((x, j) => (j === i ? q : x)))} color="#0f172a" snap={0.25} />)}
        </Plane>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={manual} onChange={(e) => { setManual(e.target.checked); if (fit) { setMa(Math.round(fit.a * 10) / 10); setMb(Math.round(fit.b * 10) / 10); } }} /> Ajustar a reta à mão</label>
          {manual && (
            <>
              <Slider label={<M>{"\\alpha"}</M>} value={ma} min={-3} max={3} step={0.05} onChange={setMa} display={fmt(ma)} />
              <Slider label={<M>{"\\beta"}</M>} value={mb} min={-2} max={2} step={0.01} onChange={setMb} display={fmt(mb)} />
            </>
          )}
          <Readout>
            <div>Sistema impossível <M>{"A\\begin{bmatrix}\\alpha\\\\\\beta\\end{bmatrix} = b"}</M>, com linhas <M>{"[1\\ \\ x_i]"}</M> e <M>{"b_i = y_i"}</M>.</div>
            {fit && <div>Equações normais <M>{`A^TA\\hat x = A^Tb:\\ \\begin{bmatrix} ${fit.N} & ${n(fit.sx)} \\\\ ${n(fit.sx)} & ${n(fit.sxx)} \\end{bmatrix}\\begin{bmatrix}\\alpha\\\\\\beta\\end{bmatrix} = \\begin{bmatrix} ${n(fit.sy)} \\\\ ${n(fit.sxy)} \\end{bmatrix}`}</M></div>}
            <div><M>{`y = ${n(a)} + ${n(b)}x`}</M></div>
            <div>Erro <M>{`\\|b - A\\hat x\\|^2 = \\sum (y_i - \\alpha - \\beta x_i)^2 = ${n(err, 3)}`}</M>{manual && fit && <> (mínimo possível: {fmt(best, 3)})</>}</div>
          </Readout>
          <div className="flex gap-2">
            <button className="btn-ghost py-1" onClick={() => setPts([...pts, [Math.round((Math.random() * 6 - 3) * 4) / 4, Math.round((Math.random() * 6 - 3) * 4) / 4]])}>+ ponto</button>
            <button className="btn-ghost py-1" disabled={pts.length <= 2} onClick={() => setPts(pts.slice(0, -1))}>− ponto</button>
          </div>
        </div>
      </div>
    </Lab>
  );
}

/** Teorema espetral: matriz simétrica = rotação · esticar nos eixos próprios · rotação de volta. */
export function SpectralLab() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const A: M2 = [[a, b], [b, c]];
  const { values, Q } = symEigen(a, b, c);
  const q1: V2 = [Q[0][0], Q[1][0]], q2: V2 = [Q[0][1], Q[1][1]];
  const ellipse = circle(1).map((p) => mulMV(A, p));
  return (
    <Lab title="Teorema espetral" hint="Para A simétrica, os vetores próprios são ortogonais. O círculo unitário é transformado numa elipse cujos eixos são os vetores próprios, esticados por |λ|.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={4}>
          <Path pts={circle(1)} stroke="#cbd5e1" />
          <Path pts={ellipse} stroke={COLORS.x} width={2.5} />
          <Line d={q1} color="#10b981" dashed />
          <Line d={q2} color="#f59e0b" dashed />
          <Arrow to={scale(values[0], q1)} color="#10b981" label="λ₁q₁" />
          <Arrow to={scale(values[1], q2)} color="#f59e0b" label="λ₂q₂" />
        </Plane>
        <div className="space-y-3">
          <Slider label={<M>a</M>} value={a} min={-3} max={3} step={0.1} onChange={setA} display={fmt(a, 1)} />
          <Slider label={<M>{"b"}</M>} value={b} min={-3} max={3} step={0.1} onChange={setB} display={fmt(b, 1)} />
          <Slider label={<M>c</M>} value={c} min={-3} max={3} step={0.1} onChange={setC} display={fmt(c, 1)} />
          <Readout>
            <div><M>{`A = \\begin{bmatrix} a & b \\\\ b & c\\end{bmatrix} = ${texM2(A, 1)} = A^T`}</M></div>
            <div><M>{`\\lambda_1 = ${n(values[0])},\\ \\lambda_2 = ${n(values[1])}`}</M> — sempre reais</div>
            <div><M>{`A = QDQ^T,\\ Q = ${texM2(Q)},\\ D = ${texM2([[values[0], 0], [0, values[1]]] as M2)}`}</M></div>
            <div><M>{`\\langle q_1, q_2\\rangle = ${n(dot(q1, q2), 6)}`}</M> e <M>{`Q^TQ = I`}</M> (Q ortogonal)</div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Transformações ortogonais: rotações e reflexões preservam comprimentos e ângulos. */
export function OrthogonalLab() {
  const [theta, setTheta] = useState(30);
  const [reflect, setReflect] = useState(false);
  const [u, setU] = useState<V2>([2, 1]);
  const [v, setV] = useState<V2>([0.5, 2]);
  const t = (theta * Math.PI) / 180;
  const Qm: M2 = reflect ? [[Math.cos(2 * t), Math.sin(2 * t)], [Math.sin(2 * t), -Math.cos(2 * t)]] : rot(t);
  const Qu = mulMV(Qm, u), Qv = mulMV(Qm, v);
  const QtQ = mulMM(transpose(Qm), Qm);
  return (
    <Lab title="Transformações ortogonais" hint="Rotação de ângulo θ ou reflexão na reta de ângulo θ. Repara: ‖Qu‖ = ‖u‖ e ⟨Qu, Qv⟩ = ⟨u, v⟩ — a forma não se deforma.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={3}>
          {reflect && <Line d={[Math.cos(t), Math.sin(t)]} color="#f59e0b" dashed width={2} />}
          <Arrow to={u} color="#93c5fd" />
          <Arrow to={v} color="#fca5a5" />
          <Arrow to={Qu} color={COLORS.u} label="Qu" width={3} />
          <Arrow to={Qv} color={COLORS.v} label="Qv" width={3} />
          <Handle p={u} onChange={setU} color="#93c5fd" label="u" snap={0.25} />
          <Handle p={v} onChange={setV} color="#fca5a5" label="v" snap={0.25} />
        </Plane>
        <div className="space-y-3">
          <Slider label={<M>{"\\theta"}</M>} value={theta} min={-180} max={180} step={1} onChange={setTheta} display={`${theta}°`} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={reflect} onChange={(e) => setReflect(e.target.checked)} /> Reflexão (em vez de rotação)</label>
          <Readout>
            <div><M>{`Q = ${texM2(Qm, 3)}`}</M></div>
            <div><M>{`Q^TQ = ${texM2(QtQ, 3)} = I`}</M> ✔ &nbsp; <M>{`\\det Q = ${n(det2(Qm), 3)}`}</M> ({reflect ? "reflexão" : "rotação"})</div>
            <div><M>{`\\|u\\| = ${n(norm(u))},\\ \\|Qu\\| = ${n(norm(Qu))}`}</M></div>
            <div><M>{`\\langle u,v\\rangle = ${n(dot(u, v))},\\ \\langle Qu,Qv\\rangle = ${n(dot(Qu, Qv))}`}</M></div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** SVD: A = U Σ Vᵀ = rodar · esticar · rodar. */
export function SVDLab() {
  const [A, setA] = useState<M2>([[3, 0], [4, 5]]);
  const [stage, setStage] = useState(3);
  const { U, S, V } = svd2(A);
  const Vt = transpose(V);
  const Sig: M2 = [[S[0], 0], [0, S[1]]];
  const T: M2 = stage === 0 ? [[1, 0], [0, 1]] : stage === 1 ? Vt : stage === 2 ? mulMM(Sig, Vt) : mulMM(U, mulMM(Sig, Vt));
  const shape = circle(1).map((p) => mulMV(T, p));
  const v1: V2 = [V[0][0], V[1][0]], v2: V2 = [V[0][1], V[1][1]];
  const scaleR = Math.max(4, Math.ceil(S[0] + 0.5));
  return (
    <Lab title="Decomposição em valores singulares" hint="Qualquer matriz leva o círculo unitário numa elipse. Vê a decomposição por etapas: Vᵀ roda, Σ estica ao longo dos eixos, U volta a rodar.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={scaleR}>
          <TransformedGrid A={T} color="#e0e7ff" range={scaleR} />
          <Path pts={circle(1)} stroke="#cbd5e1" />
          <Path pts={shape} stroke={COLORS.x} width={2.5} />
          <Arrow to={mulMV(T, v1)} color="#10b981" label={stage === 3 ? "σ₁u₁" : undefined} />
          <Arrow to={mulMV(T, v2)} color="#f59e0b" label={stage === 3 ? "σ₂u₂" : undefined} />
        </Plane>
        <div className="space-y-3">
          <MatrixSliders A={A} onChange={setA} step={0.5} min={-5} max={5} />
          <div className="flex flex-wrap gap-1.5">
            {["Círculo", "Vᵀ (rodar)", "ΣVᵀ (esticar)", "UΣVᵀ = A"].map((l, i) => (
              <button key={l} onClick={() => setStage(i)} className={`rounded-full border px-2.5 py-1 text-xs ${stage === i ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"}`}>{l}</button>
            ))}
          </div>
          <Readout>
            <div><M>{`A = ${texM2(A, 1)} = U\\Sigma V^T`}</M></div>
            <div><M>{`\\sigma_1 = ${n(S[0], 3)},\\ \\sigma_2 = ${n(S[1], 3)}`}</M> — raízes dos valores próprios de <M>{"A^TA"}</M> (semieixos da elipse)</div>
            <div><M>{`V = ${texM2(V, 3)},\\ U = ${texM2(U, 3)}`}</M></div>
            <div className="text-slate-600"><M>{`|\\det A| = ${n(Math.abs(det2(A)), 3)} = \\sigma_1\\sigma_2 = ${n(S[0] * S[1], 3)}`}</M>; car(A) = nº de σ não nulos = {S.filter((s) => s > 1e-9).length}</div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}

/** Formas quadráticas Q(x,y) = ax² + 2bxy + cy²: curvas de nível e classificação. */
export function QuadraticFormLab() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const { values, Q } = symEigen(a, b, c);
  const [l1, l2] = values;
  const cls =
    l1 > 1e-9 && l2 > 1e-9 ? "definida positiva" : l1 < -1e-9 && l2 < -1e-9 ? "definida negativa" : l1 > 1e-9 && l2 < -1e-9 ? "indefinida" : l1 >= -1e-9 && l2 >= -1e-9 ? "semidefinida positiva" : "semidefinida negativa";
  // heatmap por amostragem
  const N = 40, R = 3;
  const cells = [];
  let maxAbs = 1e-9;
  const vals: number[][] = [];
  for (let i = 0; i < N; i++) {
    vals.push([]);
    for (let j = 0; j < N; j++) {
      const x = -R + ((j + 0.5) * 2 * R) / N, y = R - ((i + 0.5) * 2 * R) / N;
      const q = a * x * x + 2 * b * x * y + c * y * y;
      vals[i].push(q);
      maxAbs = Math.max(maxAbs, Math.abs(q));
    }
  }
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const t = vals[i][j] / maxAbs;
      const al = Math.round(Math.pow(Math.abs(t), 0.6) * 0.75 * 1000) / 1000;
      const color = t >= 0 ? `rgba(37,99,235,${al})` : `rgba(220,38,38,${al})`;
      cells.push(<rect key={`${i}-${j}`} x={(j * 360) / N} y={(i * 360) / N} width={360 / N + 0.5} height={360 / N + 0.5} fill={color} />);
    }
  // curvas de nível Q = ±1, ±4 (paramétricas nos eixos principais)
  const level = (k: number): V2[][] => {
    const out: V2[][] = [];
    const q1: V2 = [Q[0][0], Q[1][0]], q2: V2 = [Q[0][1], Q[1][1]];
    const toXY = (s: number, t: number): V2 => add(scale(s, q1), scale(t, q2));
    if (l1 * k > 0 && l2 * k > 0) out.push(circle(1, 120).map(([x, y]) => toXY(x * Math.sqrt(k / l1), y * Math.sqrt(k / l2))));
    else if (l1 * k > 0 && l2 * k < 0)
      for (const sgn of [1, -1]) out.push(Array.from({ length: 81 }, (_, i) => { const u = -3 + i * 0.075; return toXY(sgn * Math.sqrt(k / l1) * Math.cosh(u), Math.sqrt(-k / l2) * Math.sinh(u)); }));
    else if (l2 * k > 0 && l1 * k < 0)
      for (const sgn of [1, -1]) out.push(Array.from({ length: 81 }, (_, i) => { const u = -3 + i * 0.075; return toXY(Math.sqrt(-k / l1) * Math.sinh(u), sgn * Math.sqrt(k / l2) * Math.cosh(u)); }));
    return out;
  };
  return (
    <Lab title="Classificação de formas quadráticas" hint="Azul: Q > 0, vermelho: Q < 0. As curvas Q = ±1 e Q = ±4 são elipses (definida) ou hipérboles (indefinida), com eixos nos vetores próprios.">
      <div className="grid gap-4 md:grid-cols-2">
        <Plane range={R}>
          {cells}
          {[1, 4, -1, -4].flatMap((k) => level(k).map((pts, i) => <Path key={`${k}-${i}`} pts={pts} stroke={k > 0 ? "#1e3a8a" : "#7f1d1d"} width={1.5} />))}
          <Line d={[Q[0][0], Q[1][0]]} color="#10b981" dashed />
          <Line d={[Q[0][1], Q[1][1]]} color="#f59e0b" dashed />
          <Dot p={[0, 0]} r={3} />
        </Plane>
        <div className="space-y-3">
          <Slider label={<M>a</M>} value={a} min={-3} max={3} step={0.1} onChange={setA} display={fmt(a, 1)} />
          <Slider label={<M>b</M>} value={b} min={-3} max={3} step={0.1} onChange={setB} display={fmt(b, 1)} />
          <Slider label={<M>c</M>} value={c} min={-3} max={3} step={0.1} onChange={setC} display={fmt(c, 1)} />
          <Presets
            items={[
              { label: "Def. positiva", value: [2, 1, 1] },
              { label: "Def. negativa", value: [-1, 0.5, -2] },
              { label: "Indefinida", value: [1, 0, -1] },
              { label: "Semidefinida", value: [1, 1, 1] },
            ]}
            onPick={([x, y, z]) => { setA(x); setB(y); setC(z); }}
          />
          <Readout>
            <div><M>{`Q(x,y) = ${poly([[a, "x^2"], [2 * b, "xy"], [c, "y^2"]], 1)} = \\begin{bmatrix}x & y\\end{bmatrix}${texM2([[a, b], [b, c]] as M2, 1)}\\begin{bmatrix}x\\\\y\\end{bmatrix}`}</M></div>
            <div><M>{`\\lambda_1 = ${n(l1)},\\ \\lambda_2 = ${n(l2)}`}</M> → <b>{cls}</b></div>
            <div className="text-slate-600">Critério dos menores: <M>{`a = ${n(a, 1)},\\ \\det = ac - b^2 = ${n(a * c - b * b)}`}</M>{a * c - b * b > 1e-9 ? (a > 0 ? " → ambos > 0: definida positiva" : " → a < 0 e det > 0: definida negativa") : a * c - b * b < -1e-9 ? " → det < 0: indefinida" : " → det = 0: semidefinida (ou nula)"}</div>
            <div className="text-slate-600">Nos eixos próprios: <M>{`Q = ${poly([[l1, "s^2"], [l2, "t^2"]])}`}</M> (sem termo cruzado)</div>
          </Readout>
        </div>
      </div>
    </Lab>
  );
}
