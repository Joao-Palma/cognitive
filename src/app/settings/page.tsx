import { requireUser } from "@/lib/auth";
import { SettingsForm } from "@/components/SettingsForm";
import { PremiumToggle } from "@/components/PremiumToggle";
import { emailOnlyLogin } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">Definições</h1>
      <SettingsForm dailyHours={user.dailyHours} studyWindowStart={user.studyWindowStart} studyWindowEnd={user.studyWindowEnd} />
      {emailOnlyLogin && <PremiumToggle isPremium={user.isPremium} />}
      <p className="mt-4 text-sm text-slate-500">Conta: {user.email} · {user.isPremium ? "Premium ✨" : "Grátis"}</p>
    </div>
  );
}
