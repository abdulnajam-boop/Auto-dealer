import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenantContext();
    const listings = await prisma.listing.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        vehicle: {
          include: { photos: { where: { isCover: true }, take: 1 } },
        },
        marketplaceListings: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(listings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();
    const {
      vehicleId,
      headline,
      shortDescription,
      longDescription,
      featureBullets,
      seoTitle,
      seoDescription,
      status,
      suggestedAskingPrice,
    } = body;

    if (!vehicleId || !headline) {
      return NextResponse.json({ error: 'vehicleId and headline are required' }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        organizationId: tenant.organizationId,
        vehicleId,
        headline,
        shortDescription: shortDescription || '',
        longDescription: longDescription || '',
        featureBulletsJson: featureBullets ? JSON.stringify(featureBullets) : null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        suggestedAskingPrice: suggestedAskingPrice ? Number(suggestedAskingPrice) : 0,
        status: status || 'DRAFT',
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
