import { NextResponse } from "next/server";
import { getUserId } from "./auth";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Envolve um handler: exige sessão e converte erros em JSON. */
export function withUser<A extends unknown[]>(fn: (userId: string, req: Request, ...rest: A) => Promise<unknown>) {
  return async (req: Request, ...rest: A) => {
    try {
      const userId = await getUserId();
      if (!userId) throw new HttpError(401, "Sessão necessária");
      const data = await fn(userId, req, ...rest);
      return NextResponse.json(data ?? { ok: true });
    } catch (e) {
      if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error(e);
      return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
  };
}

export async function body<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "JSON inválido");
  }
}

export function date(v: unknown, field: string): Date {
  const d = new Date(String(v));
  if (typeof v !== "string" || isNaN(d.getTime())) throw new HttpError(400, `${field} inválido`);
  return d;
}

export function num(v: unknown, field: string, min = -Infinity, max = Infinity): number {
  const n = Number(v);
  if (v === null || v === undefined || v === "" || !Number.isFinite(n) || n < min || n > max)
    throw new HttpError(400, `${field} inválido`);
  return n;
}

export type Ctx = { params: Promise<{ id: string }> };
