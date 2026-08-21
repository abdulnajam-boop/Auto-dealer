'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Car,
  Layers,
  HelpCircle,
} from '@/components/icons';

interface PlanDetails {
  id: string;
  name: string;
  badge?: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  inventoryLimit: string;
  seatsIncluded: string;
  aiUsage: string;
  vinAuditReports: string;
  marketValuations: string;
  marketListings: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  popular?: boolean;
}

const PRICING_PLANS: PlanDetails[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    description: 'Essential operating system for boutique dealerships managing single-lot operations.',
    priceMonthly: 249,
    priceAnnual: 199,
    inventoryLimit: 'Up to 30 Active Vehicles',
    seatsIncluded: '3 Staff Seats (RBAC)',
    aiUsage: '1,000 AI Actions / mo',
    vinAuditReports: '25 Reports / mo',
    marketValuations: '50 Valuations / mo',
    marketListings: '100 Comp Searches / mo',
    features: [
      'Custom Branded Dealership Storefront',
      'NHTSA & VinAudit VIN Decoding',
      'Unified CRM & Lead Inbox',
      'Digital F&I Desking & Bill of Sale',
      'Standard Inventory Expense Tracking',
      'Email Support (12h SLA)',
    ],
    ctaLabel: 'Start Starter Trial',
    ctaHref: '/demo?plan=STARTER&mode=trial',
  },
  {
    id: 'PRO',
    name: 'Pro',
    description: 'High-turn system for growing independent dealers requiring market intelligence.',
    priceMonthly: 499,
    priceAnnual: 399,
    inventoryLimit: 'Up to 100 Active Vehicles',
    seatsIncluded: '8 Staff Seats (RBAC)',
    aiUsage: '5,000 AI Actions / mo',
    vinAuditReports: '100 Reports / mo',
    marketValuations: '250 Valuations / mo',
    marketListings: '500 Comp Searches / mo',
    features: [
      'All Starter Features Included',
      'Opportunity Intelligence & Arbitrage Scoring',
      'Omnichannel Listing Studio',
      'Storefront External Inventory Controls',
      'Automated Lead Scoring & Desking Tools',
      'Comprehensive Profit & Loss Analytics',
      'Priority Phone & Chat Support (4h SLA)',
    ],
    ctaLabel: 'Start Pro Trial',
    ctaHref: '/demo?plan=PRO&mode=trial',
  },
  {
    id: 'AI_PRO',
    name: 'AI Pro',
    popular: true,
    badge: 'RECOMMENDED',
    description: 'Maximum velocity with 24/7 bounded AI sales autonomy and full data feeds.',
    priceMonthly: 799,
    priceAnnual: 649,
    inventoryLimit: 'Up to 250 Active Vehicles',
    seatsIncluded: '15 Staff Seats (RBAC)',
    aiUsage: 'Unlimited Bounded AI Conversations',
    vinAuditReports: '300 Reports / mo',
    marketValuations: 'Unlimited Valuations',
    marketListings: 'Unlimited Comp Searches',
    features: [
      'All Pro Features Included',
      '24/7 Autonomous AI Sales Agent (Bounded Floors)',
      'Vehicle Background Removal Studio',
      'Plate-to-VIN Fast Acquisition Scanner',
      'Storefront Lease Deals Module (Configurable)',
      'Dealer-to-Dealer Network Listing Syndication',
      'Dedicated Account Onboarding Specialist',
    ],
    ctaLabel: 'Start 14-Day Free Trial',
    ctaHref: '/demo?plan=AI_PRO&mode=trial',
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'Custom platform for multi-rooftop dealer groups and high-volume wholesale networks.',
    priceMonthly: 1499,
    priceAnnual: 1199,
    inventoryLimit: 'Unlimited Vehicles & Rooftops',
    seatsIncluded: 'Unlimited Seats',
    aiUsage: 'Custom Enterprise Quota',
    vinAuditReports: 'High-Volume Enterprise Tier',
    marketValuations: 'Unlimited',
    marketListings: 'Unlimited',
    features: [
      'All AI Pro Features Included',
      'Multi-Rooftop Consolidated Reporting',
      'Custom DMS Integration / CDK Feeds',
      'Custom White-Label Domain Architecture',
      'Custom AI Negotiation Rule Fine-Tuning',
      'Dedicated Customer Success Manager & 99.9% SLA',
      'Custom API & Webhook Access',
    ],
    ctaLabel: 'Contact Enterprise Sales',
    ctaHref: '/demo?plan=ENTERPRISE',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <MarketingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            <span>TRANSPARENT SAAS PRICING</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Predictable Plans Built for Dealership Growth
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            No per-lead penalties, no surprise commissions. Choose a plan that matches your current lot size and scale seamlessly as you grow.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs">
            <span className={billingCycle === 'MONTHLY' ? 'text-white font-bold' : 'text-slate-400'}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 transition-colors relative border border-slate-700"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                  billingCycle === 'ANNUAL' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={billingCycle === 'ANNUAL' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              Annual Billing <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === 'ANNUAL' ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all ${
                  plan.popular
                    ? 'bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 relative scale-[1.02]'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{plan.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white font-mono">${price}</span>
                    <span className="text-xs text-slate-400 font-sans">/ month</span>
                  </div>

                  {/* Entitlement Badges */}
                  <div className="space-y-2 py-3 border-y border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Inventory:</span>
                      <span className="font-bold text-white">{plan.inventoryLimit}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Users:</span>
                      <span className="font-bold text-white">{plan.seatsIncluded}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">AI Capacity:</span>
                      <span className="font-bold text-emerald-400">{plan.aiUsage}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs text-center block transition-all ${
                      plan.popular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {plan.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white">Full Entitlement & Feature Matrix</h3>
            <p className="text-xs text-slate-400">Granular comparison of operational limits across all plans.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4 font-bold">Feature / Entitlement</th>
                  <th className="py-3 px-4 text-center font-bold">Starter</th>
                  <th className="py-3 px-4 text-center font-bold">Pro</th>
                  <th className="py-3 px-4 text-center font-bold text-emerald-400">AI Pro</th>
                  <th className="py-3 px-4 text-center font-bold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Inventory Capacity</td>
                  <td className="py-3 px-4 text-center font-mono">30 Vehicles</td>
                  <td className="py-3 px-4 text-center font-mono">100 Vehicles</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">250 Vehicles</td>
                  <td className="py-3 px-4 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Staff Seats / Roles</td>
                  <td className="py-3 px-4 text-center font-mono">3 Seats</td>
                  <td className="py-3 px-4 text-center font-mono">8 Seats</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">15 Seats</td>
                  <td className="py-3 px-4 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">24/7 AI Sales Agent (Bounded)</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center font-mono">Limited (500)</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Unlimited</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Custom Tuned</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">VinAudit Vehicle History Reports</td>
                  <td className="py-3 px-4 text-center font-mono">25 / mo</td>
                  <td className="py-3 px-4 text-center font-mono">100 / mo</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">300 / mo</td>
                  <td className="py-3 px-4 text-center font-mono">Volume Tier</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Opportunity Intelligence & Comps</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Full Access</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Full Access</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Full Access</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Plate-to-VIN Fast Acquisition</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Storefront Lease Module Toggle</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Storefront External Network Toggle</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Multi-Rooftop Management</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center text-slate-500">—</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">Can I change or upgrade my plan later?</h4>
              <p className="text-slate-400 leading-relaxed">
                Yes. You can upgrade or adjust your plan anytime from your Owner Dashboard. Upgrades take effect immediately with prorated billing.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">How does the 14-day free trial work?</h4>
              <p className="text-slate-400 leading-relaxed">
                You get full unrestricted access to all features in your chosen tier. No credit card is required to begin.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">Is my dealership data isolated from other dealers?</h4>
              <p className="text-slate-400 leading-relaxed">
                Strictly yes. All tenant inventory, lead communications, floor pricing, and profit numbers are fully isolated with strict database-level boundaries.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-white">What happens if I exceed my vehicle limit?</h4>
              <p className="text-slate-400 leading-relaxed">
                You can easily upgrade to the next tier or purchase supplemental inventory allotments without any interruption to active listings.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
