import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  Car,
  Sparkles,
  DollarSign,
  Plus,
  ArrowLeft,
  Globe,
  Tag,
  Clock,
  ShieldCheck,
  FileCheck2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await getTenantContext();
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
      expenses: { orderBy: { date: 'desc' } },
      listings: {
        include: { marketplaceListings: true },
        orderBy: { createdAt: 'desc' },
      },
      leads: { orderBy: { updatedAt: 'desc' } },
      deals: true,
    },
  });

  if (!vehicle || vehicle.organizationId !== tenant.organizationId) {
    notFound();
  }

  const latestListing = vehicle.listings[0];
  const projectedProfit = vehicle.askingPrice - vehicle.totalCostBasis;
  const roi =
    vehicle.totalCostBasis > 0
      ? ((projectedProfit / vehicle.totalCostBasis) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Back to Inventory Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim || ''}
              </h1>
              <StatusBadge status={vehicle.status} size="md" />
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Stock #{vehicle.stockNumber} • VIN: {vehicle.vin} • {vehicle.daysInInventory} Days in Stock
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/listings?vehicleId=${vehicle.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Listing Studio</span>
          </Link>

          <Link
            href={`/marketplaces`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition-all"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Marketplace Hub</span>
          </Link>

          <Link
            href={`/deals?vehicleId=${vehicle.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Create Deal</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Photos & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Media & Detailed Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Showcase */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md space-y-3">
            <div className="h-72 w-full rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800">
              {vehicle.photos[0] ? (
                <img
                  src={vehicle.photos[0].url}
                  alt={vehicle.model}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Car className="w-12 h-12" />
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700">
                {vehicle.photos.length} Verified Photos
              </div>
            </div>

            {vehicle.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.photos.map((photo, pIdx) => (
                  <div
                    key={photo.id}
                    className="h-16 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 cursor-pointer hover:border-emerald-500 transition-colors"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Specifications */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Vehicle Specifications
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Mileage</span>
                <div className="font-bold text-white mt-0.5">{formatNumber(vehicle.mileage)} mi</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Exterior Color</span>
                <div className="font-bold text-white mt-0.5">{vehicle.exteriorColor}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Interior Color</span>
                <div className="font-bold text-white mt-0.5">
                  {vehicle.interiorColor || 'Leather'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Engine</span>
                <div className="font-bold text-white mt-0.5">{vehicle.engine || 'Standard'}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Transmission</span>
                <div className="font-bold text-white mt-0.5">
                  {vehicle.transmission || 'Automatic'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500">Drivetrain / Fuel</span>
                <div className="font-bold text-white mt-0.5">
                  {vehicle.drivetrain || 'FWD'} / {vehicle.fuelType || 'Gas'}
                </div>
              </div>
            </div>
          </div>

          {/* Reconditioning & Expense Accounting Ledger */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Vehicle Expense Ledger & Cost Accounting
                </h2>
                <p className="text-xs text-slate-400">
                  Itemized acquisition and reconditioning investments
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  Total Cost Basis
                </span>
                <div className="text-lg font-bold text-white font-mono">
                  {formatCurrency(vehicle.totalCostBasis)}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 pb-2">
                    <th className="py-2 font-medium">Category</th>
                    <th className="py-2 font-medium">Description</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {vehicle.expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="py-2.5 font-semibold text-emerald-400">{exp.category}</td>
                      <td className="py-2.5 text-slate-300">{exp.description}</td>
                      <td className="py-2.5 text-slate-400">{formatDate(exp.date)}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-white">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pricing & Marketplace Sync */}
        <div className="space-y-6">
          {/* Pricing & Profitability Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-bold text-white">Pricing & Margins</h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Asking Price</span>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCurrency(vehicle.askingPrice)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Preferred Floor</span>
                <span className="text-sm font-semibold text-slate-200">
                  {formatCurrency(vehicle.preferredPrice)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Absolute Min (AI Limit)</span>
                <span className="text-sm font-semibold text-rose-400">
                  {formatCurrency(vehicle.minPrice)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Projected Profit</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  +{formatCurrency(projectedProfit)} ({roi}% ROI)
                </span>
              </div>
            </div>
          </div>

          {/* Syndication Status Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Marketplace Syndication
              </h2>
              <Link href="/marketplaces" className="text-xs text-blue-400 hover:text-blue-300">
                Manage
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Dealer Storefront</span>
                <StatusBadge status="LIVE" />
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Facebook Marketplace</span>
                <StatusBadge status="LIVE" />
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Craigslist</span>
                <StatusBadge status="LIVE" />
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>eBay Motors</span>
                <StatusBadge status="LIVE" />
              </div>
            </div>
          </div>

          {/* Buyer Inquiries Linked */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Active Buyer Inquiries ({vehicle.leads.length})
            </h2>

            {vehicle.leads.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center">
                No active buyer leads yet.
              </div>
            ) : (
              vehicle.leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lead.name}</span>
                    <StatusBadge status={lead.stage} />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Offer: {lead.currentOffer ? formatCurrency(lead.currentOffer) : 'Asking Price'} • Score: {lead.score}/100
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
