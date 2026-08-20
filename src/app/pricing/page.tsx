'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from '@/components/icons';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      <section className="pt-20 pb-12 border-b border-slate-800 bg-slate-900/30 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <span>14-Day Full-Feature Free Trial • No Credit Card Required</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Transparent, Predictable Dealership Pricing
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Scale your dealership without predatory per-lead fees or hidden charges.
        </p>

        {/* Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'MONTHLY' ? 'text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
            className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-1 relative transition-colors"
          >
            <div
              className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                billingCycle === 'ANNUAL' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'ANNUAL' ? 'text-white' : 'text-slate-400'}`}>
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Starter</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-mono">
                  {billingCycle === 'MONTHLY' ? '$249' : '$199'}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ideal for boutique independent dealers managing up to 30 vehicles.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 30 Active Vehicles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Branded Dealership Storefront</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> NHTSA VIN Decoding</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> CRM & Unified Inbox</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3 Staff Accounts with RBAC</li>
              </ul>
            </div>
            <Link
              href="/register?plan=STARTER"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all block"
            >
              Start Starter Trial
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-8 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Professional</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-mono">
                  {billingCycle === 'MONTHLY' ? '$499' : '$399'}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                For high-turn dealerships requiring 24/7 AI autonomy, arbitrage sourcing, and syndication.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 150 Active Vehicles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 AI Sales Agent (Unlimited)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Marketplace Hub & Auto-Delist</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-Time Auction & Arbitrage Center</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lease Deal Discovery Module</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 15 Staff Accounts with RBAC</li>
              </ul>
            </div>
            <Link
              href="/register?plan=PRO"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center shadow-lg shadow-emerald-500/20 transition-all block"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Enterprise</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-mono">
                  {billingCycle === 'MONTHLY' ? '$1,299' : '$999'}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-rooftop dealer groups requiring custom DMS feeds, dedicated IPs, and SLAs.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Inventory & Rooftops</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated DMS / CDK / Reynolds Feed</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Domain White-Labeling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Dedicated Account Manager</li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all block"
            >
              Contact Enterprise Sales
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
