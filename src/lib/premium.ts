/** Gate do plano pago. Pagamentos (Stripe) entram na fase 2 e só alteram User.isPremium. */
export function isPremium(user: { isPremium: boolean } | null | undefined): boolean {
  return !!user?.isPremium;
}
