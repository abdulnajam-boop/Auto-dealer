export interface ValuationInput {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  conditionGrade: 'EXCELLENT' | 'CLEAN' | 'AVERAGE' | 'ROUGH';
  sourceChannel?: string;
  currentBid?: number;
  buyFee?: number;
  transportEstimate?: number;
  repairEstimate?: number;
}

export interface ValuationResult {
  estimatedMarketValue: number;
  targetAcquisitionPrice: number;
  maxRecommendedBid: number;
  expectedSalePrice: number;
  buyFee: number;
  transportEstimate: number;
  repairEstimate: number;
  totalAcquisitionCost: number;
  expectedGrossProfit: number;
  expectedRoiPercent: number;
  demandScore: number; // 1-100
  opportunityScore: number; // 0-100
  daysToSellEstimate: number;
  recommendation: 'STRONG_BUY' | 'BUY' | 'WATCH' | 'PASS';
  confidenceScore: number;
  comparableListings: Array<{
    title: string;
    price: number;
    mileage: number;
    dealer: string;
    distanceMiles: number;
    daysOnMarket: number;
  }>;
}

export function calculateVehicleOpportunity(input: ValuationInput): ValuationResult {
  const currentYear = 2026;
  const age = Math.max(1, currentYear - input.year);
  
  // Base Market Retail Benchmarks (based on trim and segment)
  let baseBenchmark = 28500;
  const upperMake = input.make?.toUpperCase() || '';
  const upperModel = input.model?.toUpperCase() || '';

  if (['BMW', 'MERCEDES-BENZ', 'AUDI', 'PORSCHE', 'LEXUS'].includes(upperMake)) {
    baseBenchmark = 46000;
  } else if (['FORD', 'CHEVROLET', 'RAM', 'GMC'].includes(upperMake) && (upperModel.includes('150') || upperModel.includes('SILVERADO') || upperModel.includes('SIERRA'))) {
    baseBenchmark = 52000;
  } else if (upperMake === 'TOYOTA' && upperModel.includes('CAMRY')) {
    baseBenchmark = 29500;
  } else if (upperMake === 'HONDA' && upperModel.includes('ACCORD')) {
    baseBenchmark = 29000;
  } else if (['TOYOTA', 'HONDA', 'SUBARU', 'MAZDA'].includes(upperMake)) {
    baseBenchmark = 31000;
  } else if (['NISSAN', 'HYUNDAI', 'KIA'].includes(upperMake)) {
    baseBenchmark = 24000;
  }

  // Realistic annual depreciation (approx 5-7% per year for high residual brands like Toyota/Honda, 9-11% for others)
  const annualDeprecRate = ['TOYOTA', 'HONDA', 'SUBARU', 'LEXUS', 'PORSCHE'].includes(upperMake) ? 0.94 : 0.90;
  const depreciationFactor = Math.pow(annualDeprecRate, age);
  let estimatedRetail = baseBenchmark * depreciationFactor;

  // Mileage Adjustment (Standard ~12,500 miles/year; $0.06 per mile delta)
  const expectedMileage = age * 12500;
  const mileageDelta = input.mileage - expectedMileage;
  const mileageAdjustment = mileageDelta * -0.06;
  estimatedRetail += mileageAdjustment;

  // Condition Multiplier
  const conditionMultipliers: Record<string, number> = {
    EXCELLENT: 1.05,
    CLEAN: 1.0,
    AVERAGE: 0.90,
    ROUGH: 0.78,
  };
  const condMultiplier = conditionMultipliers[input.conditionGrade] || 1.0;
  estimatedRetail = Math.round(estimatedRetail * condMultiplier);

  // Expected sale price (typically 98% of estimated retail)
  const expectedSalePrice = Math.round(estimatedRetail * 0.98);

  // Reconditioning and fees
  const repairEstimate = input.repairEstimate !== undefined && input.repairEstimate >= 0 
    ? input.repairEstimate 
    : input.conditionGrade === 'ROUGH' ? 2200 : input.conditionGrade === 'AVERAGE' ? 1200 : 600;
    
  const transportEstimate = input.transportEstimate !== undefined && input.transportEstimate >= 0
    ? input.transportEstimate
    : 350;

  const currentBid = input.currentBid !== undefined && input.currentBid > 0 
    ? input.currentBid 
    : Math.round(expectedSalePrice * 0.76);
  
  const buyFee = input.buyFee !== undefined && input.buyFee >= 0 
    ? input.buyFee 
    : Math.round(currentBid * 0.035 + 100);

  // Total estimated acquisition cost
  const totalAcquisitionCost = currentBid + buyFee + transportEstimate + repairEstimate;
  const expectedGrossProfit = expectedSalePrice - totalAcquisitionCost;
  const expectedRoiPercent = totalAcquisitionCost > 0 
    ? Number(((expectedGrossProfit / totalAcquisitionCost) * 100).toFixed(1)) 
    : 0;

  // Target acquisition and max bid formulas
  const targetProfit = Math.max(2800, Math.round(expectedSalePrice * 0.13));
  const targetAcquisitionPrice = Math.max(1000, expectedSalePrice - targetProfit - transportEstimate - repairEstimate - buyFee);
  const maxRecommendedBid = Math.max(1000, expectedSalePrice - 1800 - transportEstimate - repairEstimate - buyFee);

  // Market Demand & Days to Sell
  let demandScore = 78;
  if (['TOYOTA', 'HONDA', 'SUBARU', 'LEXUS', 'PORSCHE'].includes(upperMake)) demandScore = 88;
  if (input.mileage < 40000) demandScore += 6;
  if (input.conditionGrade === 'ROUGH') demandScore -= 15;
  demandScore = Math.min(98, Math.max(35, demandScore));

  const daysToSellEstimate = Math.max(14, Math.round(52 - (demandScore * 0.38)));

  // Opportunity Score (0-100)
  let profitScore = Math.min(100, Math.max(0, (expectedGrossProfit / 3500) * 100));
  let roiScore = Math.min(100, Math.max(0, (expectedRoiPercent / 18) * 100));
  let speedScore = Math.min(100, Math.max(0, ((45 - daysToSellEstimate) / 30) * 100));

  let opportunityScore = Math.round(
    profitScore * 0.4 + roiScore * 0.3 + demandScore * 0.2 + speedScore * 0.1
  );
  opportunityScore = Math.min(99, Math.max(10, opportunityScore));

  let recommendation: ValuationResult['recommendation'] = 'WATCH';
  if (opportunityScore >= 78 && expectedGrossProfit >= 2500) {
    recommendation = 'STRONG_BUY';
  } else if (opportunityScore >= 60 && expectedGrossProfit >= 1500) {
    recommendation = 'BUY';
  } else if (opportunityScore < 45 || expectedGrossProfit < 800) {
    recommendation = 'PASS';
  }

  // Comparable Listings Simulation
  const comparableListings = [
    {
      title: `${input.year} ${input.make} ${input.model} ${input.trim || ''}`,
      price: Math.round(expectedSalePrice * 1.02),
      mileage: Math.round(input.mileage * 0.94),
      dealer: 'AutoNation Direct',
      distanceMiles: 14,
      daysOnMarket: 18,
    },
    {
      title: `${input.year} ${input.make} ${input.model} ${input.trim || ''}`,
      price: Math.round(expectedSalePrice * 0.99),
      mileage: Math.round(input.mileage * 1.05),
      dealer: 'CarMax Premier',
      distanceMiles: 28,
      daysOnMarket: 24,
    },
    {
      title: `${input.year} ${input.make} ${input.model} ${input.trim || ''}`,
      price: Math.round(expectedSalePrice * 0.97),
      mileage: Math.round(input.mileage * 1.12),
      dealer: 'Metro Motors',
      distanceMiles: 8,
      daysOnMarket: 39,
    },
  ];

  return {
    estimatedMarketValue: Math.round(estimatedRetail),
    targetAcquisitionPrice,
    maxRecommendedBid,
    expectedSalePrice,
    buyFee,
    transportEstimate,
    repairEstimate,
    totalAcquisitionCost,
    expectedGrossProfit,
    expectedRoiPercent,
    demandScore,
    opportunityScore,
    daysToSellEstimate,
    recommendation,
    confidenceScore: 92,
    comparableListings,
  };
}
