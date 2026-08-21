'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  ShieldCheck,
  Bot,
  Zap,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Database,
  Cpu,
} from '@/components/icons';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <MarketingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            <span>ABOUT AUTOAIDEALERSHIP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Building the Operating System for Modern Automotive Retail
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            AutoAIdealership exists to give independent automotive dealerships the intelligence, automation, and computational speed historically reserved for massive dealer conglomerates.
          </p>
        </section>

        {/* The Problem We Solve */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              <span>THE CHALLENGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Independent Dealerships Face Unprecedented Headwinds
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Operating an independent dealership today requires managing dozens of disconnected software tools: one tool for inventory, another for listing syndication, separate systems for CRM, manual spreadsheets for floor pricing, and fragmented desking calculators.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              This fragmentation causes critical operational bottlenecks:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span><strong>After-hours lead loss:</strong> Over 60% of vehicle inquiries arrive when sales staff are offline.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span><strong>Uncertain acquisition margins:</strong> Hidden transport fees, reconditioning costs, and auction fees erode gross profits.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span><strong>Repetitive listing toil:</strong> Writing vehicle descriptions and manually syncing pricing across classifieds wastes hours daily.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-4 shadow-xl">
            <div className="text-xs font-mono text-emerald-400 font-bold border-b border-slate-800 pb-2">
              Our Guiding Principles
            </div>
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1. Bounded & Explainable AI</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  AI must never hallucinate pricing or commit dealers to unauthorized terms. We build strict, mathematically bounded guardrails that enforce minimum floor prices.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>2. Complete Data Provenance</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  Every valuation, opportunity score, and vehicle history insight transparently displays its underlying provider source, sample count, and confidence rating.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>3. Multi-Tenant Data Sovereignty</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  Your dealership’s customer communications, inventory costs, and negotiation strategies belong exclusively to your organization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach to Technology */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineering for Speed & Reliability</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built on modern full-stack TypeScript, PostgreSQL relational architecture, and robust provider integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-2xl space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">PostgreSQL & Strict Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Relational schema with scoped tenant contexts, row-level organization filters, and comprehensive automated test coverage for zero data cross-leakage.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-2xl space-y-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Server-Side Provider Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All external provider keys (such as VinAudit, market feeds, and vehicle history services) are kept strictly server-side and never exposed to client browsers.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-2xl space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Controlled Human-in-the-Loop AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sales managers have full visibility into live AI conversations with 1-click human intervention and configurable escalation triggers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center max-w-xl mx-auto space-y-5">
          <h3 className="text-2xl font-black text-white">Join the Future of Independent Automotive Retail</h3>
          <p className="text-xs text-slate-400">
            Learn how AutoAIdealership can help your team turn inventory faster and increase gross margins per vehicle.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/demo"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              Schedule 1-on-1 Walkthrough
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-xs"
            >
              Explore Plans & Pricing
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
