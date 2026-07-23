'use client';

import Link from 'next/link';
import { ChevronLeft, Tag, Clock, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function MobileCampaignsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 max-w-md mx-auto relative shadow-2xl font-sans border-x border-slate-100">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between">
        <Link href="/mobile" className="p-1 rounded-full hover:bg-slate-100 transition">
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </Link>
        <h1 className="text-base font-bold text-slate-900">Fırsat Detayı</h1>
        <button className="p-1 rounded-full hover:bg-slate-100 transition">
          <Share2 className="w-5 h-5 text-slate-600" />
        </button>
      </header>

      <main className="p-5 space-y-6">
        <div className="rounded-[20px] bg-[#0B132B] p-6 text-white space-y-4 shadow-lg">
          <span className="px-3 py-1 rounded-lg bg-[#FF5722] text-white text-xs font-bold shadow-sm inline-block">
            %20 İndirim Fırsatı
          </span>
          <div>
            <p className="text-xs text-slate-300 font-medium">BigChefs Cafe & Brasserie</p>
            <h2 className="text-xl font-bold text-white leading-tight mt-1">Öğle Menüsünde Özel Fırsat</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hafta içi 12:00 - 15:00 saatleri arasında yapılan tüm TORBAA Yemek Kartı harcamalarında %20 anında indirim ve %5 Toin Puan hediyesi!
          </p>
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#00B2E3]" /> Son 3 gün</span>
            <span className="text-[#00B2E3] font-semibold">Kod: BIGCHEFS20</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FEF08A] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#854D0E]">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" /> Kampanya Avantajları
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5 pl-5 list-disc">
            <li>Tüm şubelerde geçerlidir.</li>
            <li>QR ödemede otomatik uygulanır.</li>
            <li>Toin sadakat puanları ile birleştirilebilir.</li>
          </ul>
        </div>

        <button className="w-full py-3.5 rounded-full bg-[#00B2E3] text-white font-bold text-sm shadow-md hover:bg-[#0097C2] transition">
          Kuponu Cüzdanıma Ekle
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
