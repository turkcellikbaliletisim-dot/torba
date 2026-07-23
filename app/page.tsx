import Link from 'next/link';
import { Store, Building2, ShieldCheck, Sparkles, ArrowRight, Wallet, FileText, CheckCircle2, QrCode } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            T
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              TORBAA
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Özgün Yemek Kartı Ekosistemi
              </span>
            </h1>
            <p className="text-xs text-slate-400">B2B2C Sadakat, Keşif & Kurumsal Yan Haklar Altyapısı</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/turkcellikbaliletisim-dot/torba.git"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 hover:border-slate-700"
          >
            <FileText className="w-4 h-4 text-emerald-400" /> GitHub Repository
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto my-12 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 backdrop-blur-md shadow-xl">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>GVK 23/8 Vergi İstisnalı %100 Yerli Dijital Yemek Kartı</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Yüksek Komisyonlara Son. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 via-amber-300 to-purple-400 bg-clip-text text-transparent">
            TORBAA DİJİTAL YEMEK KARTI
          </span>
        </h2>

        <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
          Şirketler için %100 vergi istisnası, çalışanlar için harcadıkça kazandıran <strong className="text-emerald-400">Çift Bakiye (Net Yemek + Toin)</strong>, restoranlar için %3 düşük komisyon ve 7 günde hızlı hakediş!
        </p>

        {/* 4 Distinct Role Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-6xl mx-auto">
          {/* Portal 1: Mobile App (Emerald Theme) */}
          <Link
            href="/mobile"
            className="group relative p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  B2C & Çalışan
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5 flex items-center justify-between">
                Mobil Uygulama
                <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Mobil Tüketici & Şirket Çalışanı portalı. TORBAA Yemek Kartı, QR Ödeme & %5 Toin Puan.
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <span>/mobile</span>
            </div>
          </Link>

          {/* Portal 2: Merchant Panel (Amber Theme) */}
          <Link
            href="/panel"
            className="group relative p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Üye Restoran
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5 flex items-center justify-between">
                Esnaf / Bayi Paneli
                <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Üye restoranlar için Kasiyer POS QR Tahsilatı ve 7 günde şeffaf hakediş takibi.
              </p>
            </div>
            <div className="text-xs text-amber-400 font-mono font-semibold flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit">
              <span>/panel</span>
            </div>
          </Link>

          {/* Portal 3: Corporate HR Portal (Blue Theme) */}
          <Link
            href="/corporate"
            className="group relative p-6 rounded-2xl bg-slate-900/80 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  Şirket İK
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5 flex items-center justify-between">
                Kurumsal İK Portalı
                <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Şirket İK yöneticileri için çalışanlara toplu yemek kartı yükleme & vergi muafiyet raporları.
              </p>
            </div>
            <div className="text-xs text-blue-400 font-mono font-semibold flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 w-fit">
              <span>/corporate</span>
            </div>
          </Link>

          {/* Portal 4: Admin Management Portal (Purple Theme) */}
          <Link
            href="/admin"
            className="group relative p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  Super Admin
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5 flex items-center justify-between">
                Yönetici Paneli
                <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Platform yöneticileri için Çift Onay (4-Eye), finansal kapanış & mutabakat denetimi.
              </p>
            </div>
            <div className="text-xs text-purple-400 font-mono font-semibold flex items-center gap-1.5 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 w-fit">
              <span>/admin</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer Links */}
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
