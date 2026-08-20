'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Car,
  Award,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
} from '@/components/icons';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      <section className="pt-20 pb-12 border-b border-slate-800 bg-slate-900/30 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <span>Our Mission & Vision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Empowering Modern Automotive Retail
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          We built DealerOS because independent and franchise automotive dealerships deserve modern software that works as hard and fast as their best sales managers.
        </p>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Replacing Fragmented Legacy Tools</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Traditional automotive software is broken: disparate DMS tools, disconnected CRMs, slow auction valuation calculators, and manual marketplace copy-pasting that wastes dozens of employee hours every week.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              DealerOS unifies inventory management, auction intelligence, AI customer negotiations, and F&I desking into a single lightning-fast platform designed from day one for multi-tenant scalability.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                15k+
              </div>
              <div>
                <div className="font-bold text-white text-sm">Vehicles Managed</div>
                <div className="text-xs text-slate-400">Across verified dealerships</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                99.9%
              </div>
              <div>
                <div className="font-bold text-white text-sm">Uptime & Isolation</div>
                <div className="text-xs text-slate-400">Enterprise cloud architecture</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
