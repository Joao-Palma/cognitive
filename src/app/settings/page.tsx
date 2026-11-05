import { requireUser, emailOnlyLogin } from "@/lib/auth";
import { SettingsForm } from "@/components/SettingsForm";
import { PremiumToggle } from "@/components/PremiumToggle";
import { getT } from "@/i18n/server";

export default async function SettingsPage() {
  const user = await requireUser();
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">{t("Definições", "Settings")}</h1>
      <SettingsForm dailyHours={user.dailyHours} studyWindowStart={user.studyWindowStart} studyWindowEnd={user.studyWindowEnd} />
      {emailOnlyLogin && <PremiumToggle isPremium={user.isPremium} />}
      <p className="mt-4 text-sm text-slate-500">{t("Conta", "Account")}: {user.email} · {user.isPremium ? "Premium ✨" : t("Grátis", "Free")}</p>
    </div>
  );
}
