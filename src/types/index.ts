export type UserRole = 'client' | 'reseller' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  balanceUsd: number;
  balanceArs: number;
  freeFireId?: string;
  freeFireNickname?: string;
  resellerDiscountPercent?: number;
  createdAt: string;
}

export type PaymentGateway = 'mercadopago' | 'binance' | 'wallet';

export interface DiamondPackage {
  id: string;
  title: string;
  diamonds: number;
  bonusDiamonds: number;
  priceUsd: number;
  priceArs: number;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose';
  isPopular?: boolean;
  category: 'diamonds' | 'passes' | 'special';
  litingmBaseCostUsd: number;
  imageIcon: string;
  imageUrl: string;
}

export interface PlayerVerificationResult {
  playerId: string;
  nickname: string;
  region: 'LATAM (Sudamérica)' | 'EE.UU. / Norteamérica' | 'Brasil' | 'Europa';
  level: number;
  likes: number;
  verifiedAt: string;
  guildName?: string;
  avatarIcon?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  packageId: string;
  packageTitle: string;
  diamondsTotal: number;
  amountUsd: number;
  amountArs: number;
  gateway: PaymentGateway;
  playerId: string;
  playerNickname: string;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  paymentReference?: string;
  proofImageUrl?: string;
  createdAt: string;
  adminNote?: string;
}

export interface PinCode {
  id: string;
  code: string;
  diamonds: number;
  bonusDiamonds: number;
  valueUsd: number;
  isRedeemed: boolean;
  redeemedByUserId?: string;
  redeemedByPlayerId?: string;
  redeemedAt?: string;
  generatedForReseller?: string;
  createdAt: string;
}

export interface PaymentTopUpRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: 'USD' | 'ARS' | 'USDT';
  gateway: 'mercadopago' | 'binance';
  proofReference: string;
  proofImageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  notes?: string;
}

export interface StoreSettings {
  adminEmail: string;
  usdToArsRate: number;
  litingmMarginPercent: number;
  resellerDefaultDiscountPercent: number;
  binancePayId: string;
  binanceQrImageUrl: string;
  binanceUsdtAddress: string;
  mpCvu: string;
  mpAlias: string;
  mpHolderName: string;
  mpQrImageUrl: string;
  whatsappSupportNumber: string;
}
