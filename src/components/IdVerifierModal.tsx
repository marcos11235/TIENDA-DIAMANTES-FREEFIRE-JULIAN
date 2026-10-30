import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Flame,
  Award,
  Globe,
  ThumbsUp,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { verifyPlayerId } from '../services/ffVerification';
import { PlayerVerificationResult } from '../types';

interface IdVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmId: (playerId: string, nickname: string) => void;
  initialPlayerId?: string;
}

export const IdVerifierModal: React.FC<IdVerifierModalProps> = ({
  isOpen,
  onClose,
  onConfirmId,
  initialPlayerId = '',
}) => {
  const [playerIdInput, setPlayerIdInput] = useState(initialPlayerId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlayerVerificationResult | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (idToTest?: string) => {
    const targetId = (idToTest || playerIdInput).trim();
    if (!targetId) {
      setError('Por favor ingresa tu Player ID de Free Fire.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await verifyPlayerId(targetId);
      setResult(data);
      setPlayerIdInput(data.playerId);
    } catch (err: any) {
      setError(err.message || 'Error al verificar ID en los servidores de Free Fire.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setPlayerIdInput(presetId);
    handleVerify(presetId);
  };

  const handleConfirm = () => {
    if (result) {
      onConfirmId(result.playerId, result.nickname);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1422] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-gaming uppercase tracking-wide text-white">
                Verificador de Player ID FF
              </h3>
              <p className="text-xs text-slate-400">
                Garantiza que la recarga llegue a tu cuenta oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Ingresa tu Player ID (Solo Números)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ejemplo: 1289471928"
                value={playerIdInput}
                onChange={(e) => {
                  setPlayerIdInput(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify();
                }}
                className="w-full bg-[#141b2d] border border-cyan-800/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white placeholder-slate-500 outline-none transition-all"
              />
              <button
                onClick={() => handleVerify()}
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-black text-xs uppercase rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Verificar</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-xs text-rose-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick presets for testing */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              IDs de prueba rápida:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: '1289471928', label: '1289471928 (亗ＴＯＸＩＣＯ亗)' },
                { id: '8492019482', label: '8492019482 (NOOB_PRO)' },
                { id: '3910482019', label: '3910482019 (Vampiro)' },
                { id: '5519402847', label: '5519402847 (Suprema)' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-cyan-300 rounded-lg transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Card */}
          {result && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131d33] to-[#0d1424] border-2 border-emerald-500/50 shadow-lg animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    ¡Cuenta Verificada Oficialmente!
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Garena Server Latam
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-3">
                <div className="bg-black/30 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Apodo (Nickname):</span>
                  <span className="text-base font-black text-amber-300 font-gaming tracking-wide">
                    {result.nickname}
                  </span>
                </div>

                <div className="bg-black/30 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">ID Confirmado:</span>
                  <span className="text-base font-mono font-bold text-cyan-400">
                    {result.playerId}
                  </span>
                </div>

                <div className="bg-black/30 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nivel de Cuenta:</span>
                    <span className="text-xs font-bold text-white">Nivel {result.level}</span>
                  </div>
                </div>

                <div className="bg-black/30 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Región:</span>
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">{result.region}</span>
                  </div>
                </div>
              </div>

              {result.guildName && (
                <div className="text-xs text-slate-300 bg-black/20 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400">Clan / Guild:</span>
                  <span className="font-bold text-purple-300">{result.guildName}</span>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Usar Esta Cuenta para Compras</span>
                </button>
              </div>
            </div>
          )}

          <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-xl text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              ¿Por qué verificamos el ID?
            </p>
            <p>
              El sistema consulta el apodo en la base de datos para prevenir envíos a IDs equivocados. Una vez que confirmes que el nickname es tuyo, las recargas se procesarán automáticamente a este perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
