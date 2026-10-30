import React, { useState } from 'react';
import { X, ShieldCheck, User, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { DEFAULT_ADMIN_EMAIL } from '../services/storeDatabase';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name?: string) => void;
  adminEmail: string;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  adminEmail,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    onLogin(customEmail.trim(), customName.trim() || undefined);
    onClose();
  };

  const handleQuickLogin = (email: string, name: string) => {
    onLogin(email, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0e1424] border-2 border-red-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-2 flex items-center justify-center shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h3 className="text-base font-bold font-gaming uppercase tracking-wide text-white">
                Iniciar Sesión con Google
              </h3>
              <p className="text-xs text-slate-400">OAuth 2.0 & Control de Roles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick profiles */}
        <div className="py-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cuentas de Acceso Rápido:
          </div>

          {/* Admin Profile */}
          <button
            onClick={() => handleQuickLogin(adminEmail, 'Gabriel (Admin)')}
            className="w-full p-3 bg-pink-950/30 hover:bg-pink-950/60 border border-pink-500/40 rounded-2xl flex items-center justify-between transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Gabriel (Administrador Principal)</span>
                  <span className="bg-pink-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                    ADMIN
                  </span>
                </div>
                <div className="text-[11px] text-pink-300 font-mono">{adminEmail}</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Reseller Profile */}
          <button
            onClick={() => handleQuickLogin('revendedor_pro@ffstore.com', 'Carlos Revendedor Pro')}
            className="w-full p-3 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-500/40 rounded-2xl flex items-center justify-between transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Carlos Revendedor VIP</span>
                  <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded">
                    REVENDEDOR
                  </span>
                </div>
                <div className="text-[11px] text-amber-300 font-mono">revendedor_pro@ffstore.com</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Client Profile */}
          <button
            onClick={() => handleQuickLogin('gamer_latam99@gmail.com', 'Lucas Gamer')}
            className="w-full p-3 bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-800/40 rounded-2xl flex items-center justify-between transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Lucas Martínez</span>
                  <span className="bg-cyan-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded">
                    CLIENTE
                  </span>
                </div>
                <div className="text-[11px] text-cyan-300 font-mono">gamer_latam99@gmail.com</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Or enter custom Google Account */}
        <div className="pt-3 border-t border-slate-800">
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              O ingresa con otro correo de Google:
            </div>
            <div>
              <input
                type="email"
                placeholder="tu.correo@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-400"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Nombre o Nickname (opcional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Continuar con este correo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
