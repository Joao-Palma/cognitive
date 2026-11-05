"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function TaskCheckbox({ id, done }: { id: string; done: boolean }) {
  const [checked, setChecked] = useState(done);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <input
      type="checkbox"
      className="h-4 w-4 cursor-pointer accent-slate-900"
      checked={checked}
      disabled={busy}
      aria-label="Marcar como feita"
      onChange={async (e) => {
        const next = e.target.checked;
        setChecked(next);
        setBusy(true);
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: next }),
        });
        if (!res.ok) setChecked(!next);
        setBusy(false);
        router.refresh();
      }}
    />
  );
}
