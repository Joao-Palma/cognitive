import { redirect } from "next/navigation";
import { getUserId, emailOnlyLogin } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  if (await getUserId()) redirect("/plan");
  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="mb-1 text-2xl font-bold">Entrar</h1>
      <p className="mb-6 text-sm text-slate-600">Escreve o teu email para entrar. Se ainda não tens conta, é criada logo.</p>
      <LoginForm
        emailOnly={emailOnlyLogin}
        google={!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
        magicLink={!!process.env.EMAIL_SERVER}
      />
    </div>
  );
}
