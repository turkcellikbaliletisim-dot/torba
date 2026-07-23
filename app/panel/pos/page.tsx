'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QrCode, ArrowLeft, CheckCircle2, DollarSign, RefreshCw } from 'lucide-react';

export default function MerchantPosPage() {
  const [amount, setAmount] = useState('180');
  const [paymentStatus, setPaymentStatus] = useState<'WAITING' | 'SUCCESS'>('WAITING');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <Link href="/panel" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Paneline Dön
        </Link>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E0F7FC] text-[#00B2E3]">
          Kasiyer POS QR Tahsilat Terminali
        </span>
      </header>

      <main className="max-w-xl mx-auto space-y-6 text-center">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h1 className="text-lg font-bold text-white">Ödeme Tutarı Girin</h1>
          <div className="relative max-w-xs mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₺</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setPaymentStatus('WAITING');
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-2xl text-center focus:outline-none focus:border-[#00B2E3]"
            />
          </div>

          <div className="p-5 rounded-2xl bg-white text-slate-950 max-w-xs mx-auto space-y-3 shadow-xl">
            <div className="w-44 h-44 mx-auto border-2 border-dashed border-slate-900 rounded-xl flex flex-col items-center justify-center p-2">
              <QrCode className="w-24 h-24 mb-1 text-slate-900" />
              <span className="text-xs font-bold">₺{amount || '0'},00 QR</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Müşterinize QR kodu okutun</p>
          </div>

          {paymentStatus === 'WAITING' ? (
            <button
              onClick={() => setPaymentStatus('SUCCESS')}
              className="w-full py-3.5 rounded-xl bg-[#00B2E3] text-white font-bold text-xs hover:bg-[#0097C2] transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 animate-spin" /> Ödeme Bekleniyor (Simüle Et)
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" /> ₺{amount},00 Tahsilat Başarıyla Tamamlandı!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
