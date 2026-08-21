import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { StorefrontSettingsSchema } from '@/lib/validation/storefront-settings';

export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (!tenant?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const branding = await prisma.dealerBranding.findUnique({
      where: { organizationId: tenant.organizationId },
    });

    return NextResponse.json({ branding: branding || {} });
  } catch (error: any) {
    console.error('Error fetching storefront settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storefront settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (!tenant?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Require OWNER or MANAGER role
    if (tenant.role !== 'OWNER' && tenant.role !== 'MANAGER' && tenant.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only dealership Owners and Managers can modify storefront controls' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parseResult = StorefrontSettingsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid settings data', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    const updated = await prisma.dealerBranding.upsert({
      where: { organizationId: tenant.organizationId },
      create: {
        organizationId: tenant.organizationId,
        showOwnInventory: data.showOwnInventory,
        showLeaseDeals: data.showLeaseDeals,
        showNetworkInventory: data.showNetworkInventory,
        showPartnerListings: data.showPartnerListings,
        showCarfaxCta: data.showCarfaxCta,
        showFinancingCta: data.showFinancingCta,
        showTradeInCta: data.showTradeInCta,
        showMakeOffer: data.showMakeOffer,
        showScheduleTestDrive: data.showScheduleTestDrive,
        showContactDealer: data.showContactDealer,
        showVehicleRecommendations: data.showVehicleRecommendations,
        preferredHistoryProvider: data.preferredHistoryProvider,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        tagline: data.tagline,
        primaryColor: data.primaryColor,
        accentColor: data.accentColor,
        aboutUs: data.aboutUs,
      },
      update: {
        showOwnInventory: data.showOwnInventory,
        showLeaseDeals: data.showLeaseDeals,
        showNetworkInventory: data.showNetworkInventory,
        showPartnerListings: data.showPartnerListings,
        showCarfaxCta: data.showCarfaxCta,
        showFinancingCta: data.showFinancingCta,
        showTradeInCta: data.showTradeInCta,
        showMakeOffer: data.showMakeOffer,
        showScheduleTestDrive: data.showScheduleTestDrive,
        showContactDealer: data.showContactDealer,
        showVehicleRecommendations: data.showVehicleRecommendations,
        preferredHistoryProvider: data.preferredHistoryProvider,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        tagline: data.tagline,
        primaryColor: data.primaryColor,
        accentColor: data.accentColor,
        aboutUs: data.aboutUs,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Storefront controls updated successfully',
      branding: updated,
    });
  } catch (error: any) {
    console.error('Error updating storefront settings:', error);
    return NextResponse.json(
      { error: 'Failed to update storefront settings' },
      { status: 500 }
    );
  }
}
