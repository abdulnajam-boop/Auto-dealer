'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Bot,
  Zap,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Globe,
  CheckCircle2,
  FileCheck2,
  Target,
  ArrowRight,
  Database,
  Layers,
  Search,
} from '@/components/icons';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <MarketingHeader />

      {/* Header */}
      <section className="pt-20 pb-12 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            <span>AUTOAIDEALERSHIP CAPABILITIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Features Built for Independent Dealership Velocity
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From Opportunity Intelligence and bounded AI buyer communications to VinAudit data normalization and digital desking, explore the core capabilities powering AutoAIdealership.
          </p>
        </div>
      </section>

      {/* Feature Deep Dives */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 1. AI Sales Agent (Bounded) */}
        <div id="ai" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE CAPABILITY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Bounded AI Sales Agent</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              AutoAIdealership AI engages shoppers on your website storefront 24/7. Built with strict mathematical guardrails, it negotiates counter-offers strictly within pre-approved floor prices, collects trade-in vehicle details, and books showroom test drives directly onto your sales calendar.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bounded price floor enforcement: Asking Price ≥ Counter ≥ Min Floor</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Trade-in appraisal information collection</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated calendar scheduling for showroom test drives</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-click human salesperson takeover with real-time manager escalation</li>
            </ul>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3 font-mono text-xs">
            <div className="text-xs text-emerald-400 font-bold pb-2 border-b border-slate-800 flex justify-between">
              <span>// Bounded AI Negotiation Protocol</span>
              <span className="text-slate-400">ACTIVE GUARDRAILS</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl space-y-3 border border-slate-800">
              <div className="text-slate-400">Shopper: "Can you do $22,000 cash today on the 2022 Camry SE?"</div>
              <div className="text-purple-300">AI: "Hi Kevin! Our listed price is $24,500. While $22,000 is below our floor, our manager has authorized $22,950 including documentation fee if you can test drive today at 3 PM. Would that work?"</div>
            </div>
          </div>
        </div>

        {/* 2. Opportunity Arbitrage */}
        <div id="arbitrage" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
              <span className="text-slate-300">Opportunity Valuation Model</span>
              <span className="text-emerald-400 font-bold">SCORE 92/100</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Acquisition Bid</div>
                <div className="font-bold text-white">$18,900</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Recon + Trans</div>
                <div className="font-bold text-slate-300">$800</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Projected Margin</div>
                <div className="font-bold text-emerald-400">+$4,500</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE CAPABILITY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Opportunity Intelligence & Arbitrage</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Identify profitable wholesale, dealer-to-dealer, and auction vehicles with mathematical certainty. AutoAIdealership incorporates estimated transportation, reconditioning costs, and regional pricing comps into an explainable 0–100 Opportunity Score.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full cost basis breakdown (Transport + Recon + Buy Fees)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transparent data provenance for every market comp</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-click conversion from Opportunity to Live Inventory</li>
            </ul>
          </div>
        </div>

        {/* 3. Marketplace Syndication Architecture (Truthful Phrasing) */}
        <div id="marketplaces" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                COMING SOON / PARTNER INTEGRATION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Marketplace Feeds & Listing Studio</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Build one master vehicle record. Our Listing Studio automatically crafts tailored copy for your Branded Storefront and generates structured feed formats for external classifieds and marketplace partners.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI-generated tailored copy for storefront and social listings</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Standardized export feeds for supported classified portals</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Inventory status tracking when vehicles enter pending or sold status</li>
            </ul>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3 font-mono text-xs">
            <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">
              Channel Integration Roadmap
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-white font-semibold">Dealer Storefront</span>
                <span className="text-emerald-400 font-bold text-[10px]">LIVE • INCLUDED</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-white font-semibold">Facebook Marketplace Catalog Feed</span>
                <span className="text-amber-400 text-[10px]">PARTNER FEED CONFIGURABLE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-white font-semibold">Autotrader & Cars.com Feeds</span>
                <span className="text-amber-400 text-[10px]">PARTNER INTEGRATION REQUIRED</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Vehicle Data & VinAudit Architecture */}
        <div id="vinaudit" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3 font-mono text-xs">
            <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">
              VinAudit Integration Services
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg"><span>VIN Decoder:</span><span className="text-emerald-400 font-bold">IMPLEMENTED</span></div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg"><span>Plate-to-VIN Lookup:</span><span className="text-emerald-400 font-bold">IMPLEMENTED</span></div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg"><span>Vehicle History Records:</span><span className="text-emerald-400 font-bold">IMPLEMENTED</span></div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg"><span>Market Value & Comps:</span><span className="text-emerald-400 font-bold">IMPLEMENTED</span></div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg"><span>Background Removal:</span><span className="text-emerald-400 font-bold">IMPLEMENTED</span></div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ARCHITECTURE ESTABLISHED
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">VinAudit Data Architecture</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              AutoAIdealership includes a dedicated, metered VinAudit service architecture for factory build specifications, license plate lookups, title brand records, market comps, and vehicle image enhancement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-slate-800 bg-slate-900/40 text-center space-y-4">
        <h3 className="text-2xl font-black text-white">Experience AutoAIdealership in Action</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          See how our AI-powered operating system simplifies your daily workflow.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/demo?mode=trial"
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
