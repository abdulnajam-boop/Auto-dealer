'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileCheck2,
  Printer,
  Download,
  ShieldCheck,
  Search,
} from '@/components/icons';
import { formatDate } from '@/lib/utils';

interface DealDoc {
  id: string;
  buyerName: string;
  vehicleName: string;
  createdAt: string;
  totalDue: number;
}

export default function DocumentsPage() {
  const [deals, setDeals] = useState<DealDoc[]>([
    {
      id: 'deal_1',
      buyerName: 'Emily Rodriguez',
      vehicleName: '2022 Toyota Camry SE',
      createdAt: new Date().toISOString(),
      totalDue: 26849,
    },
    {
      id: 'deal_2',
      buyerName: 'Lucas Vance',
      vehicleName: '2021 Honda Accord Sport',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      totalDue: 26680,
    },
    {
      id: 'deal_3',
      buyerName: 'Michael Chen',
      vehicleName: '2020 BMW 330i xDrive',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      totalDue: 31200,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Documents &amp; Bill of Sale Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Buyer&apos;s Orders, Bills of Sale, Odometer Disclosures, and Title Records.
          </p>
        </div>
      </div>

      {/* Documents Vault Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Generated Legal &amp; Deal Records</h2>
          <span className="text-xs text-slate-400">{deals.length} Active Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2.5 font-medium">
                <th className="py-2.5">Document Title</th>
                <th className="py-2.5">Customer / Deal</th>
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">Created Date</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <span>State Bill of Sale &amp; Buyer&apos;s Order</span>
                  </td>
                  <td className="py-3 text-slate-300">{deal.buyerName}</td>
                  <td className="py-3 text-slate-300">{deal.vehicleName}</td>
                  <td className="py-3 text-slate-400 font-mono">{formatDate(deal.createdAt)}</td>
                  <td className="py-3">
                    <span className="text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                      READY TO PRINT
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Document</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
