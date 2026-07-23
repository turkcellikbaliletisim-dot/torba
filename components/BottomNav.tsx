'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Wallet, Sparkles, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Ana Sayfa', href: '/mobile', icon: Home },
    { name: 'Yakınımda', href: '/mobile/nearby', icon: MapPin },
    { name: 'Cüzdan', href: '/mobile/wallet', icon: Wallet },
    { name: 'Puan', href: '/mobile/points', icon: Sparkles },
    { name: 'Profil', href: '/mobile/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-torba-floating px-3 py-2.5 flex items-center justify-around max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/mobile' && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 py-0.5 transition-all duration-200 ${
              isActive
                ? 'text-[#00B2E3] font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25px] text-[#00B2E3]' : 'stroke-[1.75px] text-slate-500'}`} />
            </div>
            <span className={`text-[11px] mt-1 tracking-tight font-medium ${isActive ? 'text-[#00B2E3] font-bold' : 'text-slate-500'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
