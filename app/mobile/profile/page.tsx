'use client';

import { User, Bell, MapPin, CreditCard, Gift, History, Award, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function MobileProfilePage() {
  const menuItems = [
    { icon: User, label: 'Kişisel Bilgiler' },
    { icon: Bell, label: 'Bildirim Tercihleri' },
    { icon: MapPin, label: 'Adreslerim' },
    { icon: CreditCard, label: 'Ödeme Yöntemlerim' },
    { icon: Gift, label: 'Arkadaşını Davet Et (+50 Puan)' },
    { icon: History, label: 'İşlem Geçmişim' },
    { icon: Award, label: 'Seviyem & Rozetlerim' },
    { icon: HelpCircle, label: 'Yardım & Destek' },
    { icon: FileText, label: 'Sözleşmeler & KVKK' },
  ];

  return (
    <div className="min-h-screen bg-torba-neutral-50 text-torba-neutral-950 pb-24 max-w-md mx-auto relative shadow-2xl">
      {/* App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-torba-neutral-200 px-5 py-3 text-center">
        <h1 className="text-base font-bold text-torba-neutral-950">Profilim</h1>
      </header>

      <main className="p-5 space-y-6">
        {/* Profil Kartı */}
        <div className="p-4 rounded-torba-xl bg-white border border-torba-neutral-200 shadow-torba-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-torba-brand-100 border-2 border-torba-brand-500/30 text-torba-brand-700 font-bold text-xl flex items-center justify-center">
              AY
            </div>
            <div>
              <h2 className="text-sm font-bold text-torba-neutral-950">Ahmet Yılmaz</h2>
              <p className="text-xs text-torba-neutral-600">+90 532 *** ** 45</p>
              <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-torba-neutral-100 text-torba-neutral-800">
                Gümüş 🥈 Üye
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-torba-md border border-torba-brand-500 text-torba-brand-500 text-xs font-semibold hover:bg-torba-brand-50 transition">
            Düzenle
          </button>
        </div>

        {/* Menü Listesi */}
        <div className="bg-white rounded-torba-xl border border-torba-neutral-200 shadow-torba-card overflow-hidden divide-y divide-torba-neutral-200">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-torba-neutral-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-torba-neutral-600" />
                  <span className="text-xs font-medium text-torba-neutral-950">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-torba-neutral-400" />
              </button>
            );
          })}

          <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-red-50 text-torba-error transition text-left">
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-torba-error" />
              <span className="text-xs font-bold">Çıkış Yap</span>
            </div>
          </button>
        </div>

        <p className="text-center text-[11px] text-torba-neutral-400 pt-2">
          Torba v1.0.0 (Build 2026.07)
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
