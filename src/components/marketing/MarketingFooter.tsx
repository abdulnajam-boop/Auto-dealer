import React from 'react';
import Link from 'next/link';
import { Car, ShieldCheck, HeartHandshake, Award } from '@/components/icons';

export function MarketingFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">DealerOS</span>
            </Link>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              The unified operating system for modern automotive retail. Empowering independent and franchise dealerships to source profitably, automate multi-channel marketing, and accelerate retail turns.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SOC 2 Type II Certified Architecture</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="hover:text-emerald-400 transition-colors">All Features</Link></li>
              <li><Link href="/cars" className="hover:text-emerald-400 transition-colors">Consumer Marketplace</Link></li>
              <li><Link href="/lease-deals" className="hover:text-emerald-400 transition-colors">Lease Deal Discovery</Link></li>
              <li><Link href="/integrations" className="hover:text-emerald-400 transition-colors">Integrations & APIs</Link></li>
              <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="/features#ai" className="hover:text-emerald-400 transition-colors">Autonomous AI Sales Agent</Link></li>
              <li><Link href="/features#arbitrage" className="hover:text-emerald-400 transition-colors">Opportunity Arbitrage</Link></li>
              <li><Link href="/features#marketplaces" className="hover:text-emerald-400 transition-colors">Multi-Marketplace Hub</Link></li>
              <li><Link href="/features#crm" className="hover:text-emerald-400 transition-colors">Unified CRM & Desking</Link></li>
              <li><Link href="/demo" className="hover:text-emerald-400 transition-colors">Request a Live Demo</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Trust & Company</h4>
            <ul className="space-y-2">
              <li><Link href="/security" className="hover:text-emerald-400 transition-colors">Security & Privacy</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Sales</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Dealership Login</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Start Free Trial</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} DealerOS Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/security" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/security" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/security" className="hover:text-slate-300">Responsible AI Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
