'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Car,
  Bot,
  Zap,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Globe,
  Gavel,
  DollarSign,
  CheckCircle2,
  FileCheck2,
  Tag,
  Target,
  ArrowRight,
} from '@/components/icons';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      {/* Header */}
      <section className="pt-20 pb-12 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <span>The Complete Dealership Operating System</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Features Built for High-Velocity Automotive Retail
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            From auction lane sourcing and AI customer negotiations to automated multi-channel publishing and desking, explore every capability that powers DealerOS.
          </p>
        </div>
      </section>

      {/* Feature Deep Dives */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 1. AI Sales Agent */}
        <div id="ai" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Autonomous AI Sales Agent</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              DealerOS AI answers buyer inquiries 24/7 across web chat, SMS, and Facebook Messenger. Built with strict mathematical price boundaries, it negotiates counter-offers, collects trade-in details, and books test drives directly onto your sales calendar.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bounded counter-offer negotiation engine</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant trade-in valuation collection</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated calendar scheduling for showroom test drives</li>
            </ul>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="text-xs font-mono text-emerald-400 mb-3">// Autonomous AI Sales Protocol</div>
            <div className="bg-slate-950 p-4 rounded-2xl space-y-3 font-mono text-xs border border-slate-800">
              <div className="text-slate-400">Buyer: "Can you do $22,500 cash today on the 2022 Camry?"</div>
              <div className="text-purple-300">AI: "Hi Kevin! Our listed price is $24,900. While $22,500 is below our floor, I can do $23,750 out-the-door if you can come in for a test drive today at 3 PM. Would that work?"</div>
            </div>
          </div>
        </div>

        {/* 2. Opportunity Arbitrage */}
        <div id="arbitrage" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
              <span className="text-slate-300">Lone Star Motors Comps (San Antonio)</span>
              <span className="text-emerald-400 font-bold">SCORE 92/100</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Acquisition</div>
                <div className="font-bold text-white">$18,900</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Recon + Trans</div>
                <div className="font-bold text-slate-300">$800</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Projected Margin</div>
                <div className="font-bold text-emerald-400">+$5,600</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Cross-Dealer Arbitrage Engine</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Identify profitable wholesale, dealer-to-dealer, and auction vehicles with mathematical certainty. DealerOS incorporates estimated transportation, reconditioning costs, and regional pricing variance into an explainable 0–100 Opportunity Score.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full cost basis breakdown (Transport + Recon + Buy Fees)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Explainable data provenance for every valuation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-click conversion from Opportunity to Live Inventory</li>
            </ul>
          </div>
        </div>

        {/* 3. Multi-Marketplace Hub */}
        <div id="marketplaces" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Omnichannel Listing Studio & Auto-Delisting</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Publish rich, optimized vehicle listings to your custom branded storefront, Facebook Marketplace, Autotrader, Cars.com, and Craigslist in seconds. When the vehicle sells, DealerOS instantly delists it everywhere to eliminate duplicate inquiries.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI-generated tailored copy for each channel</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time price synchronization across platforms</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant automated delisting on contract execution</li>
            </ul>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">Facebook Marketplace Catalog</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">Synced • 18 Leads</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">Dealer Branded Storefront</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">Live • Instant</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">Autotrader Feed</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">Live • Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-slate-800 bg-slate-900/40 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Experience DealerOS in Action</h3>
        <div className="flex justify-center gap-3">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            Start Free Trial
          </Link>
          <Link
            href="/demo"
            className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold"
          >
            Schedule Live Demo
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
