import React, { useState } from 'react';
import { X, Database, CheckCircle2, ShieldCheck, Key, ExternalLink } from 'lucide-react';
import { getSavedSupabaseConfig, saveSupabaseConfig, resetSupabaseClient } from '../services/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getSavedSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [isEnabled, setIsEnabled] = useState(currentConfig.isEnabled || false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      isEnabled,
    });
    resetSupabaseClient();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0e1424] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-gaming uppercase tracking-wide text-white">
                Configuración Supabase
              </h3>
              <p className="text-xs text-slate-400">Base de Datos & Auth en Tiempo Real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saved && (
          <div className="my-3 p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configuración de Supabase guardada correctamente</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 pt-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-slate-800">
            <div>
              <span className="font-bold text-white block">Sincronización Supabase Cloud</span>
              <span className="text-[11px] text-slate-400">
                {isEnabled ? 'Activo con servidor remoto' : 'Modo local reactivo (predeterminado)'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Supabase Project URL:
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Supabase Anon Key:
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-cyan-400"
            />
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-xl text-[11px] text-slate-400 leading-relaxed">
            Por defecto, la tienda utiliza un motor reactivo local con persistencia completa en navegador para clientes, saldo, pedidos y pines. Si conectas tus credenciales de Supabase, los perfiles y compras se sincronizan en tu base de datos cloud.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-extrabold uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
          >
            Guardar Configuración
          </button>
        </form>
      </div>
    </div>
  );
};
