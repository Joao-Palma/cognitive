import { NextResponse } from "next/server";
import { getUserId } from "./auth";
import { reqLang } from "@/i18n/server";
import type { Lang } from "@/i18n/core";

/** Erro com mensagem em português e inglês. */
export class HttpError extends Error {
  constructor(public status: number, message: string, public messageEn: string = message) {
    super(message);
  }
}

export interface ReqCtx {
  userId: string;
  lang: Lang;
}

/** Envolve um handler: exige sessão, dá a língua do pedido e converte erros em JSON. */
export function withUser<A extends unknown[]>(fn: (ctx: ReqCtx, req: Request, ...rest: A) => Promise<unknown>) {
  return async (req: Request, ...rest: A) => {
    const lang = reqLang(req);
    try {
      const userId = await getUserId();
      if (!userId) throw new HttpError(401, "Sessão necessária", "Sign-in required");
      const data = await fn({ userId, lang }, req, ...rest);
      return NextResponse.json(data ?? { ok: true });
    } catch (e) {
      if (e instanceof HttpError) return NextResponse.json({ error: lang === "en" ? e.messageEn : e.message }, { status: e.status });
      console.error(e);
      return NextResponse.json({ error: lang === "en" ? "Internal error" : "Erro interno" }, { status: 500 });
    }
  };
}

export async function body<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "JSON inválido", "Invalid JSON");
  }
}

/** field = [nome em português, nome em inglês] */
export type Field = [string, string];

export function date(v: unknown, [pt, en]: Field): Date {
  const d = new Date(String(v));
  if (typeof v !== "string" || isNaN(d.getTime())) throw new HttpError(400, `${pt} inválido`, `Invalid ${en}`);
  return d;
}

export function num(v: unknown, [pt, en]: Field, min = -Infinity, max = Infinity): number {
  const n = Number(v);
  if (v === null || v === undefined || v === "" || !Number.isFinite(n) || n < min || n > max)
    throw new HttpError(400, `${pt} inválido`, `Invalid ${en}`);
  return n;
}

export type Ctx = { params: Promise<{ id: string }> };
