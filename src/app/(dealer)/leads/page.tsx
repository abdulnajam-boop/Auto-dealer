import React from 'react';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { LeadsCrmClient } from './LeadsCrmClient';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const tenant = await getTenantContext();

  const [leads, teamUsers] = await Promise.all([
    prisma.lead.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        vehicle: true,
        assignedTo: true,
        appointments: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.user.findMany({
      where: {
        memberships: {
          some: { organizationId: tenant.organizationId },
        },
      },
      select: { id: true, name: true, email: true },
    }),
  ]);

  return <LeadsCrmClient initialLeads={leads} teamUsers={teamUsers} />;
}
