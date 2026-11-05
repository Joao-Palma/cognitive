"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function TopicWeightEditor({ id, weight, difficulty }: { id: string; weight: number; difficulty: number }) {
  const router = useRouter();
  const [w, setW] = useState(weight);
  const [d, setD] = useState(difficulty);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const dirty = w !== weight || d !== difficulty;
  return (
    <div className="flex items-center gap-1">
      <input aria-label="Peso" type="number" min={0} max={10} step={0.5} className="input w-16 px-2 py-1" value={w} onChange={(e) => setW(Number(e.target.value))} />
      <select aria-label="Dificuldade" className="input w-20 px-2 py-1" value={d} onChange={(e) => setD(Number(e.target.value))}>
        <option value={1}>Fácil</option>
        <option value={2}>Média</option>
        <option value={3}>Difícil</option>
      </select>
      <button
        className="btn-ghost px-2 py-1"
        disabled={!dirty || state === "saving"}
        onClick={async () => {
          setState("saving");
          const res = await fetch(`/api/topics/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ weight: w, difficulty: d }) });
          setState(res.ok ? "idle" : "error");
          router.refresh();
        }}
      >
        {state === "saving" ? "…" : state === "error" ? "Erro" : "Guardar"}
      </button>
    </div>
  );
}
