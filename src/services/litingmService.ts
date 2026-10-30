import { DiamondPackage } from '../types';

export const BASE_LITINGM_PACKAGES: Omit<DiamondPackage, 'priceUsd' | 'priceArs'>[] = [
  {
    id: 'ff-100-10',
    title: '110 Diamantes (100 + 10 Bonus)',
    diamonds: 100,
    bonusDiamonds: 10,
    category: 'diamonds',
    litingmBaseCostUsd: 0.92,
    badge: '+10% Extra',
    badgeColor: 'cyan',
    imageIcon: 'diamond-single',
    imageUrl: '/assets/aistudio/110DIAMANTES_446ca3ec.jpg',
  },
  {
    id: 'ff-310-31',
    title: '341 Diamantes (310 + 31 Bonus)',
    diamonds: 310,
    bonusDiamonds: 31,
    category: 'diamonds',
    litingmBaseCostUsd: 2.75,
    badge: 'Popular',
    badgeColor: 'amber',
    isPopular: true,
    imageIcon: 'diamond-stack',
    imageUrl: '/assets/aistudio/341DIAMANTES_6d77fae8.jpg',
  },
  {
    id: 'ff-520-52',
    title: '572 Diamantes (520 + 52 Bonus)',
    diamonds: 520,
    bonusDiamonds: 52,
    category: 'diamonds',
    litingmBaseCostUsd: 4.55,
    badge: 'Más Vendido 🔥',
    badgeColor: 'rose',
    isPopular: true,
    imageIcon: 'diamond-pouch',
    imageUrl: '/assets/aistudio/572DIAMANTES_27482789.jpg',
  },
  {
    id: 'ff-1060-106',
    title: '1,166 Diamantes (1,060 + 106 Bonus)',
    diamonds: 1060,
    bonusDiamonds: 106,
    category: 'diamonds',
    litingmBaseCostUsd: 9.10,
    badge: 'Súper Ahorro',
    badgeColor: 'purple',
    imageIcon: 'diamond-chest',
    imageUrl: '/assets/aistudio/1166DIAMANTES__5d1b92d7.jpg',
  },
  {
    id: 'ff-2180-218',
    title: '2,398 Diamantes (2,180 + 218 Bonus)',
    diamonds: 2180,
    bonusDiamonds: 218,
    category: 'diamonds',
    litingmBaseCostUsd: 18.20,
    badge: 'VIP Gamer',
    badgeColor: 'amber',
    imageIcon: 'diamond-vault',
    imageUrl: '/assets/aistudio/2398DIAMANTES_6e2afe24.jpg',
  },
  {
    id: 'ff-5600-560',
    title: '6,160 Diamantes (5,600 + 560 Bonus)',
    diamonds: 5600,
    bonusDiamonds: 560,
    category: 'diamonds',
    litingmBaseCostUsd: 45.50,
    badge: 'Pack Leyenda 👑',
    badgeColor: 'emerald',
    imageIcon: 'diamond-throne',
    imageUrl: '/assets/aistudio/6260DIAMANTES_d7266f61.jpg',
  },
];

export function calculatePackagePrices(
  marginPercent: number = 15,
  usdToArsRate: number = 1220,
  resellerDiscountPercent: number = 0
): DiamondPackage[] {
  return BASE_LITINGM_PACKAGES.map((pkg) => {
    // Base cost + profit margin %
    const standardPriceUsd = +(pkg.litingmBaseCostUsd * (1 + marginPercent / 100)).toFixed(2);
    
    // Apply reseller discount if eligible
    const finalPriceUsd = resellerDiscountPercent > 0 
      ? +(standardPriceUsd * (1 - resellerDiscountPercent / 100)).toFixed(2)
      : standardPriceUsd;

    const finalPriceArs = Math.round(finalPriceUsd * usdToArsRate);

    return {
      ...pkg,
      priceUsd: finalPriceUsd,
      priceArs: finalPriceArs,
    };
  });
}
