'use client';

import { useState } from 'react';
import { CreditCard, Sparkles, QrCode, Tag, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function MobileWalletPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'cards' | 'offers'>('coupons');

  return (
    <div className="min-h-screen bg-torba-neutral-50 text-torba-neutral-950 pb-24 max-w-md mx-auto relative shadow-2xl">
      {/* App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-torba-neutral-200 px-5 py-3 text-center">
        <h1 className="text-base font-bold text-torba-neutral-950">Cüzdanım</h1>
      </header>

      <main className="p-5 space-y-6">
        {/* Çift Bakiye Özet Kartları */}
        <div className="grid grid-cols-2 gap-3">
          {/* Yemek Kartı Bakiyesi */}
          <div className="p-4 rounded-torba-xl bg-gradient-to-br from-torba-brand-50 to-torba-brand-100 border border-torba-brand-500/20 shadow-torba-card">
            <div className="flex items-center gap-1.5 text-torba-brand-700 text-xs font-semibold mb-1">
              <CreditCard className="w-4 h-4" /> Yemek Kartı
            </div>
            <p className="text-xl font-bold text-torba-neutral-950">₺4.500,00</p>
            <p className="text-[10px] text-torba-brand-700 font-medium mt-1">GVK 23/8 İstisnalı</p>
          </div>

          {/* Toin Puan Bakiyesi */}
          <div className="p-4 rounded-torba-xl bg-[#FFF8DE] border border-torba-points/30 shadow-torba-card">
            <div className="flex items-center gap-1.5 text-torba-points text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4" /> Toin Puanım
            </div>
            <p className="text-xl font-bold text-[#7A5900]">1.250 Puan</p>
            <p className="text-[10px] text-torba-neutral-600 font-medium mt-1">≈ ₺1.250 değerinde</p>
          </div>
        </div>

        {/* Hızlı Aksiyonlar */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <button className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 hover:border-torba-brand-500 flex flex-col items-center gap-1 transition">
            <div className="w-8 h-8 rounded-full bg-torba-brand-50 text-torba-brand-500 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-torba-neutral-950">QR Öde</span>
          </button>
          <button className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 hover:border-torba-brand-500 flex flex-col items-center gap-1 transition">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-torba-points flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-torba-neutral-950">Toin Kullan</span>
          </button>
          <button className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 hover:border-torba-brand-500 flex flex-col items-center gap-1 transition">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-torba-info flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-torba-neutral-950">Geçmiş</span>
          </button>
          <button className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 hover:border-torba-brand-500 flex flex-col items-center gap-1 transition">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-torba-campaign flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-torba-neutral-950">Kuponlarım</span>
          </button>
        </div>

        {/* Tab Çubuğu */}
        <div className="flex border-b border-torba-neutral-200">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${
              activeTab === 'coupons'
                ? 'border-torba-brand-500 text-torba-brand-500'
                : 'border-transparent text-torba-neutral-600'
            }`}
          >
            Kuponlarım (2)
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${
              activeTab === 'cards'
                ? 'border-torba-brand-500 text-torba-brand-500'
                : 'border-transparent text-torba-neutral-600'
            }`}
          >
            Kartlarım (1)
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${
              activeTab === 'offers'
                ? 'border-torba-brand-500 text-torba-brand-500'
                : 'border-transparent text-torba-neutral-600'
            }`}
          >
            Fırsatlar
          </button>
        </div>

        {/* Tab İçerikleri */}
        {activeTab === 'coupons' && (
          <div className="space-y-3">
            {/* Coupon Card 1 */}
            <div className="p-4 rounded-torba-lg bg-white border border-torba-neutral-200 shadow-torba-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-torba-campaign/10 text-torba-campaign font-bold text-lg flex items-center justify-center">
                  %20
                </div>
                <div>
                  <h4 className="text-xs font-bold text-torba-neutral-950">BigChefs Öğle Yemeği Kuponu</h4>
                  <p className="text-[11px] text-torba-neutral-600">Geçerlilik: 25 Temmuz 2026</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-torba-md bg-torba-brand-500 text-white text-xs font-semibold">
                Kullan
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
