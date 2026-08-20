import { describe, it, expect } from 'vitest';
import { calculateVehicleOpportunity } from '../src/lib/valuation/engine';

describe('Vehicle Intelligence Valuation Engine', () => {
  it('calculates accurate opportunity metrics for a high-demand vehicle', () => {
    const result = calculateVehicleOpportunity({
      vin: '4T1B11HK5NU109283',
      year: 2022,
      make: 'Toyota',
      model: 'Camry',
      trim: 'SE',
      mileage: 28000,
      conditionGrade: 'CLEAN',
      sourceChannel: 'MANHEIM',
      currentBid: 18500,
      buyFee: 650,
      transportEstimate: 350,
      repairEstimate: 600,
    });

    expect(result.estimatedMarketValue).toBeGreaterThan(20000);
    expect(result.maxRecommendedBid).toBeGreaterThan(15000);
    expect(result.expectedGrossProfit).toBeGreaterThan(2000);
    expect(result.opportunityScore).toBeGreaterThanOrEqual(70);
    expect(['STRONG_BUY', 'BUY']).toContain(result.recommendation);
    expect(result.comparableListings.length).toBeGreaterThanOrEqual(3);
  });

  it('marks a high-mileage rough-condition car with low margin as WATCH or PASS', () => {
    const result = calculateVehicleOpportunity({
      vin: '1FA6P8CF8G5109283',
      year: 2016,
      make: 'Ford',
      model: 'Mustang',
      trim: 'EcoBoost',
      mileage: 125000,
      conditionGrade: 'ROUGH',
      sourceChannel: 'COPART',
      currentBid: 12000,
      repairEstimate: 2500,
    });

    expect(result.opportunityScore).toBeLessThan(75);
    expect(['WATCH', 'PASS']).toContain(result.recommendation);
  });
});
