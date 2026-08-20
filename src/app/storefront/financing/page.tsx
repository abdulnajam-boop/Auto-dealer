'use client';

import React, { useState } from 'react';
import { Zap, ShieldCheck, CheckCircle2, ArrowRight } from '@/components/icons';

export default function FinancingPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Fast Online Pre-Approval</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Competitive Auto Financing</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          We partner with over 20 prime national lenders and local credit unions to secure the lowest APR rates regardless of your credit profile.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 space-y-6 backdrop-blur-md">
        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-slate-950 rounded-2xl border border-emerald-500/30">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Financing Inquiry Received</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Our finance director is reviewing lender rates and will reach out with your personalized terms.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Application</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">First Name</label>
                <input type="text" placeholder="John" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Phone Number</label>
                <input type="tel" placeholder="(512) 555-0100" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Monthly Income ($)</label>
                <input type="number" placeholder="6500" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Desired Down Payment ($)</label>
                <input type="number" placeholder="3000" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Pre-Qualification (No Credit Impact)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
