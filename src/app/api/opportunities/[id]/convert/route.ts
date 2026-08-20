import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await context.params;

    const opp = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opp || opp.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Generate next stock number
    const count = await prisma.vehicle.count({
      where: { organizationId: tenant.organizationId },
    });
    const stockNumber = `AP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const totalCostBasis =
      (opp.currentBid || 0) +
      (opp.buyFee || 0) +
      (opp.transportEstimate || 0) +
      (opp.repairEstimate || 0);

    const vehicle = await prisma.vehicle.create({
      data: {
        organizationId: tenant.organizationId,
        vin: opp.vin,
        stockNumber,
        year: opp.year,
        make: opp.make,
        model: opp.model,
        trim: opp.trim,
        mileage: opp.mileage,
        exteriorColor: 'Black',
        purchaseDate: new Date(),
        purchaseSource: opp.sourceChannel,
        purchasePrice: opp.currentBid || 0,
        totalCostBasis,
        askingPrice: opp.expectedSalePrice || Math.round(totalCostBasis * 1.15),
        preferredPrice: Math.round((opp.expectedSalePrice || totalCostBasis * 1.15) * 0.96),
        minPrice: Math.round(totalCostBasis + 1500),
        status: 'RECONDITIONING',
      },
    });

    // Record initial acquisition expense
    if (opp.currentBid && opp.currentBid > 0) {
      await prisma.vehicleExpense.create({
        data: {
          organizationId: tenant.organizationId,
          vehicleId: vehicle.id,
          category: 'ACQUISITION',
          description: `Acquisition via ${opp.sourceChannel}`,
          amount: opp.currentBid,
        },
      });
    }

    if (opp.buyFee && opp.buyFee > 0) {
      await prisma.vehicleExpense.create({
        data: {
          organizationId: tenant.organizationId,
          vehicleId: vehicle.id,
          category: 'AUCTION_FEE',
          description: 'Auction Buy Fee',
          amount: opp.buyFee,
        },
      });
    }

    // Update opportunity status
    await prisma.opportunity.update({
      where: { id },
      data: {
        status: 'WON',
        convertedVehicleId: vehicle.id,
      },
    });

    return NextResponse.json({
      success: true,
      vehicleId: vehicle.id,
      stockNumber: vehicle.stockNumber,
      message: 'Vehicle converted to active inventory in RECONDITIONING stage.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
