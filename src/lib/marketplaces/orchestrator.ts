import { prisma } from '../prisma';
import { marketplaceAdapters } from './adapters';
import { MarketplacePlatform, PublishResult } from './types';

export async function publishToMarketplace(
  organizationId: string,
  vehicleId: string,
  listingId: string,
  platform: MarketplacePlatform
): Promise<PublishResult> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: { photos: true },
  });

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!vehicle || !listing) {
    throw new Error('Vehicle or Listing not found');
  }

  const adapter = marketplaceAdapters[platform];
  if (!adapter) {
    throw new Error(`Unsupported marketplace platform: ${platform}`);
  }

  const validation = adapter.validateVehicle(vehicle);
  if (!validation.valid) {
    const failedResult: PublishResult = {
      success: false,
      platform,
      errorMessage: validation.errors.join(', '),
      status: 'FAILED',
      timestamp: new Date(),
    };

    await prisma.marketplaceListing.upsert({
      where: {
        id: `${listingId}_${platform}`,
      },
      update: {
        status: 'FAILED',
        errorMessage: validation.errors.join(', '),
        lastSyncedAt: new Date(),
      },
      create: {
        id: `${listingId}_${platform}`,
        organizationId,
        listingId,
        vehicleId,
        platform,
        publishedPrice: vehicle.askingPrice,
        status: 'FAILED',
        errorMessage: validation.errors.join(', '),
        lastSyncedAt: new Date(),
      },
    });

    return failedResult;
  }

  const result = await adapter.publish(vehicle, listing);

  await prisma.marketplaceListing.upsert({
    where: {
      id: `${listingId}_${platform}`,
    },
    update: {
      status: result.status,
      externalId: result.externalId,
      externalUrl: result.externalUrl,
      publishedPrice: vehicle.askingPrice,
      errorMessage: result.errorMessage || null,
      lastSyncedAt: new Date(),
    },
    create: {
      id: `${listingId}_${platform}`,
      organizationId,
      listingId,
      vehicleId,
      platform,
      externalId: result.externalId,
      externalUrl: result.externalUrl,
      publishedPrice: vehicle.askingPrice,
      status: result.status,
      errorMessage: result.errorMessage || null,
      lastSyncedAt: new Date(),
    },
  });

  // Update main listing status to PUBLISHED if at least one platform is LIVE
  await prisma.listing.update({
    where: { id: listingId },
    data: { status: 'PUBLISHED' },
  });

  // Update vehicle status to LISTED if ready
  if (vehicle.status === 'READY') {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'LISTED' },
    });
  }

  await prisma.auditLog.create({
    data: {
      organizationId,
      action: 'LISTING_PUBLISHED',
      entityType: 'MARKETPLACE_LISTING',
      entityId: result.externalId || `${listingId}_${platform}`,
      detailsJson: JSON.stringify({ platform, price: vehicle.askingPrice, status: result.status }),
    },
  });

  return result;
}

export async function publishEverywhere(
  organizationId: string,
  vehicleId: string,
  listingId: string,
  platforms: MarketplacePlatform[] = [
    'STOREFRONT',
    'FACEBOOK',
    'CRAIGSLIST',
    'EBAY_MOTORS',
    'AUTOTRADER',
    'CARS_COM',
    'CARGURUS',
  ]
): Promise<PublishResult[]> {
  const results: PublishResult[] = [];
  for (const platform of platforms) {
    try {
      const res = await publishToMarketplace(organizationId, vehicleId, listingId, platform);
      results.push(res);
    } catch (err: any) {
      results.push({
        success: false,
        platform,
        errorMessage: err.message || 'Unknown error',
        status: 'FAILED',
        timestamp: new Date(),
      });
    }
  }
  return results;
}

export async function delistVehicleEverywhere(
  organizationId: string,
  vehicleId: string
): Promise<{ removedCount: number }> {
  const activeMarketplaceListings = await prisma.marketplaceListing.findMany({
    where: {
      organizationId,
      vehicleId,
      status: { in: ['LIVE', 'PENDING'] },
    },
  });

  let removedCount = 0;
  for (const mpListing of activeMarketplaceListings) {
    const adapter = marketplaceAdapters[mpListing.platform as MarketplacePlatform];
    if (adapter) {
      await adapter.remove(vehicleId, mpListing.externalId);
    }

    await prisma.marketplaceListing.update({
      where: { id: mpListing.id },
      data: {
        status: 'REMOVED',
        lastSyncedAt: new Date(),
      },
    });
    removedCount++;
  }

  await prisma.auditLog.create({
    data: {
      organizationId,
      action: 'VEHICLE_DELISTED_EVERYWHERE',
      entityType: 'VEHICLE',
      entityId: vehicleId,
      detailsJson: JSON.stringify({ removedCount }),
    },
  });

  return { removedCount };
}
