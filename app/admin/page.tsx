'use client';

import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Activity, Users, Store, Building2, Lock, FileText } from 'lucide-react';

export default function SuperAdminPanelPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            A
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              TORBAA Platform Super Admin & Audit Center
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold">
                Sistem Yetkilisi
              </span>
            </h1>
            <p className="text-xs text-slate-400">Finans, Risk, Audit & Operasyon Yönetimi</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <Activity className="w-4 h-4" /> Sistem Sağlığı: Mükemmel (100%)
          </span>
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
            Ana Sayfaya Dön
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* System Health & Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Toplam Platform GMV</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">₺4.850.000,00</p>
            <p className="text-xs text-purple-400 font-semibold">Toplam İşlem Hacmi</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Aktif Üye İşletme</span>
              <Store className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">240 İşletme</p>
            <p className="text-xs text-emerald-400 font-semibold">4 onay bekleyen başvuru</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Kurumsal Şirketler</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">45 Şirket</p>
            <p className="text-xs text-blue-400 font-semibold">18.500 Aktif Çalışan</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Şüpheli İşlem / Anti-Fraud</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400">2 İnleme</p>
            <p className="text-xs text-amber-400 font-semibold">Otomatik Kısıtlandı</p>
          </div>
        </div>

        {/* Immutable Audit Logs Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" /> Immutable Audit Log & Yönetici Hareketleri
            </h2>
            <span className="text-xs text-slate-400">Değiştirilemez izlenebilirlik kayıtları</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Zaman</th>
                  <th className="py-3 px-4">Aktör</th>
                  <th className="py-3 px-4">Aksiyon</th>
                  <th className="py-3 px-4">Kaynak Tipi</th>
                  <th className="py-3 px-4">Kaynak ID</th>
                  <th className="py-3 px-4">IP Adresi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 text-purple-400">LOG-9921</td>
                  <td className="py-3.5 px-4">2026-07-23 14:30:12</td>
                  <td className="py-3.5 px-4 text-white">admin@torbaa.com</td>
                  <td className="py-3.5 px-4 text-emerald-400">MERCHANT_APPROVED</td>
                  <td className="py-3.5 px-4">MERCHANT</td>
                  <td className="py-3.5 px-4 text-slate-400">m-8921-bc</td>
                  <td className="py-3.5 px-4 text-slate-400">192.168.1.45</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 text-purple-400">LOG-9920</td>
                  <td className="py-3.5 px-4">2026-07-23 13:12:05</td>
                  <td className="py-3.5 px-4 text-white">risk-bot@torbaa.com</td>
                  <td className="py-3.5 px-4 text-amber-400">TRANSACTION_FLAGGED</td>
                  <td className="py-3.5 px-4">PAYMENT</td>
                  <td className="py-3.5 px-4 text-slate-400">tx-8812-fraud</td>
                  <td className="py-3.5 px-4 text-slate-400">85.105.42.12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
