'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Gavel,
  Database,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from '@/components/icons';

type IntegrationStatus = 'LIVE' | 'IMPLEMENTED' | 'COMING SOON' | 'PARTNER REQUIRED' | 'MANUAL' | 'RESEARCH REQUIRED';

interface IntegrationItem {
  name: string;
  category: 'VEHICLE_DATA' | 'AUCTIONS' | 'MARKETPLACES' | 'DMS';
  subcategory?: string;
  status: IntegrationStatus;
  accessType: string;
  capabilities: string[];
  requirements?: string[];
  description: string;
}

const INTEGRATIONS_LIST: IntegrationItem[] = [
  // 1. Vehicle Data & History
  {
    name: 'NHTSA VPIC API',
    category: 'VEHICLE_DATA',
    status: 'LIVE',
    accessType: 'Official Public API',
    capabilities: ['Instant VIN Decoding', 'Make/Model/Year Specs', 'Safety Recalls'],
    description: 'Government public VPIC database decoding standard factory specifications with zero latency.',
  },
  {
    name: 'VinAudit API Suite',
    category: 'VEHICLE_DATA',
    status: 'IMPLEMENTED',
    accessType: 'Official REST API Architecture',
    capabilities: ['VIN Specifications', 'Plate-to-VIN', 'Vehicle History Records', 'Market Value & Comps', 'Ownership Cost', 'Background Removal'],
    requirements: ['VINAUDIT_API_KEY required for live production calls'],
    description: 'Full service provider architecture for vehicle specifications, license plate lookups, title brand checks, and comparable valuations.',
  },
  {
    name: 'CARFAX Vehicle History',
    category: 'VEHICLE_DATA',
    status: 'PARTNER REQUIRED',
    accessType: 'Commercial Provider Agreement',
    capabilities: ['Accident History', 'Service Records', '1-Owner Verification', 'Title Provenance'],
    requirements: ['Dealership CARFAX commercial agreement & credentials required'],
    description: 'CARFAX provider interface prepared. Unconfigured accounts report unverified status truthfully with no fabricated reports.',
  },
  {
    name: 'Experian AutoCheck',
    category: 'VEHICLE_DATA',
    status: 'PARTNER REQUIRED',
    accessType: 'Commercial Provider Agreement',
    capabilities: ['AutoCheck Score', 'Auction History', 'Title Brand Records'],
    requirements: ['Experian AutoCheck commercial credentials required'],
    description: 'AutoCheck provider interface prepared for commercial subscribers.',
  },

  // 2. Auctions (Wholesale / Salvage / Enthusiast)
  {
    name: 'Manheim (Cox Automotive)',
    category: 'AUCTIONS',
    subcategory: 'DEALER-ONLY WHOLESALE',
    status: 'RESEARCH REQUIRED',
    accessType: 'Dealer ACCESS / Cox Partner API',
    capabilities: ['Lane Search (TBD)', 'Simulcast Bidding (TBD)', 'MMR Valuation Data (TBD)'],
    requirements: ['Dealer License', 'AuctionACCESS Account', 'Cox Developer Authorization'],
    description: 'Wholesale auction integration under active architecture evaluation. Manual watchlist and run list import currently supported.',
  },
  {
    name: 'ACV Auctions',
    category: 'AUCTIONS',
    subcategory: 'DEALER-ONLY WHOLESALE',
    status: 'RESEARCH REQUIRED',
    accessType: 'Partner API / Dealer Token',
    capabilities: ['Inspection Report Analysis', 'Condition Audio Analysis', 'Watchlist (TBD)'],
    requirements: ['Dealer License', 'ACV Dealer Account'],
    description: 'Dealer-to-dealer wholesale platform. Manual opportunity entry and condition grade normalization supported.',
  },
  {
    name: 'OPENLANE (formerly ADESA)',
    category: 'AUCTIONS',
    subcategory: 'DEALER-ONLY WHOLESALE',
    status: 'RESEARCH REQUIRED',
    accessType: 'Wholesale Partner Feed',
    capabilities: ['Run List Inspection', 'Wholesale Watchlist'],
    requirements: ['Dealer License', 'AuctionACCESS'],
    description: 'Major wholesale auction provider integration under research.',
  },
  {
    name: 'Copart Auto Auctions',
    category: 'AUCTIONS',
    subcategory: 'SALVAGE / INSURANCE',
    status: 'RESEARCH REQUIRED',
    accessType: 'Member Feed / Authorized Partner API',
    capabilities: ['Lot Run Search (TBD)', 'Salvage Title Verification', 'Damage Appraisal Comps'],
    requirements: ['Copart Member Account', 'Dealer/Broker License for select states'],
    description: 'Insurance salvage auction platform. Automated scraping strictly prohibited; evaluating official partner feed access.',
  },
  {
    name: 'IAAI (Insurance Auto Auctions)',
    category: 'AUCTIONS',
    subcategory: 'SALVAGE / INSURANCE',
    status: 'RESEARCH REQUIRED',
    accessType: 'Authorized Member Feed',
    capabilities: ['Run List Sourcing', 'Engine Start Video Analysis'],
    requirements: ['IAAI Buyer Account', 'Dealer License'],
    description: 'Insurance salvage auction network under capability audit.',
  },
  {
    name: 'Bring a Trailer',
    category: 'AUCTIONS',
    subcategory: 'ENTHUSIAST / COLLECTOR',
    status: 'MANUAL',
    accessType: 'Public Link / Manual Watchlist',
    capabilities: ['Historical Price Comps', 'Market Comps Reference'],
    description: 'Curated enthusiast auctions. Manual comp entry supported for exotic and classic vehicle valuation.',
  },
  {
    name: 'Cars & Bids',
    category: 'AUCTIONS',
    subcategory: 'ENTHUSIAST / COLLECTOR',
    status: 'MANUAL',
    accessType: 'Public Link / Manual Watchlist',
    capabilities: ['Enthusiast Comp Tracking'],
    description: 'Modern enthusiast auction tracking for 1980s–present specialty vehicles.',
  },
  {
    name: 'eBay Motors',
    category: 'AUCTIONS',
    subcategory: 'GENERAL PUBLIC',
    status: 'COMING SOON',
    accessType: 'eBay REST API',
    capabilities: ['Listing Syndication (TBD)', 'Comp Price Tracking'],
    requirements: ['eBay Developer Account & Merchant Token'],
    description: 'Public automotive marketplace integration via official eBay Developer APIs in development.',
  },
  {
    name: 'GSA Auctions & GovPlanet',
    category: 'AUCTIONS',
    subcategory: 'GOVERNMENT / FLEET',
    status: 'MANUAL',
    accessType: 'Public Link / Manual Watchlist',
    capabilities: ['Surplus Fleet Tracking'],
    description: 'Government and municipal fleet disposition tracking.',
  },

  // 3. Marketplaces & Syndication
  {
    name: 'Dealer Branded Storefront',
    category: 'MARKETPLACES',
    status: 'LIVE',
    accessType: 'First-Party Core Architecture',
    capabilities: ['Instant 1-Click Inventory Publishing', 'Real-Time Inquiries', 'Custom Branding & Domain Scoping'],
    description: 'Included out-of-the-box with every AutoAIdealership subscription.',
  },
  {
    name: 'Facebook Marketplace Catalog Feed',
    category: 'MARKETPLACES',
    status: 'COMING SOON',
    accessType: 'Meta Catalog XML / CSV Data Feed',
    capabilities: ['Scheduled Inventory Feed', 'Lead Ingestion (TBD)'],
    requirements: ['Meta Business Manager & Catalog Feed URL'],
    description: 'Generates compliant automotive inventory feeds for dealer Meta Commerce accounts.',
  },
  {
    name: 'Autotrader / Cox Syndication',
    category: 'MARKETPLACES',
    status: 'PARTNER REQUIRED',
    accessType: 'Certified Provider FTP / API Feed',
    capabilities: ['Third-Party Classifieds Export'],
    requirements: ['Active Autotrader Dealership Advertising Contract'],
    description: 'Standardized inventory export formatted for certified third-party automotive classified aggregators.',
  },
];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredIntegrations = INTEGRATIONS_LIST.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'LIVE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'IMPLEMENTED':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'COMING SOON':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'PARTNER REQUIRED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MANUAL':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'RESEARCH REQUIRED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <MarketingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-12">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            <span>TRANSPARENT ECOSYSTEM DIRECTORY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Integrations, Feeds & Provider Directory
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            AutoAIdealership connects with industry data providers, vehicle history repositories, auction channels, and syndication feeds with complete status transparency.
          </p>
        </section>

        {/* Legend */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 text-xs space-y-3">
          <div className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">
            Integration Status Legend:
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-2.5 py-1 rounded-lg border bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold font-mono text-[10px]">
              LIVE: Fully operational in production
            </span>
            <span className="px-2.5 py-1 rounded-lg border bg-teal-500/20 text-teal-300 border-teal-500/30 font-bold font-mono text-[10px]">
              IMPLEMENTED: Code architecture complete (live with API credentials)
            </span>
            <span className="px-2.5 py-1 rounded-lg border bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold font-mono text-[10px]">
              PARTNER REQUIRED: Requires dealer commercial credentials
            </span>
            <span className="px-2.5 py-1 rounded-lg border bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold font-mono text-[10px]">
              RESEARCH REQUIRED: Active API capability audit in progress
            </span>
            <span className="px-2.5 py-1 rounded-lg border bg-slate-800 text-slate-300 border-slate-700 font-bold font-mono text-[10px]">
              MANUAL: Manual entry & watchlist workflow supported
            </span>
          </div>
        </section>

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-2">
          {[
            { id: 'ALL', label: 'All Integrations' },
            { id: 'VEHICLE_DATA', label: 'Vehicle Data & History' },
            { id: 'AUCTIONS', label: 'Auctions & Wholesale' },
            { id: 'MARKETPLACES', label: 'Marketplaces & Storefronts' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((item, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-white">{item.name}</h3>
                    {item.subcategory && (
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{item.subcategory}</span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-500">Access:</span> {item.accessType}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Capabilities:</span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {item.capabilities.map((cap, ci) => (
                        <li key={ci} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {item.requirements && item.requirements.length > 0 && (
                    <div className="pt-2 text-[10px] text-amber-300/90 font-mono bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                      <strong>Requirements:</strong> {item.requirements.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Request CTA */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white">Need a Specific Dealer DMS or Auction Connection?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Our engineering team continuously evaluates and implements authorized partner feeds. Contact our team to request custom integrations.
          </p>
          <div className="pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              <span>Speak with Integration Engineers</span>
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
