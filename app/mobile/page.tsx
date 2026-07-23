'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, ChevronRight, Star, MapPin, Tag } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function MobileHomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ['Tümü', 'Yemek', 'Kafe', 'Market', 'Güzellik', 'Teknoloji'];

  return (
    <div className="min-h-screen bg-torba-neutral-50 text-torba-neutral-950 pb-24 max-w-md mx-auto relative shadow-2xl">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-torba-neutral-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-torba-md bg-torba-brand-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
            T
          </div>
          <span className="text-lg font-bold tracking-tight text-torba-neutral-950">Torba</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-torba-neutral-100 transition">
            <Bell className="w-5 h-5 text-torba-neutral-600" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-torba-error" />
          </button>
          <div className="w-8 h-8 rounded-full bg-torba-brand-100 text-torba-brand-700 font-bold flex items-center justify-center text-xs">
            AY
          </div>
        </div>
      </header>

      <main className="p-5 space-y-6">
        {/* 2. Puan Özet Kartı */}
        <Link href="/mobile/points" className="block">
          <div className="p-4 rounded-torba-lg bg-[#FFF8DE] border border-torba-points/30 flex items-center justify-between shadow-torba-card hover:border-torba-points/60 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-torba-points/20 flex items-center justify-center text-torba-points">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-torba-neutral-600 font-medium">Toin Sadakat Bakiyesi</p>
                <p className="text-xl font-bold text-[#7A5900]">1.250 Puan</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-torba-brand-700 font-semibold">
              <span>Seviyeni gör</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* 3. Arama Çubuğu */}
        <div className="relative">
          <Search className="w-5 h-5 text-torba-neutral-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Mekan veya kampanya ara..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-torba-neutral-100 border border-torba-neutral-200 text-sm focus:outline-none focus:border-torba-brand-500 transition placeholder:text-torba-neutral-400"
          />
        </div>

        {/* 4. Hero Kampanya Karuseli */}
        <div className="relative rounded-torba-xl overflow-hidden bg-white border border-torba-neutral-200 shadow-torba-card">
          <div className="h-44 bg-slate-900 relative flex items-end p-4">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-10" />
            <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-torba-sm bg-torba-campaign text-white text-xs font-bold shadow-sm">
              %20 İndirim
            </div>
            <div className="relative z-20 text-white w-full flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-300 font-medium">BigChefs Cafe & Brasserie</p>
                <h3 className="text-base font-bold text-white">Öğle Menüsünde Özel Fırsat</h3>
              </div>
              <button className="px-3 py-1.5 rounded-torba-md bg-torba-brand-500 text-white text-xs font-semibold hover:bg-torba-brand-600 transition">
                Kuponu kullan
              </button>
            </div>
          </div>
        </div>

        {/* 5. Kategori Chip Yatay Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-torba-brand-500 text-white shadow-sm'
                  : 'bg-white text-torba-neutral-600 border border-torba-neutral-200 hover:border-torba-brand-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 6. Yakınındaki Fırsatlar */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-torba-neutral-950">Yakınındaki Fırsatlar</h2>
            <Link href="/mobile/nearby" className="text-xs font-semibold text-torba-brand-500 hover:underline flex items-center gap-0.5">
              Tümünü gör <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Merchant Card 1 */}
            <div className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 shadow-torba-card flex gap-3 items-center">
              <div className="w-16 h-16 rounded-torba-md bg-torba-neutral-100 flex items-center justify-center font-bold text-torba-neutral-600 text-lg flex-shrink-0">
                BC
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-torba-neutral-950 truncate">BigChefs Brasserie</h3>
                  <span className="px-1.5 py-0.5 rounded bg-torba-brand-50 text-torba-brand-700 text-[10px] font-semibold">
                    ✓ Onaylı
                  </span>
                </div>
                <p className="text-xs text-torba-neutral-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-torba-neutral-400" /> Restoran · 350m
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-torba-points flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-torba-points" /> 4.7
                  </span>
                  <span className="text-[11px] text-torba-campaign font-medium">3 aktif kampanya</span>
                </div>
              </div>
            </div>

            {/* Merchant Card 2 */}
            <div className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 shadow-torba-card flex gap-3 items-center">
              <div className="w-16 h-16 rounded-torba-md bg-torba-neutral-100 flex items-center justify-center font-bold text-torba-neutral-600 text-lg flex-shrink-0">
                SR
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-torba-neutral-950 truncate">Sahar Restoran</h3>
                  <span className="px-1.5 py-0.5 rounded bg-torba-brand-50 text-torba-brand-700 text-[10px] font-semibold">
                    ✓ Onaylı
                  </span>
                </div>
                <p className="text-xs text-torba-neutral-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-torba-neutral-400" /> Restoran · 600m
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-torba-points flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-torba-points" /> 4.8
                  </span>
                  <span className="text-[11px] text-torba-campaign font-medium">2 aktif kampanya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
