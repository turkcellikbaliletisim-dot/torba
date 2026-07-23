'use client';

import Link from 'next/link';
import { Building2, Users, FileText, Download, CheckCircle, ShieldCheck, ArrowRight, Plus } from 'lucide-react';

export default function CorporateHRPortalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            C
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Teknoloji A.Ş. İK Portalı
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                Kurumsal Müşteri
              </span>
            </h1>
            <p className="text-xs text-slate-400">GVK 23/8 Yemek Kartı & Bütçe Yönetimi</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Bakiye Yükleme Talebi Oluştur
          </button>
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
            Ana Sayfaya Dön
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Aktif Şirket Çalışanı</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">120 Kişi</p>
            <p className="text-xs text-blue-400 font-semibold">%100 Dijital Yemek Kartı Aktif</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Aylık Toplam Yemek Bütçesi</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">₺540.000,00</p>
            <p className="text-xs text-slate-400">Çalışan başı ₺4.500/Ay</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>GVK 23/8 Vergi Tasarrufu</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">₺189.000,00</p>
            <p className="text-xs text-emerald-400 font-semibold">%100 SGK ve Vergi Muafiyeti</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Resmi Fatura & Rapor</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">Hazır ✓</p>
            <button className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Fatura İndir (PDF)
            </button>
          </div>
        </div>

        {/* Çalışan Listesi ve Bakiye Durumu */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Çalışan Kart Yükleme Listesi
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition">
                Excel ile Toplu Aktar (.xlsx)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Çalışan No</th>
                  <th className="py-3 px-4">Ad Soyad</th>
                  <th className="py-3 px-4">Departman</th>
                  <th className="py-3 px-4">Aylık Bütçe</th>
                  <th className="py-3 px-4">Kart Durumu</th>
                  <th className="py-3 px-4">Son Yükleme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">EMP-001</td>
                  <td className="py-3.5 px-4 font-semibold text-white">Ahmet Yılmaz</td>
                  <td className="py-3.5 px-4">Yazılım Geliştirme</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₺4.500,00</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Aktif ✓</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">01 Tem 2026</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">EMP-002</td>
                  <td className="py-3.5 px-4 font-semibold text-white">Ayşe Demir</td>
                  <td className="py-3.5 px-4">İnsan Kaynakları</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₺4.500,00</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Aktif ✓</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">01 Tem 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
