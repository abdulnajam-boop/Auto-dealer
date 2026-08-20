import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  FileCheck2,
  Plus,
  DollarSign,
  Printer,
  CheckCircle2,
  Car,
  TrendingUp,
  FileText,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function DealsPage({
  searchParams,
}: {
  searchParams?: { vehicleId?: string; buyerName?: string };
}) {
  const tenant = await getTenantContext();

  const [deals, vehicles] = await Promise.all([
    prisma.deal.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        vehicle: { include: { expenses: true } },
        lead: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.vehicle.findMany({
      where: {
        organizationId: tenant.organizationId,
        status: { in: ['READY', 'LISTED', 'PENDING'] },
      },
    }),
  ]);

  const deliveredDeals = deals.filter((d) =>
    ['FUNDED', 'DELIVERED'].includes(d.dealStatus)
  );
  const totalDeliveredRevenue = deliveredDeals.reduce((sum, d) => sum + d.salePrice, 0);
  const totalDeliveredProfit = deliveredDeals.reduce(
    (sum, d) => sum + (d.salePrice - (d.vehicle?.totalCostBasis || 0)),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            F&I Deal Desk & Documents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Finance structuring, tax calculations, Buyer&apos;s Order generation, and automated delisting on sale.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 uppercase font-semibold">Funded / Delivered Volume</div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatCurrency(totalDeliveredRevenue)}
          </div>
          <div className="text-xs text-slate-500 mt-1">{deliveredDeals.length} Vehicles Sold</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 uppercase font-semibold">Realized Gross Profit</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {formatCurrency(totalDeliveredProfit)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Avg: {formatCurrency(deliveredDeals.length > 0 ? totalDeliveredProfit / deliveredDeals.length : 0)} / car
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 uppercase font-semibold">Pending Deals in Pipeline</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {deals.filter((d) => ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'CONTRACTED'].includes(d.dealStatus)).length} Deals
          </div>
          <div className="text-xs text-slate-500 mt-1">Awaiting lender funding & signing</div>
        </div>
      </div>

      {/* Deals List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Deal Portfolio & Contracts</h2>
            <p className="text-xs text-slate-400">All contracted, funded, and in-progress buyer transactions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2.5 font-medium">
                <th className="py-2.5">Buyer</th>
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">Sale Price</th>
                <th className="py-2.5">Financed / Down</th>
                <th className="py-2.5">Monthly Pmt</th>
                <th className="py-2.5">Realized Profit</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {deals.map((deal) => {
                const profit = deal.salePrice - (deal.vehicle?.totalCostBasis || 0);
                const isDelivered = ['FUNDED', 'DELIVERED'].includes(deal.dealStatus);

                return (
                  <tr key={deal.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-bold text-white">
                      <div>{deal.buyerName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{deal.buyerPhone}</div>
                    </td>
                    <td className="py-3 font-medium text-slate-300">
                      {deal.vehicle ? (
                        <Link href={`/inventory/${deal.vehicle.id}`} className="hover:text-emerald-400">
                          {deal.vehicle.year} {deal.vehicle.make} {deal.vehicle.model}
                        </Link>
                      ) : (
                        'Vehicle'
                      )}
                    </td>
                    <td className="py-3 font-bold text-white">{formatCurrency(deal.salePrice)}</td>
                    <td className="py-3 text-slate-400 font-mono">
                      {formatCurrency(deal.financedAmount)} / {formatCurrency(deal.cashDownPayment)}
                    </td>
                    <td className="py-3 font-semibold text-purple-300 font-mono">
                      {deal.monthlyPayment > 0 ? `${formatCurrency(deal.monthlyPayment)}/mo` : 'Cash Deal'}
                    </td>
                    <td className="py-3 font-bold text-emerald-400 font-mono">
                      +{formatCurrency(profit)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={deal.dealStatus} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/documents`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Print Bill of Sale"
                        >
                          <Printer className="w-3.5 h-3.5" />
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
