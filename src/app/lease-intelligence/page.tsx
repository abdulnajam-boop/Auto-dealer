'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Tag,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
} from '@/components/icons';

export default function LeaseIntelligencePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      <section className="pt-20 pb-12 border-b border-slate-800 bg-slate-900/30 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>Lease Discovery & Mathematical Rule Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Radical Lease Transparency & Intelligence
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          DealerOS exposes true effective monthly costs, money factor equivalents, and explainable 0–100 Lease Deal Scores for both shoppers and dealership desking managers.
        </p>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white">True Effective Monthly Cost</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Advertised payments often hide $4,000+ in down payments, acquisition fees, and documentation charges. DealerOS computes:
              <br />
              <code className="text-teal-300 font-mono text-[11px] block mt-2 bg-slate-950 p-2 rounded-lg">
                (Monthly × Term + Due at Signing) / Term
              </code>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Explainable 0–100 Deal Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every lease offer is ranked across residual percentage, money factor APR equivalent, manufacturer incentives, and dealer contribution to highlight real strengths and weaknesses.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Public Lease Marketplace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consumers search nationwide and regional lease specials with direct 1-click test drive bookings and lead delivery straight into your DealerOS CRM.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/lease-deals"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/20 transition-all"
          >
            <span>Explore Public Lease Deals Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
