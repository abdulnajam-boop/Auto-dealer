import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { VehicleDetailClient } from './VehicleDetailClient';

export const dynamic = 'force-dynamic';

export default async function ConsumerVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
      organization: true,
    },
  });

  if (!vehicle) {
    notFound();
  }

  // Fetch similar vehicles
  const similarVehicles = await prisma.vehicle.findMany({
    where: {
      id: { not: vehicle.id },
      status: { in: ['LISTED', 'READY'] },
      make: vehicle.make,
    },
    include: { photos: { take: 1 } },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <VehicleDetailClient vehicle={vehicle} similarVehicles={similarVehicles} />
      </main>

      <MarketingFooter />
    </div>
  );
}
