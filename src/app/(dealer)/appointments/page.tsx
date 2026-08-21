import React from 'react';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { AppointmentsClient } from './AppointmentsClient';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
  const tenant = await getTenantContext();

  const appointments = await prisma.appointment.findMany({
    where: { organizationId: tenant.organizationId },
    include: {
      vehicle: true,
      lead: true,
    },
    orderBy: { scheduledAt: 'asc' },
  });

  return <AppointmentsClient initialAppointments={appointments} />;
}
