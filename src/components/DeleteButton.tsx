"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ url, confirmText, redirectTo, label = "Apagar" }: { url: string; confirmText: string; redirectTo: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn-danger"
      disabled={busy}
      onClick={async () => {
        if (!confirm(confirmText)) return;
        setBusy(true);
        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        setBusy(false);
        const msg = data.summary?.message;
        router.push(msg ? `${redirectTo}?msg=${encodeURIComponent(msg)}` : redirectTo);
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
