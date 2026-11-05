"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useT } from "@/i18n/client";

export function LoginForm({ emailOnly, google, magicLink }: { emailOnly: boolean; google: boolean; magicLink: boolean }) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="card space-y-4">
      {emailOnly && (
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            const res = await signIn("email-only", { email, redirect: false });
            if (res?.ok) window.location.href = "/plan";
            else {
              setBusy(false);
              setError(t("Email inválido.", "Invalid email."));
            }
          }}
        >
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoFocus className="input" placeholder={t("tu@tecnico.ulisboa.pt", "you@tecnico.ulisboa.pt")} value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn w-full" disabled={busy}>{busy ? t("A entrar…", "Signing in…") : t("Entrar", "Sign in")}</button>
        </form>
      )}
      {magicLink && !emailOnly && (
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            await signIn("email", { email, callbackUrl: "/plan" });
          }}
        >
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn w-full" disabled={busy}>{t("Enviar link de entrada", "Send sign-in link")}</button>
        </form>
      )}
      {google && (
        <button className="btn-ghost w-full" onClick={() => signIn("google", { callbackUrl: "/plan" })}>{t("Entrar com Google", "Sign in with Google")}</button>
      )}
    </div>
  );
}
