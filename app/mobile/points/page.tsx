'use client';

import { Sparkles, Trophy, Flame, UserPlus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function MobilePointsPage() {
  return (
    <div className="min-h-screen bg-torba-neutral-50 text-torba-neutral-950 pb-24 max-w-md mx-auto relative shadow-2xl">
      {/* App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-torba-neutral-200 px-5 py-3 text-center">
        <h1 className="text-base font-bold text-torba-neutral-950">Puanlarım</h1>
      </header>

      <main className="p-5 space-y-6">
        {/* Puan Bakiye Kartı */}
        <div className="p-5 rounded-torba-xl bg-[#FFF8DE] border border-torba-points/30 shadow-torba-card text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-torba-points/20 text-[#7A5900] text-xs font-semibold">
            <Sparkles className="w-4 h-4" /> Toin Sadakat Programı
          </div>
          <h2 className="text-3xl font-extrabold text-[#7A5900]">1.250 Puan</h2>
          <p className="text-xs text-torba-neutral-600">Seviyeniz: <strong className="text-torba-neutral-950">Gümüş 🥈</strong></p>

          {/* Progress Bar */}
          <div className="w-full bg-torba-points/20 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-torba-points h-full rounded-full w-[71%]" />
          </div>
          <p className="text-[11px] text-torba-neutral-600 pt-1">Altın seviyeye geçmek için 500 Puan kaldı</p>
        </div>

        {/* Rozet Galerisi */}
        <div>
          <h3 className="text-xs font-bold text-torba-neutral-950 mb-3">Rozetlerin & Başarıların</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            <div className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 text-center min-w-[90px] flex-shrink-0">
              <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-torba-neutral-950 block">İlk Harcama</span>
              <span className="text-[9px] text-torba-neutral-400 block">Kazanıldı ✓</span>
            </div>

            <div className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 text-center min-w-[90px] flex-shrink-0">
              <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-torba-neutral-950 block">5 Gün Seri</span>
              <span className="text-[9px] text-torba-neutral-400 block">Kazanıldı ✓</span>
            </div>

            <div className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 text-center min-w-[90px] flex-shrink-0 opacity-60">
              <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-torba-neutral-950 block">3 Davet</span>
              <span className="text-[9px] text-torba-neutral-400 block">Kilitli 🔒</span>
            </div>
          </div>
        </div>

        {/* İşlem Geçmişi */}
        <div>
          <h3 className="text-xs font-bold text-torba-neutral-950 mb-3">Puan Geçmişi</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-torba-lg bg-white border border-torba-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-torba-neutral-950">BigChefs Harcama Ödülü</h4>
                  <p className="text-[10px] text-torba-neutral-600">Dün · 13:45</p>
                </div>
              </div>
              <span className="text-xs font-bold text-torba-points">+250 Puan</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
