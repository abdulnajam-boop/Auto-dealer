import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const whereClause: any = { organizationId: tenant.organizationId };
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        expenses: true,
        listings: true,
        leads: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(vehicles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();

    const {
      vin,
      stockNumber,
      year,
      make,
      model,
      trim,
      mileage,
      exteriorColor,
      interiorColor,
      engine,
      transmission,
      drivetrain,
      fuelType,
      bodyStyle,
      doors,
      purchasePrice,
      purchaseSource,
      purchaseDate,
      askingPrice,
      preferredPrice,
      minPrice,
      status,
      conditionGrade,
      notes,
      locationId,
      photos,
    } = body;

    if (!vin || !make || !model || !year) {
      return NextResponse.json(
        { error: 'VIN, Year, Make, and Model are required to intake a vehicle.' },
        { status: 400 }
      );
    }

    const cleanVin = vin.trim().toUpperCase();
    const cleanStockNumber = stockNumber?.trim() || `STK-${cleanVin.slice(-6)}`;
    const parsedYear = Number(year);
    const parsedMileage = Number(mileage) || 0;
    const parsedPurchasePrice = Number(purchasePrice) || 0;
    const parsedAskingPrice = Number(askingPrice) || (parsedPurchasePrice > 0 ? parsedPurchasePrice + 3500 : 25000);
    const parsedMinPrice = Number(minPrice) || (parsedPurchasePrice > 0 ? parsedPurchasePrice + 1200 : parsedAskingPrice * 0.9);
    const parsedPreferredPrice = Number(preferredPrice) || (parsedAskingPrice - 500);

    const vehicle = await prisma.vehicle.create({
      data: {
        organizationId: tenant.organizationId,
        locationId: locationId || undefined,
        vin: cleanVin,
        stockNumber: cleanStockNumber,
        year: parsedYear,
        make: make.trim(),
        model: model.trim(),
        trim: trim?.trim() || null,
        mileage: parsedMileage,
        exteriorColor: exteriorColor?.trim() || 'Black',
        interiorColor: interiorColor?.trim() || 'Black',
        engine: engine || '2.0L 4-Cylinder',
        transmission: transmission || 'Automatic',
        drivetrain: drivetrain || 'FWD',
        fuelType: fuelType || 'Gasoline',
        bodyStyle: bodyStyle || 'Sedan',
        doors: doors ? Number(doors) : 4,
        purchasePrice: parsedPurchasePrice,
        totalCostBasis: parsedPurchasePrice,
        askingPrice: parsedAskingPrice,
        preferredPrice: parsedPreferredPrice,
        minPrice: parsedMinPrice,
        purchaseSource: purchaseSource || 'AUCTION',
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        status: status || 'READY',
        conditionGrade: conditionGrade || 'CLEAN',
        notes: notes || null,
        photos: photos && Array.isArray(photos) && photos.length > 0 ? {
          create: photos.map((p: any, idx: number) => ({
            url: p.url || p,
            caption: p.caption || null,
            isCover: idx === 0,
            orderIndex: idx,
          })),
        } : undefined,
      },
      include: {
        photos: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        action: 'VEHICLE_CREATED',
        entityType: 'VEHICLE',
        entityId: vehicle.id,
        detailsJson: JSON.stringify({ vin: vehicle.vin, stockNumber: vehicle.stockNumber, price: vehicle.askingPrice }),
      },
    });

    return NextResponse.json({
      success: true,
      vehicle,
      redirectUrl: `/inventory/${vehicle.id}`,
    });
  } catch (error: any) {
    console.error('[VEHICLE_CREATE_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Failed to create vehicle.' }, { status: 500 });
  }
}
