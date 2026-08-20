import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { delistVehicleEverywhere } from '@/lib/marketplaces/orchestrator';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await context.params;

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!deal || deal.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // 1. Mark Deal as Delivered
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        dealStatus: 'DELIVERED',
        deliveredDate: new Date(),
      },
    });

    // 2. Mark Vehicle as SOLD
    if (deal.vehicleId) {
      await prisma.vehicle.update({
        where: { id: deal.vehicleId },
        data: {
          status: 'SOLD',
          soldPrice: deal.salePrice,
          soldDate: new Date(),
        },
      });

      // 3. Trigger automatic delisting across all connected marketplaces
      await delistVehicleEverywhere(tenant.organizationId, deal.vehicleId);
    }

    return NextResponse.json({
      success: true,
      deal: updatedDeal,
      message: 'Deal delivered and vehicle delisted across all marketplaces successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
