import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TORBAA — B2B2C Sadakat & Özgün Yemek Kartı Ekosistemi',
  description: 'TORBAA Yemek Kartı, Toin Çift Bakiye Cüzdanı, İşletme Paneli ve Kurumsal İK Portalı',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
