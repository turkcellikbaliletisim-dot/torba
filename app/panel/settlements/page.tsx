'use client';

import Link from 'next/link';
import { Calendar, DollarSign, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

export default function MerchantSettlementsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <Link href="/panel" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Paneline Dön
        </Link>
        <h1 className="text-base font-bold text-white">Haftalık Hakediş Ödemeleri ve Mahsup Tablosu</h1>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Son Transfer Edilen Tutar</span>
            <p className="text-2xl font-bold text-emerald-400">₺98.450,00</p>
            <p className="text-xs text-slate-400">Tarih: 20 Temmuz 2026</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Gelecek Transfer Tutarı (Net)</span>
            <p className="text-2xl font-bold text-amber-400">₺121.250,00</p>
            <p className="text-xs text-slate-400">Tarih: 27 Temmuz 2026</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Kayıtlı IBAN Hesabı</span>
            <p className="text-sm font-bold text-white font-mono">TR99 0006 2000 0000 1234 5678 90</p>
            <span className="text-xs text-[#00B2E3] font-bold">✓ Doğrulanmış Banka Hesabı</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Geçmiş Hakediş Dönemleri</h2>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Ekstre Dışa Aktar (.xlsx)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Dönem</th>
                  <th className="py-3 px-4">Toplam Brüt</th>
                  <th className="py-3 px-4">Komisyon (%3)</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Banka Referans No</th>
                  <th className="py-3 px-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-[#00B2E3]">SET-2026-W29</td>
                  <td className="py-3.5 px-4">13 Tem - 19 Tem 2026</td>
                  <td className="py-3.5 px-4 font-bold text-white">₺101.500,00</td>
                  <td className="py-3.5 px-4 text-slate-400">₺3.050,00</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₺98.450,00</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">EFT-88991201</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Ödendi ✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
