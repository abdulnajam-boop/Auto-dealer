/**
 * VinAudit API Types and Data Contracts
 * Server-side only contracts for official VinAudit endpoints.
 */

// 1. VIN Decoder / Specifications
export interface VinAuditSpecRequest {
  vin: string;
}

export interface VinAuditSpecResponse {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  bodyStyle?: string;
  doors?: number;
  cityMpg?: number;
  highwayMpg?: number;
  standardFeatures?: string[];
  specs?: Record<string, string | number | boolean>;
  isMocked?: boolean;
}

// 2. Plate-to-VIN
export interface PlateToVinRequest {
  plate: string;
  state: string;
}

export interface PlateToVinResponse {
  plate: string;
  state: string;
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  isMocked?: boolean;
}

// 3. Vehicle History
export interface VinAuditHistoryRequest {
  vin: string;
  organizationId?: string;
}

export interface VinAuditHistoryRecord {
  vin: string;
  reportId: string;
  cleanTitle: boolean;
  salvage: boolean;
  junk: boolean;
  floodDamage: boolean;
  rebuilt: boolean;
  odometerRollback: boolean;
  lastReportedMileage?: number;
  accidentCount: number;
  ownerCount: number;
  serviceRecords: number;
  recallCount: number;
  titleStateHistory: string[];
  reportUrl?: string;
  isMocked?: boolean;
}

// 4. Market Value
export interface VinAuditMarketValueRequest {
  vin: string;
  mileage?: number;
  zip?: string;
  period?: number;
}

export interface VinAuditMarketValueResponse {
  vin: string;
  mileage: number;
  zip: string;
  belowMarketPrice: number;
  averageMarketPrice: number;
  aboveMarketPrice: number;
  tradeInValue: number;
  wholesaleValue: number;
  privatePartyValue: number;
  confidenceScore: number; // 0-100
  sampleCount: number;
  lastUpdated: string;
  isMocked?: boolean;
}

// 5. Market Listings
export interface VinAuditListingsRequest {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  zip?: string;
  radiusMiles?: number;
  limit?: number;
}

export interface ComparableListing {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  price: number;
  dealerName: string;
  location: string;
  distanceMiles?: number;
  listingUrl?: string;
  daysListed: number;
  source: string;
}

export interface VinAuditListingsResponse {
  query: VinAuditListingsRequest;
  totalFound: number;
  listings: ComparableListing[];
  isMocked?: boolean;
}

// 6. 5-Year Ownership Cost
export interface VinAuditOwnershipCostRequest {
  vin: string;
  annualMileage?: number;
  state?: string;
}

export interface VinAuditOwnershipCostResponse {
  vin: string;
  fiveYearTotalCost: number;
  depreciationCost: number;
  fuelCost: number;
  insuranceCost: number;
  maintenanceCost: number;
  repairsCost: number;
  taxesAndFees: number;
  yearlyBreakdown: Array<{
    year: number;
    depreciation: number;
    fuel: number;
    insurance: number;
    maintenance: number;
    repairs: number;
    total: number;
  }>;
  isMocked?: boolean;
}

// 7. Vehicle Images
export interface VinAuditImagesRequest {
  vin: string;
  angle?: 'front-left' | 'front-right' | 'rear' | 'side' | 'interior';
}

export interface VinAuditImagesResponse {
  vin: string;
  photos: Array<{
    url: string;
    thumbnailUrl?: string;
    caption: string;
    viewAngle: string;
  }>;
  isMocked?: boolean;
}

// 8. Vehicle Background Removal
export interface BackgroundRemovalRequest {
  imageUrl: string;
  organizationId?: string;
  vehicleId?: string;
}

export interface BackgroundRemovalResponse {
  originalImageUrl: string;
  processedImageUrl: string;
  removedAt: string;
  isMocked?: boolean;
}

// Provider Usage Tracking
export interface ProviderUsageMetric {
  organizationId?: string;
  provider: 'VINAUDIT' | 'CARFAX' | 'AUTOCHECK' | 'NHTSA';
  endpoint: string;
  vin?: string;
  status: 'SUCCESS' | 'ERROR' | 'CACHE_HIT';
  costEstimateCents: number;
  metadata?: Record<string, unknown>;
}
