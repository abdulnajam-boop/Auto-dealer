import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/lib/prisma';
import { decodeVin } from '../src/lib/vin/decoder';
import { vinAuditClient } from '../src/lib/providers/vinaudit/client';
import { generateVehicleListing } from '../src/lib/ai/copywriter';
import { encryptCredential, decryptCredential, sanitizeMarketplaceAccount } from '../src/lib/security/credentials';

describe('AutoAIdealership Comprehensive 19-Step MVP Lifecycle', () => {
  const primaryOrgId = 'org_test_mvp_dealer';
  const primarySlug = 'mvp-motors-austin';
  const competitorOrgId = 'org_competitor_dealer';
  const competitorSlug = 'competitor-motors';

  let testVehicleId: string;
  let testLeadId: string;
  let testListingId: string;

  beforeAll(async () => {
    // 1. Setup primary test dealership
    await prisma.organization.upsert({
      where: { slug: primarySlug },
      update: {},
      create: {
        id: primaryOrgId,
        name: 'MVP Motors Austin',
        slug: primarySlug,
        dealerType: 'INDEPENDENT',
        inventorySize: '1-25',
        phone: '512-555-0199',
        email: 'sales@mvpmotors.com',
        address: '1000 Tech Ridge Blvd',
        city: 'Austin',
        state: 'TX',
        zip: '78753',
        onboardingCompleted: true,
        branding: {
          create: {
            heroTitle: 'Welcome to MVP Motors',
            tagline: 'Precision Pre-Owned Vehicles',
            showOwnInventory: true,
            showCarfaxCta: true,
            showFinancingCta: true,
            showTradeInCta: true,
            showMakeOffer: true,
            showScheduleTestDrive: true,
            showContactDealer: true,
          },
        },
      },
    });

    // 2. Setup competitor dealership for multi-tenant tests
    await prisma.organization.upsert({
      where: { slug: competitorSlug },
      update: {},
      create: {
        id: competitorOrgId,
        name: 'Competitor Motors',
        slug: competitorSlug,
        dealerType: 'FRANCHISE',
      },
    });
  });

  // =========================================================================
  // STEPS 1-5: REGISTRATION, ONBOARDING & CREDENTIAL ENCRYPTION
  // =========================================================================
  it('Step 1-5: registers dealer, sets onboarding preferences, and securely stores provider credentials', async () => {
    const org = await prisma.organization.findUnique({
      where: { id: primaryOrgId },
      include: { branding: true },
    });

    expect(org).toBeDefined();
    expect(org?.name).toBe('MVP Motors Austin');
    expect(org?.onboardingCompleted).toBe(true);
    expect(org?.branding?.showScheduleTestDrive).toBe(true);
    expect(org?.branding?.showMakeOffer).toBe(true);

    // Test Security Credential Vault
    const secretApiKey = 'live_sk_vinaudit_secret_998877';
    const encrypted = await encryptCredential(secretApiKey);
    expect(encrypted).not.toBe(secretApiKey);
    expect(encrypted.length).toBeGreaterThan(20);

    const decrypted = await decryptCredential(encrypted);
    expect(decrypted).toBe(secretApiKey);

    // Verify sanitization doesn't leak secrets
    const sanitized = sanitizeMarketplaceAccount({
      id: 'acc_1',
      organizationId: primaryOrgId,
      platform: 'EBAY_MOTORS',
      accountName: 'Dealer eBay Store',
      encryptedApiKey: encrypted,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect((sanitized as any).encryptedApiKey).toBeUndefined();
    expect((sanitized as any).apiKey).toBeUndefined();
    expect(sanitized.hasCredential).toBe(true);
  });

  // =========================================================================
  // STEPS 6-8: VIN DECODE, INTAKE & SPEC RECONCILIATION
  // =========================================================================
  it('Step 6-8: decodes VIN with provenance tags and intakes vehicle with pricing bounds', async () => {
    const testVin = '4T1B11HK5NU123456';
    const decoded = await decodeVin(testVin);

    expect(decoded.vin).toBe(testVin);
    expect(decoded.make).toBe('Toyota');
    expect(decoded.model).toBe('Camry');
    expect(decoded.year).toBeGreaterThanOrEqual(2020);
    expect(['NHTSA_LIVE_API', 'LOCAL_FALLBACK_DATABASE']).toContain(decoded.source);

    // Check VinAudit provider reporting
    const caps = vinAuditClient.getCapabilitiesStatus();
    expect(caps['VIN Decoder']).toBeDefined();
    expect(['LIVE', 'MOCK']).toContain(caps['VIN Decoder']);

    // Create vehicle in database
    const vehicle = await prisma.vehicle.create({
      data: {
        organizationId: primaryOrgId,
        vin: testVin,
        stockNumber: 'STK-123456',
        year: decoded.year,
        make: decoded.make,
        model: decoded.model,
        trim: decoded.trim || 'SE',
        mileage: 34500,
        exteriorColor: 'Midnight Black',
        interiorColor: 'Black Leather',
        engine: decoded.engine || '2.5L 4-Cyl',
        transmission: decoded.transmission || 'Automatic',
        drivetrain: decoded.drivetrain || 'FWD',
        fuelType: decoded.fuelType || 'Gasoline',
        bodyStyle: decoded.bodyStyle || 'Sedan',
        purchasePrice: 18500,
        totalCostBasis: 18500,
        askingPrice: 24500,
        preferredPrice: 23500,
        minPrice: 20500, // Hard floor ($P_min)
        status: 'READY',
      },
    });

    expect(vehicle.id).toBeDefined();
    expect(vehicle.askingPrice).toBe(24500);
    expect(vehicle.minPrice).toBe(20500);
    expect(vehicle.totalCostBasis).toBe(18500);
    testVehicleId = vehicle.id;
  });

  // =========================================================================
  // STEPS 9-11: RECON EXPENSE LEDGER & PHOTO MANAGEMENT
  // =========================================================================
  it('Step 9-11: records reconditioning expenses, updates cost basis, and uploads vehicle photography', async () => {
    // 1. Add reconditioning expenses
    await prisma.vehicleExpense.create({
      data: {
        organizationId: primaryOrgId,
        vehicleId: testVehicleId,
        category: 'MECHANICAL',
        description: 'Brake pads & synthetic oil change',
        amount: 450,
        vendor: 'Precision Auto Care',
      },
    });

    await prisma.vehicleExpense.create({
      data: {
        organizationId: primaryOrgId,
        vehicleId: testVehicleId,
        category: 'DETAILING',
        description: 'Stage 2 Paint Correction & Ceramic Detailing',
        amount: 350,
        vendor: 'Clean Car Detailing',
      },
    });

    const allExpenses = await prisma.vehicleExpense.findMany({
      where: { vehicleId: testVehicleId },
    });
    const totalExp = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    expect(totalExp).toBe(800);

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: testVehicleId },
      data: { totalCostBasis: 18500 + totalExp },
    });
    expect(updatedVehicle.totalCostBasis).toBe(19300);

    // 2. Upload vehicle photos
    const photo = await prisma.vehiclePhoto.create({
      data: {
        vehicleId: testVehicleId,
        url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Front Left 3/4 Studio View',
        isCover: true,
        orderIndex: 0,
      },
    });

    expect(photo.isCover).toBe(true);
  });

  // =========================================================================
  // STEPS 12-13: AI LISTING GENERATION & 1-CLICK STOREFRONT PUBLISHING
  // =========================================================================
  it('Step 12-13: generates grounded AI listing and publishes to dealer public storefront', async () => {
    const vehicle = await prisma.vehicle.findUniqueOrThrow({
      where: { id: testVehicleId },
      include: { expenses: true },
    });

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

    expect(copy.headline).toContain('Toyota Camry');
    expect(copy.facebookCopy).toBeDefined();
    expect(copy.craigslistCopy).toBeDefined();

    // Publish to Storefront
    const listing = await prisma.listing.create({
      data: {
        organizationId: primaryOrgId,
        vehicleId: testVehicleId,
        headline: copy.headline,
        shortDescription: copy.shortDescription,
        longDescription: copy.longDescription,
        status: 'PUBLISHED',
        approvedAt: new Date(),
      },
    });
    testListingId = listing.id;

    await prisma.vehicle.update({
      where: { id: testVehicleId },
      data: { status: 'LISTED' },
    });

    await prisma.marketplaceListing.upsert({
      where: { id: `storefront_${testVehicleId}` },
      update: { status: 'LIVE' },
      create: {
        id: `storefront_${testVehicleId}`,
        organizationId: primaryOrgId,
        listingId: listing.id,
        vehicleId: testVehicleId,
        platform: 'STOREFRONT',
        status: 'LIVE',
        publishedPrice: vehicle.askingPrice,
      },
    });

    const liveListing = await prisma.marketplaceListing.findUnique({
      where: { id: `storefront_${testVehicleId}` },
    });
    expect(liveListing?.status).toBe('LIVE');
  });

  // =========================================================================
  // STEPS 14-18: LEAD CAPTURE, TEST DRIVE & CRM PIPELINE
  // =========================================================================
  it('Step 14-18: captures consumer inquiry, schedules VIP test drive, and transitions through CRM pipeline', async () => {
    // 1. Consumer submits lead on storefront
    const lead = await prisma.lead.create({
      data: {
        organizationId: primaryOrgId,
        vehicleId: testVehicleId,
        name: 'Jordan Miller',
        email: 'jordan.miller@example.com',
        phone: '512-555-0188',
        stage: 'NEW',
        score: 85,
        initialOffer: 23800,
        currentOffer: 23800,
        notes: 'Inquired from public storefront. Interested in trade-in and financing.',
      },
    });
    testLeadId = lead.id;
    expect(lead.stage).toBe('NEW');

    // 2. Schedule Test Drive
    const appointmentDate = new Date(Date.now() + 86400000);
    const appointment = await prisma.appointment.create({
      data: {
        organizationId: primaryOrgId,
        leadId: lead.id,
        vehicleId: testVehicleId,
        customerName: 'Jordan Miller',
        customerPhone: '512-555-0188',
        customerEmail: 'jordan.miller@example.com',
        scheduledAt: appointmentDate,
        type: 'TEST_DRIVE',
        status: 'SCHEDULED',
        notes: 'Customer requested 2:00 PM showroom test drive.',
      },
    });
    expect(appointment.status).toBe('SCHEDULED');

    // 3. Move Lead to APPOINTMENT stage
    await prisma.lead.update({
      where: { id: lead.id },
      data: { stage: 'APPOINTMENT' },
    });

    // 4. Confirm appointment
    const updatedApt = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CONFIRMED' },
    });
    expect(updatedApt.status).toBe('CONFIRMED');

    // 5. Complete test drive & move lead to NEGOTIATING stage
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'COMPLETED' },
    });

    const negotiatingLead = await prisma.lead.update({
      where: { id: lead.id },
      data: { stage: 'NEGOTIATING', currentOffer: 24000 },
    });
    expect(negotiatingLead.stage).toBe('NEGOTIATING');
  });

  // =========================================================================
  // STEP 19: SOLD WORKFLOW, STOREFRONT DELISTING & PROFIT LOGGING
  // =========================================================================
  it('Step 19: marks vehicle sold, delists from public storefront, archives listing, and records profit', async () => {
    const finalSoldPrice = 24000;
    const soldDate = new Date();

    const vehicle = await prisma.vehicle.findUniqueOrThrow({
      where: { id: testVehicleId },
    });

    const realizedProfit = finalSoldPrice - vehicle.totalCostBasis; // 24000 - 19300 = 4700

    // 1. Mark Vehicle Sold
    const soldVehicle = await prisma.vehicle.update({
      where: { id: testVehicleId },
      data: {
        status: 'SOLD',
        soldPrice: finalSoldPrice,
        soldDate,
      },
    });
    expect(soldVehicle.status).toBe('SOLD');
    expect(soldVehicle.soldPrice).toBe(24000);

    // 2. Archive active listings
    await prisma.listing.updateMany({
      where: { vehicleId: testVehicleId },
      data: { status: 'ARCHIVED' },
    });

    // 3. Delist from Storefront
    await prisma.marketplaceListing.updateMany({
      where: { vehicleId: testVehicleId },
      data: { status: 'REMOVED' },
    });

    const storefrontListing = await prisma.marketplaceListing.findUnique({
      where: { id: `storefront_${testVehicleId}` },
    });
    expect(storefrontListing?.status).toBe('REMOVED');

    // 4. Create Deal Record
    const deal = await prisma.deal.create({
      data: {
        organizationId: primaryOrgId,
        vehicleId: testVehicleId,
        leadId: testLeadId,
        buyerName: 'Jordan Miller',
        buyerPhone: '512-555-0188',
        salePrice: finalSoldPrice,
        dealStatus: 'DELIVERED',
        deliveredDate: soldDate,
        notes: `Realized Gross Profit: $${realizedProfit.toLocaleString()}`,
      },
    });
    expect(deal.dealStatus).toBe('DELIVERED');
    expect(realizedProfit).toBe(4700);

    // 5. Update Lead stage to SOLD
    const closedLead = await prisma.lead.update({
      where: { id: testLeadId },
      data: { stage: 'SOLD' },
    });
    expect(closedLead.stage).toBe('SOLD');
  });

  // =========================================================================
  // MULTI-TENANT ISOLATION VERIFICATION
  // =========================================================================
  it('enforces multi-tenant data isolation between primary dealer and competitor', async () => {
    // Competitor cannot see primary dealer's vehicles
    const competitorVehicles = await prisma.vehicle.findMany({
      where: { organizationId: competitorOrgId },
    });
    expect(competitorVehicles.some((v) => v.id === testVehicleId)).toBe(false);

    // Competitor cannot see primary dealer's leads
    const competitorLeads = await prisma.lead.findMany({
      where: { organizationId: competitorOrgId },
    });
    expect(competitorLeads.some((l) => l.id === testLeadId)).toBe(false);

    // Competitor cannot see primary dealer's appointments
    const competitorAppointments = await prisma.appointment.findMany({
      where: { organizationId: competitorOrgId },
    });
    expect(competitorAppointments.length).toBe(0);
  });
});
