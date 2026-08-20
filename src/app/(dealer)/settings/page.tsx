import React from 'react';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import {
  Settings,
  ShieldCheck,
  Key,
  Users,
  Bot,
  DollarSign,
  Building,
  Save,
  Globe,
  CheckCircle2,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const tenant = await getTenantContext();

  const [org, members] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: tenant.organizationId },
    }),
    prisma.organizationMember.findMany({
      where: { organizationId: tenant.organizationId },
      include: { user: true },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            Dealership Settings &amp; AI Policies
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-tenant organization profile, F&amp;I fee defaults, AI negotiation guardrails, and API keys.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dealership Profile */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Dealership Profile</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Dealership Legal Name</label>
              <input
                type="text"
                defaultValue={org?.name || 'Apex Auto Gallery'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Phone Number</label>
                <input
                  type="text"
                  defaultValue={org?.phone || '(512) 555-0199'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Support Email</label>
                <input
                  type="text"
                  defaultValue={org?.email || 'sales@apexautogallery.com'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Physical Lot Address</label>
              <input
                type="text"
                defaultValue={`${org?.address || '4500 Auto Mall Pkwy'}, ${org?.city || 'Austin'}, ${org?.state || 'TX'} ${org?.zip || '78759'}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* F&I Fee & Pricing Configuration */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">F&amp;I Defaults &amp; Tax Structure</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Dealer Doc Fee ($)</label>
                <input
                  type="number"
                  defaultValue="499"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">State Tax Rate (%)</label>
                <input
                  type="number"
                  defaultValue="6.25"
                  step="0.01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Target Gross Profit Margin (%)</label>
              <input
                type="number"
                defaultValue="15"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              These values automatically populate new F&amp;I deals, Buyer&apos;s Orders, and financial projections.
            </div>
          </div>
        </div>

        {/* Autonomous AI Sales Agent Guardrails */}
        <div className="rounded-2xl border border-purple-500/30 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bot className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">AI Sales Agent Policy Rules</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Autonomous Buyer Auto-Reply</div>
                <div className="text-[11px] text-slate-400">Respond to customer inquiries within seconds</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px]">
                ENABLED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-purple-200 text-xs leading-relaxed space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Hard Invariant Price Floor Rule
              </div>
              <p className="text-[11px] text-slate-400">
                The AI Sales Agent will strictly negotiate between the Asking Price and the Absolute Minimum Floor. Any offer below the minimum is rejected or routed for manual review.
              </p>
            </div>
          </div>
        </div>

        {/* Team Members & RBAC */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Authorized Staff &amp; RBAC</h2>
          </div>

          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{m.user.name}</div>
                  <div className="text-[11px] text-slate-400">{m.user.email}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
