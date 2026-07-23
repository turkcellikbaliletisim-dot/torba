'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, Download, Search } from 'lucide-react';

export default function AdminAuditLogsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <Link href="/admin" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
        </Link>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
          Değiştirilemez Immutable Audit Log Kayıtları
        </span>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" /> Platform Güvenlik & Denetim Kayıtları
            </h1>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Log Dışa Aktar (.jsonl)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Tarih</th>
                  <th className="py-3 px-4">Aktör</th>
                  <th className="py-3 px-4">Aksiyon</th>
                  <th className="py-3 px-4">Kaynak Tipi</th>
                  <th className="py-3 px-4">IP Adresi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 text-purple-400">LOG-9921</td>
                  <td className="py-3.5 px-4 text-slate-400">2026-07-23 14:30:12</td>
                  <td className="py-3.5 px-4 text-white">admin-1@torbaa.com</td>
                  <td className="py-3.5 px-4 text-emerald-400">HIGH_VALUE_REFUND_APPROVED</td>
                  <td className="py-3.5 px-4 text-slate-400">REFUND</td>
                  <td className="py-3.5 px-4 text-slate-400">192.168.1.45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
