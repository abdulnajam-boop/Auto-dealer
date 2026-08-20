import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/lib/prisma';
import { calculateVehicleOpportunity } from '../src/lib/valuation/engine';
import { generateVehicleListing } from '../src/lib/ai/copywriter';
import { publishEverywhere, delistVehicleEverywhere } from '../src/lib/marketplaces/orchestrator';
import { processSalesConversation } from '../src/lib/ai/sales-agent';
import { processDealerExecutiveQuery } from '../src/lib/ai/executive-assistant';

describe('DealerOS Complete End-to-End Sales Lifecycle', () => {
  const orgId = 'org_apex_motors';

  beforeAll(async () => {
    // Ensure test organization exists
    await prisma.organization.upsert({
      where: { slug: 'apex-motors' },
      update: {},
      create: {
        id: orgId,
        name: 'Apex Auto Gallery',
        slug: 'apex-motors',
        settingsJson: '{}',
      },
    });
  });

  it('executes complete 17-step dealership operating lifecycle from sourcing to sale, delist, and profit calculation', async () => {
    // =========================================================================
    // STEP 1: FIND VEHICLE & ANALYZE OPPORTUNITY (Vehicle Intelligence Engine)
    // =========================================================================
    const valuation = calculateVehicleOpportunity({
      vin: '1HGCR2F83MA999888',
      year: 2021,
      make: 'Honda',
      model: 'Accord',
      trim: 'Sport 2.0T',
      mileage: 32000,
      conditionGrade: 'CLEAN',
      sourceChannel: 'MANHEIM',
      currentBid: 19500,
      buyFee: 650,
      transportEstimate: 350,
      repairEstimate: 500,
    });

    expect(valuation.estimatedMarketValue).toBeGreaterThan(20000);
    expect(valuation.maxRecommendedBid).toBeGreaterThan(16000);
    expect(valuation.opportunityScore).toBeGreaterThanOrEqual(60);
    expect(['STRONG_BUY', 'BUY']).toContain(valuation.recommendation);
    expect(valuation.comparableListings.length).toBeGreaterThanOrEqual(3);

    const opp = await prisma.opportunity.create({
      data: {
        organizationId: orgId,
        vin: '1HGCR2F83MA999888',
        year: 2021,
        make: 'Honda',
        model: 'Accord',
        trim: 'Sport 2.0T',
        mileage: 32000,
        conditionGrade: 'CLEAN',
        sourceChannel: 'MANHEIM',
        currentBid: 19500,
        buyFee: 650,
        transportEstimate: 350,
        repairEstimate: 500,
        estimatedMarketValue: valuation.estimatedMarketValue,
        targetAcquisitionPrice: valuation.targetAcquisitionPrice,
        maxRecommendedBid: valuation.maxRecommendedBid,
        expectedSalePrice: valuation.expectedSalePrice,
        expectedGrossProfit: valuation.expectedGrossProfit,
        expectedRoiPercent: valuation.expectedRoiPercent,
        opportunityScore: valuation.opportunityScore,
        recommendation: valuation.recommendation,
        status: 'WON',
      },
    });
    expect(opp.id).toBeDefined();

    // =========================================================================
    // STEP 2 & 3: BUY VEHICLE, INTAKE TO INVENTORY & EXPENSE COST ACCOUNTING
    // =========================================================================
    const totalCostBasis = opp.currentBid + opp.buyFee + opp.transportEstimate + opp.repairEstimate;

    const vehicle = await prisma.vehicle.create({
      data: {
        organizationId: orgId,
        vin: opp.vin,
        stockNumber: 'AP-E2E-100',
        year: opp.year,
        make: opp.make,
        model: opp.model,
        trim: opp.trim,
        mileage: opp.mileage,
        exteriorColor: 'Sonic Gray Pearl',
        interiorColor: 'Black Leather',
        engine: '2.0L Turbo 252hp',
        transmission: '10-Speed Automatic',
        drivetrain: 'FWD',
        purchaseDate: new Date(),
        purchaseSource: opp.sourceChannel,
        purchasePrice: opp.currentBid,
        totalCostBasis,
        askingPrice: 25900,
        preferredPrice: 24900,
        minPrice: 23800,
        status: 'READY',
      },
    });
    expect(vehicle.id).toBeDefined();

    // Itemize Expenses
    await prisma.vehicleExpense.createMany({
      data: [
        { organizationId: orgId, vehicleId: vehicle.id, category: 'ACQUISITION', description: 'Manheim Auction Buy Price', amount: 19500 },
        { organizationId: orgId, vehicleId: vehicle.id, category: 'AUCTION_FEE', description: 'Manheim Buyer Fee', amount: 650 },
        { organizationId: orgId, vehicleId: vehicle.id, category: 'TRANSPORTATION', description: 'Enclosed Carrier Hauling', amount: 350 },
        { organizationId: orgId, vehicleId: vehicle.id, category: 'PARTS', description: 'Brake Pads & Service', amount: 500 },
      ],
    });

    expect(vehicle.totalCostBasis).toBe(21000);
    expect(vehicle.askingPrice - vehicle.totalCostBasis).toBe(4900); // $4,900 projected margin

    // =========================================================================
    // STEP 4 & 5: GENERATE AI LISTING & DEALER APPROVES
    // =========================================================================
    const vehicleWithExpenses = await prisma.vehicle.findUniqueOrThrow({
      where: { id: vehicle.id },
      include: { expenses: true },
    });

    const listingCopy = await generateVehicleListing({
      year: vehicleWithExpenses.year,
      make: vehicleWithExpenses.make,
      model: vehicleWithExpenses.model,
      trim: vehicleWithExpenses.trim,
      mileage: vehicleWithExpenses.mileage,
      exteriorColor: vehicleWithExpenses.exteriorColor,
      interiorColor: vehicleWithExpenses.interiorColor,
      engine: vehicleWithExpenses.engine,
      transmission: vehicleWithExpenses.transmission,
      drivetrain: vehicleWithExpenses.drivetrain,
      askingPrice: vehicleWithExpenses.askingPrice,
      stockNumber: vehicleWithExpenses.stockNumber,
      reconditioningNotes: vehicleWithExpenses.expenses.map((e) => `${e.category}: ${e.description}`),
    });

    expect(listingCopy.headline).toBeDefined();
    expect(listingCopy.facebookCopy).toContain('Sonic Gray Pearl');
    expect(listingCopy.featureBullets.length).toBeGreaterThanOrEqual(3);

    const listing = await prisma.listing.create({
      data: {
        organizationId: orgId,
        vehicleId: vehicle.id,
        headline: listingCopy.headline,
        shortDescription: listingCopy.shortDescription,
        longDescription: listingCopy.longDescription,
        featureBulletsJson: JSON.stringify(listingCopy.featureBullets),
        facebookCopy: listingCopy.facebookCopy,
        craigslistCopy: listingCopy.craigslistCopy,
        socialCopy: listingCopy.socialCopy,
        suggestedAskingPrice: listingCopy.suggestedAskingPrice,
        status: 'APPROVED',
      },
    });
    expect(listing.id).toBeDefined();

    // =========================================================================
    // STEP 6: PUBLISH TO ALL CONNECTED MARKETPLACES (Storefront, FB, Craigslist, eBay)
    // =========================================================================
    const publishResults = await publishEverywhere(orgId, vehicle.id, listing.id);

    expect(publishResults.length).toBeGreaterThanOrEqual(4);
    expect(publishResults.every((r) => r.success)).toBe(true);

    const liveMarketplaceListings = await prisma.marketplaceListing.findMany({
      where: { vehicleId: vehicle.id, status: 'LIVE' },
    });
    expect(liveMarketplaceListings.length).toBeGreaterThanOrEqual(4);

    // =========================================================================
    // STEP 7, 8, 9: RECEIVE BUYER MESSAGE & AI AUTONOMOUS NEGOTIATION
    // =========================================================================
    const conversation = await prisma.conversation.create({
      data: {
        organizationId: orgId,
        vehicleId: vehicle.id,
        buyerName: 'Lucas Vance (Buyer)',
        buyerPhone: '(512) 555-4499',
        buyerEmail: 'lucas.v@gmail.com',
        channel: 'STOREFRONT_CHAT',
        status: 'ACTIVE',
      },
    });

    const buyerInquiry = 'Hi! Would you accept $24,500 cash if I come in today?';

    const aiSalesOutput = await processSalesConversation({
      vehicle: {
        id: vehicle.id,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        trim: vehicle.trim,
        mileage: vehicle.mileage,
        askingPrice: vehicle.askingPrice,
        preferredPrice: vehicle.preferredPrice,
        minPrice: vehicle.minPrice,
        status: vehicle.status,
        exteriorColor: vehicle.exteriorColor,
      },
      buyerName: conversation.buyerName,
      incomingMessage: buyerInquiry,
      conversationHistory: [],
    });

    expect(aiSalesOutput.detectedIntent).toBe('OFFER');
    expect(aiSalesOutput.offeredPrice).toBe(24500);
    // $24,500 is >= minPrice ($23,800), so the AI can handle it cleanly
    expect(aiSalesOutput.requiresManagerApproval).toBe(false);

    // Create CRM Lead
    const lead = await prisma.lead.create({
      data: {
        organizationId: orgId,
        conversationId: conversation.id,
        vehicleId: vehicle.id,
        name: conversation.buyerName,
        phone: conversation.buyerPhone,
        email: conversation.buyerEmail,
        currentOffer: 24500,
        stage: 'NEGOTIATING',
        score: 88,
      },
    });
    expect(lead.id).toBeDefined();

    // =========================================================================
    // STEP 10: SCHEDULE VIP APPOINTMENT
    // =========================================================================
    const appointment = await prisma.appointment.create({
      data: {
        organizationId: orgId,
        leadId: lead.id,
        vehicleId: vehicle.id,
        customerName: lead.name,
        customerPhone: lead.phone,
        type: 'TEST_DRIVE',
        scheduledAt: new Date(Date.now() + 86400000),
        status: 'CONFIRMED',
      },
    });
    expect(appointment.id).toBeDefined();

    // =========================================================================
    // STEP 11: CREATE F&I DEAL & CONTRACT
    // =========================================================================
    const salePrice = 24500;
    const docFee = 499;
    const tax = Math.round(salePrice * 0.0625);
    const titleRegFee = 150;
    const totalDue = salePrice + docFee + tax + titleRegFee;
    const cashDown = 4500;
    const financedAmount = totalDue - cashDown;

    const deal = await prisma.deal.create({
      data: {
        organizationId: orgId,
        vehicleId: vehicle.id,
        leadId: lead.id,
        buyerName: lead.name,
        buyerPhone: lead.phone,
        salePrice,
        docFee,
        taxAmount: tax,
        titleRegFee,
        cashDownPayment: cashDown,
        financedAmount,
        aprRate: 6.49,
        loanTermMonths: 60,
        monthlyPayment: Math.round(financedAmount * 0.0195),
        totalDue,
        dealStatus: 'APPROVED',
      },
    });
    expect(deal.id).toBeDefined();

    // =========================================================================
    // STEP 12, 13, 14: DELIVER DEAL, SELL VEHICLE, DELIST EVERYWHERE, PROFIT CALC
    // =========================================================================
    // 1. Mark deal delivered
    await prisma.deal.update({
      where: { id: deal.id },
      data: {
        dealStatus: 'DELIVERED',
        deliveredDate: new Date(),
        fundedDate: new Date(),
      },
    });

    // 2. Mark vehicle sold
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        status: 'SOLD',
        soldPrice: deal.salePrice,
        soldDate: new Date(),
      },
    });

    // 3. Remove all active marketplace listings
    const delistResult = await delistVehicleEverywhere(orgId, vehicle.id);
    expect(delistResult.removedCount).toBeGreaterThanOrEqual(4);

    // Verify all active listings are REMOVED
    const remainingActiveListings = await prisma.marketplaceListing.findMany({
      where: { vehicleId: vehicle.id, status: 'LIVE' },
    });
    expect(remainingActiveListings.length).toBe(0);

    // 4. Calculate realized profit
    const finalSoldVehicle = await prisma.vehicle.findUniqueOrThrow({
      where: { id: vehicle.id },
    });
    const realizedProfit = (finalSoldVehicle.soldPrice || 0) - finalSoldVehicle.totalCostBasis;
    expect(realizedProfit).toBe(24500 - 21000); // Realized $3,500 Gross Profit!

    // =========================================================================
    // STEP 15: DEALER AI EXECUTIVE ASSISTANT QUERIES
    // =========================================================================
    const assistantResult = await processDealerExecutiveQuery({
      organizationId: orgId,
      query: 'What happened today and how much profit was realized?',
    });

    expect(assistantResult.answer).toBeDefined();
    expect(assistantResult.suggestedActions.length).toBeGreaterThanOrEqual(1);
  });
});
