export const PREMIUM_TIER_AMOUNTS = {
  TIER_100K: 100000,
  TIER_400K: 400000,
} as const

export type PremiumTierKey = keyof typeof PREMIUM_TIER_AMOUNTS

export function amountToTier(amount: number): PremiumTierKey | null {
  const entry = Object.entries(PREMIUM_TIER_AMOUNTS).find(([, value]) => value === amount)
  return entry ? (entry[0] as PremiumTierKey) : null
}