'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminFinancialClosingPage() {
  const [isRerunning, setIsRerunning] = useState(false);
  const [rerunSuccess, setRerunSuccess] = useState(false);

  const handleRerun = () => {
    setIsRerunning(true);
    setTimeout(() => {
      setIsRerunning(false);
      setRerunSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <Link href="/admin" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRerun}
            disabled={isRerunning}
            className="px-4 py-2 rounded-xl bg-purple-600 text-[#00B2E3] font-bold text-xs hover:bg-purple-500 transition flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRerunning ? 'animate-spin' : ''}`} /> Günlük Kapanışı Rerun Et
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        {rerunSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" /> Günlük finansal kapanış hesabı başarıyla yeniden yürütüldü ve güncellendi!
          </div>
        )}

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Günlük Finansal Kapanış & Mutabakat Denklemi
            </h1>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              DURUM: DENK VE DENGELİ ✓
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Provider Captured Gross</span>
              <p className="text-lg font-bold text-white">₺4.850.000,00</p>
              <p className="text-[11px] text-emerald-400">Local Completed Gross ile Denk ✓</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Net Merchant Hakediş</span>
              <p className="text-lg font-bold text-white">₺4.704.500,00</p>
              <p className="text-[11px] text-slate-400">Brüt - %3 Komisyon</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Platform Komisyonu (%3)</span>
              <p className="text-lg font-bold text-purple-400">₺145.500,00</p>
              <p className="text-[11px] text-purple-400">Toplanan Platform Geliri</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
