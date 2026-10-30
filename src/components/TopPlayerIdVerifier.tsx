import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Award,
  Globe,
  Loader2,
  Sparkles,
  UserCheck,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { verifyPlayerId } from '../services/ffVerification';
import { PlayerVerificationResult } from '../types';

interface TopPlayerIdVerifierProps {
  verifiedPlayerId?: string;
  verifiedNickname?: string;
  onConfirmId: (playerId: string, nickname: string) => void;
}

export const TopPlayerIdVerifier: React.FC<TopPlayerIdVerifierProps> = ({
  verifiedPlayerId = '',
  verifiedNickname = '',
  onConfirmId,
}) => {
  const [inputVal, setInputVal] = useState(verifiedPlayerId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedResult, setVerifiedResult] = useState<PlayerVerificationResult | null>(
    verifiedPlayerId
      ? {
          playerId: verifiedPlayerId,
          nickname: verifiedNickname || 'Jugador FF',
          region: 'LATAM (Sudamérica)',
          level: 72,
          likes: 18450,
          guildName: 'FUEGO_LEGEND™',
          verifiedAt: new Date().toISOString(),
        }
      : null
  );
  const [copied, setCopied] = useState(false);

  const handleVerify = async (idToTest?: string) => {
    const targetId = (idToTest || inputVal).trim().replace(/\D/g, '');
    if (!targetId) {
      setError('Por favor ingresa un Player ID numérico de Free Fire.');
      return;
    }

    if (targetId.length < 6 || targetId.length > 12) {
      setError('El ID de Free Fire debe tener entre 6 y 12 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await verifyPlayerId(targetId);
      setVerifiedResult(data);
      setInputVal(data.playerId);
      onConfirmId(data.playerId, data.nickname);
    } catch (err: any) {
      setError(err.message || 'No se pudo verificar el ID en los servidores de Free Fire.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (id: string) => {
    setInputVal(id);
    handleVerify(id);
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mb-8 relative rounded-3xl bg-gradient-to-b from-[#111827] via-[#0d1322] to-[#0a0e1a] border-2 border-cyan-500/50 p-5 sm:p-7 shadow-2xl shadow-cyan-950/40 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of the verifier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                PASO 1 OBLIGATORIO
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">• Reconocimiento de Cuenta Oficial</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-gaming uppercase tracking-wide text-white">
              Verificador de Player ID Free Fire
            </h2>
          </div>
        </div>

        {/* Verification Status Badge */}
        <div>
          {verifiedResult ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs font-bold shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cuenta Verificada en Servidor</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-amber-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Ingresa tu ID para desbloquear la compra</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Form & Result layout */}
      <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Input and Quick IDs */}
        <div className="lg:col-span-7 space-y-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Ingresa tu Player ID de Free Fire:
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-cyan-500/70" />
              <input
                type="text"
                placeholder="Ejemplo: 1289471928"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify();
                }}
                className="w-full bg-[#131b2e] border-2 border-cyan-700/60 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 rounded-2xl pl-11 pr-4 py-3 text-lg font-mono font-black text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={() => handleVerify()}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verificar Nickname</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold bg-rose-950/40 p-2.5 rounded-xl border border-rose-600/40">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick preset ID chips for testing */}
          <div className="pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Probar con IDs de muestra rápida:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: '1289471928', nick: '亗ＴＯＸＩＣＯ亗' },
                { id: '8492019482', nick: 'NOOB_PRO' },
                { id: '3910482019', nick: 'Vampiro_FF' },
                { id: '5519402847', nick: 'SUPREMA' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickPreset(p.id)}
                  className="px-3 py-1.5 bg-[#141d33] hover:bg-[#1c2948] border border-cyan-800/60 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{p.id}</span>
                  <span className="text-[10px] text-slate-400">({p.nick})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verified Player Profile Card */}
        <div className="lg:col-span-5">
          {verifiedResult ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#142038] to-[#0c1424] border-2 border-emerald-500/60 shadow-xl relative overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                    Cuenta Enlazada con Éxito
                  </span>
                </div>
                <button
                  onClick={() => copyId(verifiedResult.playerId)}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-mono"
                  title="Copiar ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/25 shrink-0">
                  <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center font-gaming text-2xl font-black text-amber-300">
                    FF
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                    Apodo (Nickname):
                  </span>
                  <h3 className="text-lg sm:text-xl font-black font-gaming text-amber-300 tracking-wider truncate drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    {verifiedResult.nickname}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      ID: {verifiedResult.playerId}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-bold">
                      Nivel {verifiedResult.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="bg-black/40 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{verifiedResult.region}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">{verifiedResult.guildName || 'Clan Oficial'}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">✓ Diamantes listos para entrega directa</span>
                <span className="font-mono text-[10px] text-slate-500">ID Guardado</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-cyan-500 mx-auto opacity-70" />
              <h4 className="text-sm font-bold text-white">¿Por qué verificar primero?</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Para garantizar que los diamantes se envíen a tu cuenta personal exacta sin margen de error. Una vez verificado tu apodo, cualquier paquete que elijas abajo se acreditará a este perfil.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
