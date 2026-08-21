import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();
    const { vehicleId, listingId, headline, shortDescription, longDescription, askingPrice } = body;

    if (!vehicleId && !listingId) {
      return NextResponse.json({ error: 'vehicleId or listingId is required' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: vehicleId ? { id: vehicleId, organizationId: tenant.organizationId } : { listings: { some: { id: listingId } }, organizationId: tenant.organizationId },
      include: { listings: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // 1. Update or create listing as PUBLISHED
    let listing = vehicle.listings[0];
    if (listing) {
      listing = await prisma.listing.update({
        where: { id: listing.id },
        data: {
          headline: headline || listing.headline,
          shortDescription: shortDescription || listing.shortDescription,
          longDescription: longDescription || listing.longDescription,
          suggestedAskingPrice: askingPrice ? Number(askingPrice) : listing.suggestedAskingPrice,
          status: 'PUBLISHED',
          approvedAt: new Date(),
        },
      });
    } else {
      listing = await prisma.listing.create({
        data: {
          organizationId: tenant.organizationId,
          vehicleId: vehicle.id,
          headline: headline || `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`,
          shortDescription: shortDescription || 'Certified pre-owned inventory ready for immediate delivery.',
          longDescription: longDescription || 'Front-line certified vehicle with complete multi-point inspection.',
          status: 'PUBLISHED',
          approvedAt: new Date(),
        },
      });
    }

    // 2. Ensure vehicle is marked LISTED
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        status: 'LISTED',
        askingPrice: askingPrice ? Number(askingPrice) : vehicle.askingPrice,
      },
    });

    // 3. Upsert MarketplaceListing for STOREFRONT
    await prisma.marketplaceListing.upsert({
      where: {
        id: `storefront_${vehicle.id}`,
      },
      update: {
        status: 'LIVE',
        lastSyncedAt: new Date(),
        publishedPrice: vehicle.askingPrice,
      },
      create: {
        id: `storefront_${vehicle.id}`,
        organizationId: tenant.organizationId,
        listingId: listing.id,
        vehicleId: vehicle.id,
        platform: 'STOREFRONT',
        status: 'LIVE',
        publishedPrice: vehicle.askingPrice,
        lastSyncedAt: new Date(),
      },
    });

    // 4. Audit Log
    await prisma.auditLog.create({
      data: {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        action: 'LISTING_PUBLISHED',
        entityType: 'LISTING',
        entityId: listing.id,
        detailsJson: JSON.stringify({ vehicleId: vehicle.id, platform: 'STOREFRONT' }),
      },
    });

    return NextResponse.json({
      success: true,
      listing,
      vehicleId: vehicle.id,
      storefrontUrl: `/dealer/${tenant.organizationSlug}/inventory/${vehicle.id}`,
    });
  } catch (error: any) {
    console.error('[LISTING_PUBLISH_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Failed to publish listing' }, { status: 500 });
  }
}
