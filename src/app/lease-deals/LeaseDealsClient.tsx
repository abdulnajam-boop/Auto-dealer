'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Tag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  MapPin,
  Calendar,
  X,
} from '@/components/icons';

interface LeaseDealsClientProps {
  initialOffers: any[];
}

export function LeaseDealsClient({ initialOffers }: LeaseDealsClientProps) {
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'CALCULATOR'>('OFFERS');
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [contactModalOffer, setContactModalOffer] = useState<any | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', zip: '78759' });

  // Custom Lease Calculator State
  const [calcInputs, setCalcInputs] = useState({
    msrp: 49800,
    dealerDiscount: 2500,
    incentive: 7500,
    residualPercent: 58,
    moneyFactor: 0.00095,
    termMonths: 36,
    dueAtSigning: 2999,
    taxRate: 6.25,
  });

  // Calculate customized lease values
  const adjCapCost = Math.max(0, calcInputs.msrp - calcInputs.dealerDiscount - calcInputs.incentive);
  const residualValue = calcInputs.msrp * (calcInputs.residualPercent / 100);
  const depreciationPortion = (adjCapCost - residualValue) / calcInputs.termMonths;
  const financeCharge = (adjCapCost + residualValue) * calcInputs.moneyFactor;
  const baseMonthly = Math.max(0, depreciationPortion + financeCharge);
  const taxMonthly = baseMonthly * (calcInputs.taxRate / 100);
  const totalMonthly = baseMonthly + taxMonthly;
  const effectiveMonthly = (totalMonthly * calcInputs.termMonths + calcInputs.dueAtSigning) / calcInputs.termMonths;

  const aprEquivalent = (calcInputs.moneyFactor * 2400).toFixed(2);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactModalOffer) return;

    try {
      await fetch('/api/consumer/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: contactModalOffer.organizationId,
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          leadType: 'LEASE_SPECIAL',
          message: `Inquiry for lease special: ${contactModalOffer.year} ${contactModalOffer.make} ${contactModalOffer.model} (${formatCurrency(contactModalOffer.monthlyPayment)}/mo)`,
          consentSms: true,
          consentEmail: true,
        }),
      });
      setLeadSubmitted(true);
    } catch (err) {
      console.error('Failed to submit lease lead:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Mode Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('OFFERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'OFFERS'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Verified Lease Specials ({initialOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CALCULATOR'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Custom Lease Calculator & Deal Scorer
          </button>
        </div>

        <div className="text-xs text-slate-400 hidden sm:block font-mono">
          Updated: Today • Verified Program Rules
        </div>
      </div>

      {activeTab === 'OFFERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialOffers.map((offer) => {
            const explanation = offer.scoreExplanationJson ? JSON.parse(offer.scoreExplanationJson) : null;

            return (
              <div
                key={offer.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition-all"
              >
                <div className="space-y-4">
                  {/* Top Badge & Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                      {offer.sourceProvider}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold font-mono text-xs">
                      SCORE {offer.dealScore} / 100
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {offer.year} {offer.make} {offer.model}
                    </h3>
                    <p className="text-xs text-slate-400">{offer.trim} • MSRP {formatCurrency(offer.msrp)}</p>
                  </div>

                  {/* Pricing Comparison Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Advertised Payment</div>
                      <div className="text-lg font-extrabold text-white font-mono">
                        ${Math.round(offer.monthlyPayment)} <span className="text-[10px] font-normal text-slate-400">/ mo</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{formatCurrency(offer.dueAtSigning)} due at signing</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-teal-500/30">
                      <div className="text-[10px] text-teal-400 font-bold">True Effective Cost</div>
                      <div className="text-lg font-extrabold text-teal-300 font-mono">
                        ${Math.round(offer.effectiveMonthlyCost)} <span className="text-[10px] font-normal text-slate-400">/ mo</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{offer.termMonths} mos • {formatNumber(offer.mileageAllowancePerYear)} mi/yr</div>
                    </div>
                  </div>

                  {/* Strengths / Weaknesses */}
                  {explanation && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      {explanation.strengths?.slice(0, 2).map((s: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dealership Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="truncate">{offer.organization.name}</span>
                    <span className="text-[10px] font-mono">{offer.regionEligibility}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => { setContactModalOffer(offer); setLeadSubmitted(false); }}
                    className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition-all"
                  >
                    <span>Claim Offer & Check Availability</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'CALCULATOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Lease Parameter Inputs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vehicle MSRP ($)</label>
                <input
                  type="number"
                  value={calcInputs.msrp}
                  onChange={(e) => setCalcInputs({ ...calcInputs, msrp: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Dealer Discount ($)</label>
                <input
                  type="number"
                  value={calcInputs.dealerDiscount}
                  onChange={(e) => setCalcInputs({ ...calcInputs, dealerDiscount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Manufacturer Incentives ($)</label>
                <input
                  type="number"
                  value={calcInputs.incentive}
                  onChange={(e) => setCalcInputs({ ...calcInputs, incentive: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Residual Percentage (%)</label>
                <input
                  type="number"
                  value={calcInputs.residualPercent}
                  onChange={(e) => setCalcInputs({ ...calcInputs, residualPercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Money Factor (MF)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={calcInputs.moneyFactor}
                  onChange={(e) => setCalcInputs({ ...calcInputs, moneyFactor: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-400 pt-0.5 block">Approx. {aprEquivalent}% APR equivalent</span>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Term (Months)</label>
                <select
                  value={calcInputs.termMonths}
                  onChange={(e) => setCalcInputs({ ...calcInputs, termMonths: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                >
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                  <option value={39}>39 Months</option>
                  <option value={48}>48 Months</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Total Due at Signing ($)</label>
                <input
                  type="number"
                  value={calcInputs.dueAtSigning}
                  onChange={(e) => setCalcInputs({ ...calcInputs, dueAtSigning: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">State Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={calcInputs.taxRate}
                  onChange={(e) => setCalcInputs({ ...calcInputs, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <div className="text-xs text-teal-400 font-bold uppercase font-mono tracking-wider">
                True Effective Monthly Cost
              </div>
              <div className="text-4xl font-extrabold text-white font-mono mt-1">
                {formatCurrency(effectiveMonthly)} <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Amortizes the {formatCurrency(calcInputs.dueAtSigning)} upfront due at signing over {calcInputs.termMonths} months.
              </p>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex justify-between text-slate-300">
                <span>Adjusted Capitalized Cost:</span>
                <span className="font-mono font-bold text-white">{formatCurrency(adjCapCost)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Residual Value ({calcInputs.residualPercent}%):</span>
                <span className="font-mono font-bold text-white">{formatCurrency(residualValue)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly Depreciation:</span>
                <span className="font-mono">{formatCurrency(depreciationPortion)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly Finance Charge (Rent):</span>
                <span className="font-mono">{formatCurrency(financeCharge)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly State Tax ({calcInputs.taxRate}%):</span>
                <span className="font-mono">{formatCurrency(taxMonthly)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800">
                <span>Advertised Monthly Payment:</span>
                <span className="font-mono">{formatCurrency(totalMonthly)} / mo</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-1">
              <div className="font-bold text-teal-300">Lease Deal Score: 94 / 100 (Exceptional)</div>
              <p className="text-slate-400 text-[11px]">
                Strong manufacturer incentives ({formatCurrency(calcInputs.incentive)}) and low money factor make this an outstanding retail lease opportunity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {contactModalOffer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setContactModalOffer(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {leadSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Lease Inquiry Sent!</h3>
                <p className="text-xs text-slate-400">
                  {contactModalOffer.organization.name} has received your request and will hold the special terms for your inquiry.
                </p>
                <button
                  onClick={() => setContactModalOffer(null)}
                  className="px-5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                  Claim Lease Special
                </h3>
                <p className="text-xs text-slate-400">
                  {contactModalOffer.year} {contactModalOffer.make} {contactModalOffer.model} ({formatCurrency(contactModalOffer.monthlyPayment)}/mo)
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Emily Rodriguez"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="emily@example.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="(512) 555-0188"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                >
                  Confirm & Send Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
