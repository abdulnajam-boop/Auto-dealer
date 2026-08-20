import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatDate } from '@/lib/utils';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  Settings,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function AutomationsPage() {
  const tenant = await getTenantContext();

  const rules = await prisma.automationRule.findMany({
    where: { organizationId: tenant.organizationId },
    include: { runs: { take: 5, orderBy: { createdAt: 'desc' } } },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Event Automation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reactive event triggers, autonomous AI workflows, and external webhook integrations.
          </p>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{rule.name}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{rule.description}</p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div>
                <span className="text-slate-500 font-mono">TRIGGER:</span>{' '}
                <span className="font-semibold text-amber-400 font-mono">{rule.triggerEvent}</span>
              </div>
              <div>
                <span className="text-slate-500 font-mono">ACTIONS:</span>{' '}
                <span className="font-semibold text-purple-300 font-mono">{rule.actionsJson}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Automatic Execution Active</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Listening
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* External Integration Notice */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
          <Settings className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">External n8n / Webhook Dispatcher</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            All core dealership events (vehicle intake, AI listing approval, buyer messages, post-sale delisting)
            fire through the internal event bus. External webhook endpoints can be connected for n8n or Zapier flows without disrupting core DMS operations.
          </p>
        </div>
      </div>
    </div>
  );
}
