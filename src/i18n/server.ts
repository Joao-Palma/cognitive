import { cookies, headers } from "next/headers";
import { LANG_COOKIE, Lang, langFromAcceptLanguage, makeT, parseLang } from "./core";

export async function getLang(): Promise<Lang> {
  const c = parseLang((await cookies()).get(LANG_COOKIE)?.value);
  if (c) return c;
  return langFromAcceptLanguage((await headers()).get("accept-language"));
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: makeT(lang) };
}

/** Para route handlers: língua a partir do pedido. */
export function reqLang(req: Request): Lang {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=(pt|en)`));
  return parseLang(m?.[1]) ?? langFromAcceptLanguage(req.headers.get("accept-language"));
}
