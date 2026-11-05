"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, Lang, makeT } from "./core";

const LangCtx = createContext<Lang>("pt");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
export const useT = () => makeT(useContext(LangCtx));

export function LangSwitch() {
  const lang = useLang();
  const router = useRouter();
  const set = (l: Lang) => {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };
  return (
    <div className="flex overflow-hidden rounded-lg border border-slate-300 text-xs font-semibold" role="group" aria-label="Language / Língua">
      {(["pt", "en"] as Lang[]).map((l) => (
        <button key={l} onClick={() => set(l)} aria-pressed={lang === l} className={`px-2 py-1 ${lang === l ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
