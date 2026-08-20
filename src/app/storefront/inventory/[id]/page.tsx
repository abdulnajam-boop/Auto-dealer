import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, calculateMonthlyPayment } from '@/lib/utils';
import {
  Car,
  ShieldCheck,
  Award,
  Calendar,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function StorefrontVehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await getTenantContext();
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
      listings: { take: 1, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!vehicle || vehicle.organizationId !== tenant.organizationId) {
    notFound();
  }

  const listing = vehicle.listings[0];
  const sampleMonthly = calculateMonthlyPayment(vehicle.askingPrice * 0.9, 6.99, 60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/storefront/inventory"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Vehicles</span>
      </Link>

      {/* Main Grid: Gallery & Buying Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Photo Gallery & Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Showcase */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden relative h-96">
            {vehicle.photos[0] ? (
              <img
                src={vehicle.photos[0].url}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700">
                <Car className="w-16 h-16" />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-xs font-extrabold shadow-lg">
              120-POINT CERTIFIED
            </div>
          </div>

          {/* Thumbnails */}
          {vehicle.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {vehicle.photos.map((p) => (
                <div
                  key={p.id}
                  className="h-20 rounded-xl bg-slate-900 overflow-hidden border border-slate-800"
                >
                  <img src={p.url} alt={p.caption || ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Story & Narrative */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">About This {vehicle.year} {vehicle.make} {vehicle.model}</h2>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {listing?.longDescription ||
                `Presenting this certified ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}. Thoroughly inspected and reconditioned with complete safety check, oil service, and full professional detailing.`}
            </p>

            {listing?.featureBulletsJson && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase">Key Features &amp; Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {JSON.parse(listing.featureBulletsJson).map((bullet: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Price & Direct Booking Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 backdrop-blur-md sticky top-24">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Stock #{vehicle.stockNumber}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim || ''}
              </h1>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                VIN: {vehicle.vin} • {formatNumber(vehicle.mileage)} Miles
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Upfront Transparent Price
                </span>
                <span className="text-3xl font-extrabold text-white">
                  {formatCurrency(vehicle.askingPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Est. Payment
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${sampleMonthly}/mo*
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <a
                href="#livechat"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule VIP Test Drive Today</span>
              </a>

              <a
                href="#livechat"
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Make an Offer or Value Trade-in</span>
              </a>
            </div>

            {/* Specifications Quick Grid */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Exterior</span>
                <div className="font-semibold text-white">{vehicle.exteriorColor}</div>
              </div>
              <div>
                <span className="text-slate-500">Interior</span>
                <div className="font-semibold text-white">{vehicle.interiorColor || 'Leather'}</div>
              </div>
              <div>
                <span className="text-slate-500">Transmission</span>
                <div className="font-semibold text-white">{vehicle.transmission || 'Automatic'}</div>
              </div>
              <div>
                <span className="text-slate-500">Drivetrain</span>
                <div className="font-semibold text-white">{vehicle.drivetrain || 'FWD'}</div>
              </div>
              <div>
                <span className="text-slate-500">Engine</span>
                <div className="font-semibold text-white">{vehicle.engine || 'Standard'}</div>
              </div>
              <div>
                <span className="text-slate-500">Fuel Type</span>
                <div className="font-semibold text-white">{vehicle.fuelType || 'Gasoline'}</div>
              </div>
            </div>

            {/* Certification Assurance */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Apex Certified Peace of Mind
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Free complete CARFAX history report, 120-point mechanical certification, and 7-day exchange guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
