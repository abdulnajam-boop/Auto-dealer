'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Car,
  Bot,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Globe,
  Gavel,
  DollarSign,
  CheckCircle2,
  Calendar,
  Search,
  MessageSquare,
  FileCheck2,
  Target,
  Award,
  Play,
  Key,
  Tag,
} from '@/components/icons';

export default function CorporateHomePage() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'BUY' | 'LEASE'>('BUY');
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('78759');
  const [activeTab, setActiveTab] = useState<'AI' | 'OPPORTUNITY' | 'MARKETPLACE' | 'AUCTION' | 'LEASE' | 'CRM'>('AI');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'BUY') {
      router.push(`/cars?search=${encodeURIComponent(searchQuery)}&zip=${encodeURIComponent(zipCode)}`);
    } else {
      router.push(`/lease-deals?search=${encodeURIComponent(searchQuery)}&zip=${encodeURIComponent(zipCode)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Glowing background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">DealerOS 2.0</span>
              <span className="text-slate-400">|</span>
              <span>The Autonomous Automotive Operating System</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              One Platform to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Buy, Manage, Market</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Sell</span> Vehicles.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Unite real-time auction arbitrage, bounded AI sales autonomy, 1-click multi-marketplace syndication, transparent lease discovery, and digital F&I desking into a unified high-turn platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-sm transition-all"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Interactive Live Demo</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold transition-all"
              >
                <span>Sign In →</span>
              </Link>
            </div>

            {/* Consumer Quick Search Widget */}
            <div className="pt-10 max-w-2xl mx-auto">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shopper Discovery:</span>
                    <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                      <button
                        onClick={() => setSearchMode('BUY')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          searchMode === 'BUY'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Buy Vehicles
                      </button>
                      <button
                        onClick={() => setSearchMode('LEASE')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          searchMode === 'LEASE'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Lease Deals
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium hidden sm:block">
                    {searchMode === 'BUY' ? 'Browse nationwide inventory' : 'Explore verified lease specials'}
                  </div>
                </div>

                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-7 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={searchMode === 'BUY' ? 'Make, model, body style (e.g. Toyota Camry)' : 'Model or brand (e.g. BMW iX, Hyundai IONIQ)'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full h-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Stats Metrics */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">42%</div>
              <div className="text-xs text-emerald-400 font-semibold">Faster Inventory Turn Rate</div>
              <p className="text-[11px] text-slate-400">Average 23 days from acquisition to retail contract</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">+$1,850</div>
              <div className="text-xs text-emerald-400 font-semibold">Higher Gross Profit Per Unit</div>
              <p className="text-[11px] text-slate-400">Driven by real-time cross-dealer arbitrage scoring</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">8.4x</div>
              <div className="text-xs text-emerald-400 font-semibold">Inbound Lead Engagement</div>
              <p className="text-[11px] text-slate-400">24/7 instant AI reply under dealer price bounds</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">0 sec</div>
              <div className="text-xs text-emerald-400 font-semibold">Post-Sale Delisting Lag</div>
              <p className="text-[11px] text-slate-400">Automatic multi-marketplace removal on contract close</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Capabilities Tabs */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Complete Automotive Operating System
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Dealership Scale and Profitability
            </h3>
            <p className="text-sm text-slate-400">
              Explore how DealerOS replaces fractured legacy tools with an intelligent, cohesive operating platform.
            </p>
          </div>

          {/* Feature Navigation Tabs */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-8">
            <button
              onClick={() => setActiveTab('AI')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'AI'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Sales Agent</span>
            </button>
            <button
              onClick={() => setActiveTab('OPPORTUNITY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'OPPORTUNITY'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Arbitrage & Opportunities</span>
            </button>
            <button
              onClick={() => setActiveTab('MARKETPLACE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'MARKETPLACE'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Master Listing Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('AUCTION')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'AUCTION'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Auction Center</span>
            </button>
            <button
              onClick={() => setActiveTab('LEASE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'LEASE'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Lease Deal Discovery</span>
            </button>
            <button
              onClick={() => setActiveTab('CRM')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'CRM'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>CRM & F&I Desking</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            {activeTab === 'AI' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Bounded Negotiation Autonomy</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    24/7 AI Sales Agent with Ironclad Dealer Guardrails
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Never lose an after-hours lead again. DealerOS AI responds instantly across web chat, SMS, and Facebook Messenger, answering vehicle questions, qualifying trade-ins, booking test drives, and negotiating strictly within your pre-approved floor prices.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Mathematical floor enforcement: Asking Price ≥ Counter Price ≥ Min Price</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Instant test drive scheduling & calendar coordination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>1-click human takeover with real-time manager escalation</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                    <span>Live Conversation Simulation</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      AI Active
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="bg-slate-900 p-3 rounded-xl max-w-[85%] text-slate-300">
                      <div className="text-[10px] text-slate-400 mb-1">Emily Rodriguez • 10:42 PM</div>
                      Hi! Is the 2022 Toyota Camry still available? Would you take $23,000 out the door?
                    </div>
                    <div className="bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl max-w-[85%] ml-auto text-purple-200">
                      <div className="text-[10px] text-purple-400 mb-1 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Dealer AI Agent (Floor: $23,500)
                      </div>
                      Hi Emily! Yes, the 2022 Camry SE is ready in our Austin showroom with 38k miles and clean history. While $23,000 is below our floor, our manager can do $23,650 including all fees. Can I hold it for a test drive tomorrow at 2 PM?
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'OPPORTUNITY' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Real-Time Arbitrage Engine</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Discover Profitable Inventory Before Competitors
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    DealerOS scans authorized dealer feeds, wholesale partner networks, auctions, and private listings to calculate precise net margins after transport, auction fees, and reconditioning.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Opportunity Score</div>
                      <div className="text-xl font-bold text-emerald-400 font-mono">92 / 100</div>
                      <p className="text-[10px] text-slate-400">High margin, low days-to-sell</p>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Expected Gross Margin</div>
                      <div className="text-xl font-bold text-white font-mono">+$5,600</div>
                      <p className="text-[10px] text-slate-400">After $250 transport + $550 recon</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="font-bold text-sm text-white">2022 Toyota Camry SE Nightshade</div>
                      <div className="text-xs text-slate-400">Lone Star Motors (San Antonio, TX • 78 mi)</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                      SCORE 92
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">Asking</div>
                      <div className="font-bold text-slate-200">$18,900</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">Est. Market</div>
                      <div className="font-bold text-emerald-400">$24,200</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">Proj. Profit</div>
                      <div className="font-bold text-white">+$5,600</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="font-semibold text-slate-300">Data Provenance:</span> 14 live comparable listings (Austin/San Antonio DMA). Confidence: HIGH.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MARKETPLACE' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Omnichannel Listing Studio</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Create Once. Publish Everywhere. Delist on Sale.
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Build one master vehicle record. AI Listing Studio automatically crafts tailored copy for your Branded Storefront, Facebook Marketplace, Autotrader, Cars.com, and Craigslist. When the deal closes, DealerOS immediately delists across all connected channels.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Storefront CMS</span>
                    <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Facebook Marketplace Feed</span>
                    <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Autotrader / Cox Feed</span>
                    <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Cars.com & CarGurus</span>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">
                    Connected Marketplace Orchestration
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-semibold text-white">Apex Auto Storefront</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">LIVE • Instant Sync</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-semibold text-white">Facebook Marketplace Catalog</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">LIVE • 14 Leads Today</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-semibold text-white">Autotrader Syndication</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">LIVE • Active Feed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'AUCTION' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Unified Auction Center</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Normalized Run Lists Across Manheim, ACV & Copart
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Search and analyze upcoming auction lanes across all major providers. Set your maximum recommended bid based on guaranteed profit margins, watch runs in real-time, and convert won vehicles into active inventory with a single click.
                  </p>
                  <Link
                    href="/auctions"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>View Auction Center Workflow →</span>
                  </Link>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Manheim Dallas • Lane 4 Run 12</span>
                    <span className="text-amber-400 font-mono">TOMORROW 2:00 PM</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl space-y-2 text-xs">
                    <div className="font-semibold text-white">2022 Toyota Camry SE (38,400 mi)</div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Condition Grade: 4.2 Clean</span>
                      <span>Starting Bid: $17,800</span>
                    </div>
                    <div className="flex items-center justify-between font-mono pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Recommended Max Bid:</span>
                      <span className="text-emerald-400 font-bold">$18,600</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'LEASE' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Transparent Lease Intelligence</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    True Effective Monthly Cost & Explainable Deal Scores
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Cut through fine-print lease confusion. DealerOS calculates the exact depreciation portion, money factor finance charge, and true effective monthly cost so consumers and dealers can compare offers transparently.
                  </p>
                  <Link
                    href="/lease-deals"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300"
                  >
                    <span>Browse Public Lease Deals Marketplace →</span>
                  </Link>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">2026 BMW iX xDrive50 (MSRP $89,500)</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold font-mono">
                      SCORE 91
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-lg">
                      <div className="text-[10px] text-slate-400">Advertised Payment</div>
                      <div className="text-base font-bold text-slate-200 font-mono">$699 / mo</div>
                      <div className="text-[10px] text-slate-400">$4,999 due at signing</div>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-teal-500/30">
                      <div className="text-[10px] text-teal-400 font-bold">True Effective Cost</div>
                      <div className="text-base font-bold text-teal-300 font-mono">$823 / mo</div>
                      <div className="text-[10px] text-slate-400">Includes all upfronts</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'CRM' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Automotive CRM & Desking</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Unified Inbox, Real-Time Desking & Instant Documents
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Manage leads across all channels, structure multi-tier financing deals with trade-in equity, generate legal buyers orders and bill of sale documents, and track exact front-end and back-end profit per VIN.
                  </p>
                  <Link
                    href="/deals"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Explore F&I Desking Tools →</span>
                  </Link>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">
                    Active F&I Deal Summary
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Vehicle Sale Price:</span>
                      <span className="font-mono font-bold">$24,900</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Doc Fee + Taxes + Title:</span>
                      <span className="font-mono">$2,206</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Trade-In Net Equity:</span>
                      <span className="font-mono">-$3,500</span>
                    </div>
                    <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800">
                      <span>Monthly Payment (60 mo @ 5.99%):</span>
                      <span className="font-mono text-emerald-400">$424 / mo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Transparent Dealership Pricing</h3>
            <p className="text-xs sm:text-sm text-slate-400">No hidden fees, no per-lead penalties. Cancel or upgrade anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Starter</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">$249</span>
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
                  <span className="text-4xl font-extrabold text-white font-mono">$499</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For growing dealerships requiring AI autonomy and multi-marketplace reach.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 150 Active Vehicles</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 AI Sales Agent (Unlimited)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Marketplace Hub & Auto-Delist</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-Time Auction & Arbitrage Center</li>
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
                  <span className="text-4xl font-extrabold text-white font-mono">$1,299</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Multi-rooftop dealer groups requiring custom feeds, DMS integrations, and dedicated SLAs.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Inventory & Rooftops</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated DMS / CDK Integration</li>
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
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Onboarding in under 2 minutes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Ready to Turn Inventory Faster with AI?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Join forward-thinking dealerships leveraging DealerOS to source higher-margin vehicles and automate retail sales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all"
            >
              Start Free Trial Now
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-all"
            >
              Schedule 1-on-1 Walkthrough
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
