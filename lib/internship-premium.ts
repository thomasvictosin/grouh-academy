import { getPlatformSettings } from '@/lib/platform-settings'
 
export type PremiumTierKey = 'TIER_100K' | 'TIER_400K'
 
export async function getPremiumTierAmounts(): Promise<Record<PremiumTierKey, number>> {
  const settings = await getPlatformSettings()
  return {
    TIER_100K: settings.premiumTier1Amount,
    TIER_400K: settings.premiumTier2Amount,
  }
}
 
export async function amountToTier(amount: number): Promise<PremiumTierKey | null> {
  const amounts = await getPremiumTierAmounts()
  const entry = Object.entries(amounts).find(([, value]) => value === amount)
  return entry ? (entry[0] as PremiumTierKey) : null
}