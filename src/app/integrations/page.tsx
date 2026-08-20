'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Car,
  ShieldCheck,
  Zap,
  Globe,
  Gavel,
  CheckCircle2,
  Lock,
  ArrowRight,
} from '@/components/icons';

const INTEGRATIONS = [
  {
    name: 'NHTSA VPIC',
    category: 'VEHICLE_DATA',
    status: 'LIVE_API',
    description: 'Official US Government vehicle specification and recall database with instant VIN decoding.',
    badge: 'Connected / Free',
  },
  {
    name: 'VinAudit & NMVTIS',
    category: 'VEHICLE_DATA',
    status: 'LIVE_API',
    description: 'National Motor Vehicle Title Information System junk, salvage, flood, and odometer rollback verification.',
    badge: 'API Sandbox Ready',
  },
  {
    name: 'Facebook Marketplace',
    category: 'MARKETPLACES',
    status: 'PARTNER_API / MANUAL',
    description: 'Meta Automotive Catalog Feed integration and 1-click clipboard asset bundles with auto-delisting.',
    badge: 'Feed Ready',
  },
  {
    name: 'Autotrader / Cox Automotive',
    category: 'MARKETPLACES',
    status: 'DEALER_FEED',
    description: 'Automated Homenet / FTP inventory feed syndication and bidirectional CRM lead ingestion.',
    badge: 'Syndication Ready',
  },
  {
    name: 'Manheim Auctions',
    category: 'AUCTIONS',
    status: 'AUCTIONACCESS_REQUIRED',
    description: 'Live lane run lists, MMR market valuation, and proxy bidding for licensed dealerships.',
    badge: 'Dealer License Required',
  },
  {
    name: 'ACV Auctions',
    category: 'AUCTIONS',
    status: 'AUCTIONACCESS_REQUIRED',
    description: '20-minute digital condition reports, timed online bidding, and automated purchase conversion.',
    badge: 'Dealer License Required',
  },
  {
    name: 'Twilio SMS & Voice',
    category: 'COMMUNICATION',
    status: 'PARTNER_API',
    description: 'Dedicated dealership phone numbers for 2-way AI customer SMS conversations and click-to-call.',
    badge: 'API Ready',
  },
  {
    name: 'CARFAX & AutoCheck',
    category: 'VEHICLE_DATA',
    status: 'PARTNER_API',
    description: 'Commercial accident, service records, and 1-owner title verification history reports.',
    badge: 'Partner Integration',
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      <section className="pt-20 pb-12 border-b border-slate-800 bg-slate-900/30 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <span>Official APIs, Certified Feeds & Dealer Integrations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Automotive Data & Marketplace Ecosystem
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          DealerOS connects to authoritative government databases, wholesale auction platforms, and major consumer advertising channels without brittle scraping.
        </p>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTEGRATIONS.map((item) => (
            <div key={item.name} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                Integration Protocol: <span className="text-slate-300 font-semibold">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
