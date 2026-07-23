import Link from 'next/link';
import { Store, Building2, ShieldCheck, Sparkles, ArrowRight, Wallet, FileText } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            T
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              TORBAA
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                Özgün Yemek Kartı İhraççısı
              </span>
            </h1>
            <p className="text-xs text-slate-400">B2B2C Sadakat, Keşif & Kurumsal Yan Haklar Platformu</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/turkcellikbaliletisim-dot/torba.git"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            GitHub Repository
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto my-10 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>GVK 23/8 Vergi İstisnalı %100 Yerli Yemek Kartı Ekosistemi</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Yüksek Komisyonlara Son. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            TORBAA YEMEK KARTI
          </span> Özgürlüğü!
        </h2>

        <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
          Şirketler için %100 vergi istisnası, çalışanlar için harcadıkça kazandıran <strong className="text-emerald-400">Çift Bakiye (Net Yemek + Toin)</strong>, restoranlar için ise %3-%5 düşük komisyon ve 7 günde hızlı hakediş!
        </p>

        {/* 4 Distinct Role Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left max-w-6xl mx-auto">
          {/* Card 1: Mobile App */}
          <Link
            href="/mobile"
            className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                Mobil Uygulama
                <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                B2C Tüketici & Şirket Çalışanı portalı. TORBAA Yemek Kartı, QR Ödeme & %5 Toin Puan.
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              <code>/mobile</code>
            </div>
          </Link>

          {/* Card 2: Merchant Panel */}
          <Link
            href="/panel"
            className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                Esnaf / Bayi Paneli
                <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Üye restoranlar için Kasiyer POS QR Tahsilatı ve haftalık hakediş takibi.
              </p>
            </div>
            <div className="text-xs text-amber-400 font-semibold">
              <code>/panel</code>
            </div>
          </Link>

          {/* Card 3: Corporate HR Portal */}
          <Link
            href="/corporate"
            className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                Kurumsal İK Portalı
                <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Şirket İK yöneticileri için çalışanlara toplu yemek kartı yükleme & vergi muafiyet raporları.
              </p>
            </div>
            <div className="text-xs text-blue-400 font-semibold">
              <code>/corporate</code>
            </div>
          </Link>

          {/* Card 4: Admin Management Portal */}
          <Link
            href="/admin"
            className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                Yönetici (Admin) Paneli
                <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Platform yöneticileri için Çift Onay (4-Eye), finansal kapanış & mutabakat denetimi.
              </p>
            </div>
            <div className="text-xs text-purple-400 font-semibold">
              <code>/admin</code>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer Documentation Links */}
      <footer className="max-w-7xl w-full mx-auto pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 z-10">
        <div>
          © 2026 TORBAA Teknolojileri A.Ş. Tüm hakları saklıdır.
        </div>
        <div className="flex items-center gap-4">
          <a href="/README.md" className="hover:text-slate-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> README.md
          </a>
          <a href="/TORBAA_MASTER_DOKUMAN.md" className="hover:text-slate-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Master Spesifikasyon
          </a>
          <a href="/OPEN_QUESTIONS.md" className="hover:text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Open Questions
          </a>
        </div>
      </footer>
    </main>
  );
}
