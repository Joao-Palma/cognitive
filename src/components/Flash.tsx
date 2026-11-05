"use client";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/client";

/** Mensagem temporária (p.ex. "Plano ajustado: …"). */
export function Flash({ message }: { message: string | null | undefined }) {
  const t = useT();
  const [shown, setShown] = useState(message);
  useEffect(() => {
    setShown(message);
    if (!message) return;
    const t = setTimeout(() => setShown(null), 8000);
    return () => clearTimeout(t);
  }, [message]);
  if (!shown) return null;
  return (
    <div role="status" className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
      <span>🔄 {shown}</span>
      <button onClick={() => setShown(null)} className="text-blue-700" aria-label={t("Fechar", "Close")}>✕</button>
    </div>
  );
}
