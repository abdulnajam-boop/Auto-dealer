'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Clock, Car, ShieldCheck } from 'lucide-react';

export function StorefrontHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Info Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              4500 Auto Mall Pkwy, Austin, TX 78759
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Mon-Sat: 9:00 AM - 7:00 PM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              120-Point Certified Inspection on All Inventory
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/storefront" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-extrabold text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white">Apex Auto Gallery</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Premier Certified Used Vehicles
            </div>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          <Link
            href="/storefront/inventory"
            className={`transition-colors ${
              pathname.startsWith('/storefront/inventory')
                ? 'text-emerald-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Browse Inventory
          </Link>
          <Link
            href="/storefront/financing"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Financing Pre-Approval
          </Link>
          <Link
            href="/storefront/trade-in"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Value Your Trade
          </Link>
          <Link
            href="/storefront/about"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Why Apex?
          </Link>
          <Link
            href="/storefront/contact"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Contact &amp; Location
          </Link>
        </nav>

        {/* Direct Call Action & Admin Link */}
        <div className="flex items-center gap-3">
          <a
            href="tel:5125550199"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-emerald-500/50 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>(512) 555-0199</span>
          </a>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <span>Dealer OS Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
