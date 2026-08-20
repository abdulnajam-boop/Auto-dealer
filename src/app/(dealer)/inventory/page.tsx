import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  Car,
  Plus,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InventoryPage({
  searchParams,
}: {
  searchParams?: { status?: string; search?: string };
}) {
  const tenant = await getTenantContext();
  const statusFilter = searchParams?.status;
  const searchQuery = searchParams?.search;

  const whereClause: any = { organizationId: tenant.organizationId };
  if (statusFilter && statusFilter !== 'ALL') {
    whereClause.status = statusFilter;
  }
  if (searchQuery) {
    whereClause.OR = [
      { make: { contains: searchQuery } },
      { model: { contains: searchQuery } },
      { vin: { contains: searchQuery } },
      { stockNumber: { contains: searchQuery } },
    ];
  }

  const vehicles = await prisma.vehicle.findMany({
    where: whereClause,
    include: {
      photos: { where: { isCover: true }, take: 1 },
      expenses: true,
      listings: { take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  const allVehicles = await prisma.vehicle.findMany({
    where: { organizationId: tenant.organizationId },
  });

  const totalCost = allVehicles.reduce(
    (sum, v) => sum + (v.totalCostBasis || v.purchasePrice || 0),
    0
  );
  const totalAsking = allVehicles.reduce((sum, v) => sum + v.askingPrice, 0);
  const potentialProfit = totalAsking - totalCost;

  const STATUSES = [
    { label: 'All Units', value: 'ALL', count: allVehicles.length },
    { label: 'Listed', value: 'LISTED', count: allVehicles.filter((v) => v.status === 'LISTED').length },
    { label: 'Ready', value: 'READY', count: allVehicles.filter((v) => v.status === 'READY').length },
    { label: 'Reconditioning', value: 'RECONDITIONING', count: allVehicles.filter((v) => v.status === 'RECONDITIONING').length },
    { label: 'In Transit', value: 'IN_TRANSIT', count: allVehicles.filter((v) => v.status === 'IN_TRANSIT').length },
    { label: 'Purchased', value: 'PURCHASED', count: allVehicles.filter((v) => v.status === 'PURCHASED').length },
    { label: 'Sold', value: 'SOLD', count: allVehicles.filter((v) => v.status === 'SOLD').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-emerald-400" />
            Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete vehicle lifecycle, cost basis accounting, photo media, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Intake Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Stock</div>
          <div className="text-xl font-bold text-white mt-1">{allVehicles.length} Vehicles</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Cost Basis</div>
          <div className="text-xl font-bold text-slate-200 mt-1">{formatCurrency(totalCost)}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Asking Value</div>
          <div className="text-xl font-bold text-white mt-1">{formatCurrency(totalAsking)}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 uppercase font-semibold">Potential Margin</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {formatCurrency(potentialProfit)}
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {STATUSES.map((tab) => {
          const isActive = (!statusFilter && tab.value === 'ALL') || statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={`/inventory?status=${tab.value}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Inventory Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2.5 font-medium">
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">Stock / VIN</th>
                <th className="py-2.5">Mileage</th>
                <th className="py-2.5">Cost Basis</th>
                <th className="py-2.5">Asking Price</th>
                <th className="py-2.5">Proj. Profit</th>
                <th className="py-2.5">Days</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {vehicles.map((v) => {
                const profit = v.askingPrice - v.totalCostBasis;
                return (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5">
                      <Link
                        href={`/inventory/${v.id}`}
                        className="font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                          {v.photos[0] ? (
                            <img
                              src={v.photos[0].url}
                              alt={v.model}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Car className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div>
                            {v.year} {v.make} {v.model} {v.trim || ''}
                          </div>
                          <div className="text-[11px] text-slate-400">{v.exteriorColor}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3.5 font-mono text-slate-400">
                      <div>#{v.stockNumber}</div>
                      <div className="text-[10px] text-slate-500">{v.vin.slice(-8)}</div>
                    </td>
                    <td className="py-3.5 text-slate-300">{formatNumber(v.mileage)} mi</td>
                    <td className="py-3.5 text-slate-400">{formatCurrency(v.totalCostBasis)}</td>
                    <td className="py-3.5 font-bold text-white">{formatCurrency(v.askingPrice)}</td>
                    <td className="py-3.5 font-semibold text-emerald-400">
                      {formatCurrency(profit)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`font-mono font-semibold ${
                          v.daysInInventory > 45 ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {v.daysInInventory}d
                      </span>
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/listings?vehicleId=${v.id}`}
                          className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
                          title="Generate AI Listing"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/inventory/${v.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                        >
                          Manage
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
