import React, { useState } from 'react';
import {
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Gem,
  ArrowRight,
  ShieldCheck,
  Search,
  Clock,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PinCode, UserProfile } from '../types';
import { storeDb } from '../services/storeDatabase';

interface RedeemPinSectionProps {
  currentUser: UserProfile | null;
  verifiedPlayerId?: string;
  verifiedNickname?: string;
  onOpenIdVerifier: () => void;
  onOpenGoogleLogin: () => void;
  allPins: PinCode[];
}

export const RedeemPinSection: React.FC<RedeemPinSectionProps> = ({
  currentUser,
  verifiedPlayerId,
  verifiedNickname,
  onOpenIdVerifier,
  onOpenGoogleLogin,
  allPins,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{
    success: boolean;
    message: string;
    pin?: PinCode;
  } | null>(null);

  const availablePins = allPins.filter((p) => !p.isRedeemed);
  const myRedeemedPins = allPins.filter(
    (p) => p.isRedeemed && currentUser && p.redeemedByUserId === currentUser.id
  );

  const handleRedeem = async () => {
    if (!currentUser) {
      onOpenGoogleLogin();
      return;
    }

    if (!verifiedPlayerId) {
      onOpenIdVerifier();
      return;
    }

    const cleanPin = pinInput.trim().toUpperCase();
    if (!cleanPin) {
      setRedeemResult({
        success: false,
        message: 'Por favor ingresa un código de PIN de diamantes válido.',
      });
      return;
    }

    setLoading(true);
    setRedeemResult(null);

    // Realistic API network simulation
    await new Promise((r) => setTimeout(r, 650));

    const result = storeDb.redeemPin(cleanPin, currentUser.id, verifiedPlayerId);
    setRedeemResult(result);
    setLoading(false);

    if (result.success) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
      setPinInput('');
    }
  };

  const handleUsePresetPin = (code: string) => {
    setPinInput(code);
    setRedeemResult(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Header for Pin Redemption */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#11192e] via-[#0f1c36] to-[#1a122e] border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto text-cyan-400 mb-4 shadow-lg shadow-cyan-500/20">
          <KeyRound className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-black font-gaming uppercase tracking-wider text-white">
          Canje Directo de <span className="text-cyan-400">Pines Digitales</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
          Ingresa aquí tu código de PIN prepago de Free Fire (Garena) para canjearlo al instante
          directo a tu cuenta sin salir de la tienda.
        </p>

        {/* Player ID verification pill inside redeem */}
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 bg-black/50 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400">Cuenta de Destino:</span>
          {verifiedPlayerId ? (
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-cyan-400">{verifiedPlayerId}</span>
              {verifiedNickname && <span className="text-amber-300 font-bold">({verifiedNickname})</span>}
              <button
                onClick={onOpenIdVerifier}
                className="text-[11px] text-cyan-400 hover:text-white underline ml-1 cursor-pointer"
              >
                Cambiar ID
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenIdVerifier}
              className="text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Verificar Player ID Primero</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Redeem Box */}
      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Código del PIN Digital de Diamantes:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Ejemplo: FF-DIAM-9482-1060 o FF-GOLD-3310-520"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.toUpperCase());
                setRedeemResult(null);
              }}
              className="flex-1 bg-[#141d33] border border-cyan-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 rounded-2xl px-5 py-4 text-base sm:text-lg font-mono font-bold text-cyan-300 placeholder-slate-500 outline-none uppercase tracking-widest transition-all"
            />
            <button
              onClick={handleRedeem}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <span>Validando PIN en Garena...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Canjear PIN Ahora</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback message banner */}
        {redeemResult && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 animate-fadeIn ${
              redeemResult.success
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            }`}
          >
            {redeemResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">{redeemResult.message}</p>
              {redeemResult.pin && (
                <div className="mt-2 text-xs text-emerald-300 font-mono">
                  💎 Total: {redeemResult.pin.diamonds + redeemResult.pin.bonusDiamonds} Diamantes • Código: {redeemResult.pin.code}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available PINs in Stock for instant testing */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Pines de Prueba Disponibles en Inventario:
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              {availablePins.length} Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availablePins.slice(0, 4).map((pin) => (
              <div
                key={pin.id}
                onClick={() => handleUsePresetPin(pin.code)}
                className="p-3 bg-[#131d33] hover:bg-[#1a2745] border border-cyan-800/40 hover:border-cyan-500/80 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300">
                    {pin.code}
                  </span>
                  <div className="text-[11px] text-amber-400 font-semibold">
                    💎 {pin.diamonds} + {pin.bonusDiamonds} Diamantes (${pin.valueUsd.toFixed(2)} USD)
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-lg group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                  Usar Código
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* My Redeemed Pins History */}
        {currentUser && myRedeemedPins.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Tus Pines Canjeados Recientemente:
            </h4>
            <div className="space-y-2">
              {myRedeemedPins.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-black/30 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-300">{p.code}</span>
                    <span className="text-slate-500 ml-2">
                      ({new Date(p.redeemedAt || '').toLocaleDateString('es-ES')})
                    </span>
                  </div>
                  <span className="font-bold text-emerald-400">
                    +{p.diamonds + p.bonusDiamonds} Diamantes
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-400 space-y-1.5">
          <p className="text-cyan-300 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            ¿Cómo funciona el Canje de Pines?
          </p>
          <p>
            Los pines son códigos prepagos oficiales de Garena. Al ingresarlos en FuegoStore, nuestro sistema se conecta automáticamente a la pasarela de canje oficial y deposita los diamantes en tu ID sin que tengas que iniciar sesión en páginas externas ni esperar demoras.
          </p>
        </div>
      </div>
    </div>
  );
};
