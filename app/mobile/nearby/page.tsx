'use client';

import { useState } from 'react';
import { Search, Map, List, MapPin, Star, Filter } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function MobileNearbyPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  return (
    <div className="min-h-screen bg-torba-neutral-50 text-torba-neutral-950 pb-24 max-w-md mx-auto relative shadow-2xl">
      {/* App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-torba-neutral-200 px-5 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-torba-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Mekan veya kampanya ara..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-torba-neutral-100 text-xs text-torba-neutral-950 border border-torba-neutral-200 focus:outline-none focus:border-torba-brand-500"
          />
        </div>
        <button className="p-2 rounded-full border border-torba-neutral-200 hover:bg-torba-neutral-100 text-torba-neutral-600">
          <Filter className="w-4 h-4" />
        </button>
      </header>

      {/* Toggle Bar */}
      <div className="p-4 flex justify-between items-center bg-white border-b border-torba-neutral-200">
        <span className="text-xs text-torba-neutral-600 font-medium">Balıkesir bölgesinde 24 mekan</span>
        <div className="flex bg-torba-neutral-100 p-1 rounded-full border border-torba-neutral-200">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              viewMode === 'map' ? 'bg-torba-brand-500 text-white shadow-sm' : 'text-torba-neutral-600'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Harita
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              viewMode === 'list' ? 'bg-torba-brand-500 text-white shadow-sm' : 'text-torba-neutral-600'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Liste
          </button>
        </div>
      </div>

      <main className="p-4">
        {viewMode === 'map' ? (
          /* Harita Görünümü Mockup Container */
          <div className="h-[480px] rounded-torba-xl bg-slate-100 border border-torba-neutral-200 relative overflow-hidden flex flex-col justify-end p-3">
            {/* Map Canvas Mock Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-200/60" />
            
            {/* Map Pin 1 */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 p-2 rounded-full bg-torba-brand-500 text-white shadow-lg flex items-center justify-center animate-bounce">
              <MapPin className="w-5 h-5 fill-white" />
            </div>

            {/* Selected Mini Card Overlay */}
            <div className="relative z-20 p-3 rounded-torba-lg bg-white border border-torba-neutral-200 shadow-torba-modal flex items-center gap-3">
              <div className="w-12 h-12 rounded-torba-md bg-torba-neutral-100 flex items-center justify-center font-bold text-xs text-torba-neutral-600">
                BC
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-torba-neutral-950 truncate">BigChefs Cafe & Brasserie</h4>
                <p className="text-[11px] text-torba-neutral-600">⭐ 4.7 · 350m · Açık</p>
                <span className="inline-block mt-0.5 text-[10px] text-torba-brand-700 font-semibold">
                  ✓ Yemek Kartı Geçerli
                </span>
              </div>
              <button className="px-3 py-1.5 rounded-torba-md bg-torba-brand-500 text-white text-xs font-semibold">
                Detay
              </button>
            </div>
          </div>
        ) : (
          /* Liste Görünümü */
          <div className="space-y-3">
            {/* Merchant Item 1 */}
            <div className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 shadow-torba-card flex gap-3 items-center">
              <div className="w-14 h-14 rounded-torba-md bg-torba-neutral-100 flex items-center justify-center font-bold text-torba-neutral-600 text-sm">
                BC
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-torba-neutral-950 truncate">BigChefs Brasserie</h3>
                <p className="text-xs text-torba-neutral-600">Restoran · 350m mesafe</p>
                <p className="text-xs text-torba-points font-semibold mt-0.5">⭐ 4.7 (324 değerlendirme)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
