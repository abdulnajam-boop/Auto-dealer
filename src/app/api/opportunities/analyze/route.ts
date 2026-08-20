import { NextResponse } from 'next/server';
import { getTenantContext } from '@/lib/tenant';
import { calculateVehicleOpportunity } from '@/lib/valuation/engine';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await request.json();
    const {
      vin,
      year,
      make,
      model,
      trim,
      mileage,
      conditionGrade,
      sourceChannel,
      sourceLocation,
      currentBid,
      buyFee,
      transportEstimate,
      repairEstimate,
      saveToDatabase,
    } = body;

    if (!vin || !year || !make || !model) {
      return NextResponse.json({ error: 'VIN, Year, Make, Model are required' }, { status: 400 });
    }

    const valuation = calculateVehicleOpportunity({
      vin,
      year: parseInt(year, 10),
      make,
      model,
      trim,
      mileage: parseInt(mileage || '40000', 10),
      conditionGrade: conditionGrade || 'CLEAN',
      sourceChannel: sourceChannel || 'MANHEIM',
      currentBid: currentBid ? parseFloat(currentBid) : undefined,
      buyFee: buyFee ? parseFloat(buyFee) : undefined,
      transportEstimate: transportEstimate ? parseFloat(transportEstimate) : undefined,
      repairEstimate: repairEstimate ? parseFloat(repairEstimate) : undefined,
    });

    let savedOpportunity = null;
    if (saveToDatabase) {
      savedOpportunity = await prisma.opportunity.create({
        data: {
          organizationId: tenant.organizationId,
          vin: vin.toUpperCase(),
          year: parseInt(year, 10),
          make,
          model,
          trim,
          mileage: parseInt(mileage || '40000', 10),
          conditionGrade: conditionGrade || 'CLEAN',
          sourceChannel: sourceChannel || 'MANHEIM',
          sourceLocation: sourceLocation || 'Manheim Dallas',
          currentBid: valuation.buyFee ? (currentBid ? parseFloat(currentBid) : valuation.targetAcquisitionPrice) : 0,
          buyFee: valuation.buyFee,
          transportEstimate: valuation.transportEstimate,
          repairEstimate: valuation.repairEstimate,
          estimatedMarketValue: valuation.estimatedMarketValue,
          targetAcquisitionPrice: valuation.targetAcquisitionPrice,
          maxRecommendedBid: valuation.maxRecommendedBid,
          expectedSalePrice: valuation.expectedSalePrice,
          expectedGrossProfit: valuation.expectedGrossProfit,
          expectedRoiPercent: valuation.expectedRoiPercent,
          daysToSellEstimate: valuation.daysToSellEstimate,
          demandScore: valuation.demandScore,
          opportunityScore: valuation.opportunityScore,
          recommendation: valuation.recommendation,
          status: 'BIDDING',
          valuationDataJson: JSON.stringify(valuation.comparableListings),
        },
      });

      // Also create AuctionItem
      await prisma.auctionItem.create({
        data: {
          organizationId: tenant.organizationId,
          opportunityId: savedOpportunity.id,
          auctionPlatform: sourceChannel || 'MANHEIM',
          auctionDate: new Date(Date.now() + 86400000 * 2),
          startingBid: valuation.targetAcquisitionPrice * 0.9,
          currentBid: valuation.targetAcquisitionPrice,
          maxBid: valuation.maxRecommendedBid,
          status: 'BID_PLACED',
          notes: `Evaluated by Opportunity Intelligence. Score: ${valuation.opportunityScore}/100. Recommendation: ${valuation.recommendation}`,
        },
      });
    }

    return NextResponse.json({ valuation, savedOpportunity });
  } catch (error: any) {
    console.error('Error analyzing opportunity:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
