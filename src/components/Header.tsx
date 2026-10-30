import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Wallet,
  User,
  LogOut,
  Settings,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Database,
  Users,
  Search,
  KeyRound,
  ShoppingBag,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile | null;
  activeTab: 'store' | 'redeem' | 'wallet' | 'admin';
  setActiveTab: (tab: 'store' | 'redeem' | 'wallet' | 'admin') => void;
  currency: 'USD' | 'ARS';
  setCurrency: (cur: 'USD' | 'ARS') => void;
  onOpenGoogleLogin: () => void;
  onOpenIdVerifier: () => void;
  onOpenWallet: () => void;
  onOpenSupabaseConfig: () => void;
  onLogout: () => void;
  verifiedPlayerId?: string;
  verifiedNickname?: string;
  onQuickSwitchUser: (userId: string) => void;
  allUsers: UserProfile[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenGoogleLogin,
  onOpenIdVerifier,
  onOpenWallet,
  onOpenSupabaseConfig,
  onLogout,
  verifiedPlayerId,
  verifiedNickname,
  onQuickSwitchUser,
  allUsers,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isReseller = currentUser?.role === 'reseller';

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-cyan-900/30">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-orange-950/60 via-amber-950/40 to-cyan-950/60 border-b border-orange-500/20 px-4 py-1 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-emerald-400">SERVIDORES ACTIVOS:</span>
            <span className="hidden sm:inline text-slate-400">Entrega Automática Litingm en 60 segundos</span>
            <span className="sm:hidden text-slate-400">Entrega 60s</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSupabaseConfig}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
              title="Configuración de Base de Datos Supabase"
            >
              <Database className="w-3 h-3" />
              <span className="hidden md:inline">Supabase Cloud / Auth</span>
            </button>
            <div className="flex items-center bg-black/40 rounded px-1.5 py-0.5 border border-slate-800 text-[11px]">
              <span className="text-slate-400 mr-1.5">Moneda:</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-1.5 rounded text-[10px] font-bold transition-colors ${
                  currency === 'USD' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD / USDT
              </button>
              <button
                onClick={() => setCurrency('ARS')}
                className={`px-1.5 rounded text-[10px] font-bold transition-colors ml-1 ${
                  currency === 'ARS' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                ARS ($)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('store')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-gaming text-xl sm:text-2xl font-black tracking-wider text-white">
                  FUEGO<span className="text-orange-500">STORE</span>
                </span>
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                  FF 2026
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-tight hidden sm:block">
                Diamantes & Pines Oficiales
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101726]/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'store'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tienda Diamantes</span>
          </button>

          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'redeem'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Canjear Pines</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'wallet'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black shadow-md shadow-emerald-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Mi Billetera</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all relative ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                  : 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border border-pink-500/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-pink-300 animate-bounce" />
              <span>Panel Admin 👑</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
            </button>
          )}
        </nav>

        {/* Right Action Tools: Player ID Chip + Wallet + User Auth */}
        <div className="flex items-center gap-2.5">
          {/* Player ID verification pill */}
          <button
            onClick={onOpenIdVerifier}
            className="hidden sm:flex items-center gap-2 bg-[#121927] hover:bg-[#182236] border border-cyan-800/40 hover:border-cyan-500/60 px-3 py-1.5 rounded-xl transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-700/40 text-cyan-400 group-hover:scale-105 transition-transform">
              <Search className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <div className="text-[10px] text-slate-400 font-medium leading-none">
                {verifiedPlayerId ? 'ID Verificado' : 'Verificar ID'}
              </div>
              <div className="font-bold text-slate-100 flex items-center gap-1 leading-tight">
                {verifiedPlayerId ? (
                  <>
                    <span className="text-cyan-400 font-mono text-xs">{verifiedPlayerId}</span>
                    {verifiedNickname && (
                      <span className="text-slate-400 text-[10px] truncate max-w-[80px]">
                        ({verifiedNickname})
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-amber-400 text-[11px]">Ingresar Player ID</span>
                )}
              </div>
            </div>
          </button>

          {/* User balance badge */}
          {currentUser && (
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/70 to-[#0e2221] hover:from-emerald-900/80 hover:to-[#133331] border border-emerald-600/40 px-3 py-1.5 rounded-xl transition-all"
              title="Ver Billetera y Cargar Saldo"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <div className="text-right">
                <div className="text-[9px] text-emerald-400/80 font-bold uppercase tracking-wider leading-none">
                  Tu Saldo
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-emerald-300 font-mono">
                  {currency === 'USD'
                    ? `$${currentUser.balanceUsd.toFixed(2)} USD`
                    : `$${currentUser.balanceArs.toLocaleString('es-AR')} ARS`}
                </div>
              </div>
            </button>
          )}

          {/* User profile / Google login */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-[#121927] hover:bg-[#1a2438] border border-slate-700/60 rounded-xl transition-colors"
              >
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                    {isAdmin && (
                      <span className="text-pink-400 bg-pink-500/20 px-1 py-0.2 rounded border border-pink-500/30">
                        ADMIN
                      </span>
                    )}
                    {isReseller && (
                      <span className="text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/30">
                        REVENDEDOR
                      </span>
                    )}
                    {!isAdmin && !isReseller && (
                      <span className="text-cyan-400">CLIENTE</span>
                    )}
                  </div>
                </div>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-600"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#101726] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-slate-200"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">{currentUser.email}</p>
                    {isAdmin && (
                      <p className="text-[10px] text-pink-400 font-bold mt-1">
                        👑 Super Administrador Activo
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('wallet');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-800 rounded-lg text-slate-200"
                    >
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span>Cargar Saldo & Historial</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenIdVerifier();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-800 rounded-lg text-slate-200"
                    >
                      <Search className="w-4 h-4 text-cyan-400" />
                      <span>Verificar / Cambiar Player ID</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-pink-400 hover:bg-pink-500/10 rounded-lg"
                      >
                        <ShieldCheck className="w-4 h-4 text-pink-400" />
                        <span>Ir al Panel de Administración</span>
                      </button>
                    )}

                    {/* Quick account switch for developer / demo testing */}
                    <div className="mt-2 pt-2 border-t border-slate-800">
                      <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Cambio Rápido de Cuenta:</span>
                      </div>
                      {allUsers.map(u => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onQuickSwitchUser(u.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="truncate max-w-[140px]">{u.name}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {u.role === 'admin' ? '👑 Admin' : u.role === 'reseller' ? '💼 Rev' : '👤 Cl'}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGoogleLogin}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              {/* Google G icon SVG */}
              <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Ingresar con Google</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-[#101726] rounded-xl border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c111d] border-b border-slate-800 px-4 py-3 space-y-2">
          {/* Mobile ID verifier bar */}
          <div
            onClick={() => {
              onOpenIdVerifier();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-cyan-800/40 text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">ID de Jugador Free Fire:</span>
                <span className="font-bold text-white">
                  {verifiedPlayerId ? `${verifiedPlayerId} (${verifiedNickname})` : 'Toca para verificar ID'}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded font-bold">
              {verifiedPlayerId ? 'OK' : 'VERIFICAR'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setActiveTab('store');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                activeTab === 'store' ? 'bg-orange-500 text-black' : 'bg-slate-800/80 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tienda</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('redeem');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                activeTab === 'redeem' ? 'bg-cyan-500 text-black' : 'bg-slate-800/80 text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Canjear Pines</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('wallet');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                activeTab === 'wallet' ? 'bg-emerald-500 text-black' : 'bg-slate-800/80 text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Mi Saldo</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-950/60 text-pink-300 border border-pink-700/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Panel Admin</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
