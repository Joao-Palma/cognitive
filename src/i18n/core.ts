/** Internacionalização mínima: pt (por omissão) e en. Os textos escrevem-se aos pares: t("pt", "en"). */
export type Lang = "pt" | "en";
export const LANGS: Lang[] = ["pt", "en"];
export const LANG_COOKIE = "lang";

export type T = (pt: string, en: string) => string;
export const makeT = (lang: Lang): T => (pt, en) => (lang === "en" ? en : pt);

export const parseLang = (v: string | undefined | null): Lang | null => (v === "pt" || v === "en" ? v : null);

/** Escolhe pela preferência do browser: português → pt, qualquer outra → en. */
export function langFromAcceptLanguage(header: string | null): Lang {
  if (!header) return "pt";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("pt") ? "pt" : "en";
}

export const dateLocale = (lang: Lang) => (lang === "en" ? "en-GB" : "pt-PT");

/** Nome/título na língua pedida, com recurso ao português. */
export const courseName = (c: { name: string; nameEn?: string | null }, lang: Lang) => (lang === "en" && c.nameEn ? c.nameEn : c.name);
export const topicTitle = (tp: { title: string; titleEn?: string | null }, lang: Lang) => (lang === "en" && tp.titleEn ? tp.titleEn : tp.title);
