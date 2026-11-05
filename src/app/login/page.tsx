import { redirect } from "next/navigation";
import { getUserId, emailOnlyLogin } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { getT } from "@/i18n/server";

export default async function LoginPage() {
  if (await getUserId()) redirect("/plan");
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="mb-1 text-2xl font-bold">{t("Entrar", "Sign in")}</h1>
      <p className="mb-6 text-sm text-slate-600">{t("Escreve o teu email para entrar. Se ainda não tens conta, é criada logo.", "Enter your email to sign in. If you don't have an account yet, one is created right away.")}</p>
      <LoginForm
        emailOnly={emailOnlyLogin}
        google={!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
        magicLink={!!process.env.EMAIL_SERVER}
      />
    </div>
  );
}
