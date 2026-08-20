import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenantContext();
    const vehicles = await prisma.vehicle.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        expenses: true,
        listings: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(vehicles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
