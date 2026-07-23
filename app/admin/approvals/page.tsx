'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Lock } from 'lucide-react';

export default function AdminApprovalsPage() {
  const [actionDone, setActionDone] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <Link href="/admin" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
        </Link>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
          Çift Onay (4-Eye Principle) Onay Masası
        </span>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" /> 2. Yönetici Onayı Bekleyen Yüksek Tutarlı İşlemler
            </h1>
            <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              1 Bekleyen Talep
            </span>
          </div>

          {!actionDone ? (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-bold">
                    HIGH_VALUE_REFUND (Yüksek Tutarlı İade)
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2">Ödeme ID: pay-891209</h3>
                  <p className="text-xs text-slate-400 mt-1">İade Tutarı: <strong className="text-amber-400">₺15.000,00</strong> (Tutar REVERSED olarak kilitlendi)</p>
                  <p className="text-xs text-slate-400">1. Onaylayan Admin: <span className="text-slate-200">admin-1@torbaa.com</span></p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActionDone(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> 2. Admin Onayını Ver
                  </button>
                  <button className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs hover:text-white transition">
                    <XCircle className="w-4 h-4 text-red-400" /> Reddet
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" /> 2. Admin onayı başarıyla verildi. İade işlemi yürütüldü!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
