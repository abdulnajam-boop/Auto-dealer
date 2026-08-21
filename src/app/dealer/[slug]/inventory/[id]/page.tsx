import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PublicVehicleDetailClient } from './PublicVehicleDetailClient';

export const dynamic = 'force-dynamic';

export default async function PublicVehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: { branding: true },
  });

  if (!org) notFound();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
    },
  });

  if (!vehicle || vehicle.organizationId !== org.id || vehicle.status === 'SOLD') {
    notFound();
  }

  return (
    <PublicVehicleDetailClient
      vehicle={vehicle}
      organization={org}
      branding={org.branding}
    />
  );
}
