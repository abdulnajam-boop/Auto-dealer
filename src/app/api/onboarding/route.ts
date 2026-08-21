import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenantContext();
    const org = await prisma.organization.findUnique({
      where: { id: tenant.organizationId },
      include: {
        branding: true,
        locations: { where: { isPrimary: true }, take: 1 },
      },
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({
      organization: org,
      branding: org.branding,
      primaryLocation: org.locations[0] || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();

    const {
      // Step 1: Info
      name,
      phone,
      email,
      address,
      city,
      state,
      zip,
      website,
      // Step 2: Profile
      dealerType,
      // Step 3: Inventory size
      inventorySize,
      // Step 4: Branding
      logoUrl,
      primaryColor,
      accentColor,
      tagline,
      heroTitle,
      // Step 5: Features
      showOwnInventory,
      showLeaseDeals,
      showNetworkInventory,
      showPartnerListings,
      showCarfaxCta,
      showFinancingCta,
      showTradeInCta,
      showMakeOffer,
      showScheduleTestDrive,
      showContactDealer,
      aiAutoReplyEnabled,
      preferredHistoryProvider,
      isCompleted,
    } = body;

    // Update organization details
    const updatedOrg = await prisma.organization.update({
      where: { id: tenant.organizationId },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        email: email || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zip: zip || undefined,
        website: website || undefined,
        logoUrl: logoUrl || undefined,
        dealerType: dealerType || 'INDEPENDENT',
        inventorySize: inventorySize || '1-25',
        onboardingCompleted: isCompleted ?? true,
      },
    });

    // Update primary location if exists or create
    const existingLoc = await prisma.location.findFirst({
      where: { organizationId: tenant.organizationId, isPrimary: true },
    });

    if (existingLoc) {
      await prisma.location.update({
        where: { id: existingLoc.id },
        data: {
          address: address || existingLoc.address,
          city: city || existingLoc.city,
          state: state || existingLoc.state,
          zip: zip || existingLoc.zip,
          phone: phone || existingLoc.phone,
        },
      });
    }

    // Upsert dealer branding
    await prisma.dealerBranding.upsert({
      where: { organizationId: tenant.organizationId },
      update: {
        heroTitle: heroTitle || undefined,
        primaryColor: primaryColor || '#10b981',
        accentColor: accentColor || '#14b8a6',
        tagline: tagline || undefined,
        showOwnInventory: showOwnInventory ?? true,
        showLeaseDeals: showLeaseDeals ?? false,
        showNetworkInventory: showNetworkInventory ?? false,
        showPartnerListings: showPartnerListings ?? false,
        showCarfaxCta: showCarfaxCta ?? true,
        showFinancingCta: showFinancingCta ?? true,
        showTradeInCta: showTradeInCta ?? true,
        showMakeOffer: showMakeOffer ?? true,
        showScheduleTestDrive: showScheduleTestDrive ?? true,
        showContactDealer: showContactDealer ?? true,
        preferredHistoryProvider: preferredHistoryProvider || 'VINAUDIT',
      },
      create: {
        organizationId: tenant.organizationId,
        heroTitle: heroTitle || `Welcome to ${updatedOrg.name}`,
        heroSubtitle: 'Exceptional pre-owned vehicles, transparent pricing, and instant financing.',
        primaryColor: primaryColor || '#10b981',
        accentColor: accentColor || '#14b8a6',
        tagline: tagline || 'Quality Vehicles. Trusted Service.',
        showOwnInventory: showOwnInventory ?? true,
        showLeaseDeals: showLeaseDeals ?? false,
        showNetworkInventory: showNetworkInventory ?? false,
        showPartnerListings: showPartnerListings ?? false,
        showCarfaxCta: showCarfaxCta ?? true,
        showFinancingCta: showFinancingCta ?? true,
        showTradeInCta: showTradeInCta ?? true,
        showMakeOffer: showMakeOffer ?? true,
        showScheduleTestDrive: showScheduleTestDrive ?? true,
        showContactDealer: showContactDealer ?? true,
        preferredHistoryProvider: preferredHistoryProvider || 'VINAUDIT',
      },
    });

    return NextResponse.json({
      success: true,
      redirectUrl: `/d/${updatedOrg.slug}/dashboard`,
      organization: updatedOrg,
    });
  } catch (error: any) {
    console.error('[ONBOARDING_SAVE_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
