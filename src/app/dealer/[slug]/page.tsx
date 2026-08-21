import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatNumber, calculateMonthlyPayment } from '@/lib/utils';
import {
  Car,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  HeartHandshake,
  ArrowRight,
  Search,
  Calendar,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function BrandedDealerStorefrontPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ search?: string; make?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const { search, make } = resolvedSearchParams;

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      branding: true,
      locations: true,
      vehicles: {
        where: {
          status: { in: ['LISTED', 'READY'] },
          ...(make && make !== 'ALL' ? { make: { contains: make } } : {}),
          ...(search
            ? {
                OR: [
                  { make: { contains: search } },
                  { model: { contains: search } },
                  { vin: { contains: search } },
                ],
              }
            : {}),
        },
        include: { photos: { orderBy: { orderIndex: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!org) {
    notFound();
  }

  const branding = org.branding;
  const hours = branding?.businessHoursJson ? JSON.parse(branding.businessHoursJson) : null;
  const policies = branding?.policiesJson ? JSON.parse(branding.policiesJson) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Dealer Storefront Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base text-white tracking-tight leading-tight">{org.name}</div>
              <div className="text-[10px] text-slate-400">{branding?.tagline || `${org.city}, ${org.state}`}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href={`tel:${org.phone || '(512) 555-0199'}`}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-emerald-400"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{org.phone || '(512) 555-0199'}</span>
            </a>
            <Link
              href="/cars"
              className="text-xs text-slate-400 hover:text-white hidden md:block"
            >
              AutoAIdealership Marketplace →
            </Link>
          </div>
        </div>
      </header>

      {/* Dealer Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Certified Dealership Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {branding?.heroTitle || `Welcome to ${org.name}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {branding?.heroSubtitle || 'Handcrafted luxury, verified vehicle histories, and transparent out-the-door pricing.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{org.address}, {org.city}, {org.state} {org.zip}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mon-Sat 9:00 AM - 8:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Inventory Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Current Showroom Inventory</h2>
            <p className="text-xs text-slate-400">All vehicles inspected, reconditioned, and ready for immediate delivery.</p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
            {org.vehicles.length} Active Vehicles
          </div>
        </div>

        {org.vehicles.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-3">
            <Car className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No vehicles found</h3>
            <p className="text-xs text-slate-400">Please check back soon as new inventory is added weekly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {org.vehicles.map((v) => {
              const coverPhoto =
                v.photos.find((p) => p.isCover)?.url ||
                v.photos[0]?.url ||
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
              const estMonthly = calculateMonthlyPayment(v.askingPrice, 5.99, 60, v.askingPrice * 0.1);

              return (
                <div
                  key={v.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      <img
                        src={coverPhoto}
                        alt={`${v.year} ${v.make} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-right">
                        <div className="text-xs font-extrabold text-white font-mono">
                          {formatCurrency(v.askingPrice)}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-mono">
                          Est. ${estMonthly}/mo
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                          {v.year} {v.make} {v.model}
                        </h3>
                        <p className="text-xs text-slate-400">{v.trim || 'Standard Edition'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-slate-400">Mileage: </span>
                          <span className="font-mono">{formatNumber(v.mileage)} mi</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Drivetrain: </span>
                          <span>{v.drivetrain || 'AWD'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/cars/${v.id}`}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>View Vehicle & Test Drive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Policies Section */}
        {policies && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dealership Guarantees & Transparency Policies</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {policies.warranty && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200">Powertrain Warranty</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{policies.warranty}</p>
                </div>
              )}
              {policies.moneyBack && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200">Exchange Guarantee</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{policies.moneyBack}</p>
                </div>
              )}
              {policies.docFee && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200">Fee Transparency</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{policies.docFee}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 text-center text-xs text-slate-400 space-y-2">
        <div>© {new Date().getFullYear()} {org.name}. Powered by AutoAIdealership.</div>
        <div className="text-[11px] text-slate-500">All prices subject to applicable state sales tax, title, and registration fees.</div>
      </footer>
    </div>
  );
}
