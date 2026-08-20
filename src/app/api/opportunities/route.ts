import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenantContext();
    const opportunities = await prisma.opportunity.findMany({
      where: { organizationId: tenant.organizationId },
      orderBy: { opportunityScore: 'desc' },
    });
    return NextResponse.json(opportunities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
