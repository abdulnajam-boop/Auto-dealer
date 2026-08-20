import React from 'react';
import { redirect } from 'next/navigation';
import { getTenantContext } from '@/lib/tenant';
import { prisma } from '@/lib/prisma';
import DashboardPage from '@/app/(dealer)/dashboard/page';

export const dynamic = 'force-dynamic';

export default async function PathBasedDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getTenantContext();

  const targetOrg = await prisma.organization.findUnique({
    where: { slug },
  });

  if (!targetOrg) {
    redirect('/dashboard');
  }

  // Render the core dashboard within the active tenant context
  return <DashboardPage />;
}
