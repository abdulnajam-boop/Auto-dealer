import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/dealer/StatCard';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  Car,
  DollarSign,
  TrendingUp,
  Clock,
  Globe,
  Users,
  MessageSquare,
  Calendar,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const tenant = await getTenantContext();

  const [vehicles, opportunities, leads, appointments, deals, conversations] =
    await Promise.all([
      prisma.vehicle.findMany({
        where: { organizationId: tenant.organizationId },
        include: { photos: true, expenses: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.opportunity.findMany({
        where: { organizationId: tenant.organizationId },
        orderBy: { opportunityScore: 'desc' },
        take: 5,
      }),
      prisma.lead.findMany({
        where: { organizationId: tenant.organizationId },
        include: { vehicle: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.appointment.findMany({
        where: { organizationId: tenant.organizationId },
        include: { vehicle: true },
        orderBy: { scheduledAt: 'asc' },
      }),
      prisma.deal.findMany({
        where: { organizationId: tenant.organizationId },
        include: { vehicle: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.conversation.findMany({
        where: { organizationId: tenant.organizationId },
        include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
      }),
    ]);

  const activeVehicles = vehicles.filter((v) =>
    ['READY', 'LISTED', 'RECONDITIONING'].includes(v.status)
  );
  const soldVehicles = vehicles.filter((v) => v.status === 'SOLD');

  const totalCostBasis = activeVehicles.reduce(
    (sum, v) => sum + (v.totalCostBasis || v.purchasePrice || 0),
    0
  );
  const totalAskingValue = activeVehicles.reduce((sum, v) => sum + v.askingPrice, 0);
  const potentialProfit = totalAskingValue - totalCostBasis;
  const avgMargin =
    totalCostBasis > 0 ? ((potentialProfit / totalCostBasis) * 100).toFixed(1) : '0';

  const staleVehicles = activeVehicles.filter((v) => v.daysInInventory >= 45);
  const avgDaysToSell =
    activeVehicles.length > 0
      ? Math.round(
          activeVehicles.reduce((sum, v) => sum + v.daysInInventory, 0) /
            activeVehicles.length
        )
      : 24;

  const totalSoldRevenue = deals
    .filter((d) => ['FUNDED', 'DELIVERED'].includes(d.dealStatus))
    .reduce((sum, d) => sum + d.salePrice, 0);

  const pendingDeals = deals.filter((d) =>
    ['PENDING_APPROVAL', 'APPROVED', 'CONTRACTED'].includes(d.dealStatus)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Dealership Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Command Center
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
              Live Feed
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time dealership operations, AI opportunity scoring, buyer negotiation & F&I desk.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze Opportunity</span>
          </Link>
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Listing Studio</span>
          </Link>
        </div>
      </div>

      {/* AI-Generated Daily Dealer Briefing Card */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-slate-900/40 p-5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-purple-400" />
        </div>
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                AI Daily Dealer Briefing
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                  EXECUTIVE SUMMARY
                </span>
              </h2>
              <span className="text-xs text-slate-400">{formatDate(new Date())}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              &ldquo;Three new buyer inquiries arrived overnight. The{' '}
              <strong className="text-white">2021 Honda Accord</strong> generated the highest buyer
              engagement across Storefront and Facebook Marketplace. Emily Rodriguez confirmed a VIP
              test drive appointment for today. Two vehicles have surpassed 45 days in inventory—review
              the <strong className="text-amber-300">2020 BMW 330i</strong> pricing for markdown. 4
              leads are currently active in the negotiation pipeline.&rdquo;
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <Link
                href="/messages"
                className="inline-flex items-center gap-1 text-purple-300 hover:text-white font-medium"
              >
                <span>View 3 Unread Conversations</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/inventory"
                className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-medium"
              >
                <span>Review {staleVehicles.length} Stale Vehicles</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Inventory"
          value={`${activeVehicles.length} Units`}
          change={`${formatCurrency(totalAskingValue)} Retail`}
          isPositive={true}
          subtitle={`Cost Basis: ${formatCurrency(totalCostBasis)}`}
          icon={Car}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Potential Gross Margin"
          value={formatCurrency(potentialProfit)}
          change={`+${avgMargin}% ROI`}
          isPositive={true}
          subtitle="Unrealized margin in stock"
          icon={TrendingUp}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Avg Days to Sell"
          value={`${avgDaysToSell} Days`}
          change={avgDaysToSell <= 30 ? 'Optimal Velocity' : 'Aged Warning'}
          isPositive={avgDaysToSell <= 30}
          subtitle={`${staleVehicles.length} units sitting >45 days`}
          icon={Clock}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Realized Sold Revenue"
          value={formatCurrency(totalSoldRevenue)}
          change={`${soldVehicles.length} Cars Delivered`}
          isPositive={true}
          subtitle={`${pendingDeals.length} deals pending closing`}
          icon={DollarSign}
          iconColor="text-purple-400"
        />
      </div>

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase text-slate-500">Active Leads</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">{leads.length} in Pipeline</div>
          <div className="text-xs text-slate-400 mt-1">
            {leads.filter((l) => l.stage === 'APPOINTMENT').length} test drives booked
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase text-slate-500">Marketplaces</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">7 Channels Connected</div>
          <div className="text-xs text-slate-400 mt-1">Storefront, FB, CL, eBay, Autotrader</div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase text-slate-500">Appointments</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">{appointments.length} Scheduled</div>
          <div className="text-xs text-slate-400 mt-1">Next: Emily Rodriguez (Camry)</div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase text-slate-500">Pending F&I Deals</span>
            <FileCheck2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-white">{pendingDeals.length} In Contracting</div>
          <div className="text-xs text-slate-400 mt-1">Awaiting lender funding / delivery</div>
        </div>
      </div>

      {/* Main Dual Columns: Current Inventory & Sourcing Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Inventory & Performance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Active Inventory Quick Desk</h3>
                <p className="text-xs text-slate-400">Current stock, pricing, and days on lot</p>
              </div>
              <Link
                href="/inventory"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                <span>View Full Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 pb-2 font-medium">
                    <th className="py-2.5">Vehicle</th>
                    <th className="py-2.5">Stock #</th>
                    <th className="py-2.5">Mileage</th>
                    <th className="py-2.5">Cost Basis</th>
                    <th className="py-2.5">Asking Price</th>
                    <th className="py-2.5">Days</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {activeVehicles.slice(0, 6).map((veh) => (
                    <tr key={veh.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-white">
                        <Link href={`/inventory/${veh.id}`} className="hover:text-emerald-400">
                          {veh.year} {veh.make} {veh.model} {veh.trim || ''}
                        </Link>
                      </td>
                      <td className="py-3 font-mono text-slate-400">{veh.stockNumber}</td>
                      <td className="py-3 text-slate-300">{formatNumber(veh.mileage)} mi</td>
                      <td className="py-3 text-slate-400">{formatCurrency(veh.totalCostBasis)}</td>
                      <td className="py-3 font-semibold text-emerald-400">
                        {formatCurrency(veh.askingPrice)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            veh.daysInInventory > 45 ? 'text-rose-400 font-bold' : 'text-slate-300'
                          }`}
                        >
                          {veh.daysInInventory}d
                        </span>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={veh.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CRM Leads Quick Desk */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Recent Buyer Leads & Negotiations</h3>
                <p className="text-xs text-slate-400">Active CRM pipeline and customer inquiries</p>
              </div>
              <Link
                href="/leads"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                <span>Open CRM Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl border border-slate-800/70 bg-slate-950/60 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{lead.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {lead.vehicle
                          ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}`
                          : 'General Inquiry'}{' '}
                        • Offer: {lead.currentOffer ? formatCurrency(lead.currentOffer) : 'Asking Price'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      Score: {lead.score}
                    </span>
                    <StatusBadge status={lead.stage} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Sourcing Opportunities & Watchlists */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Top Auction Opportunities
                </h3>
                <p className="text-xs text-slate-400">Evaluated by Vehicle Intelligence Engine</p>
              </div>
              <Link
                href="/opportunities"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Scan VIN
              </Link>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white">
                        {opp.year} {opp.make} {opp.model} {opp.trim || ''}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {opp.sourceChannel} • {formatNumber(opp.mileage)} mi
                      </div>
                    </div>
                    <StatusBadge status={opp.recommendation} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-500">Max Bid:</span>{' '}
                      <span className="font-semibold text-white">
                        {formatCurrency(opp.maxRecommendedBid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Exp. Profit:</span>{' '}
                      <span className="font-semibold text-emerald-400">
                        {formatCurrency(opp.expectedGrossProfit)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>Opportunity Score:</span>
                      <span className="font-mono font-bold text-purple-300">
                        {opp.opportunityScore}/100
                      </span>
                    </div>
                    <Link
                      href="/opportunities"
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Automation Engine Health Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Event Automations Active
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                100% HEALTHY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Auto AI copy generation, auto-delisting on delivery, and AI sales negotiation engine are active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
