'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, QrCode, TrendingUp, DollarSign, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MerchantPanelPage() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAmount, setQrAmount] = useState('250');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Bar Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-torba-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            T
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              BigChefs Balıkesir Şubesi
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                ✓ Doğrulanmış İşletme
              </span>
            </h1>
            <p className="text-xs text-slate-400">İşletme & POS Tahsilat Paneli</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2 rounded-xl bg-torba-brand-500 text-white font-semibold text-xs hover:bg-torba-brand-600 transition flex items-center gap-2 shadow-lg shadow-torba-brand-500/20"
          >
            <QrCode className="w-4 h-4" /> Kasiyer POS Tahsilat (QR)
          </button>
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
            Ana Sayfaya Dön
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Bugünkü İşlem Hacmi</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">₺14.250,00</p>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +%18 dünden bu yana
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Gelecek Hakediş Ödemesi</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">₺121.250,00</p>
            <p className="text-xs text-slate-400 font-medium">
              Ödeme tarihi: <strong className="text-amber-400">27 Temmuz 2026</strong> (7 Günde Şeffaf Ödeme)
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Şeffaf Komisyon Oranı</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">%3.0</p>
            <p className="text-xs text-slate-400">Gizli ücret veya cihaz bedeli yok</p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Tekrar Ziyaret Eden Müşteri</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">%64</p>
            <p className="text-xs text-purple-400 font-semibold">Toin Sadakat Etkisi</p>
          </div>
        </div>

        {/* Son Tahsilat İşlemleri Tablosu */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-torba-brand-500" /> Son Kasada Yapılan QR Ödemeleri
            </h2>
            <span className="text-xs text-slate-400">Canlı idyempotent ledger takibi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">İşlem ID</th>
                  <th className="py-3 px-4">Tarih</th>
                  <th className="py-3 px-4">Müşteri</th>
                  <th className="py-3 px-4">Ödeme Tipi</th>
                  <th className="py-3 px-4">Brüt Tutar</th>
                  <th className="py-3 px-4">Komisyon (%3)</th>
                  <th className="py-3 px-4">Net Hakediş</th>
                  <th className="py-3 px-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">TX-8921</td>
                  <td className="py-3.5 px-4">23 Tem 2026 14:15</td>
                  <td className="py-3.5 px-4 font-semibold text-white">Ahmet Y.</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      TORBAA Yemek Kartı
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">₺450,00</td>
                  <td className="py-3.5 px-4 text-slate-400">₺13,50</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₺436,50</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Tamamlandı ✓</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">TX-8920</td>
                  <td className="py-3.5 px-4">23 Tem 2026 13:30</td>
                  <td className="py-3.5 px-4 font-semibold text-white">Mehmet K.</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Toin Harcama
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">₺120,00</td>
                  <td className="py-3.5 px-4 text-slate-400">₺3,60</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₺116,40</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Tamamlandı ✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* POS QR Modal Dialog */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-torba-brand-500/20 text-torba-brand-500 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Kasiyer Dinamik Tahsilat QR</h3>
              <p className="text-xs text-slate-400">Ödeme tutarını girip müşteriye gösterin</p>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-medium text-slate-300">Tahsil Edilecek Brüt Tutar (₺)</label>
              <input
                type="number"
                value={qrAmount}
                onChange={(e) => setQrAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-lg focus:outline-none focus:border-torba-brand-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-center">
              <div className="w-48 h-48 bg-white p-3 rounded-lg flex items-center justify-center">
                {/* QR Display Placeholder */}
                <div className="w-full h-full border-2 border-dashed border-slate-950 flex flex-col items-center justify-center text-slate-950 font-bold text-xs">
                  <QrCode className="w-24 h-24 mb-1" />
                  <span>₺{qrAmount || '0'},00 QR</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-xl bg-torba-brand-500 text-white font-bold text-xs hover:bg-torba-brand-600 transition"
            >
              Tahsilat Ekranını Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
