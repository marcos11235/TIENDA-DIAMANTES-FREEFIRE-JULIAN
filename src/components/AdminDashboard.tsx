import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  KeyRound,
  Settings,
  DollarSign,
  Plus,
  Minus,
  Crown,
  Search,
  Gem,
  ExternalLink,
  Edit,
  Save,
  Check,
  Copy,
  AlertCircle,
  Upload,
  FileText,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Order,
  PaymentTopUpRequest,
  PinCode,
  StoreSettings,
  UserProfile,
  UserRole,
} from '../types';
import { storeDb } from '../services/storeDatabase';

interface AdminDashboardProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  allOrders: Order[];
  allTopups: PaymentTopUpRequest[];
  allPins: PinCode[];
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  allUsers,
  allOrders,
  allTopups,
  allPins,
  settings,
  onRefresh,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'pending' | 'users' | 'pins' | 'settings'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Balance adjustment modal state
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<UserProfile | null>(null);
  const [balanceDeltaUsd, setBalanceDeltaUsd] = useState<number>(10);
  const [balanceDeltaArs, setBalanceDeltaArs] = useState<number>(12200);

  // Pin Generator & Bulk Import state
  const [pinMode, setPinMode] = useState<'bulk' | 'generator'>('bulk');
  const [bulkPinText, setBulkPinText] = useState<string>('');
  const [bulkDenomination, setBulkDenomination] = useState<string>('572');
  const [bulkDiamonds, setBulkDiamonds] = useState<number>(520);
  const [bulkBonus, setBulkBonus] = useState<number>(52);
  const [bulkPriceUsd, setBulkPriceUsd] = useState<number>(5.25);
  const [bulkResellerEmail, setBulkResellerEmail] = useState<string>('');
  const [bulkImportResult, setBulkImportResult] = useState<{ count: number; duplicatesSkipped: number } | null>(null);

  const [pinDiamonds, setPinDiamonds] = useState<number>(1060);
  const [pinBonus, setPinBonus] = useState<number>(106);
  const [pinValueUsd, setPinValueUsd] = useState<number>(10.45);
  const [pinQuantity, setPinQuantity] = useState<number>(3);
  const [resellerTargetEmail, setResellerTargetEmail] = useState<string>('');
  const [generatedSuccessPins, setGeneratedSuccessPins] = useState<PinCode[] | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // KPI Calculations
  const totalRevenueUsd = allOrders
    .filter((o) => o.status === 'approved' || o.status === 'delivered')
    .reduce((acc, o) => acc + o.amountUsd, 0);

  const totalDiamondsDelivered = allOrders
    .filter((o) => o.status === 'approved' || o.status === 'delivered')
    .reduce((acc, o) => acc + o.diamondsTotal, 0);

  const pendingOrders = allOrders.filter((o) => o.status === 'pending');
  const pendingTopups = allTopups.filter((t) => t.status === 'pending');
  const totalPendingActions = pendingOrders.length + pendingTopups.length;

  const resellersCount = allUsers.filter((u) => u.role === 'reseller').length;
  const clientsCount = allUsers.filter((u) => u.role === 'client').length;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Actions
  const handleApproveOrder = (orderId: string) => {
    storeDb.updateOrderStatus(orderId, 'delivered', 'Aprobado manualmente por Admin');
    confetti({ particleCount: 80, spread: 60 });
    onRefresh();
  };

  const handleRejectOrder = (orderId: string) => {
    const reason = prompt('Motivo del rechazo de la orden (opcional):') || 'Comprobante no válido';
    storeDb.updateOrderStatus(orderId, 'rejected', reason);
    onRefresh();
  };

  const handleApproveTopUp = (topUpId: string) => {
    storeDb.processTopUp(topUpId, true, 'Transferencia verificada y saldo acreditado por Admin');
    confetti({ particleCount: 100, spread: 70 });
    onRefresh();
  };

  const handleRejectTopUp = (topUpId: string) => {
    const reason = prompt('Motivo de rechazo de la solicitud:') || 'Comprobante rechazado';
    storeDb.processTopUp(topUpId, false, reason);
    onRefresh();
  };

  const handleApplyBalanceAdjustment = () => {
    if (!selectedUserForBalance) return;
    storeDb.adjustUserBalance(
      selectedUserForBalance.id,
      balanceDeltaUsd,
      balanceDeltaArs
    );
    setSelectedUserForBalance(null);
    onRefresh();
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    storeDb.updateUserRole(userId, newRole);
    onRefresh();
  };

  const handleDenominationChange = (value: string) => {
    setBulkDenomination(value);
    switch (value) {
      case '110':
        setBulkDiamonds(100);
        setBulkBonus(10);
        setBulkPriceUsd(1.10);
        break;
      case '341':
        setBulkDiamonds(310);
        setBulkBonus(31);
        setBulkPriceUsd(3.20);
        break;
      case '572':
        setBulkDiamonds(520);
        setBulkBonus(52);
        setBulkPriceUsd(5.25);
        break;
      case '1166':
        setBulkDiamonds(1060);
        setBulkBonus(106);
        setBulkPriceUsd(10.45);
        break;
      case '2398':
        setBulkDiamonds(2180);
        setBulkBonus(218);
        setBulkPriceUsd(20.80);
        break;
      case '6160':
        setBulkDiamonds(5600);
        setBulkBonus(560);
        setBulkPriceUsd(51.50);
        break;
      default:
        break;
    }
  };

  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkPinText.trim()) return;

    const res = storeDb.bulkImportPins(
      bulkPinText,
      bulkDiamonds,
      bulkBonus,
      bulkPriceUsd,
      bulkResellerEmail.trim() || undefined
    );
    setBulkImportResult(res);
    setBulkPinText('');
    confetti({ particleCount: 80, spread: 60 });
    onRefresh();
  };

  const detectedBulkCodesCount = bulkPinText
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 6).length;

  const handleGeneratePins = (e: React.FormEvent) => {
    e.preventDefault();
    const created = storeDb.generatePins(
      pinDiamonds,
      pinBonus,
      pinValueUsd,
      pinQuantity,
      resellerTargetEmail.trim() || undefined
    );
    setGeneratedSuccessPins(created);
    onRefresh();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storeDb.updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    onRefresh();
  };

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.freeFireId && u.freeFireId.includes(searchQuery)) ||
      (u.freeFireNickname && u.freeFireNickname.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Admin Title & Role verification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-[#101726] border-2 border-pink-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-gaming uppercase tracking-wider text-white">
                Panel de Administración General
              </h2>
              <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Acceso autenticado como: <span className="text-pink-300 font-bold">{currentUser.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Estado de Operaciones:</span>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            EN LÍNEA
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ingresos Totales */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ingresos Totales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
            ${totalRevenueUsd.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            ≈ ${(totalRevenueUsd * settings.usdToArsRate).toLocaleString('es-AR')} ARS
          </div>
        </div>

        {/* Card 2: Pagos Pendientes */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Acciones Pendientes</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
            {totalPendingActions}
          </div>
          <div className="text-[11px] text-slate-400">
            {pendingOrders.length} compras / {pendingTopups.length} recargas de saldo
          </div>
        </div>

        {/* Card 3: Clientes & Revendedores */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Usuarios Totales</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white">
            {allUsers.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {clientsCount} clientes • {resellersCount} revendedores
          </div>
        </div>

        {/* Card 4: Diamantes Despachados */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Diamantes Enviados</span>
            <Gem className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-orange-400">
            {totalDiamondsDelivered.toLocaleString()} 💎
          </div>
          <div className="text-[11px] text-slate-400">
            {allPins.filter((p) => !p.isRedeemed).length} pines en stock
          </div>
        </div>
      </div>

      {/* Navigation tabs within Admin */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveAdminTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'pending'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Gestión de Pagos Pendientes ({totalPendingActions})</span>
          {totalPendingActions > 0 && (
            <span className="bg-black/80 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {totalPendingActions}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'users'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Control de Clientes & Saldos ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('pins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'pins'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Generador de Pines ({allPins.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'settings'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Precios Litingm & Pasarelas</span>
        </button>
      </div>

      {/* TAB 1: PENDING PAYMENTS (MERCADO PAGO / BINANCE) */}
      {activeAdminTab === 'pending' && (
        <div className="space-y-6">
          {/* Section: Pending Diamond Orders */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Gem className="w-4 h-4 text-orange-400" />
              <span>Compras de Diamantes por Aprobar ({pendingOrders.length})</span>
            </h3>

            {pendingOrders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-black/30 border border-slate-800 text-center text-xs text-slate-400">
                ✅ No hay compras directas pendientes de aprobación en este momento.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-[#0f172a] border border-amber-500/40 hover:border-amber-400 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 text-xs">{ord.id}</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            ord.gateway === 'mercadopago'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {ord.gateway === 'mercadopago' ? 'MERCADO PAGO (ARS)' : 'BINANCE PAY (USDT)'}
                        </span>
                        <span className="text-slate-400 text-xs font-mono">
                          {new Date(ord.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-sm font-extrabold text-white">
                        {ord.packageTitle} • <span className="text-amber-400">💎 {ord.diamondsTotal.toLocaleString()} Diamantes</span>
                      </div>

                      <div className="text-xs text-slate-300">
                        Cliente: <strong className="text-white">{ord.userName}</strong> ({ord.userEmail})
                      </div>

                      <div className="text-xs bg-black/40 p-2 rounded-lg border border-slate-800 font-mono text-cyan-300">
                        Target Free Fire: <strong>ID {ord.playerId}</strong> ({ord.playerNickname})
                      </div>

                      {ord.paymentReference && (
                        <div className="text-xs text-slate-400">
                          Comprobante / TXID: <strong className="text-amber-300 font-mono">{ord.paymentReference}</strong>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <div className="text-right sm:mr-2">
                        <div className="text-lg font-black font-mono text-emerald-400">
                          ${ord.amountUsd.toFixed(2)} USD
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ${ord.amountArs.toLocaleString('es-AR')} ARS
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectOrder(ord.id)}
                          className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Rechazar</span>
                        </button>

                        <button
                          onClick={() => handleApproveOrder(ord.id)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Aprobar & Despachar Diamantes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Pending Balance Top-Ups */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Solicitudes de Carga de Billetera ({pendingTopups.length})</span>
            </h3>

            {pendingTopups.length === 0 ? (
              <div className="p-6 rounded-2xl bg-black/30 border border-slate-800 text-center text-xs text-slate-400">
                ✅ No hay solicitudes de recarga de saldo pendientes.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTopups.map((top) => (
                  <div
                    key={top.id}
                    className="p-4 rounded-2xl bg-[#0f172a] border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 text-xs">{top.id}</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(top.createdAt).toLocaleDateString('es-ES')}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {top.gateway === 'binance' ? 'Binance USDT' : 'Mercado Pago'}
                        </span>
                      </div>

                      <div className="text-sm font-bold text-white">
                        Usuario: {top.userName} ({top.userEmail})
                      </div>

                      <div className="text-xs text-slate-400 font-mono">
                        Comprobante: <strong className="text-amber-300">{top.proofReference}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-black font-mono text-emerald-400">
                          +{top.amount} {top.currency}
                        </div>
                        <div className="text-[10px] text-slate-400">Acreditar a billetera</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectTopUp(top.id)}
                          className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Rechazar</span>
                        </button>

                        <button
                          onClick={() => handleApproveTopUp(top.id)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Acreditar Saldo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLIENTS & RESELLERS BALANCE CONTROL */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cliente, email, o ID FF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101726] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Filter by role */}
            <div className="flex items-center gap-1 bg-[#101726] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  roleFilter === 'all' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({allUsers.length})
              </button>
              <button
                onClick={() => setRoleFilter('client')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  roleFilter === 'client' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clientes ({clientsCount})
              </button>
              <button
                onClick={() => setRoleFilter('reseller')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  roleFilter === 'reseller' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Revendedores ({resellersCount})
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  roleFilter === 'admin' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admins
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0c1220]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#121929] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Cliente / Usuario</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">ID Free Fire</th>
                  <th className="p-3">Saldo Actual</th>
                  <th className="p-3 text-right">Acciones de Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* User info */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.email.toLowerCase() === settings.adminEmail.toLowerCase() && (
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role selector */}
                    <td className="p-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-pink-950/80 text-pink-300 border-pink-700/60'
                            : user.role === 'reseller'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                            : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                        }`}
                      >
                        <option value="client">CLIENTE</option>
                        <option value="reseller">REVENDEDOR (VIP)</option>
                        <option value="admin">ADMINISTRADOR</option>
                      </select>
                    </td>

                    {/* FF ID & Nickname */}
                    <td className="p-3">
                      {user.freeFireId ? (
                        <div>
                          <span className="font-mono font-bold text-cyan-400">{user.freeFireId}</span>
                          {user.freeFireNickname && (
                            <span className="block text-[10px] text-amber-300 font-bold truncate max-w-[120px]">
                              {user.freeFireNickname}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No configurado</span>
                      )}
                    </td>

                    {/* Balance */}
                    <td className="p-3">
                      <div className="font-mono font-bold text-emerald-400 text-sm">
                        ${user.balanceUsd.toFixed(2)} USD
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ${user.balanceArs.toLocaleString('es-AR')} ARS
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedUserForBalance(user)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-extrabold text-xs rounded-lg transition-all shadow-md cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Ajustar Saldo</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GENERADOR & GESTIÓN DE PINES DIGITALES */}
      {activeAdminTab === 'pins' && (
        <div className="space-y-6">
          {/* Mode Switcher: Bulk vs Generator */}
          <div className="flex items-center gap-2 bg-[#0c1220] p-1.5 rounded-2xl border border-slate-800 w-fit">
            <button
              type="button"
              onClick={() => setPinMode('bulk')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pinMode === 'bulk'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Carga Masiva (Pegar Códigos)</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                NUEVO
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPinMode('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pinMode === 'generator'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Generador Automático de Pines</span>
            </button>
          </div>

          {/* MODE 1: BULK / MASS PIN TEXTAREA IMPORT */}
          {pinMode === 'bulk' && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121b2f] via-[#0e1629] to-[#1a1230] border-2 border-purple-500/50 shadow-2xl shadow-purple-950/40 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-900/40 gap-2">
                <div className="flex items-center gap-2 text-purple-300 font-black text-sm uppercase tracking-wider">
                  <Upload className="w-5 h-5 text-purple-400" />
                  <span>Carga Masiva e Individual de Códigos de Pines (Textarea)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Detectados:{' '}
                    <strong className="text-cyan-300 text-sm">{detectedBulkCodesCount}</strong> códigos
                  </span>
                </div>
              </div>

              <form onSubmit={handleBulkImportSubmit} className="space-y-4">
                {/* Configuration Row: Denomination Dropdown & Unified Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Denomination Dropdown */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      1. Denominación de Diamantes:
                    </label>
                    <select
                      value={bulkDenomination}
                      onChange={(e) => handleDenominationChange(e.target.value)}
                      className="w-full bg-[#141d33] border-2 border-purple-500/50 focus:border-purple-400 rounded-xl px-3 py-2.5 text-white font-bold cursor-pointer outline-none"
                    >
                      <option value="110">110 Diamantes (100 + 10 Bonus)</option>
                      <option value="341">341 Diamantes (310 + 31 Bonus)</option>
                      <option value="572">572 Diamantes (520 + 52 Bonus)</option>
                      <option value="1166">1,166 Diamantes (1060 + 106 Bonus)</option>
                      <option value="2398">2,398 Diamantes (2180 + 218 Bonus)</option>
                      <option value="6160">6,160 Diamantes (5600 + 560 Bonus)</option>
                      <option value="custom">Personalizado (Manual)</option>
                    </select>
                  </div>

                  {/* Base Diamonds & Bonus */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      2. Diamantes Netos (+ Bonus):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={bulkDiamonds}
                        onChange={(e) => setBulkDiamonds(Number(e.target.value))}
                        className="bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                        title="Diamantes Base"
                        required
                      />
                      <input
                        type="number"
                        value={bulkBonus}
                        onChange={(e) => setBulkBonus(Number(e.target.value))}
                        className="bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                        title="Bonus Adicional"
                      />
                    </div>
                  </div>

                  {/* Unified Price ($USD) */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      3. Precio Unificado de la Tanda ($USD):
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
                      <input
                        type="number"
                        step="0.01"
                        value={bulkPriceUsd}
                        onChange={(e) => setBulkPriceUsd(Number(e.target.value))}
                        className="w-full bg-[#141d33] border-2 border-emerald-500/50 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-white font-mono font-black text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Optional Reseller Assignment */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      4. Asignar a Revendedor (Opcional):
                    </label>
                    <input
                      type="email"
                      placeholder="email@revendedor.com o vacío para stock general"
                      value={bulkResellerEmail}
                      onChange={(e) => setBulkResellerEmail(e.target.value)}
                      className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* The Large Textarea for Codes */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Pega aquí los códigos de pines (uno por línea o separados por comas):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const samples = [
                          'FF' + Math.floor(100000000000 + Math.random() * 900000000000),
                          'FF' + Math.floor(100000000000 + Math.random() * 900000000000),
                          'FF' + Math.floor(100000000000 + Math.random() * 900000000000),
                          'FF' + Math.floor(100000000000 + Math.random() * 900000000000),
                          'FF' + Math.floor(100000000000 + Math.random() * 900000000000),
                        ].join('\n');
                        setBulkPinText(samples);
                      }}
                      className="text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer underline"
                    >
                      + Pegar códigos de muestra
                    </button>
                  </div>

                  <textarea
                    rows={7}
                    value={bulkPinText}
                    onChange={(e) => setBulkPinText(e.target.value)}
                    placeholder={`Pega aquí tus pines individuales o en masa:\nFF938472918471\nFF827361948201\nFF192837465019\nFF839201948271\n...`}
                    className="w-full bg-[#0a0f1d] border-2 border-slate-700 focus:border-purple-400 rounded-2xl p-4 text-xs font-mono text-cyan-300 placeholder-slate-600 outline-none transition-all leading-relaxed"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1 text-[11px] text-slate-400">
                    <span>
                      Admite formatos: un código por línea, códigos con prefijo o guiones (ej. FF-XXXX-XXXX).
                    </span>
                    <span className="font-mono text-purple-300 font-bold">
                      {detectedBulkCodesCount} códigos válidos encontrados
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-400">
                    Todos los códigos pegados se crearán con{' '}
                    <strong className="text-amber-300">
                      💎 {bulkDiamonds} {bulkBonus > 0 ? `+ ${bulkBonus}` : ''} Diamantes
                    </strong>{' '}
                    a un precio unificado de{' '}
                    <strong className="text-emerald-300 font-mono">${bulkPriceUsd.toFixed(2)} USD</strong>.
                  </div>

                  <button
                    type="submit"
                    disabled={detectedBulkCodesCount === 0}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 hover:from-purple-400 hover:to-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      Importar {detectedBulkCodesCount > 0 ? `${detectedBulkCodesCount} Pines` : 'Pines'} a la Base de Datos
                    </span>
                  </button>
                </div>
              </form>

              {/* Success Result Box */}
              {bulkImportResult && (
                <div className="p-4 bg-emerald-950/50 border-2 border-emerald-500/60 rounded-2xl space-y-1.5 text-xs text-emerald-300 animate-fadeIn">
                  <div className="flex items-center gap-2 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>¡Importación Masiva Completada con Éxito!</span>
                  </div>
                  <div>
                    Se han agregado <strong>{bulkImportResult.count} pines nuevos</strong> a la base de datos disponibles para canje inmediato.
                  </div>
                  {bulkImportResult.duplicatesSkipped > 0 && (
                    <div className="text-amber-300 text-[11px]">
                      ⚠️ Se omitieron {bulkImportResult.duplicatesSkipped} códigos porque ya existían en el inventario.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODE 2: AUTOMATIC PIN GENERATOR */}
          {pinMode === 'generator' && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121b2f] via-[#0f172a] to-[#19142e] border-2 border-purple-500/40 space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider">
                <KeyRound className="w-5 h-5" />
                <span>Generador Automático de Pines de Diamantes</span>
              </div>

              <form onSubmit={handleGeneratePins} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Diamantes:</label>
                  <input
                    type="number"
                    value={pinDiamonds}
                    onChange={(e) => setPinDiamonds(Number(e.target.value))}
                    className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Bonus Diamantes:</label>
                  <input
                    type="number"
                    value={pinBonus}
                    onChange={(e) => setPinBonus(Number(e.target.value))}
                    className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Valor ($USD):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pinValueUsd}
                    onChange={(e) => setPinValueUsd(Number(e.target.value))}
                    className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Cantidad de Códigos:</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={pinQuantity}
                    onChange={(e) => setPinQuantity(Number(e.target.value))}
                    className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all"
                  >
                    Generar {pinQuantity} Pines
                  </button>
                </div>
              </form>

              {generatedSuccessPins && (
                <div className="p-4 bg-purple-950/40 border border-purple-500/50 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-purple-300">
                    🎉 ¡Se generaron {generatedSuccessPins.length} pines exitosamente!
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedSuccessPins.map((p) => (
                      <span
                        key={p.id}
                        onClick={() => copyCode(p.code)}
                        className="px-2.5 py-1 bg-black/50 border border-purple-500/40 text-cyan-300 rounded-lg font-mono cursor-pointer hover:bg-purple-900/40 flex items-center gap-1"
                      >
                        <span>{p.code}</span>
                        <Copy className="w-3 h-3 text-slate-400" />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pins Inventory List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Inventario de Pines Registrados ({allPins.length})
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0c1220]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#121929] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Código PIN</th>
                    <th className="p-3">Diamantes</th>
                    <th className="p-3">Valor USD</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Canjeado Por</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {allPins.map((pin) => (
                    <tr key={pin.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <span>{pin.code}</span>
                        <button
                          onClick={() => copyCode(pin.code)}
                          className="text-slate-400 hover:text-cyan-400 p-0.5"
                        >
                          {copiedCode === pin.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="p-3 text-amber-400 font-bold">
                        💎 {pin.diamonds} {pin.bonusDiamonds > 0 ? `+ ${pin.bonusDiamonds}` : ''}
                      </td>
                      <td className="p-3 text-slate-300">${pin.valueUsd.toFixed(2)}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            pin.isRedeemed
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {pin.isRedeemed ? 'CANJEADO' : 'DISPONIBLE'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {pin.redeemedByPlayerId ? `ID: ${pin.redeemedByPlayerId}` : '—'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => copyCode(pin.code)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                        >
                          Copiar PIN
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AJUSTES DE TIENDA, LITINGM & DATOS BANCARIOS */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          {settingsSaved && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/60 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>¡Ajustes y márgenes de precios guardados exitosamente!</span>
            </div>
          )}

          {/* Sincronización Litingm & Moneda */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Sincronización de Precios Litingm & Cotización</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Margen de Ganancia sobre Costo Litingm (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settingsForm.litingmMarginPercent}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, litingmMarginPercent: Number(e.target.value) })
                  }
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
                <span className="text-[10px] text-slate-500">Calculado sobre la API de recarga.</span>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Tasa de Cambio 1 USD = ARS ($ Pesos):
                </label>
                <input
                  type="number"
                  value={settingsForm.usdToArsRate}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, usdToArsRate: Number(e.target.value) })
                  }
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
                <span className="text-[10px] text-slate-500">Ajusta el precio en pesos en vivo.</span>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Descuento Revendedores por Defecto (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={settingsForm.resellerDefaultDiscountPercent}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, resellerDefaultDiscountPercent: Number(e.target.value) })
                  }
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Email de Admin Principal */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Control de Rol de Administrador por Email</span>
            </h3>
            <div className="text-xs">
              <label className="block text-slate-400 font-semibold mb-1">
                Correo Electrónico de Super Administrador (Auto-Promoción):
              </label>
              <input
                type="email"
                value={settingsForm.adminEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                className="w-full sm:w-96 bg-[#141d33] border border-pink-700/60 rounded-xl px-4 py-2 text-xs font-mono text-pink-300 font-bold"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Cualquier usuario que inicie sesión con Google usando este correo se convertirá automáticamente en <strong>ADMIN</strong> en toda la aplicación.
              </p>
            </div>
          </div>

          {/* Datos Bancarios y Pasarelas */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>Configuración de Cuentas Receptoras (Mercado Pago & Binance)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mercado Pago - Alias:</label>
                <input
                  type="text"
                  value={settingsForm.mpAlias}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mpAlias: e.target.value })}
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mercado Pago - CVU:</label>
                <input
                  type="text"
                  value={settingsForm.mpCvu}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mpCvu: e.target.value })}
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Titular de la Cuenta:</label>
                <input
                  type="text"
                  value={settingsForm.mpHolderName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mpHolderName: e.target.value })}
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Binance Pay ID Oficial:</label>
                <input
                  type="text"
                  value={settingsForm.binancePayId}
                  onChange={(e) => setSettingsForm({ ...settingsForm, binancePayId: e.target.value })}
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Dirección USDT TRC-20 (Binance):</label>
                <input
                  type="text"
                  value={settingsForm.binanceUsdtAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, binanceUsdtAddress: e.target.value })}
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos los Cambios de Configuración</span>
          </button>
        </form>
      )}

      {/* Balance Adjustment Modal */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border-2 border-emerald-500/50 rounded-3xl p-6 text-slate-100 space-y-4">
            <h3 className="text-base font-bold font-gaming uppercase text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span>Ajustar Saldo de Cliente</span>
            </h3>

            <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div>
                Cliente: <strong className="text-white">{selectedUserForBalance.name}</strong>
              </div>
              <div className="text-slate-400 font-mono">{selectedUserForBalance.email}</div>
              <div className="text-emerald-400 font-mono font-bold pt-1">
                Saldo Actual: ${selectedUserForBalance.balanceUsd.toFixed(2)} USD / ${selectedUserForBalance.balanceArs.toLocaleString('es-AR')} ARS
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Monto a Sumar / Restar ($USD):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={balanceDeltaUsd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBalanceDeltaUsd(val);
                    setBalanceDeltaArs(Math.round(val * settings.usdToArsRate));
                  }}
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Equivalente ($ARS):
                </label>
                <input
                  type="number"
                  value={balanceDeltaArs}
                  onChange={(e) => setBalanceDeltaArs(Number(e.target.value))}
                  className="w-full bg-[#141d33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setBalanceDeltaUsd(-Math.abs(balanceDeltaUsd));
                  setBalanceDeltaArs(-Math.abs(balanceDeltaArs));
                }}
                className="flex-1 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 rounded-xl text-xs font-bold"
              >
                Hacer Débito (-)
              </button>
              <button
                type="button"
                onClick={() => {
                  setBalanceDeltaUsd(Math.abs(balanceDeltaUsd));
                  setBalanceDeltaArs(Math.abs(balanceDeltaArs));
                }}
                className="flex-1 py-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs font-bold"
              >
                Hacer Crédito (+)
              </button>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedUserForBalance(null)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyBalanceAdjustment}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs uppercase rounded-xl"
              >
                Confirmar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
