'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ArrowRight, Menu, X } from '@/components/icons';

const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Request Demo', href: '/demo' },
  { label: 'About Us', href: '/about' },
  { label: 'Integrations', href: '/integrations' },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo variant="full" size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/demo"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
          >
            Request Demo
          </Link>
          <Link
            href="/demo?mode=trial"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800"
            >
              Sign In
            </Link>
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800"
            >
              Request Demo
            </Link>
            <Link
              href="/demo?mode=trial"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
