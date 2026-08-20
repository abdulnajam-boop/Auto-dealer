import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Tag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  MapPin,
  Calendar,
  Calculator,
} from '@/components/icons';
import { LeaseDealsClient } from './LeaseDealsClient';

export const dynamic = 'force-dynamic';

export default async function PublicLeaseDealsPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; make?: string; maxPayment?: string; minScore?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { search, make, maxPayment, minScore } = resolvedParams;

  const whereClause: any = {
    isVerified: true,
  };

  if (make && make !== 'ALL') {
    whereClause.make = { contains: make };
  }

  if (maxPayment) {
    whereClause.monthlyPayment = { lte: parseFloat(maxPayment) };
  }

  if (minScore) {
    whereClause.dealScore = { gte: parseInt(minScore, 10) };
  }

  if (search) {
    whereClause.OR = [
      { make: { contains: search } },
      { model: { contains: search } },
      { trim: { contains: search } },
    ];
  }

  const leaseOffers = await prisma.leaseOffer.findMany({
    where: whereClause,
    include: { organization: true },
    orderBy: { dealScore: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      {/* Header Banner */}
      <section className="pt-12 pb-8 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>Zero Hidden Fees • True Effective Monthly Costs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Public Lease Deal Discovery
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Explore nationwide OEM manufacturer programs and verified dealership lease specials ranked by explainable 0–100 Deal Scores.
              </p>
            </div>
            <div className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20 w-fit">
              {leaseOffers.length} Verified Specials
            </div>
          </div>
        </div>
      </section>

      {/* Client Interactive Workspace (Filters, Cards, and Embedded Lease Calculator) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <LeaseDealsClient initialOffers={leaseOffers} />
      </main>

      <MarketingFooter />
    </div>
  );
}
