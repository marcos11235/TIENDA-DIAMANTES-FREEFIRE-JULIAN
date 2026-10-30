import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Gem,
  Upload,
  ArrowRight,
  QrCode,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DiamondPackage, PaymentGateway, StoreSettings, UserProfile } from '../types';
import { storeDb } from '../services/storeDatabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: DiamondPackage | null;
  quantity: number;
  currency: 'USD' | 'ARS';
  currentUser: UserProfile | null;
  verifiedPlayerId?: string;
  verifiedNickname?: string;
  onOpenIdVerifier: () => void;
  onOpenGoogleLogin: () => void;
  settings: StoreSettings;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  pkg,
  quantity,
  currency,
  currentUser,
  verifiedPlayerId,
  verifiedNickname,
  onOpenIdVerifier,
  onOpenGoogleLogin,
  settings,
  onOrderCompleted,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('mercadopago');
  const [proofReference, setProofReference] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !pkg) return null;

  const totalUsd = +(pkg.priceUsd * quantity).toFixed(2);
  const totalArs = Math.round(pkg.priceArs * quantity);
  const totalDiamonds = (pkg.diamonds + pkg.bonusDiamonds) * quantity;

  // Check if user has sufficient wallet balance
  const hasSufficientWalletBalance = currentUser
    ? currency === 'USD'
      ? currentUser.balanceUsd >= totalUsd
      : currentUser.balanceArs >= totalArs
    : false;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async () => {
    if (!currentUser) {
      onOpenGoogleLogin();
      return;
    }

    if (!verifiedPlayerId) {
      onOpenIdVerifier();
      return;
    }

    if (selectedGateway !== 'wallet' && !proofReference.trim()) {
      alert('Por favor ingresa el número de comprobante de transferencia o TXID de la transacción.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = storeDb.createOrder({
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        packageId: pkg.id,
        packageTitle: pkg.title,
        diamondsTotal: totalDiamonds,
        amountUsd: totalUsd,
        amountArs: totalArs,
        gateway: selectedGateway,
        playerId: verifiedPlayerId,
        playerNickname: verifiedNickname || `ID: ${verifiedPlayerId}`,
        paymentReference: selectedGateway === 'wallet' ? 'SALDO-BILLETERA-INSTANT' : proofReference,
        proofImageUrl: proofImage || undefined,
      });

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setOrderSuccess(newOrder);
      onOrderCompleted();
    } catch (err: any) {
      alert('Error al generar la orden: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setOrderSuccess(null);
    setProofReference('');
    setProofImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0d1322] border-2 border-orange-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-orange-950/60 my-6 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-gaming uppercase tracking-wider text-white">
                Finalizar Recarga de Diamantes
              </h3>
              <p className="text-xs text-slate-400">
                Acreditación directa vía Garena / Litingm API
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Screen */}
        {orderSuccess ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black font-gaming text-white uppercase">
              {orderSuccess.status === 'delivered'
                ? '¡Recarga Acreditada al Instante!'
                : '¡Orden Generada con Éxito!'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              {orderSuccess.status === 'delivered'
                ? `Los ${totalDiamonds} diamantes han sido acreditados a tu cuenta ${verifiedNickname} (${verifiedPlayerId}).`
                : 'Tu comprobante de pago fue recibido y está en cola de aprobación prioritaria por el administrador.'}
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#121929] border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Código de Orden:</span>
                <span className="font-mono font-bold text-cyan-400">{orderSuccess.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Paquete:</span>
                <span className="font-bold text-white">{pkg.title} x{quantity}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Diamantes Totales:</span>
                <span className="font-bold text-amber-400">{totalDiamonds.toLocaleString()} FF</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Destino (Player ID):</span>
                <span className="font-mono font-bold text-white">
                  {verifiedPlayerId} ({verifiedNickname})
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Abonado:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {currency === 'USD' ? `$${totalUsd.toFixed(2)} USD` : `$${totalArs.toLocaleString('es-AR')} ARS`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estado:</span>
                <span
                  className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                    orderSuccess.status === 'delivered'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {orderSuccess.status === 'delivered' ? 'ACREDITADO' : 'PENDIENTE DE REVISIÓN'}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer"
            >
              Cerrar y Volver a la Tienda
            </button>
          </div>
        ) : (
          /* Normal Checkout Form */
          <div className="space-y-5 pt-4">
            {/* Package details banner with Official Image Asset */}
            <div className="flex items-center gap-3.5 p-3.5 bg-black/50 rounded-2xl border border-slate-800">
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-black/95 border border-cyan-800/60 shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-400">Paquete Seleccionado:</div>
                <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 truncate">
                  <span className="truncate">{pkg.title}</span>
                  {quantity > 1 && (
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-cyan-400 font-mono shrink-0">
                      x{quantity}
                    </span>
                  )}
                </div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">
                  💎 {totalDiamonds.toLocaleString()} Diamantes Totales
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400">Total a Pagar:</div>
                <div className="text-lg sm:text-xl font-black font-mono text-cyan-400">
                  {currency === 'USD'
                    ? `$${totalUsd.toFixed(2)} USD`
                    : `$${totalArs.toLocaleString('es-AR')} ARS`}
                </div>
              </div>
            </div>

            {/* Target Player ID box */}
            <div className="p-3.5 bg-[#121929] rounded-2xl border border-cyan-800/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Cuenta Free Fire Receptora:
                </span>
                <button
                  onClick={onOpenIdVerifier}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
                >
                  {verifiedPlayerId ? 'Cambiar ID' : 'Ingresar / Verificar ID'}
                </button>
              </div>

              {verifiedPlayerId ? (
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="font-mono text-sm font-bold text-white">{verifiedPlayerId}</span>
                      <span className="text-xs text-amber-300 font-bold ml-2">({verifiedNickname})</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    VERIFICADO
                  </span>
                </div>
              ) : (
                <div
                  onClick={onOpenIdVerifier}
                  className="p-2.5 bg-amber-950/30 border border-amber-600/40 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-950/50 transition-colors"
                >
                  <span className="text-xs text-amber-300 font-semibold">
                    ⚠️ No has verificado tu Player ID. Haz clic aquí para verificarlo.
                  </span>
                  <span className="text-xs bg-amber-500 text-black font-bold px-2.5 py-1 rounded-lg">
                    Verificar Ahora
                  </span>
                </div>
              )}
            </div>

            {/* Gateway Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Selecciona Método de Pago:
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Mercado Pago */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('mercadopago')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'mercadopago'
                      ? 'bg-sky-950/50 border-sky-400 ring-2 ring-sky-400/30 text-white'
                      : 'bg-[#121929] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-sky-400">Mercado Pago</span>
                    <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-1 rounded">ARS</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Alias, CVU o QR (Pesos)
                  </p>
                </button>

                {/* Binance Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('binance')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'binance'
                      ? 'bg-amber-950/50 border-amber-400 ring-2 ring-amber-400/30 text-white'
                      : 'bg-[#121929] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-amber-400">Binance Pay</span>
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1 rounded">USDT</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Pay ID / TRC20 (Cripto)
                  </p>
                </button>

                {/* Saldo de Billetera */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('wallet')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'wallet'
                      ? 'bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-400/30 text-white'
                      : 'bg-[#121929] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-emerald-400">Saldo Cuenta</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1 rounded">
                      1-CLICK
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {currentUser
                      ? currency === 'USD'
                        ? `$${currentUser.balanceUsd.toFixed(2)} USD`
                        : `$${currentUser.balanceArs.toLocaleString('es-AR')} ARS`
                      : 'Inicia sesión'}
                  </p>
                </button>
              </div>
            </div>

            {/* Gateway Details & Transfer Instructions */}
            {selectedGateway === 'mercadopago' && (
              <div className="p-4 bg-sky-950/20 border border-sky-800/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Datos para Transferir (Mercado Pago Argentina / LATAM)
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Monto exacto: ${totalArs.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Alias de Mercado Pago:</span>
                      <span className="font-mono font-bold text-white">{settings.mpAlias}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(settings.mpAlias, 'alias')}
                      className="text-sky-400 hover:text-sky-300 p-1"
                    >
                      {copiedField === 'alias' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">CVU Oficial:</span>
                      <span className="font-mono font-bold text-white truncate max-w-[140px]">{settings.mpCvu}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(settings.mpCvu, 'cvu')}
                      className="text-sky-400 hover:text-sky-300 p-1"
                    >
                      {copiedField === 'cvu' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Titular de la cuenta: <strong className="text-white">{settings.mpHolderName}</strong>
                </div>

                {/* Comprobante input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Número de Operación / Comprobante de Mercado Pago:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 9812481902 o MP-2026-X81"
                    value={proofReference}
                    onChange={(e) => setProofReference(e.target.value)}
                    className="w-full bg-[#101726] border border-sky-800/60 focus:border-sky-400 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>
            )}

            {selectedGateway === 'binance' && (
              <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Datos Binance Pay (Cripto / Dólares)
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Monto: ${totalUsd.toFixed(2)} USDT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Binance Pay ID:</span>
                      <span className="font-mono font-bold text-amber-300">{settings.binancePayId}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(settings.binancePayId, 'payid')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'payid' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Red USDT (TRC-20):</span>
                      <span className="font-mono font-bold text-white truncate max-w-[130px]">
                        {settings.binanceUsdtAddress}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(settings.binanceUsdtAddress, 'address')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'address' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* TXID input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    TXID / Hash de la Transacción o Binance Order ID:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 0x984928194a... o Pay ID remitente"
                    value={proofReference}
                    onChange={(e) => setProofReference(e.target.value)}
                    className="w-full bg-[#101726] border border-amber-800/60 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>
            )}

            {selectedGateway === 'wallet' && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Pago Inmediato con Saldo
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    Acreditación Automática en 60 segundos
                  </span>
                </div>
                {currentUser ? (
                  <div className="text-xs text-slate-300 space-y-1">
                    <p>
                      Tu saldo disponible es de{' '}
                      <strong className="text-white">
                        {currency === 'USD'
                          ? `$${currentUser.balanceUsd.toFixed(2)} USD`
                          : `$${currentUser.balanceArs.toLocaleString('es-AR')} ARS`}
                      </strong>
                      . Se descontará automáticamente el total ({currency === 'USD' ? `$${totalUsd.toFixed(2)} USD` : `$${totalArs.toLocaleString('es-AR')} ARS`}).
                    </p>
                    {!hasSufficientWalletBalance && (
                      <p className="text-rose-400 font-semibold pt-1">
                        ⚠️ Saldo insuficiente en tu cuenta. Por favor recarga saldo antes o selecciona Mercado Pago / Binance Pay.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-amber-300">
                    Debes iniciar sesión con Google para usar tu saldo.
                  </p>
                )}
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                onClick={handleSubmitOrder}
                disabled={
                  isSubmitting ||
                  !verifiedPlayerId ||
                  (selectedGateway === 'wallet' && (!currentUser || !hasSufficientWalletBalance))
                }
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Procesando Recarga...</span>
                ) : (
                  <>
                    <span>Confirmar y Enviar Recarga ({totalDiamonds.toLocaleString()} FF)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
