'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  FileText,
  Users,
} from '@/components/icons';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      <section className="pt-20 pb-12 border-b border-slate-800 bg-slate-900/30 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SOC 2 Type II Certified Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Enterprise Security & Tenant Isolation
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          AutoAIdealership is engineered with cryptographic isolation, strict RBAC guards, and data privacy safeguards to protect your dealership's financial and customer records.
        </p>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Cryptographic Tenant Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every database query and API endpoint enforces server-side session checks against active organization memberships. A dealer can never access another dealership's inventory, leads, deals, or profit margins.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">6-Role Granular RBAC Matrix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fine-grained access controls for Owners, Admins, Managers, Sales, Inventory, Finance, and Viewers. Restrict cost-basis visibility, price adjustments, and deal approvals to authorized staff.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Immutable Audit Logging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every critical action—including price overrides, deal funding, user invitations, and AI tool calls—is logged with timestamps, IP addresses, and user attributions for compliance audits.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white">Responsible Consumer Data & Consent Standards</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            AutoAIdealership strictly respects consumer privacy. Guest leads captured via the public marketplace or dealer storefront are logged with explicit opt-in consent records (SMS/Email/Privacy Policy). Consumers have full self-service rights for data export, preference management, and GDPR/CCPA deletion requests.
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
