import { requireUser } from "@/lib/auth";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">Definições</h1>
      <SettingsForm dailyHours={user.dailyHours} studyWindowStart={user.studyWindowStart} studyWindowEnd={user.studyWindowEnd} />
      <p className="mt-4 text-sm text-slate-500">Conta: {user.email} · {user.isPremium ? "Premium ✨" : "Grátis"}</p>
    </div>
  );
}
