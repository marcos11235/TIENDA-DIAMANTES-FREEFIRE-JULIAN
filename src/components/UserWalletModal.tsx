import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  PlusCircle,
  CreditCard,
  QrCode,
  DollarSign,
  X,
  Package,
} from 'lucide-react';
import { Order, PaymentTopUpRequest, StoreSettings, UserProfile } from '../types';
import { storeDb } from '../services/storeDatabase';

interface UserWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  currency: 'USD' | 'ARS';
  settings: StoreSettings;
  orders: Order[];
  topups: PaymentTopUpRequest[];
  onOpenGoogleLogin: () => void;
}

export const UserWalletModal: React.FC<UserWalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currency,
  settings,
  orders,
  topups,
  onOpenGoogleLogin,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'balance' | 'topup' | 'orders'>('balance');
  const [topUpGateway, setTopUpGateway] = useState<'mercadopago' | 'binance'>('mercadopago');
  const [topUpAmount, setTopUpAmount] = useState<number>(10);
  const [topUpProof, setTopUpProof] = useState<string>('');
  const [topUpSubmitted, setTopUpSubmitted] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-6 text-center text-slate-100 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-gaming">Inicia Sesión con Google</h3>
          <p className="text-xs text-slate-400">
            Necesitas iniciar sesión para acceder a tu billetera personal, recargar saldo y ver tus compras.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-semibold"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenGoogleLogin();
              }}
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-xs font-bold text-white"
            >
              Ingresar con Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === currentUser.id);
  const myTopUps = topups.filter((t) => t.userId === currentUser.id);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendTopUpRequest = () => {
    if (!topUpProof.trim()) {
      alert('Por favor ingresa el comprobante o referencia de pago.');
      return;
    }

    storeDb.requestTopUp({
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      amount: topUpAmount,
      currency: topUpGateway === 'binance' ? 'USD' : 'ARS',
      gateway: topUpGateway,
      proofReference: topUpProof.trim(),
    });

    setTopUpSubmitted(true);
    setTopUpProof('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e1424] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-gaming uppercase tracking-wider text-white">
                Mi Billetera & Saldo
              </h3>
              <p className="text-xs text-slate-400">{currentUser.name} ({currentUser.email})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2 my-4 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveSubTab('balance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'balance'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Saldo & Resumen
          </button>
          <button
            onClick={() => setActiveSubTab('topup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'topup'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Cargar Saldo</span>
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'orders'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historial de Compras ({myOrders.length})</span>
          </button>
        </div>

        {/* SUBTAB 1: BALANCE & RESUMEN */}
        {activeSubTab === 'balance' && (
          <div className="space-y-5">
            {/* Balance hero card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#122424] via-[#0e1d1d] to-[#091515] border border-emerald-500/40 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 block mb-1">
                    Saldo Disponible Actual
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-300">
                    ${currentUser.balanceUsd.toFixed(2)}{' '}
                    <span className="text-lg text-emerald-400/80">USD / USDT</span>
                  </div>
                  <div className="text-base font-bold font-mono text-slate-300 mt-1">
                    ≈ ${currentUser.balanceArs.toLocaleString('es-AR')} ARS
                  </div>
                </div>

                <button
                  onClick={() => setActiveSubTab('topup')}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Cargar Saldo Ahora</span>
                </button>
              </div>
            </div>

            {/* Quick benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-black/40 p-3 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block">1-Click Checkout</span>
                <span className="text-slate-400">Recarga diamantes al instante sin subir comprobantes cada vez.</span>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block">Tasa Fija Protegida</span>
                <span className="text-slate-400">Tus fondos no se devalúan y tienes saldo siempre a mano.</span>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block">Ideal Revendedores</span>
                <span className="text-slate-400">Gestiona compras múltiples con agilidad para tus clientes.</span>
              </div>
            </div>

            {/* Recent Solicitudes de Recarga */}
            {myTopUps.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Tus Solicitudes de Carga de Saldo:
                </h4>
                <div className="space-y-2">
                  {myTopUps.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-black/30 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">
                          {t.gateway === 'binance' ? 'Binance Pay' : 'Mercado Pago'} • {t.amount} {t.currency}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Ref: {t.proofReference}
                        </div>
                      </div>
                      <span
                        className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                          t.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : t.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {t.status === 'approved'
                          ? 'Acreditado'
                          : t.status === 'rejected'
                          ? 'Rechazado'
                          : 'Pendiente de Aprobación'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: CARGAR SALDO */}
        {activeSubTab === 'topup' && (
          <div className="space-y-4">
            {topUpSubmitted && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/60 rounded-2xl flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong>¡Solicitud de carga enviada con éxito!</strong> El administrador verificará la transferencia y acreditará tus fondos a la brevedad.
                </div>
              </div>
            )}

            {/* Gateway choice */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Método para Transferir Fondos:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTopUpGateway('mercadopago')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    topUpGateway === 'mercadopago'
                      ? 'bg-sky-950/50 border-sky-400 text-white ring-2 ring-sky-400/30'
                      : 'bg-black/30 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-sky-400">Mercado Pago (ARS)</div>
                  <div className="text-[10px] text-slate-400">Transferencia bancaria / CVU / Alias</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTopUpGateway('binance')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    topUpGateway === 'binance'
                      ? 'bg-amber-950/50 border-amber-400 text-white ring-2 ring-amber-400/30'
                      : 'bg-black/30 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-amber-400">Binance Pay (USDT)</div>
                  <div className="text-[10px] text-slate-400">Pay ID o Red TRC-20 (Dólares Cripto)</div>
                </button>
              </div>
            </div>

            {/* Transfer details based on choice */}
            {topUpGateway === 'mercadopago' ? (
              <div className="p-4 bg-sky-950/20 border border-sky-800/40 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-sky-400 font-bold">
                  <span>Alias: {settings.mpAlias}</span>
                  <button
                    onClick={() => copyToClipboard(settings.mpAlias, 'alias2')}
                    className="text-sky-300 hover:text-white"
                  >
                    {copiedField === 'alias2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-slate-300">CVU: <span className="font-mono">{settings.mpCvu}</span></div>
                <div className="text-slate-400">Titular: {settings.mpHolderName}</div>
              </div>
            ) : (
              <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-amber-400 font-bold">
                  <span>Binance Pay ID: {settings.binancePayId}</span>
                  <button
                    onClick={() => copyToClipboard(settings.binancePayId, 'payid2')}
                    className="text-amber-300 hover:text-white"
                  >
                    {copiedField === 'payid2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-slate-300">Red TRC-20: <span className="font-mono truncate block">{settings.binanceUsdtAddress}</span></div>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Monto a Transferir ({topUpGateway === 'binance' ? 'USD / USDT' : 'Pesos ARS'}):
              </label>
              <input
                type="number"
                min="1"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white outline-none focus:border-emerald-400"
              />
            </div>

            {/* Reference input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Comprobante / Número de Operación / Hash TXID:
              </label>
              <input
                type="text"
                placeholder="Pega aquí el código o número de la transferencia"
                value={topUpProof}
                onChange={(e) => setTopUpProof(e.target.value)}
                className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none focus:border-emerald-400"
              />
            </div>

            <button
              onClick={handleSendTopUpRequest}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            >
              Enviar Notificación de Transferencia al Admin
            </button>
          </div>
        )}

        {/* SUBTAB 3: HISTORIAL DE COMPRAS */}
        {activeSubTab === 'orders' && (
          <div className="space-y-3">
            {myOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No tienes compras registradas todavía. ¡Explora la tienda de diamantes!
              </div>
            ) : (
              myOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 bg-black/40 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">{ord.id}</span>
                      <span className="text-slate-400">• {new Date(ord.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="font-bold text-white">{ord.packageTitle}</div>
                    <div className="text-slate-400 font-mono">
                      ID Destino: <strong className="text-slate-200">{ord.playerId}</strong> ({ord.playerNickname})
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-amber-300">
                      💎 {ord.diamondsTotal.toLocaleString()} FF
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {ord.gateway === 'wallet' ? 'Pago con Saldo' : ord.gateway.toUpperCase()} • ${ord.amountUsd.toFixed(2)} USD
                    </div>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : ord.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {ord.status === 'delivered' ? 'ACREDITADO' : ord.status === 'pending' ? 'EN REVISIÓN' : 'RECHAZADO'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
