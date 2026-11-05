"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PremiumToggle({ isPremium }: { isPremium: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <div className="card mt-4 flex items-center justify-between gap-3">
      <div>
        <div className="font-semibold">{isPremium ? "Premium ✨ ativo" : "Plano grátis"}</div>
        <div className="text-sm text-slate-600">Guias de estudo interativos por tópico. Ainda não há pagamentos: em modo de teste ativa-se aqui.</div>
      </div>
      <button
        className={isPremium ? "btn-ghost" : "btn"}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await fetch("/api/premium", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !isPremium }) });
          setBusy(false);
          router.refresh();
        }}
      >
        {isPremium ? "Desativar" : "Ativar Premium (teste)"}
      </button>
    </div>
  );
}
