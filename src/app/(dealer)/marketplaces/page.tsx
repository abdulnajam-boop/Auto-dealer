import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate, formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  Globe,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Sparkles,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function MarketplaceHubPage() {
  const tenant = await getTenantContext();

  const [marketplaceListings, vehicles] = await Promise.all([
    prisma.marketplaceListing.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        vehicle: true,
        listing: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.vehicle.findMany({
      where: {
        organizationId: tenant.organizationId,
        status: { in: ['READY', 'LISTED'] },
      },
      include: { listings: true },
    }),
  ]);

  const PLATFORMS = [
    { id: 'STOREFRONT', name: 'Dealer Website Storefront', mode: 'DIRECT_SYNC', supported: true, desc: 'Real-time database sync to /storefront showroom' },
    { id: 'FACEBOOK', name: 'Facebook Marketplace', mode: 'MANUAL_PACK', supported: true, desc: '1-click copy-paste & photo pack generator' },
    { id: 'CRAIGSLIST', name: 'Craigslist Motors', mode: 'TEMPLATE_EXPORT', supported: true, desc: 'Structured posting template with stock #' },
    { id: 'EBAY_MOTORS', name: 'eBay Motors API', mode: 'API_SYNC', supported: true, desc: 'Authorized vehicle listing integration' },
    { id: 'AUTOTRADER', name: 'Autotrader / Cox Feed', mode: 'FEED_SYNC', supported: true, desc: 'Direct dealer inventory XML/JSON feed' },
    { id: 'CARS_COM', name: 'Cars.com Inventory Feed', mode: 'FEED_SYNC', supported: true, desc: 'Standardized daily inventory feed' },
    { id: 'CARGURUS', name: 'CarGurus Partner Feed', mode: 'FEED_SYNC', supported: true, desc: 'Real-time deal rating & inventory sync' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            Marketplace Hub & Syndication
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Adapter-based multi-platform marketing architecture with auto-publish & post-sale delisting.
          </p>
        </div>

        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Listing Studio</span>
        </Link>
      </div>

      {/* Connected Marketplace Adapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => {
          const liveCount = marketplaceListings.filter(
            (m) => m.platform === platform.id && m.status === 'LIVE'
          ).length;

          return (
            <div
              key={platform.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{platform.name}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                  {platform.mode}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{platform.desc}</p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">{liveCount} Live Listings</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Syndicated Listings Desk */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Active Syndicated Listings</h2>
            <p className="text-xs text-slate-400">All live and pending marketplace postings across channels</p>
          </div>
          <span className="text-xs text-slate-400">{marketplaceListings.length} Total Listings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2.5 font-medium">
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">Platform</th>
                <th className="py-2.5">Published Price</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">External Link</th>
                <th className="py-2.5 text-right">Last Synced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {marketplaceListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-white">
                    {item.vehicle ? (
                      <Link href={`/inventory/${item.vehicle.id}`} className="hover:text-emerald-400">
                        {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}
                        <span className="text-[11px] font-mono text-slate-500 block">
                          Stock #{item.vehicle.stockNumber}
                        </span>
                      </Link>
                    ) : (
                      'Vehicle'
                    )}
                  </td>
                  <td className="py-3 font-semibold text-slate-300">{item.platform}</td>
                  <td className="py-3 font-bold text-emerald-400">
                    {formatCurrency(item.publishedPrice)}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3">
                    {item.externalUrl ? (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-mono text-[11px]"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500">Manual Pack</span>
                    )}
                  </td>
                  <td className="py-3 text-right text-slate-400 font-mono text-[11px]">
                    {formatDateTime(item.lastSyncedAt || item.updatedAt)}
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
