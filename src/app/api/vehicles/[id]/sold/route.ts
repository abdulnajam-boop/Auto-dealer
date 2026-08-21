import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await params;
    const body = await req.json();
    const { soldPrice, soldDate, buyerName, buyerEmail, buyerPhone, leadId } = body;

    if (!soldPrice) {
      return NextResponse.json({ error: 'Sold price is required.' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { listings: true },
    });

    if (!vehicle || vehicle.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });
    }

    const parsedSoldPrice = Number(soldPrice);
    const parsedSoldDate = soldDate ? new Date(soldDate) : new Date();

    // 1. Update vehicle status to SOLD
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        status: 'SOLD',
        soldPrice: parsedSoldPrice,
        soldDate: parsedSoldDate,
      },
    });

    // 2. Archive active listings
    await prisma.listing.updateMany({
      where: { vehicleId: id },
      data: { status: 'ARCHIVED' },
    });

    // 3. Update marketplace listings to REMOVED
    await prisma.marketplaceListing.updateMany({
      where: { vehicleId: id },
      data: { status: 'REMOVED' },
    });

    // 4. Create completed Deal record if not already exists
    const realizedProfit = parsedSoldPrice - vehicle.totalCostBasis;
    const deal = await prisma.deal.create({
      data: {
        organizationId: tenant.organizationId,
        vehicleId: id,
        leadId: leadId || undefined,
        buyerName: buyerName || 'Direct Buyer',
        buyerEmail: buyerEmail || null,
        buyerPhone: buyerPhone || null,
        salePrice: parsedSoldPrice,
        dealStatus: 'DELIVERED',
        deliveredDate: parsedSoldDate,
        fundedDate: parsedSoldDate,
        notes: `Sold for $${parsedSoldPrice.toLocaleString()}. Realized Profit: $${realizedProfit.toLocaleString()}`,
      },
    });

    // 5. Update lead stage to SOLD if leadId was linked
    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { stage: 'SOLD' },
      });
    }

    // 6. Audit Log
    await prisma.auditLog.create({
      data: {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        action: 'VEHICLE_SOLD',
        entityType: 'VEHICLE',
        entityId: id,
        detailsJson: JSON.stringify({
          soldPrice: parsedSoldPrice,
          soldDate: parsedSoldDate,
          realizedProfit,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      vehicle: updatedVehicle,
      deal,
      realizedProfit,
    });
  } catch (error: any) {
    console.error('[VEHICLE_SOLD_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Failed to mark vehicle sold.' }, { status: 500 });
  }
}
