import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, calculateMonthlyPayment } from '@/lib/utils';
import {
  Car,
  Search,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  DollarSign,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function StorefrontHomePage() {
  const tenant = await getTenantContext();

  const featuredVehicles = await prisma.vehicle.findMany({
    where: {
      organizationId: tenant.organizationId,
      status: { in: ['LISTED', 'READY'] },
    },
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-16 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Austin&apos;s Highest Rated Independent Dealership</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Certified Vehicle</span> with Zero Hassle.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every vehicle undergoes a rigorous 120-point mechanical inspection, complete CARFAX history verification, and comes with upfront, transparent market pricing.
          </p>

          {/* Sourcing Quick Search Bar */}
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-2xl glass-panel text-left grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Make</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500">
                <option value="">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="BMW">BMW</option>
                <option value="Ford">Ford</option>
                <option value="Mazda">Mazda</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Body Style</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500">
                <option value="">All Body Styles</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Max Budget</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500">
                <option value="">Any Price</option>
                <option value="25000">Under $25,000</option>
                <option value="35000">Under $35,000</option>
                <option value="50000">Under $50,000</option>
              </select>
            </div>

            <div className="flex items-end">
              <Link
                href="/storefront/inventory"
                className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Inventory</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Inventory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Hand-Picked Selection
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Featured Certified Vehicles</h2>
          </div>
          <Link
            href="/storefront/inventory"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 group"
          >
            <span>View All {featuredVehicles.length}+ In Stock</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((veh) => {
            const sampleMonthly = calculateMonthlyPayment(veh.askingPrice * 0.9, 6.99, 60);

            return (
              <div
                key={veh.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all group flex flex-col"
              >
                {/* Photo Header */}
                <div className="h-52 w-full bg-slate-950 relative overflow-hidden">
                  {veh.photos[0] ? (
                    <img
                      src={veh.photos[0].url}
                      alt={veh.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Car className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    CERTIFIED 120-PT
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-slate-700">
                    {formatNumber(veh.mileage)} mi
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {veh.year} {veh.make} {veh.model} {veh.trim || ''}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1">
                      {veh.exteriorColor} • {veh.transmission || 'Automatic'} • {veh.drivetrain || 'FWD'}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Our Transparent Price
                      </span>
                      <span className="text-xl font-extrabold text-white">
                        {formatCurrency(veh.askingPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Est. Payment
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        ${sampleMonthly}/mo
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/storefront/inventory/${veh.id}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Vehicle &amp; Schedule Test Drive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trade-in & Financing Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trade In */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant Top-Dollar Trade Valuation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Find out what your vehicle is worth in under 60 seconds. Apply trade equity directly toward your next purchase.
            </p>
            <Link
              href="/storefront/trade-in"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              <span>Get Your Instant Equity Offer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Financing */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">2-Minute Financing Pre-Approval</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Competitive rates starting at 5.99% APR with over 20 top prime &amp; subprime lenders. No impact to credit score.
            </p>
            <Link
              href="/storefront/financing"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
            >
              <span>Check Rates in 2 Minutes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
