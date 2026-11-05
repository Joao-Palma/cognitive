"use client";
/**
 * Plano cartesiano em SVG com grelha, eixos, vetores e pontos arrastáveis.
 * Coordenadas do mundo: [-range, range] em ambos os eixos (y para cima).
 */
import { createContext, useContext, useRef, useState } from "react";
import type { V2 } from "../math/linalg2";

interface Ctx {
  toPx: (p: V2) => [number, number];
  toWorld: (px: number, py: number) => V2;
  range: number;
  size: number;
}
const PlaneCtx = createContext<Ctx | null>(null);
const usePlane = () => useContext(PlaneCtx)!;

const r2 = (x: number) => Math.round(x * 100) / 100;

export const COLORS = { u: "#2563eb", v: "#dc2626", w: "#16a34a", x: "#9333ea", y: "#d97706", muted: "#94a3b8" };

export function Plane({ range = 5, size = 360, grid = true, children }: { range?: number; size?: number; grid?: boolean; children?: React.ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  const s = size / (2 * range);
  // arredondar evita diferenças servidor/cliente nas últimas casas de Math.cos/sin (hydration)
  const toPx = (p: V2): [number, number] => [r2(size / 2 + p[0] * s), r2(size / 2 - p[1] * s)];
  const toWorld = (px: number, py: number): V2 => [(px - size / 2) / s, (size / 2 - py) / s];
  const ticks = [];
  for (let i = -Math.floor(range); i <= Math.floor(range); i++) ticks.push(i);
  return (
    <PlaneCtx.Provider value={{ toPx, toWorld, range, size }}>
      <svg ref={ref} viewBox={`0 0 ${size} ${size}`} className="h-auto w-full max-w-[420px] touch-none select-none rounded-lg border border-slate-200 bg-white" data-plane>
        <defs>
          {Object.entries(COLORS).map(([k, c]) => (
            <marker key={k} id={`arrow-${c.slice(1)}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        {grid &&
          ticks.map((t) => (
            <g key={t}>
              <line x1={toPx([t, -range])[0]} y1={0} x2={toPx([t, range])[0]} y2={size} stroke="#f1f5f9" />
              <line x1={0} y1={toPx([0, t])[1]} x2={size} y2={toPx([0, t])[1]} stroke="#f1f5f9" />
            </g>
          ))}
        <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke="#cbd5e1" />
        <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke="#cbd5e1" />
        {children}
      </svg>
    </PlaneCtx.Provider>
  );
}

export function Arrow({ from = [0, 0], to, color = COLORS.u, label, width = 2.5, dashed }: { from?: V2; to: V2; color?: string; label?: string; width?: number; dashed?: boolean }) {
  const { toPx } = usePlane();
  const [x1, y1] = toPx(from);
  const [x2, y2] = toPx(to);
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <g>
      {len > 2 && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} markerEnd={`url(#arrow-${color.slice(1)})`} />
      )}
      {label && (
        <text x={x2 + 6} y={y2 - 6} fontSize="13" fontWeight="700" fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

export function Seg({ a, b, color = COLORS.muted, width = 1.5, dashed }: { a: V2; b: V2; color?: string; width?: number; dashed?: boolean }) {
  const { toPx } = usePlane();
  const [x1, y1] = toPx(a);
  const [x2, y2] = toPx(b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "4 4" : undefined} />;
}

/** Reta infinita {p + t·d}. */
export function Line({ p = [0, 0], d, color = COLORS.muted, width = 1.5, dashed }: { p?: V2; d: V2; color?: string; width?: number; dashed?: boolean }) {
  const { range } = usePlane();
  const n = Math.hypot(d[0], d[1]);
  if (n < 1e-9) return null;
  const k = (range * 3) / n;
  return <Seg a={[p[0] - k * d[0], p[1] - k * d[1]]} b={[p[0] + k * d[0], p[1] + k * d[1]]} color={color} width={width} dashed={dashed} />;
}

export function Poly({ pts, fill = "#2563eb22", stroke = "#2563eb", width = 1.5 }: { pts: V2[]; fill?: string; stroke?: string; width?: number }) {
  const { toPx } = usePlane();
  return <polygon points={pts.map((p) => toPx(p).join(",")).join(" ")} fill={fill} stroke={stroke} strokeWidth={width} />;
}

export function Path({ pts, stroke = "#2563eb", width = 2, fill = "none", closed }: { pts: V2[]; stroke?: string; width?: number; fill?: string; closed?: boolean }) {
  const { toPx } = usePlane();
  if (pts.length < 2) return null;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${toPx(p).join(" ")}`).join(" ") + (closed ? " Z" : "");
  return <path d={d} stroke={stroke} strokeWidth={width} fill={fill} />;
}

export function Dot({ p, color = "#0f172a", r = 4, label }: { p: V2; color?: string; r?: number; label?: string }) {
  const { toPx } = usePlane();
  const [x, y] = toPx(p);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} />
      {label && (
        <text x={x + 7} y={y - 7} fontSize="12" fill={color} fontWeight="600">
          {label}
        </text>
      )}
    </g>
  );
}

export function Label({ p, children, color = "#334155", size = 12 }: { p: V2; children: React.ReactNode; color?: string; size?: number }) {
  const { toPx } = usePlane();
  const [x, y] = toPx(p);
  return (
    <text x={x} y={y} fontSize={size} fill={color} fontWeight="600">
      {children}
    </text>
  );
}

/** Ponto arrastável (com rato ou dedo). snap: arredonda a múltiplos de snap. */
export function Handle({ p, onChange, color = COLORS.u, snap = 0.5, label }: { p: V2; onChange: (p: V2) => void; color?: string; snap?: number; label?: string }) {
  const { toPx, toWorld, range } = usePlane();
  const [drag, setDrag] = useState(false);
  const [x, y] = toPx(p);
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    const svg = (e.target as SVGElement).ownerSVGElement ?? (e.currentTarget as SVGElement).ownerSVGElement;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    let [wx, wy] = toWorld(local.x, local.y);
    if (snap) {
      wx = Math.round(wx / snap) * snap;
      wy = Math.round(wy / snap) * snap;
    }
    wx = Math.max(-range, Math.min(range, wx));
    wy = Math.max(-range, Math.min(range, wy));
    if (wx !== p[0] || wy !== p[1]) onChange([wx, wy]);
  };
  return (
    <g
      style={{ cursor: drag ? "grabbing" : "grab" }}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture(e.pointerId);
        setDrag(true);
      }}
      onPointerMove={move}
      onPointerUp={() => setDrag(false)}
    >
      <circle cx={x} cy={y} r={14} fill="transparent" />
      <circle cx={x} cy={y} r={7} fill="white" stroke={color} strokeWidth={3} />
      {label && (
        <text x={x + 10} y={y - 10} fontSize="13" fontWeight="700" fill={color} pointerEvents="none">
          {label}
        </text>
      )}
    </g>
  );
}
