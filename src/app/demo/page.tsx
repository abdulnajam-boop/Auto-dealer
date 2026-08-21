'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import {
  Bot,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  User,
  Car,
  Users,
  Briefcase,
  HelpCircle,
} from '@/components/icons';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

function RequestDemoFormContent() {
  const searchParams = useSearchParams();
  const isTrial = searchParams?.get('mode') === 'trial';
  const preselectedPlan = searchParams?.get('plan') || 'PRO';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dealershipName: '',
    businessEmail: '',
    phone: '',
    state: 'TX',
    inventorySize: '26-75',
    employeeCount: '1-5',
    currentDms: 'Frazer',
    mainChallenge: 'AI Sales & Lead Response',
    preferredContactMethod: 'EMAIL',
    preferredDemoDate: '',
    preferredDemoTime: 'Afternoon (1pm - 5pm)',
    website_hp: '', // Honeypot field for bot prevention
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit demo request. Please check all fields.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Value Proposition */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            <span>{isTrial ? 'START 14-DAY FREE TRIAL' : 'EXPERIENCE THE PLATFORM'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {isTrial ? 'Get Started with AutoAIdealership Free' : 'Schedule a Custom Product Walkthrough'}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            See how AutoAIdealership automates after-hours buyer conversations, scores wholesale arbitrage opportunities, and normalizes VinAudit vehicle data in one cohesive operating system.
          </p>
        </div>

        {/* Selected Plan Badge */}
        {preselectedPlan && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[11px] font-mono uppercase text-slate-400">Target Plan Configuration:</div>
            <div className="text-base font-extrabold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{preselectedPlan} Plan Selection</span>
            </div>
          </div>
        )}

        {/* What to expect bullets */}
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            What Happens Next:
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-[10px]">1</span>
              </div>
              <span className="leading-relaxed">
                <strong>Tailored Demo Instance:</strong> We configure a sandbox environment with your local market comp feeds and vehicle valuation models.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-[10px]">2</span>
              </div>
              <span className="leading-relaxed">
                <strong>Live Bounded AI Simulation:</strong> Test our 24/7 AI Sales Agent counter-offer workflows with simulated customer inquiries and minimum floor pricing.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-[10px]">3</span>
              </div>
              <span className="leading-relaxed">
                <strong>Transparent Pricing & Onboarding:</strong> Review clear entitlement tiers with zero long-term lock-in and same-day onboarding assistance.
              </span>
            </li>
          </ul>
        </div>

        {/* Trust Badges */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Tenant Isolation & Data Privacy</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Your inventory data, cost floors, and customer communications remain 100% private to your dealership organization.
          </p>
        </div>
      </div>

      {/* Right Column: Demo Form Card */}
      <div className="lg:col-span-7">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Demo Request Received!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.firstName}</strong>. Our automotive product specialists have received your request for <strong>{formData.dealershipName}</strong> and will contact you via {formData.preferredContactMethod.toLowerCase()} within 1 business day.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Return to Home
                </Link>
                <Link
                  href="/features"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Explore Features
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-white">
                  {isTrial ? 'Start Your 14-Day Free Trial' : 'Tell Us About Your Dealership'}
                </h2>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Complete the details below and we will prepare your customized demonstration.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Bot Honeypot field (hidden from users) */}
              <input
                type="text"
                name="website_hp"
                value={formData.website_hp}
                onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Section 1: Contact Information */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                  1. Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Marcus"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Vance"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="marcus@apexautogallery.com"
                      value={formData.businessEmail}
                      onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(512) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Dealership Details */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                  2. Dealership Operations
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-300 font-semibold">Dealership Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Apex Auto Gallery"
                      value={formData.dealershipName}
                      onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {US_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Approx. Active Inventory</label>
                    <select
                      value={formData.inventorySize}
                      onChange={(e) => setFormData({ ...formData, inventorySize: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="1-25">1 – 25 Vehicles</option>
                      <option value="26-75">26 – 75 Vehicles</option>
                      <option value="76-150">76 – 150 Vehicles</option>
                      <option value="150+">150+ Vehicles (Multi-Lot)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Number of Staff</label>
                    <select
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="1-5">1 – 5 Employees</option>
                      <option value="6-15">6 – 15 Employees</option>
                      <option value="16+">16+ Employees</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Current DMS / Tool</label>
                    <input
                      type="text"
                      placeholder="e.g. Frazer, DealerCenter, Spreadsheets"
                      value={formData.currentDms}
                      onChange={(e) => setFormData({ ...formData, currentDms: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Primary Dealership Challenge</label>
                  <select
                    value={formData.mainChallenge}
                    onChange={(e) => setFormData({ ...formData, mainChallenge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="AI Sales & Lead Response">After-hours lead response & autonomous sales inquiries</option>
                    <option value="Arbitrage & Sourcing">Opportunity sourcing, auction fee calculations & price comps</option>
                    <option value="Listing & Syndication">Manual listing descriptions and marketplace syndication</option>
                    <option value="F&I and Desking">Digital F&I desking, buyer contracts & paperless bill of sale</option>
                    <option value="Consolidated Operations">Replacing fragmented software with all-in-one DealerOS</option>
                  </select>
                </div>
              </div>

              {/* Section 3: Scheduling & Preferences */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                  3. Contact Preference & Scheduling
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Preferred Contact</label>
                    <select
                      value={formData.preferredContactMethod}
                      onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="EMAIL">Email</option>
                      <option value="PHONE">Phone Call</option>
                      <option value="SMS">SMS / Text</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Preferred Demo Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.preferredDemoDate}
                      onChange={(e) => setFormData({ ...formData, preferredDemoDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Time Preference</label>
                    <select
                      value={formData.preferredDemoTime}
                      onChange={(e) => setFormData({ ...formData, preferredDemoTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Morning (9am - 12pm)">Morning (9am – 12pm)</option>
                      <option value="Afternoon (1pm - 5pm)">Afternoon (1pm – 5pm)</option>
                      <option value="Flexible">Flexible / Anytime</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Processing Request...</span>
                    ) : (
                      <>
                        <span>{isTrial ? 'Activate 14-Day Trial & Setup Demo' : 'Confirm & Request Demo'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2.5">
                    No credit card required. Protected by AutoAIdealership data privacy guarantees.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RequestDemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <MarketingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Suspense fallback={<div className="text-center py-20 text-slate-400 text-xs">Loading form...</div>}>
          <RequestDemoFormContent />
        </Suspense>
      </main>

      <MarketingFooter />
    </div>
  );
}
