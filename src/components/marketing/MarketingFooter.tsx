import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ShieldCheck } from '@/components/icons';

export function MarketingFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo variant="full" size="md" subtitle="AI-Powered Dealership Operating System" />
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              AutoAIdealership is the all-in-one AI operating system built for independent dealerships. Source high-margin vehicles, streamline inventory, decode specs, generate multi-platform listings, and automate buyer communications with strict guardrails.
            </p>
            <p className="text-emerald-400 font-semibold text-xs">
              Smarter Dealers. Better Deals.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enterprise Multi-Tenant Security</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="hover:text-emerald-400 transition-colors">Core Capabilities</Link></li>
              <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/integrations" className="hover:text-emerald-400 transition-colors">Integrations & Feeds</Link></li>
              <li><Link href="/demo" className="hover:text-emerald-400 transition-colors">Request a Live Demo</Link></li>
              <li><Link href="/security" className="hover:text-emerald-400 transition-colors">Security & Isolation</Link></li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="/features#ai" className="hover:text-emerald-400 transition-colors">AI Sales Agent (Bounded)</Link></li>
              <li><Link href="/features#arbitrage" className="hover:text-emerald-400 transition-colors">Opportunity Intelligence</Link></li>
              <li><Link href="/features#marketplaces" className="hover:text-emerald-400 transition-colors">Listing Studio</Link></li>
              <li><Link href="/features#crm" className="hover:text-emerald-400 transition-colors">CRM & F&I Desking</Link></li>
              <li><Link href="/demo?mode=trial" className="hover:text-emerald-400 transition-colors">Start 14-Day Trial</Link></li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Company & Access</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Sales</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Dealer Portal Login</Link></li>
              <li><Link href="/demo" className="hover:text-emerald-400 transition-colors">Schedule Walkthrough</Link></li>
              <li><Link href="/security" className="hover:text-emerald-400 transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} AutoAIdealership (autoaidealership.com). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/security" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/security" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/security" className="hover:text-slate-300">Responsible AI Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
