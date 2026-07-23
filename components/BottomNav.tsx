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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-torba-neutral-200 shadow-torba-floating px-4 py-2 flex items-center justify-around max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/mobile' && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all duration-200 ${
              isActive
                ? 'text-torba-brand-500 font-semibold scale-105'
                : 'text-torba-neutral-600 hover:text-torba-neutral-950'
            }`}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-torba-brand-500" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
