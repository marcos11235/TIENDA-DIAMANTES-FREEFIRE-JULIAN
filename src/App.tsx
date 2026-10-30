/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopPlayerIdVerifier } from './components/TopPlayerIdVerifier';
import { HeroBanner } from './components/HeroBanner';
import { DiamondStore } from './components/DiamondStore';
import { IdVerifierModal } from './components/IdVerifierModal';
import { CheckoutModal } from './components/CheckoutModal';
import { RedeemPinSection } from './components/RedeemPinSection';
import { UserWalletModal } from './components/UserWalletModal';
import { AdminDashboard } from './components/AdminDashboard';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { Footer } from './components/Footer';
import { calculatePackagePrices } from './services/litingmService';
import { storeDb } from './services/storeDatabase';
import { DiamondPackage, Order, PaymentTopUpRequest, PinCode, StoreSettings, UserProfile } from './types';
import {
  ShoppingBag,
  KeyRound,
  Wallet,
  ShieldCheck,
  MessageCircle,
  Gem,
  Search,
} from 'lucide-react';

export default function App() {
  // Database reactive state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(storeDb.getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(storeDb.getUsers());
  const [allOrders, setAllOrders] = useState<Order[]>(storeDb.getOrders());
  const [allPins, setAllPins] = useState<PinCode[]>(storeDb.getPins());
  const [allTopups, setAllTopups] = useState<PaymentTopUpRequest[]>(storeDb.getTopUps());
  const [settings, setSettings] = useState<StoreSettings>(storeDb.getSettings());

  // UI Navigation & Preferences
  const [activeTab, setActiveTab] = useState<'store' | 'redeem' | 'wallet' | 'admin'>('store');
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');

  // Player ID state
  const [verifiedPlayerId, setVerifiedPlayerId] = useState<string>(
    currentUser?.freeFireId || '1289471928'
  );
  const [verifiedNickname, setVerifiedNickname] = useState<string>(
    currentUser?.freeFireNickname || '亗ＴＯＸＩＣＯ亗'
  );

  // Modals state
  const [isIdVerifierOpen, setIsIdVerifierOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isGoogleLoginOpen, setIsGoogleLoginOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [checkoutSelection, setCheckoutSelection] = useState<{
    pkg: DiamondPackage;
    quantity: number;
  } | null>(null);

  // Subscribe to database changes
  useEffect(() => {
    const unsubscribe = storeDb.subscribe(() => {
      const cur = storeDb.getCurrentUser();
      setCurrentUser(cur);
      setAllUsers(storeDb.getUsers());
      setAllOrders(storeDb.getOrders());
      setAllPins(storeDb.getPins());
      setAllTopups(storeDb.getTopUps());
      setSettings(storeDb.getSettings());

      if (cur?.freeFireId && !verifiedPlayerId) {
        setVerifiedPlayerId(cur.freeFireId);
        setVerifiedNickname(cur.freeFireNickname || `ID: ${cur.freeFireId}`);
      }
    });

    return () => unsubscribe();
  }, [verifiedPlayerId]);

  // Sync player ID if user changes
  useEffect(() => {
    if (currentUser?.freeFireId) {
      setVerifiedPlayerId(currentUser.freeFireId);
      setVerifiedNickname(currentUser.freeFireNickname || `ID: ${currentUser.freeFireId}`);
    }
  }, [currentUser?.id]);

  // Package prices computation using Litingm base and settings
  const resellerDiscount =
    currentUser?.role === 'reseller' ? currentUser.resellerDiscountPercent || settings.resellerDefaultDiscountPercent : 0;

  const currentPackages = calculatePackagePrices(
    settings.litingmMarginPercent,
    settings.usdToArsRate,
    resellerDiscount
  );

  const handleConfirmPlayerId = (playerId: string, nickname: string) => {
    setVerifiedPlayerId(playerId);
    setVerifiedNickname(nickname);
    if (currentUser) {
      storeDb.updateUserPlayerId(playerId, nickname);
    }
  };

  const handleSelectPackageForCheckout = (pkg: DiamondPackage, quantity: number) => {
    setCheckoutSelection({ pkg, quantity });
  };

  const handleGoogleLogin = (email: string, name?: string) => {
    const user = storeDb.loginWithGoogle(email, name);
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    storeDb.logout();
    if (activeTab === 'admin') {
      setActiveTab('store');
    }
  };

  const handleQuickSwitchUser = (userId: string) => {
    const switched = storeDb.switchUser(userId);
    if (switched) {
      setCurrentUser(switched);
      if (switched.role !== 'admin' && activeTab === 'admin') {
        setActiveTab('store');
      }
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-black relative">
      {/* Global Ambient Free Fire Background Artwork */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/assets/aistudio/FONDO_PAGINA_FREFIRE_3d057bcb.jpg"
          alt="Free Fire Global Background"
          className="w-full h-full object-cover object-center opacity-12 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/90 via-[#080b12]/80 to-[#080b12]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currency={currency}
          setCurrency={setCurrency}
          onOpenGoogleLogin={() => setIsGoogleLoginOpen(true)}
          onOpenIdVerifier={() => setIsIdVerifierOpen(true)}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
          onLogout={handleLogout}
          verifiedPlayerId={verifiedPlayerId}
          verifiedNickname={verifiedNickname}
          onQuickSwitchUser={handleQuickSwitchUser}
          allUsers={allUsers}
        />

        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
        {/* TAB: STORE */}
        {activeTab === 'store' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. VERIFICADOR DE ID DE JUGADORES (SUPERIOR ABSOLUTA) */}
            <TopPlayerIdVerifier
              verifiedPlayerId={verifiedPlayerId}
              verifiedNickname={verifiedNickname}
              onConfirmId={handleConfirmPlayerId}
            />

            {/* 2. Banner Promocional Gaming */}
            <HeroBanner
              onExplorePackages={() => {
                const el = document.getElementById('store-grid-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenVerifier={() => setIsIdVerifierOpen(true)}
              onOpenRedeem={() => setActiveTab('redeem')}
            />

            {/* 3. Tienda de Diamantes con Selector de Divisas USD/ARS */}
            <div id="store-grid-section">
              <DiamondStore
                packages={currentPackages}
                currency={currency}
                setCurrency={setCurrency}
                usdToArsRate={settings.usdToArsRate}
                currentUser={currentUser}
                verifiedPlayerId={verifiedPlayerId}
                verifiedNickname={verifiedNickname}
                onOpenIdVerifier={() => setIsIdVerifierOpen(true)}
                onSelectPackageForCheckout={handleSelectPackageForCheckout}
              />
            </div>
          </div>
        )}

        {/* TAB: REDEEM PINS */}
        {activeTab === 'redeem' && (
          <div className="animate-fadeIn py-2">
            <RedeemPinSection
              currentUser={currentUser}
              verifiedPlayerId={verifiedPlayerId}
              verifiedNickname={verifiedNickname}
              onOpenIdVerifier={() => setIsIdVerifierOpen(true)}
              onOpenGoogleLogin={() => setIsGoogleLoginOpen(true)}
              allPins={allPins}
            />
          </div>
        )}

        {/* TAB: WALLET */}
        {activeTab === 'wallet' && (
          <div className="animate-fadeIn py-2 max-w-3xl mx-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-black font-gaming uppercase tracking-wider text-white">
                Billetera & Saldo Personal
              </h2>
              <p className="text-xs text-slate-400">
                Gestiona tus fondos en USD y ARS para recargas instantáneas sin esperas
              </p>
            </div>
            {/* Embedded user wallet view */}
            <UserWalletModal
              isOpen={true}
              onClose={() => setActiveTab('store')}
              currentUser={currentUser}
              currency={currency}
              settings={settings}
              orders={allOrders}
              topups={allTopups}
              onOpenGoogleLogin={() => setIsGoogleLoginOpen(true)}
            />
          </div>
        )}

        {/* TAB: ADMIN (EXCLUSIVE) */}
        {activeTab === 'admin' && (
          <div className="animate-fadeIn py-2">
            {isAdmin ? (
              <AdminDashboard
                currentUser={currentUser!}
                allUsers={allUsers}
                allOrders={allOrders}
                allTopups={allTopups}
                allPins={allPins}
                settings={settings}
                onRefresh={() => {
                  setAllUsers(storeDb.getUsers());
                  setAllOrders(storeDb.getOrders());
                  setAllPins(storeDb.getPins());
                  setAllTopups(storeDb.getTopUps());
                  setSettings(storeDb.getSettings());
                }}
              />
            ) : (
              <div className="p-10 rounded-3xl bg-[#0f172a] border border-rose-500/50 text-center max-w-md mx-auto space-y-4">
                <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-xl font-bold font-gaming text-white uppercase">
                  Acceso Restringido a Administradores
                </h3>
                <p className="text-xs text-slate-300">
                  Tu cuenta ({currentUser?.email || 'No autenticado'}) no posee rango de Administrador.
                  Inicia sesión con la cuenta de administrador configurada ({settings.adminEmail}).
                </p>
                <button
                  onClick={() => setIsGoogleLoginOpen(true)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase rounded-xl"
                >
                  Iniciar Sesión como Admin
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenVerifier={() => setIsIdVerifierOpen(true)}
        onOpenRedeem={() => setActiveTab('redeem')}
      />

      {/* Floating Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0a0f1c]/95 backdrop-blur-lg border-t border-slate-800 p-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
            activeTab === 'store' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tienda</span>
        </button>

        <button
          onClick={() => setActiveTab('redeem')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
            activeTab === 'redeem' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Pines</span>
        </button>

        <button
          onClick={() => setIsIdVerifierOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold text-slate-400"
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Verificar ID</span>
        </button>

        <button
          onClick={() => {
            if (activeTab === 'wallet') {
              setIsWalletModalOpen(true);
            } else {
              setActiveTab('wallet');
            }
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
            activeTab === 'wallet' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Billetera</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
              activeTab === 'admin' ? 'text-pink-400 bg-pink-500/10' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin 👑</span>
          </button>
        )}
      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${settings.whatsappSupportNumber.replace(/\D/g, '')}?text=Hola,%20necesito%20ayuda%20con%20una%20recarga%20de%20Free%20Fire`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-black p-3.5 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        title="Atención WhatsApp 24/7"
      >
        <MessageCircle className="w-6 h-6 fill-black" />
        <span className="hidden group-hover:inline ml-2 text-xs font-black uppercase pr-1">
          Soporte 24/7
        </span>
      </a>
      </div>

      {/* Modals */}
      <IdVerifierModal
        isOpen={isIdVerifierOpen}
        onClose={() => setIsIdVerifierOpen(false)}
        onConfirmId={handleConfirmPlayerId}
        initialPlayerId={verifiedPlayerId}
      />

      <CheckoutModal
        isOpen={!!checkoutSelection}
        onClose={() => setCheckoutSelection(null)}
        pkg={checkoutSelection?.pkg || null}
        quantity={checkoutSelection?.quantity || 1}
        currency={currency}
        currentUser={currentUser}
        verifiedPlayerId={verifiedPlayerId}
        verifiedNickname={verifiedNickname}
        onOpenIdVerifier={() => {
          setIsIdVerifierOpen(true);
        }}
        onOpenGoogleLogin={() => setIsGoogleLoginOpen(true)}
        settings={settings}
        onOrderCompleted={() => {
          setAllOrders(storeDb.getOrders());
          setCurrentUser(storeDb.getCurrentUser());
        }}
      />

      {/* Floating Wallet modal when opened from header button */}
      {isWalletModalOpen && (
        <UserWalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          currentUser={currentUser}
          currency={currency}
          settings={settings}
          orders={allOrders}
          topups={allTopups}
          onOpenGoogleLogin={() => {
            setIsWalletModalOpen(false);
            setIsGoogleLoginOpen(true);
          }}
        />
      )}

      <GoogleLoginModal
        isOpen={isGoogleLoginOpen}
        onClose={() => setIsGoogleLoginOpen(false)}
        onLogin={handleGoogleLogin}
        adminEmail={settings.adminEmail}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />
    </div>
  );
}
