import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { generateVehicleListing } from '@/lib/ai/copywriter';

export async function POST(request: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await request.json();
    const { vehicleId } = body;

    if (!vehicleId) {
      return NextResponse.json({ error: 'vehicleId is required' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { expenses: true },
    });

    if (!vehicle || vehicle.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Vehicle not found in active dealership organization' }, { status: 404 });
    }

    const copy = await generateVehicleListing({
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      mileage: vehicle.mileage,
      exteriorColor: vehicle.exteriorColor,
      interiorColor: vehicle.interiorColor,
      engine: vehicle.engine,
      transmission: vehicle.transmission,
      drivetrain: vehicle.drivetrain,
      askingPrice: vehicle.askingPrice,
      conditionGrade: vehicle.conditionGrade,
      stockNumber: vehicle.stockNumber,
      reconditioningNotes: vehicle.expenses.map((e) => `${e.category}: ${e.description}`),
    });

    const listing = await prisma.listing.create({
      data: {
        organizationId: tenant.organizationId,
        vehicleId: vehicle.id,
        headline: copy.headline,
        shortDescription: copy.shortDescription,
        longDescription: copy.longDescription,
        featureBulletsJson: JSON.stringify(copy.featureBullets),
        seoTitle: copy.seoTitle,
        seoDescription: copy.seoDescription,
        facebookCopy: copy.facebookCopy,
        craigslistCopy: copy.craigslistCopy,
        socialCopy: copy.socialCopy,
        hashtagsJson: JSON.stringify(copy.hashtags),
        suggestedAskingPrice: copy.suggestedAskingPrice,
        status: 'DRAFT',
      },
    });

    return NextResponse.json({ success: true, listing, copy });
  } catch (error: any) {
    console.error('Error generating AI listing:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
