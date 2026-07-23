'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Plus, Upload, Search, Download } from 'lucide-react';

export default function CorporateEmployeesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <Link href="/corporate" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> İK Portalına Dön
        </Link>
        <div className="flex gap-3">
          <button className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-blue-400" /> Excel ile Toplu Yükleme (.xlsx)
          </button>
          <button className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Yeni Çalışan Ekle
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Şirket Çalışan Kart Listesi (120 Kişi)
            </h1>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Çalışan ara..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Çalışan No</th>
                  <th className="py-3 px-4">Ad Soyad</th>
                  <th className="py-3 px-4">E-Posta / Telefon</th>
                  <th className="py-3 px-4">Departman</th>
                  <th className="py-3 px-4">Aylık Bütçe</th>
                  <th className="py-3 px-4">Kart Durumu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-blue-400">EMP-001</td>
                  <td className="py-3.5 px-4 font-semibold text-white">Ahmet Yılmaz</td>
                  <td className="py-3.5 px-4 text-slate-400">ahmet@teknoloji.com</td>
                  <td className="py-3.5 px-4">Yazılım Geliştirme</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₺4.500,00</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Aktif ✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
