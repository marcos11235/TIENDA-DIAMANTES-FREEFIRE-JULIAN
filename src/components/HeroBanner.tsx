import React from 'react';
import { Flame, Zap, ShieldCheck, Gem, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onExplorePackages: () => void;
  onOpenVerifier: () => void;
  onOpenRedeem: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplorePackages,
  onOpenVerifier,
  onOpenRedeem,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0e1424] border-2 border-orange-500/40 p-6 sm:p-10 mb-8 shadow-2xl">
      {/* Background Free Fire Character Artwork with dark gaming gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/aistudio/FONDO_PAGINA_FREFIRE_3d057bcb.jpg"
          alt="Free Fire Background"
          className="w-full h-full object-cover object-right md:object-center opacity-25 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a] via-[#0b1120]/90 to-[#120a17]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-transparent" />
      </div>

      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headlines & CTA */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs font-bold tracking-wide backdrop-blur-md">
            <Flame className="w-4 h-4 animate-bounce text-orange-400" />
            <span>RECARGAS OFICIALES GARENA FREE FIRE & FREE FIRE MAX</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-gaming uppercase tracking-tight text-white leading-none drop-shadow-md">
            DIAMANTES <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500">AL INSTANTE</span>
            <br />
            <span className="text-cyan-400 text-2xl sm:text-4xl">& PINES DIRECTOS</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed drop-shadow">
            Acreditación directa vía <strong className="text-white">Player ID</strong> sin dar tu contraseña.
            Precios sincronizados con la tasa de proveedor <strong className="text-cyan-400">Litingm</strong>. Pagá con <strong className="text-sky-400">Mercado Pago</strong> (Pesos) o <strong className="text-amber-400">Binance Pay</strong> (Cripto/USDT) con la mejor tasa del mercado.
          </p>

          {/* Quick thumbnails of official cards */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Formatos Oficiales:
            </span>
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/images_8b4d3e82.jpg"
                alt="110 Diamantes"
                className="w-10 h-7 object-cover rounded border border-orange-500/60 shadow-sm"
                title="110 Diamantes con ID"
              />
              <img
                src="/assets/aistudio/310_DIAMANTES_36629991.jpg"
                alt="310 Diamantes"
                className="w-7 h-9 object-cover rounded border border-cyan-500/60 shadow-sm"
                title="Tarjeta 310 Diamantes"
              />
              <img
                src="/assets/aistudio/download_4add05d4.jpg"
                alt="1060 Diamantes"
                className="w-7 h-9 object-cover rounded border border-purple-500/60 shadow-sm"
                title="Tarjeta 1060 Diamantes"
              />
              <img
                src="/assets/aistudio/SELECTOR_COMPRA_DIAMANTES_e16a1040.jpg"
                alt="Cofre de Diamantes"
                className="w-11 h-7 object-cover rounded border border-amber-500/60 shadow-sm"
                title="Cofre de Diamantes"
              />
            </div>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-slate-700">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Entrega 60 seg.</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sin riesgo de baneo</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-xs font-semibold text-slate-200 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-slate-700">
              <Gem className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>+10% Bonus Extra</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExplorePackages}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Ver Paquetes de Diamantes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenVerifier}
              className="flex items-center gap-2 bg-[#172237]/90 hover:bg-[#1d2b45] text-cyan-300 border border-cyan-600/60 hover:border-cyan-400 font-bold text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Verificar mi Nickname FF</span>
            </button>

            <button
              onClick={onOpenRedeem}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm px-4 py-3.5 rounded-xl border border-slate-700 transition-all cursor-pointer backdrop-blur-md"
            >
              <span>Tengo un PIN</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Showcase card with live promo */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#18233c] to-[#0c1220] rounded-2xl p-4 sm:p-5 border-2 border-orange-500/50 shadow-2xl relative group overflow-hidden">
            {/* Corner Badge */}
            <div className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider animate-pulse">
              HOT DEAL 🔥
            </div>

            {/* Featured Image Asset */}
            <div className="relative h-44 rounded-xl overflow-hidden mb-3 border border-slate-700">
              <img
                src="/assets/aistudio/SELECTOR_COMPRA_DIAMANTES_e16a1040.jpg"
                alt="Cofre de Diamantes Free Fire"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <div className="text-2xl font-black font-gaming text-cyan-300">
                  520 <span className="text-amber-400 text-lg">+ 52 Bonus</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">Pack Más Solicitado</h4>
                <p className="text-[11px] text-slate-400">Recarga directa por ID</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Seguro
              </span>
            </div>

            {/* Payment methods row */}
            <div className="space-y-1.5 text-xs text-slate-300 my-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Pasarela:</span>
                <span className="text-white font-bold">Mercado Pago / Binance</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Tiempo de entrega:</span>
                <span className="text-emerald-400 font-bold">Inmediato (&lt; 2 min)</span>
              </div>
            </div>

            <button
              onClick={onExplorePackages}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Recargar Este Paquete Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
