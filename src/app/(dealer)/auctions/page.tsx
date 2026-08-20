import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate, formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  Gavel,
  Plus,
  Clock,
  ExternalLink,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function AuctionsPage() {
  const tenant = await getTenantContext();

  const auctionItems = await prisma.auctionItem.findMany({
    where: { organizationId: tenant.organizationId },
    include: { opportunity: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Gavel className="w-6 h-6 text-emerald-400" />
            Auction Center & Bidding Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track Manheim, ACV, and Copart live auctions with automated ceiling bids.
          </p>
        </div>

        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Auction Unit</span>
        </Link>
      </div>

      {/* Auction Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-400 font-semibold uppercase">Active Watchlist</div>
          <div className="text-2xl font-bold text-white mt-1">
            {auctionItems.filter((a) => a.status === 'WATCHING' || a.status === 'BID_PLACED').length} Units
          </div>
          <div className="text-xs text-slate-500 mt-1">Manheim Dallas, ACV Online</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Max Bid Exposure</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {formatCurrency(
              auctionItems.reduce((sum, a) => sum + a.maxBid, 0)
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">Calculated by Opportunity Intelligence</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-400 font-semibold uppercase">Won & Acquired MTD</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {auctionItems.filter((a) => a.status === 'WON' || a.opportunity?.status === 'CONVERTED').length} Units
          </div>
          <div className="text-xs text-slate-500 mt-1">Transferred to Reconditioning</div>
        </div>
      </div>

      {/* Auction List Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Monitored Auction Lanes & Lots</h2>
            <p className="text-xs text-slate-400">Live auction runs with target bidding thresholds</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2 font-medium">
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">Platform</th>
                <th className="py-2.5">Lane / Run</th>
                <th className="py-2.5">Auction Date</th>
                <th className="py-2.5">Current Bid</th>
                <th className="py-2.5">Max Rec Bid</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {auctionItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-white">
                    {item.opportunity ? (
                      <div>
                        {item.opportunity.year} {item.opportunity.make} {item.opportunity.model}{' '}
                        {item.opportunity.trim || ''}
                        <div className="text-[11px] font-mono text-slate-500">
                          VIN: {item.opportunity.vin.slice(-8)}
                        </div>
                      </div>
                    ) : (
                      'Auction Vehicle'
                    )}
                  </td>
                  <td className="py-3 font-semibold text-slate-300">
                    {item.auctionPlatform}
                  </td>
                  <td className="py-3 font-mono text-slate-400">
                    Lane {item.lane || '4'} / Run #{item.runNumber || '88'}
                  </td>
                  <td className="py-3 text-slate-300">
                    {formatDate(item.auctionDate || new Date())}
                  </td>
                  <td className="py-3 font-semibold text-slate-200">
                    {formatCurrency(item.currentBid)}
                  </td>
                  <td className="py-3 font-bold text-amber-400">
                    {formatCurrency(item.maxBid)}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href="/opportunities"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <span>Inspect Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
