'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, ChevronRight, Star, MapPin } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function MobileHomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ['Tümü', 'Yemek', 'Kafe', 'Market', 'Güzellik', 'Teknoloji'];

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 max-w-md mx-auto relative shadow-2xl font-sans border-x border-slate-100">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#00B2E3] flex items-center justify-center font-black text-white text-base shadow-sm">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Torba</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#E0F7FC] text-[#00B2E3] font-bold flex items-center justify-center text-xs">
            AY
          </div>
        </div>
      </header>

      <main className="p-5 space-y-5">
        {/* 2. Toin Sadakat Bakiyesi Kartı */}
        <Link href="/mobile/points" className="block">
          <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FEF08A] flex items-center justify-between shadow-sm hover:border-[#FDE047] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
                <Sparkles className="w-5 h-5 fill-[#F59E0B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Toin Sadakat Bakiyesi</p>
                <p className="text-lg font-bold text-[#854D0E]">1.250 Puan</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#00B2E3] font-semibold">
              <span>Seviyeni gör</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* 3. Arama Çubuğu */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Mekan veya kampanya ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F1F5F9] border-none text-xs focus:outline-none focus:ring-2 focus:ring-[#00B2E3] transition placeholder:text-slate-400"
          />
        </div>

        {/* 4. Hero Kampanya Banner */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#0B132B] p-5 shadow-md text-white min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="px-3 py-1 rounded-lg bg-[#FF5722] text-white text-xs font-bold shadow-sm">
              %20 İndirim
            </span>
          </div>

          <div className="mt-6 flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-300 font-medium mb-0.5">BigChefs Cafe & Brasserie</p>
              <h3 className="text-base font-bold text-white leading-tight">Öğle Menüsünde Özel Fırsat</h3>
            </div>
            <button className="px-4 py-2 rounded-full bg-[#00B2E3] text-white text-xs font-bold hover:bg-[#0097C2] transition flex-shrink-0">
              Kuponu kullan
            </button>
          </div>
        </div>

        {/* 5. Kategori Chip Scroll Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#00B2E3] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#00B2E3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 6. Yakınındaki Fırsatlar */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-slate-900">Yakınındaki Fırsatlar</h2>
            <Link href="/mobile/nearby" className="text-xs font-semibold text-[#00B2E3] hover:underline flex items-center gap-0.5">
              Tümünü gör <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Merchant Card 1 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition flex gap-3.5 items-center">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-base flex-shrink-0">
                BC
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 truncate">BigChefs Brasserie</h3>
                  <span className="px-1.5 py-0.5 rounded bg-[#E0F7FC] text-[#00B2E3] text-[10px] font-bold">
                    ✓ Onaylı
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> Restoran · 350m
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-[#F59E0B]" /> 4.7
                  </span>
                  <span className="text-[11px] text-[#00B2E3] font-semibold">3 aktif kampanya</span>
                </div>
              </div>
            </div>

            {/* Merchant Card 2 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition flex gap-3.5 items-center">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-base flex-shrink-0">
                SR
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 truncate">Sahar Restoran</h3>
                  <span className="px-1.5 py-0.5 rounded bg-[#E0F7FC] text-[#00B2E3] text-[10px] font-bold">
                    ✓ Onaylı
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> Restoran · 600m
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-[#F59E0B]" /> 4.8
                  </span>
                  <span className="text-[11px] text-[#00B2E3] font-semibold">2 aktif kampanya</span>
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
