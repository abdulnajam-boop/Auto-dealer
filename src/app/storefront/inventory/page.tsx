import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, calculateMonthlyPayment } from '@/lib/utils';
import { Car, Search, Filter, ArrowRight, ShieldCheck } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function StorefrontInventoryPage({
  searchParams,
}: {
  searchParams?: { make?: string; bodyStyle?: string; search?: string };
}) {
  const tenant = await getTenantContext();

  const whereClause: any = {
    organizationId: tenant.organizationId,
    status: { in: ['LISTED', 'READY'] },
  };

  if (searchParams?.make) {
    whereClause.make = searchParams.make;
  }
  if (searchParams?.bodyStyle) {
    whereClause.bodyStyle = searchParams.bodyStyle;
  }
  if (searchParams?.search) {
    whereClause.OR = [
      { make: { contains: searchParams.search } },
      { model: { contains: searchParams.search } },
      { year: isNaN(parseInt(searchParams.search, 10)) ? undefined : parseInt(searchParams.search, 10) },
    ];
  }

  const vehicles = await prisma.vehicle.findMany({
    where: whereClause,
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
    },
    orderBy: { askingPrice: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Certified Used Vehicle Inventory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Showing {vehicles.length} fully inspected vehicles available for immediate Austin test drive.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((veh) => {
          const sampleMonthly = calculateMonthlyPayment(veh.askingPrice * 0.9, 6.99, 60);

          return (
            <div
              key={veh.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all group flex flex-col"
            >
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
                  CERTIFIED
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-slate-700">
                  {formatNumber(veh.mileage)} mi
                </div>
              </div>

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
                      Price
                    </span>
                    <span className="text-xl font-extrabold text-white">
                      {formatCurrency(veh.askingPrice)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Est. Monthly
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
                  <span>View Details &amp; Test Drive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
