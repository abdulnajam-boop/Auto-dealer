import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { vinAuditClient } from '@/lib/providers/vinaudit/client';
import { VehicleDetailClient } from './VehicleDetailClient';

export const dynamic = 'force-dynamic';

export default async function VehicleDetailPage({
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
      expenses: { orderBy: { date: 'desc' } },
      listings: {
        include: { marketplaceListings: true },
        orderBy: { createdAt: 'desc' },
      },
      leads: { orderBy: { updatedAt: 'desc' } },
      deals: true,
      historyRecords: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  if (!vehicle || vehicle.organizationId !== tenant.organizationId) {
    notFound();
  }

  // Pre-fetch or calculate vehicle history & market value metrics
  const [historyReport, marketValue, marketComps] = await Promise.all([
    vinAuditClient.getVehicleHistory({ vin: vehicle.vin, organizationId: tenant.organizationId }),
    vinAuditClient.getMarketValue({ vin: vehicle.vin, mileage: vehicle.mileage }, tenant.organizationId),
    vinAuditClient.getMarketListings({ make: vehicle.make, model: vehicle.model }, tenant.organizationId),
  ]);

  return (
    <VehicleDetailClient
      vehicle={vehicle}
      historyReport={historyReport}
      marketValue={marketValue}
      marketComps={marketComps}
      activeListing={vehicle.listings[0] || null}
      storefrontSlug={tenant.organizationSlug}
    />
  );
}
