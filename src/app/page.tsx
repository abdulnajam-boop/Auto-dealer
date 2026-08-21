'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Bot,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Globe,
  Gavel,
  CheckCircle2,
  FileCheck2,
  Target,
  Play,
  X,
  Lock,
  Layers,
  Search,
  Database,
  Cpu,
  Smartphone,
  Eye,
} from '@/components/icons';

export default function CorporateHomePage() {
  const [activeTab, setActiveTab] = useState<'AI' | 'OPPORTUNITY' | 'LISTINGS' | 'HISTORY' | 'CRM' | 'ANALYTICS'>('AI');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Configurable demo video URL
  const demoVideoUrl = process.env.NEXT_PUBLIC_PRODUCT_DEMO_VIDEO_URL || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <MarketingHeader />

      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400">AutoAIdealership</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-medium">Smarter Dealers. Better Deals.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Run a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Smarter, Faster,</span> More Profitable Dealership
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
              AutoAIdealership is an AI-powered dealership operating system that helps independent dealers source vehicles, manage inventory, understand vehicle history and market value, create listings, manage leads, communicate with buyers, analyze profitability, and automate dealership operations from one platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/demo?mode=trial"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold text-sm transition-all"
              >
                <span>Request Demo</span>
              </Link>
              <button
                onClick={() => setVideoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-slate-400 hover:text-emerald-400 text-sm font-semibold transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10">
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                </div>
                <span>Watch Product Demo</span>
              </button>
            </div>

            {/* Metric Highlights */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-white font-mono">24/7</div>
                <div className="text-xs font-semibold text-emerald-400">Autonomous Sales Lead AI</div>
                <p className="text-[11px] text-slate-400 mt-1">Bounded within floor prices</p>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-white font-mono">0–100</div>
                <div className="text-xs font-semibold text-teal-400">Opportunity Score</div>
                <p className="text-[11px] text-slate-400 mt-1">Real-time arbitrage & net margins</p>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-white font-mono">Multi-Feeds</div>
                <div className="text-xs font-semibold text-cyan-400">Omnichannel Syndication</div>
                <p className="text-[11px] text-slate-400 mt-1">Storefront, feeds & marketplaces</p>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-white font-mono">100%</div>
                <div className="text-xs font-semibold text-purple-400">Tenant Data Isolation</div>
                <p className="text-[11px] text-slate-400 mt-1">Independent database boundaries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Demo Video Section */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Product Walkthrough</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">See AutoAIdealership in Action</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              A 3-minute executive preview of automated inventory sourcing, bounded AI negotiations, and omnichannel desking.
            </p>
          </div>

          {/* Video Container / Thumbnail */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group max-w-4xl mx-auto aspect-video flex items-center justify-center">
            {/* Background Poster Visual */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)]" />

            {/* Poster Blueprint UI */}
            <div className="absolute inset-4 sm:inset-8 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between opacity-50 group-hover:opacity-75 transition-opacity">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-white">AutoAIdealership Operating Console</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">STATUS: ACTIVE</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs py-4">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Inventory Units</div>
                  <div className="text-lg font-bold text-white font-mono">48 Live</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">AI Leads Active</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">14 Today</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Projected Margin</div>
                  <div className="text-lg font-bold text-teal-400 font-mono">+$84,200</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 text-center font-mono">
                Click to open interactive walkthrough video
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={() => setVideoModalOpen(true)}
              className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 transition-all transform group-hover:scale-110"
              aria-label="Play product demo video"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-sm text-white">AutoAIdealership Demo Overview</span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {demoVideoUrl ? (
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={demoVideoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="AutoAIdealership Demo Video"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                    <Play className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                      PRODUCT DEMO COMING SOON
                    </span>
                    <h4 className="text-lg font-bold text-white pt-2">Official High-Definition Walkthrough in Production</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Our interactive live demo is currently available for scheduled 1-on-1 walkthroughs with our engineering team.
                    </p>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <Link
                      href="/demo"
                      onClick={() => setVideoModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                    >
                      Book 1-on-1 Live Walkthrough
                    </Link>
                    <button
                      onClick={() => setVideoModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Core Capabilities Interactive Tabs */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Modular Dealership Platform
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Every Critical Dealership Operation, Synchronized
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Replaces disconnected spreadsheets, fragmented legacy software, and manual lead follow-up with a cohesive AI operating system.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('AI')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'AI'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Sales Agent</span>
          </button>
          <button
            onClick={() => setActiveTab('OPPORTUNITY')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'OPPORTUNITY'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Opportunity Arbitrage</span>
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Vehicle Data & History</span>
          </button>
          <button
            onClick={() => setActiveTab('LISTINGS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'LISTINGS'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Listing Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('CRM')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'CRM'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>CRM & F&I Desking</span>
          </button>
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'ANALYTICS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Profitability Analytics</span>
          </button>
        </div>

        {/* Tab Showcase Card */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {activeTab === 'AI' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bounded AI Sales Autonomy</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                  24/7 AI Buyer Communications with Ironclad Guardrails
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Engage shoppers instantly on your website, via SMS, and across social channels. AutoAIdealership AI is strictly bounded by dealer-set minimum price floors, never makes unauthorized discounts, collects trade-in details, and coordinates showroom test drives automatically.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Price Floor Enforcement: Asking Price ≥ Counter Price ≥ Min Floor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Trade-in appraisal data collection & credit tier assessment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>1-click salesperson takeover with instant alert notifications</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                  <span>Live AI Negotiation Log</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Active Guardrails
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-slate-900 p-3 rounded-xl max-w-[85%] text-slate-300">
                    <div className="text-[10px] text-slate-400 mb-1">Shopper Inquiry • 11:14 PM</div>
                    "Will you take $21,000 cash for the 2022 Camry SE?"
                  </div>
                  <div className="bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl max-w-[85%] ml-auto text-purple-200">
                    <div className="text-[10px] text-purple-400 mb-1 flex items-center gap-1">
                      <Bot className="w-3 h-3" /> AutoAIdealership Agent (Min Floor: $22,800)
                    </div>
                    "Hi! Our listed price is $24,500. While $21,000 is below our floor, our manager has authorized $22,950 including documentation fee if you can test drive today. May I schedule a 15-minute slot?"
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OPPORTUNITY' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Opportunity Intelligence</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Source High-Gross Vehicles Before Competitors
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Evaluate wholesale opportunities, dealer network listings, and auctions with full visibility into estimated transportation, reconditioning, fees, and days-to-turn.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Opportunity Score</div>
                    <div className="text-xl font-bold text-emerald-400 font-mono">92 / 100</div>
                    <p className="text-[10px] text-slate-400">High margin, fast turn probability</p>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Projected Gross</div>
                    <div className="text-xl font-bold text-white font-mono">+$4,650</div>
                    <p className="text-[10px] text-slate-400">Net of transport & reconditioning</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">2022 Honda CR-V EX-L</span>
                  <span className="text-emerald-400 font-bold">SCORE 89</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between"><span>Acquisition / Bid:</span><span className="text-white">$21,200</span></div>
                  <div className="flex justify-between"><span>Auction Fee + Transport:</span><span className="text-slate-400">+$950</span></div>
                  <div className="flex justify-between"><span>Recon & Detail Estimate:</span><span className="text-slate-400">+$600</span></div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-white"><span>Total Cost Basis:</span><span>$22,750</span></div>
                  <div className="flex justify-between font-bold text-emerald-400"><span>Target Retail:</span><span>$26,900</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                  <Database className="w-3.5 h-3.5" />
                  <span>Provider History & Spec Normalization</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                  VinAudit Integration Architecture & Provenance
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Connect official vehicle history providers, decode complete factory build specs, lookup license plates to VIN, and normalize title records into one standardized vehicle history record.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Plate-to-VIN fast inventory acquisition</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Factory equipment, engine, transmission & safety specs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Title brand verification (Clean, Salvage, Rebuilt, Flood)</li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">VIN: 4T1B11HK5NU******</span>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Title Status</div>
                    <div className="font-bold text-emerald-400">Clean Title</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Ownership</div>
                    <div className="font-bold text-white">1 Owner</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  Provider: VinAudit Official Data Feed • 0 Accidents Reported • 7 Service Records
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LISTINGS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Omnichannel Listing Studio</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Craft Tailored Copy & Orchestrate Channels
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Generate compelling, SEO-rich descriptions tailored for your dealership storefront and external channels. Eliminate repetitive data entry while maintaining complete brand control.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Dealer Storefront</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Social Ad Copy</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Classified Feeds</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">
                  Multi-Channel Syndication Status
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-white font-semibold">Dealer Storefront</span>
                    <span className="text-emerald-400 text-[11px]">LIVE • Integrated</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-white font-semibold">Marketplace Syndication Feeds</span>
                    <span className="text-amber-400 text-[11px]">PARTNER FEED CONFIGURABLE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CRM' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>CRM & Digital Desking</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Structure Multi-Tier Deals in Minutes
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Manage leads across all channels in a unified inbox. Calculate sales taxes, title/reg fees, dealer doc fees, trade-in equity, and APR loan terms with mathematical precision.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2 font-mono text-xs">
                <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">F&I Deal Summary</div>
                <div className="flex justify-between text-slate-300"><span>Sale Price:</span><span>$24,900</span></div>
                <div className="flex justify-between text-slate-400"><span>Doc Fee + Taxes + Title:</span><span>+$2,185</span></div>
                <div className="flex justify-between text-emerald-400"><span>Trade-in Equity:</span><span>-$4,000</span></div>
                <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-1">
                  <span>Monthly (60 mo @ 6.49%):</span>
                  <span className="text-emerald-400 font-bold">$448 / mo</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dealership Profit Intelligence</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Real-Time Front-End & Back-End Yield Tracking
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Monitor average days in inventory, aging risk, lead velocity, salesperson performance, and net profit per VIN to maximize capital turnover.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">Inventory Metrics</div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Avg. Days on Lot</div>
                    <div className="font-bold text-emerald-400 text-lg">21 Days</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Avg. Gross Per Unit</div>
                    <div className="font-bold text-white text-lg">+$3,420</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Pricing Preview */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h3 className="text-3xl font-black text-white">Transparent SaaS Pricing for Independent Dealers</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Select the plan that fits your current inventory size. Upgrade as your lot expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-bold font-mono text-slate-400 uppercase">Starter</div>
                <div className="text-3xl font-black text-white font-mono">$249<span className="text-xs text-slate-400 font-sans">/mo</span></div>
                <p className="text-xs text-slate-400">Up to 30 active inventory vehicles.</p>
                <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 30 Vehicles & 3 Staff</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Branded Storefront</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> VIN Decoder</li>
                </ul>
              </div>
              <Link href="/demo?plan=STARTER" className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center">
                Start Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-bold font-mono text-slate-400 uppercase">Pro</div>
                <div className="text-3xl font-black text-white font-mono">$499<span className="text-xs text-slate-400 font-sans">/mo</span></div>
                <p className="text-xs text-slate-400">Up to 100 active inventory vehicles.</p>
                <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100 Vehicles & 8 Staff</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Opportunity Intelligence</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-Marketplace Studio</li>
                </ul>
              </div>
              <Link href="/demo?plan=PRO" className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center">
                Start Trial
              </Link>
            </div>

            {/* AI Pro (Featured) */}
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative shadow-xl shadow-emerald-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase">
                Most Popular
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold font-mono text-emerald-400 uppercase">AI Pro</div>
                <div className="text-3xl font-black text-white font-mono">$799<span className="text-xs text-slate-400 font-sans">/mo</span></div>
                <p className="text-xs text-slate-400">Up to 250 active inventory vehicles.</p>
                <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 250 Vehicles & 15 Staff</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 24/7 AI Sales Agent (Bounded)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full VinAudit Architecture</li>
                </ul>
              </div>
              <Link href="/demo?plan=AI_PRO" className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center shadow-md shadow-emerald-500/20">
                Start 14-Day Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-bold font-mono text-slate-400 uppercase">Enterprise</div>
                <div className="text-3xl font-black text-white font-mono">$1,499<span className="text-xs text-slate-400 font-sans">/mo</span></div>
                <p className="text-xs text-slate-400">Unlimited vehicles & multi-rooftops.</p>
                <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Rooftops</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Custom Feeds & DMS API</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Account Manager</li>
                </ul>
              </div>
              <Link href="/demo" className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="text-center pt-8">
            <Link href="/pricing" className="text-xs font-bold text-emerald-400 hover:underline">
              View Complete Entitlements & Feature Comparison Matrix →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Customer Proof / Feedback Placeholder */}
      <section className="py-16 border-t border-slate-800 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono uppercase tracking-wider">
          EARLY ACCESS PARTNER FEEDBACK — PLACEHOLDER
        </span>
        <blockquote className="text-base sm:text-lg text-slate-300 font-medium italic max-w-2xl mx-auto">
          "AutoAIdealership provides the modern tooling independent dealerships have needed for years: real cost basis transparency, guardrailed AI response, and unified inventory control."
        </blockquote>
        <div className="text-xs text-slate-400">
          — Independent Dealership Operator (Austin, TX • Pilot Group Feedback)
        </div>
      </section>

      {/* 6. Final CTA Banner */}
      <section className="py-20 relative border-t border-slate-800 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Automate Dealership Operations?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Experience how AutoAIdealership simplifies vehicle acquisition, inventory marketing, and customer sales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/demo?mode=trial"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              Start Free Trial Now
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-all"
            >
              Request Live Demo
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
