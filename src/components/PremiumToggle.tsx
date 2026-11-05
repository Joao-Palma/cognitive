"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/i18n/client";

export function PremiumToggle({ isPremium }: { isPremium: boolean }) {
  const router = useRouter();
  const t = useT();
  const [busy, setBusy] = useState(false);
  return (
    <div className="card mt-4 flex items-center justify-between gap-3">
      <div>
        <div className="font-semibold">{isPremium ? t("Premium ✨ ativo", "Premium ✨ active") : t("Plano grátis", "Free plan")}</div>
        <div className="text-sm text-slate-600">{t("Guias de estudo interativos por tópico. Ainda não há pagamentos: em modo de teste ativa-se aqui.", "Interactive study guides per topic. There are no payments yet: in test mode you can enable it here.")}</div>
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
        {isPremium ? t("Desativar", "Disable") : t("Ativar Premium (teste)", "Enable Premium (test)")}
      </button>
    </div>
  );
}
