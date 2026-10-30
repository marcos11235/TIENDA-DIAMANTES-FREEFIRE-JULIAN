import React from 'react';
import { Flame, ShieldCheck, MessageCircle, Heart, Gem, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenVerifier: () => void;
  onOpenRedeem: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenVerifier, onOpenRedeem }) => {
  return (
    <footer className="mt-20 border-t border-cyan-900/30 bg-[#070a12] text-slate-400 text-xs">
      {/* Upper footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-gaming text-lg font-black text-white tracking-wider">
              FUEGO<span className="text-orange-500">STORE</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Plataforma líder en recargas automáticas de diamantes Free Fire y canje directo de pines digitales en América Latina y el mundo.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Conexión directa Litingm / Garena</span>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-xs font-gaming">
            Servicios Principales
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={onOpenVerifier} className="hover:text-cyan-400 transition-colors text-left">
                Verificador de Nickname FF
              </button>
            </li>
            <li>
              <button onClick={onOpenRedeem} className="hover:text-cyan-400 transition-colors text-left">
                Canje Directo de Pines
              </button>
            </li>
            <li>
              <span className="text-slate-500">Pase Booyah y Membresías VIP</span>
            </li>
            <li>
              <span className="text-slate-500">Programa para Revendedores</span>
            </li>
          </ul>
        </div>

        {/* Pasarelas de Pago */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-xs font-gaming">
            Pasarelas Disponibles
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Mercado Pago (Transferencia, CVU & QR)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Binance Pay (USDT TRC20, Pay ID)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Saldo de Billetera Virtual FuegoStore</span>
            </div>
          </div>
        </div>

        {/* Soporte 24/7 */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-xs font-gaming">
            Atención al Cliente
          </h4>
          <p className="text-slate-400 text-xs mb-3">
            ¿Tenés alguna consulta sobre una orden o recarga? Contactanos vía WhatsApp oficial.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappSupportNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Soporte WhatsApp 24/7</span>
          </a>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="border-t border-slate-900 bg-black/40 py-4 px-4 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 FuegoStore. Free Fire y Garena son marcas registradas de Garena Online Private Limited. Este sitio no está afiliado directamente con Garena ni con sus subsidiarias.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desarrollado para gamers</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
