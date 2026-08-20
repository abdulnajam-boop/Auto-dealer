import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  Users,
  Plus,
  Car,
  Calendar,
  MessageSquare,
  FileCheck2,
  Phone,
  Mail,
  ArrowRight,
  TrendingUp,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const tenant = await getTenantContext();

  const leads = await prisma.lead.findMany({
    where: { organizationId: tenant.organizationId },
    include: {
      vehicle: true,
      assignedTo: true,
      appointments: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const STAGES = [
    { label: 'New', value: 'NEW', color: 'border-blue-500/40 bg-blue-500/5' },
    { label: 'Contacted', value: 'CONTACTED', color: 'border-purple-500/40 bg-purple-500/5' },
    { label: 'Qualified', value: 'QUALIFIED', color: 'border-teal-500/40 bg-teal-500/5' },
    { label: 'Appointment', value: 'APPOINTMENT', color: 'border-amber-500/40 bg-amber-500/5' },
    { label: 'Negotiating', value: 'NEGOTIATING', color: 'border-orange-500/40 bg-orange-500/5' },
    { label: 'Pending Deal', value: 'PENDING', color: 'border-indigo-500/40 bg-indigo-500/5' },
    { label: 'Sold / Delivered', value: 'SOLD', color: 'border-emerald-500/40 bg-emerald-500/5' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            CRM & Lead Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer inquiries, trade-in valuations, credit readiness, and conversions.
          </p>
        </div>

        <Link
          href="/messages"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all"
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>Open Unified Inbox</span>
        </Link>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.value);
          return (
            <div
              key={stage.value}
              className={`rounded-xl border ${stage.color} p-3 flex flex-col min-w-[240px] lg:min-w-0`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {stage.label}
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-300 font-bold">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="text-[11px] text-slate-600 text-center py-6">No leads</div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-white">{lead.name}</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono font-bold">
                          {lead.score}
                        </span>
                      </div>

                      {lead.vehicle && (
                        <div className="text-[11px] text-emerald-400 font-medium truncate">
                          {lead.vehicle.year} {lead.vehicle.make} {lead.vehicle.model}
                        </div>
                      )}

                      {lead.currentOffer && (
                        <div className="text-[11px] text-slate-300 font-mono">
                          Offer: <span className="text-white font-bold">{formatCurrency(lead.currentOffer)}</span>
                        </div>
                      )}

                      {lead.tradeInMake && (
                        <div className="text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-800">
                          Trade: {lead.tradeInYear} {lead.tradeInMake} {lead.tradeInModel} (~{formatCurrency(lead.tradeInEstimate)})
                        </div>
                      )}

                      <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                        <Link
                          href="/messages"
                          className="text-purple-400 hover:text-purple-300 font-semibold"
                        >
                          Chat
                        </Link>
                        {lead.vehicle && (
                          <Link
                            href={`/deals?vehicleId=${lead.vehicle.id}&buyerName=${encodeURIComponent(lead.name)}`}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            Deal →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Leads Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Full Customer Relationship Directory</h2>
          <span className="text-xs text-slate-400">{leads.length} Total Leads</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2.5 font-medium">
                <th className="py-2.5">Customer</th>
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">Contact</th>
                <th className="py-2.5">Trade-in</th>
                <th className="py-2.5">Financing</th>
                <th className="py-2.5">Offer</th>
                <th className="py-2.5">Score</th>
                <th className="py-2.5">Stage</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-bold text-white">{lead.name}</td>
                  <td className="py-3 text-slate-300">
                    {lead.vehicle ? (
                      <Link href={`/inventory/${lead.vehicle.id}`} className="hover:text-emerald-400">
                        {lead.vehicle.year} {lead.vehicle.make} {lead.vehicle.model}
                      </Link>
                    ) : (
                      'General'
                    )}
                  </td>
                  <td className="py-3 text-slate-400">
                    {lead.phone || lead.email || 'SMS Channel'}
                  </td>
                  <td className="py-3 text-slate-300">
                    {lead.tradeInMake
                      ? `${lead.tradeInYear} ${lead.tradeInMake} ${lead.tradeInModel}`
                      : 'None'}
                  </td>
                  <td className="py-3">
                    <span className="text-emerald-400 font-semibold">Pre-Approved</span>
                  </td>
                  <td className="py-3 font-bold text-white">
                    {lead.currentOffer ? formatCurrency(lead.currentOffer) : 'Asking Price'}
                  </td>
                  <td className="py-3 font-mono font-bold text-purple-300">{lead.score}/100</td>
                  <td className="py-3">
                    <StatusBadge status={lead.stage} />
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/messages"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Message
                      </Link>
                      {lead.vehicle && (
                        <Link
                          href={`/deals?vehicleId=${lead.vehicle.id}&buyerName=${encodeURIComponent(lead.name)}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                        >
                          Deal
                        </Link>
                      )}
                    </div>
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
