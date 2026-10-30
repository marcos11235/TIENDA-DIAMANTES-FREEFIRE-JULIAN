import {
  UserProfile,
  Order,
  PinCode,
  PaymentTopUpRequest,
  StoreSettings,
} from '../types';

const STORAGE_USERS = 'ff_store_users_v2';
const STORAGE_CURRENT_USER = 'ff_store_current_user_v2';
const STORAGE_ORDERS = 'ff_store_orders_v2';
const STORAGE_PINS = 'ff_store_pins_v2';
const STORAGE_TOPUPS = 'ff_store_topups_v2';
const STORAGE_SETTINGS = 'ff_store_settings_v2';

export const DEFAULT_ADMIN_EMAIL = 'macosgabriel.206@gmail.com';

const INITIAL_SETTINGS: StoreSettings = {
  adminEmail: DEFAULT_ADMIN_EMAIL,
  usdToArsRate: 1220,
  litingmMarginPercent: 15,
  resellerDefaultDiscountPercent: 10,
  binancePayId: '839201948',
  binanceQrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=binance://pay?payId=839201948',
  binanceUsdtAddress: 'TXvLitingmPayFreeFireUSDTtrc20SecureWallet8921',
  mpCvu: '0000003100084920194821',
  mpAlias: 'FUEGO.STORE.DIAMANTES',
  mpHolderName: 'FuegoStore Recargas Gaming S.R.L.',
  mpQrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=mercadopago://transfer?alias=FUEGO.STORE.DIAMANTES',
  whatsappSupportNumber: '+54 9 11 4892-0194',
};

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    email: DEFAULT_ADMIN_EMAIL,
    name: 'Gabriel (Super Admin)',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
    balanceUsd: 250.00,
    balanceArs: 305000,
    freeFireId: '1289471928',
    freeFireNickname: '亗ＴＯＸＩＣＯ亗',
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'user-reseller-1',
    email: 'revendedor_pro@ffstore.com',
    name: 'Carlos Revendedor Pro',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    role: 'reseller',
    balanceUsd: 145.50,
    balanceArs: 177510,
    freeFireId: '3910482019',
    freeFireNickname: '⚡Vampiro_FF亗',
    resellerDiscountPercent: 12,
    createdAt: '2026-10-10T14:30:00Z',
  },
  {
    id: 'user-client-1',
    email: 'gamer_latam99@gmail.com',
    name: 'Lucas Martínez (Jugador)',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    role: 'client',
    balanceUsd: 15.00,
    balanceArs: 18300,
    freeFireId: '8492019482',
    freeFireNickname: '꧁ঔৣ☬NOOB_PRO☬ঔৣ꧂',
    createdAt: '2026-10-18T10:15:00Z',
  },
  {
    id: 'user-client-2',
    email: 'tiamat_ff@hotmail.com',
    name: 'Valentina Gomez',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'client',
    balanceUsd: 0.00,
    balanceArs: 0,
    freeFireId: '5519402847',
    freeFireNickname: '✿S U P R E M A✿',
    createdAt: '2026-10-25T19:40:00Z',
  },
];

const INITIAL_PINS: PinCode[] = [
  {
    id: 'pin-1',
    code: 'FF-DIAM-9482-1060',
    diamonds: 1060,
    bonusDiamonds: 106,
    valueUsd: 10.45,
    isRedeemed: false,
    createdAt: '2026-10-28T09:00:00Z',
  },
  {
    id: 'pin-2',
    code: 'FF-GOLD-3310-520',
    diamonds: 520,
    bonusDiamonds: 52,
    valueUsd: 5.25,
    isRedeemed: false,
    createdAt: '2026-10-28T10:30:00Z',
  },
  {
    id: 'pin-3',
    code: 'FF-VIP-BOOYAH-2026',
    diamonds: 499,
    bonusDiamonds: 0,
    valueUsd: 5.00,
    isRedeemed: false,
    createdAt: '2026-10-29T11:00:00Z',
  },
  {
    id: 'pin-4',
    code: 'FF-MEGA-5600-HERO',
    diamonds: 5600,
    bonusDiamonds: 560,
    valueUsd: 52.00,
    isRedeemed: false,
    createdAt: '2026-10-29T15:20:00Z',
  },
  {
    id: 'pin-5',
    code: 'FF-PRO-310-DEMO',
    diamonds: 310,
    bonusDiamonds: 31,
    valueUsd: 3.15,
    isRedeemed: true,
    redeemedByUserId: 'user-client-1',
    redeemedByPlayerId: '8492019482',
    redeemedAt: '2026-10-29T18:00:00Z',
    createdAt: '2026-10-27T08:00:00Z',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98214',
    userId: 'user-client-1',
    userEmail: 'gamer_latam99@gmail.com',
    userName: 'Lucas Martínez',
    packageId: 'ff-520-52',
    packageTitle: '520 + 52 Diamantes',
    diamondsTotal: 572,
    amountUsd: 5.25,
    amountArs: 6405,
    gateway: 'wallet',
    playerId: '8492019482',
    playerNickname: '꧁ঔৣ☬NOOB_PRO☬ঔৣ꧂',
    status: 'delivered',
    paymentReference: 'DEDUCTION-WALLET-AUTOPAY',
    createdAt: '2026-10-29T14:10:00Z',
  },
  {
    id: 'ORD-98215',
    userId: 'user-client-2',
    userEmail: 'tiamat_ff@hotmail.com',
    userName: 'Valentina Gomez',
    packageId: 'ff-1060-106',
    packageTitle: '1,060 + 106 Diamantes',
    diamondsTotal: 1166,
    amountUsd: 10.45,
    amountArs: 12750,
    gateway: 'mercadopago',
    playerId: '5519402847',
    playerNickname: '✿S U P R E M A✿',
    status: 'pending',
    paymentReference: 'MP-TRF-091248-BANCO-SANTANDER',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-10-30T06:40:00Z',
  },
  {
    id: 'ORD-98216',
    userId: 'user-reseller-1',
    userEmail: 'revendedor_pro@ffstore.com',
    userName: 'Carlos Revendedor Pro',
    packageId: 'ff-5600-560',
    packageTitle: '5,600 + 560 Diamantes',
    diamondsTotal: 6160,
    amountUsd: 46.00,
    amountArs: 56120,
    gateway: 'binance',
    playerId: '3910482019',
    playerNickname: '⚡Vampiro_FF亗',
    status: 'pending',
    paymentReference: '0x9948cbb3142781afb94872c019d84920184b2e104f',
    createdAt: '2026-10-30T07:15:00Z',
  },
];

const INITIAL_TOPUPS: PaymentTopUpRequest[] = [
  {
    id: 'TOP-1001',
    userId: 'user-client-1',
    userEmail: 'gamer_latam99@gmail.com',
    userName: 'Lucas Martínez',
    amount: 15.00,
    currency: 'USD',
    gateway: 'binance',
    proofReference: 'BINANCE-PAY-TX-88491028',
    status: 'approved',
    createdAt: '2026-10-28T16:00:00Z',
  },
  {
    id: 'TOP-1002',
    userId: 'user-client-2',
    userEmail: 'tiamat_ff@hotmail.com',
    userName: 'Valentina Gomez',
    amount: 15000,
    currency: 'ARS',
    gateway: 'mercadopago',
    proofReference: 'COMPROBANTE-MP-TRANSF-994821',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    status: 'pending',
    createdAt: '2026-10-30T07:30:00Z',
  },
  {
    id: 'TOP-1003',
    userId: 'user-reseller-1',
    userEmail: 'revendedor_pro@ffstore.com',
    userName: 'Carlos Revendedor Pro',
    amount: 50.00,
    currency: 'USDT',
    gateway: 'binance',
    proofReference: 'BINANCE-PAY-ID-993847-USDT',
    status: 'pending',
    createdAt: '2026-10-30T07:45:00Z',
  },
];

class StoreDatabase {
  private users: UserProfile[] = [];
  private currentUser: UserProfile | null = null;
  private orders: Order[] = [];
  private pins: PinCode[] = [];
  private topups: PaymentTopUpRequest[] = [];
  private settings: StoreSettings = INITIAL_SETTINGS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedSettings = localStorage.getItem(STORAGE_SETTINGS);
      this.settings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SETTINGS;
      // Ensure DEFAULT_ADMIN_EMAIL is set
      if (!this.settings.adminEmail) {
        this.settings.adminEmail = DEFAULT_ADMIN_EMAIL;
      }

      const storedUsers = localStorage.getItem(STORAGE_USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      // Make sure admin exists in user list
      const adminExists = this.users.find(u => u.email.toLowerCase() === this.settings.adminEmail.toLowerCase());
      if (!adminExists) {
        this.users.unshift(INITIAL_USERS[0]);
      } else {
        adminExists.role = 'admin';
      }

      const storedOrders = localStorage.getItem(STORAGE_ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS;

      const storedPins = localStorage.getItem(STORAGE_PINS);
      this.pins = storedPins ? JSON.parse(storedPins) : INITIAL_PINS;

      const storedTopups = localStorage.getItem(STORAGE_TOPUPS);
      this.topups = storedTopups ? JSON.parse(storedTopups) : INITIAL_TOPUPS;

      const storedCur = localStorage.getItem(STORAGE_CURRENT_USER);
      if (storedCur) {
        this.currentUser = JSON.parse(storedCur);
        // Sync role if email matches admin
        if (this.currentUser && this.currentUser.email.toLowerCase() === this.settings.adminEmail.toLowerCase()) {
          this.currentUser.role = 'admin';
        }
      } else {
        // By default on initial load, auto-login as Gabriel (the requested admin user) for smooth instant testing
        this.currentUser = this.users[0];
      }
    } catch (e) {
      console.error('Failed to init store database', e);
      this.settings = INITIAL_SETTINGS;
      this.users = INITIAL_USERS;
      this.currentUser = INITIAL_USERS[0];
      this.orders = INITIAL_ORDERS;
      this.pins = INITIAL_PINS;
      this.topups = INITIAL_TOPUPS;
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(this.settings));
      localStorage.setItem(STORAGE_USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_PINS, JSON.stringify(this.pins));
      localStorage.setItem(STORAGE_TOPUPS, JSON.stringify(this.topups));
      if (this.currentUser) {
        localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to save store db', e);
    }
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // Getters
  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    this.settings = { ...this.settings, ...newSettings };
    // If admin email changed, check roles
    this.users = this.users.map(u => {
      if (u.email.toLowerCase() === this.settings.adminEmail.toLowerCase()) {
        return { ...u, role: 'admin' };
      }
      return u;
    });
    if (this.currentUser && this.currentUser.email.toLowerCase() === this.settings.adminEmail.toLowerCase()) {
      this.currentUser.role = 'admin';
    }
    this.save();
    return this.settings;
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  public getUsers(): UserProfile[] {
    return [...this.users];
  }

  public getOrders(): Order[] {
    return [...this.orders];
  }

  public getPins(): PinCode[] {
    return [...this.pins];
  }

  public getTopUps(): PaymentTopUpRequest[] {
    return [...this.topups];
  }

  // Authentication: Google Sign-in simulation / real Supabase OAuth
  public loginWithGoogle(email: string, name?: string, avatarUrl?: string): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === this.settings.adminEmail.toLowerCase();
    
    let existing = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        name: name || email.split('@')[0],
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
        role: isAdmin ? 'admin' : 'client',
        balanceUsd: 0,
        balanceArs: 0,
        createdAt: new Date().toISOString(),
      };
      this.users.push(newUser);
      existing = newUser;
    } else if (isAdmin && existing.role !== 'admin') {
      existing.role = 'admin';
    }

    this.currentUser = { ...existing };
    this.save();
    return this.currentUser;
  }

  public switchUser(userId: string): UserProfile | null {
    const found = this.users.find(u => u.id === userId);
    if (found) {
      this.currentUser = { ...found };
      this.save();
      return this.currentUser;
    }
    return null;
  }

  public logout(): void {
    this.currentUser = null;
    this.save();
  }

  public updateUserPlayerId(playerId: string, nickname: string): void {
    if (!this.currentUser) return;
    this.currentUser.freeFireId = playerId;
    this.currentUser.freeFireNickname = nickname;

    this.users = this.users.map(u => (u.id === this.currentUser?.id ? { ...this.currentUser } : u));
    this.save();
  }

  // Balance & Wallet operations
  public adjustUserBalance(userId: string, amountUsdDelta: number, amountArsDelta: number): boolean {
    const target = this.users.find(u => u.id === userId);
    if (!target) return false;

    target.balanceUsd = Math.max(0, +(target.balanceUsd + amountUsdDelta).toFixed(2));
    target.balanceArs = Math.max(0, Math.round(target.balanceArs + amountArsDelta));

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser.balanceUsd = target.balanceUsd;
      this.currentUser.balanceArs = target.balanceArs;
    }

    this.save();
    return true;
  }

  public updateUserRole(userId: string, role: 'client' | 'reseller' | 'admin', resellerDiscountPercent?: number): void {
    const target = this.users.find(u => u.id === userId);
    if (!target) return;

    target.role = role;
    if (role === 'reseller') {
      target.resellerDiscountPercent = resellerDiscountPercent ?? this.settings.resellerDefaultDiscountPercent;
    } else {
      delete target.resellerDiscountPercent;
    }

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser.role = role;
      this.currentUser.resellerDiscountPercent = target.resellerDiscountPercent;
    }

    this.save();
  }

  // Create Order
  public createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: orderData.gateway === 'wallet' ? 'delivered' : 'pending',
    };

    // If paid via wallet, deduct immediately
    if (orderData.gateway === 'wallet') {
      this.adjustUserBalance(orderData.userId, -orderData.amountUsd, -orderData.amountArs);
    }

    this.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  // Update order status (Admin)
  public updateOrderStatus(orderId: string, status: Order['status'], adminNote?: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;

    order.status = status;
    if (adminNote) order.adminNote = adminNote;

    this.save();
    return true;
  }

  // Request balance top-up
  public requestTopUp(data: Omit<PaymentTopUpRequest, 'id' | 'createdAt' | 'status'>): PaymentTopUpRequest {
    const newTopUp: PaymentTopUpRequest = {
      ...data,
      id: `TOP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    this.topups.unshift(newTopUp);
    this.save();
    return newTopUp;
  }

  // Approve / Reject TopUp (Admin)
  public processTopUp(topUpId: string, approve: boolean, notes?: string): boolean {
    const topUp = this.topups.find(t => t.id === topUpId);
    if (!topUp || topUp.status !== 'pending') return false;

    topUp.status = approve ? 'approved' : 'rejected';
    if (notes) topUp.notes = notes;

    if (approve) {
      // Credit balance
      let usdAmount = 0;
      let arsAmount = 0;

      if (topUp.currency === 'USD' || topUp.currency === 'USDT') {
        usdAmount = topUp.amount;
        arsAmount = Math.round(topUp.amount * this.settings.usdToArsRate);
      } else {
        arsAmount = topUp.amount;
        usdAmount = +(topUp.amount / this.settings.usdToArsRate).toFixed(2);
      }

      this.adjustUserBalance(topUp.userId, usdAmount, arsAmount);
    }

    this.save();
    return true;
  }

  // Redeem Pin
  public redeemPin(pinCodeString: string, userId: string, playerId: string): { success: boolean; message: string; pin?: PinCode } {
    const normalized = pinCodeString.trim().toUpperCase();
    const pin = this.pins.find(p => p.code.toUpperCase() === normalized);

    if (!pin) {
      return { success: false, message: 'El PIN ingresado no existe o es inválido. Verifique el código.' };
    }

    if (pin.isRedeemed) {
      return {
        success: false,
        message: `Este PIN ya fue canjeado el ${new Date(pin.redeemedAt || '').toLocaleDateString('es-ES')}.`,
      };
    }

    pin.isRedeemed = true;
    pin.redeemedByUserId = userId;
    pin.redeemedByPlayerId = playerId;
    pin.redeemedAt = new Date().toISOString();

    // Create a delivered order record for traceability
    const user = this.users.find(u => u.id === userId);
    this.orders.unshift({
      id: `ORD-PIN-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userEmail: user?.email || 'usuario@ff.com',
      userName: user?.name || 'Cliente FF',
      packageId: `pin-pkg-${pin.diamonds}`,
      packageTitle: `Canje Directo PIN: ${pin.diamonds} Diamantes`,
      diamondsTotal: pin.diamonds + pin.bonusDiamonds,
      amountUsd: pin.valueUsd,
      amountArs: Math.round(pin.valueUsd * this.settings.usdToArsRate),
      gateway: 'wallet',
      playerId,
      playerNickname: user?.freeFireNickname || `ID: ${playerId}`,
      status: 'delivered',
      paymentReference: `REDEEM-PIN-${pin.code}`,
      createdAt: new Date().toISOString(),
    });

    this.save();
    return {
      success: true,
      message: `¡Canje exitoso! Se acreditaron ${pin.diamonds + pin.bonusDiamonds} diamantes a la cuenta ID ${playerId}.`,
      pin,
    };
  }

  // Generate PINs (Admin or Reseller tools)
  public generatePins(diamonds: number, bonusDiamonds: number, valueUsd: number, quantity: number = 1, forResellerEmail?: string): PinCode[] {
    const created: PinCode[] = [];
    for (let i = 0; i < quantity; i++) {
      const randomSegment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomSegment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `FF-${diamonds}-${randomSegment1}-${randomSegment2}`;

      const newPin: PinCode = {
        id: `pin-${Date.now()}-${i}`,
        code,
        diamonds,
        bonusDiamonds,
        valueUsd,
        isRedeemed: false,
        generatedForReseller: forResellerEmail,
        createdAt: new Date().toISOString(),
      };
      this.pins.unshift(newPin);
      created.push(newPin);
    }
    this.save();
    return created;
  }

  // Bulk Import PINs via Textarea (Multiple codes separated by newlines)
  public bulkImportPins(
    rawCodes: string,
    diamonds: number,
    bonusDiamonds: number,
    valueUsd: number,
    forResellerEmail?: string
  ): { created: PinCode[]; count: number; duplicatesSkipped: number } {
    const lines = rawCodes
      .split(/[\r\n,]+/)
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length >= 4);

    const existingCodes = new Set(this.pins.map((p) => p.code.toUpperCase()));
    const created: PinCode[] = [];
    let duplicatesSkipped = 0;

    for (let i = 0; i < lines.length; i++) {
      const code = lines[i];
      if (existingCodes.has(code)) {
        duplicatesSkipped++;
        continue;
      }

      const newPin: PinCode = {
        id: `pin-bulk-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        code,
        diamonds,
        bonusDiamonds,
        valueUsd,
        isRedeemed: false,
        generatedForReseller: forResellerEmail,
        createdAt: new Date().toISOString(),
      };

      existingCodes.add(code);
      this.pins.unshift(newPin);
      created.push(newPin);
    }

    this.save();
    return { created, count: created.length, duplicatesSkipped };
  }
}

export const storeDb = new StoreDatabase();
