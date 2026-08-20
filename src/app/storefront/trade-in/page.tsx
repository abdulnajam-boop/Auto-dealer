'use client';

import React, { useState } from 'react';
import { DollarSign, ShieldCheck, CheckCircle2, ArrowRight } from '@/components/icons';

export default function TradeInPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Instant Equity Appraisal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Value Your Trade-In</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          We pay top dollar for clean pre-owned vehicles. Receive a certified appraisal offer valid for 7 days or 500 miles.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 space-y-6 backdrop-blur-md">
        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-slate-950 rounded-2xl border border-emerald-500/30">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Appraisal Valuation Submitted</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Our appraisal team has received your vehicle details and is calculating your certified cash equity offer.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Year</label>
                <input type="number" placeholder="2018" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Make</label>
                <input type="text" placeholder="Honda" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Model</label>
                <input type="text" placeholder="Civic" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Approximate Mileage</label>
                <input type="number" placeholder="65000" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Overall Condition</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                  <option>Excellent (Clean title, like new)</option>
                  <option>Good (Normal wear, no accidents)</option>
                  <option>Fair (Some scratches / maintenance due)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">VIN (Optional)</label>
                <input type="text" placeholder="17-Digit VIN" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Calculate Guaranteed Cash Trade Offer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
