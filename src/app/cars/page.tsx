import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { formatCurrency, formatNumber, calculateMonthlyPayment } from '@/lib/utils';
import {
  Car,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  DollarSign,
  Tag,
  MapPin,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function ConsumerMarketplacePage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; make?: string; bodyStyle?: string; maxPrice?: string; fuelType?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { search, make, bodyStyle, maxPrice, fuelType } = resolvedParams;

  const whereClause: any = {
    status: { in: ['LISTED', 'READY'] },
  };

  if (make && make !== 'ALL') {
    whereClause.make = { contains: make };
  }

  if (bodyStyle && bodyStyle !== 'ALL') {
    whereClause.bodyStyle = bodyStyle;
  }

  if (fuelType && fuelType !== 'ALL') {
    whereClause.fuelType = fuelType;
  }

  if (maxPrice) {
    whereClause.askingPrice = { lte: parseFloat(maxPrice) };
  }

  if (search) {
    whereClause.OR = [
      { make: { contains: search } },
      { model: { contains: search } },
      { vin: { contains: search } },
    ];
  }

  const vehicles = await prisma.vehicle.findMany({
    where: whereClause,
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
      organization: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      {/* Header Banner */}
      <section className="pt-12 pb-8 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AutoAIdealership Marketplace
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Verified inventory from certified partner dealerships with transparent out-the-door pricing.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
              {vehicles.length} Vehicles Available
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Quick Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Link
            href="/cars"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200"
          >
            All Makes
          </Link>
          <Link
            href="/cars?make=Toyota"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200"
          >
            Toyota
          </Link>
          <Link
            href="/cars?make=BMW"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200"
          >
            BMW
          </Link>
          <Link
            href="/cars?make=Porsche"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200"
          >
            Porsche
          </Link>
          <Link
            href="/cars?make=Ford"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200"
          >
            Ford
          </Link>
          <Link
            href="/lease-deals"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 ml-auto"
          >
            ⚡ View Lease Deals →
          </Link>
        </div>

        {/* Vehicle Grid */}
        {vehicles.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-3">
            <Car className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No vehicles found matching filters</h3>
            <p className="text-xs text-slate-400">Try adjusting your make, price, or search criteria.</p>
            <Link
              href="/cars"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => {
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
                    {/* Photo Container */}
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      <img
                        src={coverPhoto}
                        alt={`${v.year} ${v.make} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold border border-slate-800">
                          {v.conditionGrade || 'Clean'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-right">
                        <div className="text-xs font-extrabold text-white font-mono">
                          {formatCurrency(v.askingPrice)}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-mono">
                          Est. ${estMonthly}/mo
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                          {v.year} {v.make} {v.model}
                        </h3>
                        <p className="text-xs text-slate-400">{v.trim || 'Standard'}</p>
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
                        <div>
                          <span className="text-slate-400">Fuel: </span>
                          <span>{v.fuelType || 'Gasoline'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Color: </span>
                          <span>{v.exteriorColor}</span>
                        </div>
                      </div>

                      {/* Dealership Info */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{v.organization.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{v.organization.city}, {v.organization.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/cars/${v.id}`}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <span>View Details & Schedule Test Drive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
