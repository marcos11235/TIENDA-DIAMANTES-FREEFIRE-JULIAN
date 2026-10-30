import React, { useState } from 'react';
import {
  Gem,
  Sparkles,
  Zap,
  Flame,
  Check,
  ShieldCheck,
  CreditCard,
  Crown,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  DollarSign,
  ArrowRightLeft,
} from 'lucide-react';
import { DiamondPackage, UserProfile } from '../types';

interface DiamondStoreProps {
  packages: DiamondPackage[];
  currency: 'USD' | 'ARS';
  setCurrency: (cur: 'USD' | 'ARS') => void;
  currentUser: UserProfile | null;
  verifiedPlayerId?: string;
  verifiedNickname?: string;
  onOpenIdVerifier: () => void;
  onSelectPackageForCheckout: (pkg: DiamondPackage, quantity: number) => void;
  usdToArsRate?: number;
}

export const DiamondStore: React.FC<DiamondStoreProps> = ({
  packages,
  currency,
  setCurrency,
  currentUser,
  verifiedPlayerId,
  verifiedNickname,
  onOpenIdVerifier,
  onSelectPackageForCheckout,
  usdToArsRate = 1220,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'diamonds' | 'passes'>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredPackages = packages.filter((pkg) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'diamonds') return pkg.category === 'diamonds';
    if (activeCategory === 'passes') return pkg.category === 'passes' || pkg.category === 'special';
    return true;
  });

  const getQuantity = (id: string) => quantities[id] || 1;

  const updateQuantity = (id: string, delta: number) => {
    const current = getQuantity(id);
    const next = Math.max(1, Math.min(10, current + delta));
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  const isReseller = currentUser?.role === 'reseller';

  return (
    <div className="space-y-6">
      {/* Reseller Banner Notice */}
      {isReseller && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>
              <strong>Modo Revendedor Activo:</strong> Estás accediendo con un {currentUser.resellerDiscountPercent || 10}% de descuento exclusivo.
            </span>
          </div>
          <span className="font-bold uppercase text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded">
            VIP RESELLER
          </span>
        </div>
      )}

      {/* CURRENCY CONVERSION SWITCHER (USD DEFAULT / ARS INTERACTIVE SWITCH) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121929] via-[#0f172a] to-[#141d33] border-2 border-cyan-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Conversión de Divisas en Tiempo Real
              </span>
              <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 px-2 py-0.2 rounded border border-cyan-500/30">
                Precios Base en USD
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tasa de cambio de referencia: <strong className="text-amber-300 font-mono">1 USD = ${usdToArsRate.toLocaleString('es-AR')} ARS</strong>
            </p>
          </div>
        </div>

        {/* The Interactive Currency Switch */}
        <div className="flex items-center gap-2 bg-[#090d16] p-1.5 rounded-2xl border border-slate-700 shadow-inner">
          <button
            onClick={() => setCurrency('USD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              currency === 'USD'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>USD ($ Dólar / USDT)</span>
            <span className="text-[9px] bg-black/40 text-cyan-200 px-1.5 py-0.2 rounded ml-1 font-bold">
              PREDETERMINADO
            </span>
          </button>

          <button
            onClick={() => setCurrency('ARS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              currency === 'ARS'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>ARS ($ Pesos Argentinos)</span>
          </button>
        </div>
      </div>

      {/* Packages Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black font-gaming uppercase tracking-wider text-white">
              Paquetes Oficiales de Diamantes Free Fire
            </h3>
            <p className="text-xs text-slate-400">
              Selecciona tu lote de diamantes para recarga directa por Player ID
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Proveedor Oficial Litingm • Entrega 60s</span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.map((pkg) => {
          const qty = getQuantity(pkg.id);
          const totalUsd = +(pkg.priceUsd * qty).toFixed(2);
          const totalArs = Math.round(pkg.priceArs * qty);

          return (
            <div
              key={pkg.id}
              className={`group relative bg-gradient-to-b from-[#131b2e] to-[#0c1220] rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 overflow-hidden ${
                pkg.isPopular
                  ? 'border-orange-500/70 shadow-2xl shadow-orange-950/40 ring-1 ring-orange-500/30'
                  : 'border-slate-800 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-950/30'
              }`}
            >
              {/* Top Badge */}
              {pkg.badge && (
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg ${
                      pkg.badgeColor === 'rose'
                        ? 'bg-rose-500 text-white'
                        : pkg.badgeColor === 'amber'
                        ? 'bg-amber-400 text-black'
                        : pkg.badgeColor === 'emerald'
                        ? 'bg-emerald-400 text-black'
                        : pkg.badgeColor === 'purple'
                        ? 'bg-purple-500 text-white'
                        : 'bg-cyan-400 text-black'
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>
              )}

              {/* Clean High-Resolution Card Image Asset */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black/95 border border-slate-800 mb-3.5 group-hover:border-cyan-500/60 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all flex items-center justify-center p-1.5">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                />

                {/* Floating Diamond Amount Pill */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80">
                  <div className="flex items-center gap-1.5">
                    <Gem className="w-4 h-4 text-cyan-400" />
                    <span className="font-gaming font-black text-white text-base">
                      {pkg.diamonds.toLocaleString()}{' '}
                      {pkg.bonusDiamonds > 0 && (
                        <span className="text-amber-400 text-sm">+{pkg.bonusDiamonds}</span>
                      )}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                    Diamantes FF
                  </span>
                </div>
              </div>

              {/* Title & info */}
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mb-3">
                  Recarga Directa por Player ID
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-black/30 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Acreditación en 60 segundos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sin riesgo de baneo • 100% Legal</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Price in selected currency, Quantity & Action */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                {/* Quantity selector */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Cantidad de paquetes:</span>
                  <div className="flex items-center bg-[#090d16] border border-slate-700 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(pkg.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-white text-xs">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(pkg.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Price display with default USD emphasis */}
                <div className="flex items-baseline justify-between bg-black/40 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Precio Final:</span>
                  <div className="text-right">
                    {currency === 'USD' ? (
                      <>
                        <div className="text-xl font-black font-mono text-cyan-300">
                          ${totalUsd.toFixed(2)} USD
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ≈ ${totalArs.toLocaleString('es-AR')} ARS
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-black font-mono text-amber-300">
                          ${totalArs.toLocaleString('es-AR')} ARS
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ≈ ${totalUsd.toFixed(2)} USD
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => onSelectPackageForCheckout(pkg, qty)}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    Comprar {currency === 'USD' ? `$${totalUsd.toFixed(2)} USD` : `$${totalArs.toLocaleString('es-AR')} ARS`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
