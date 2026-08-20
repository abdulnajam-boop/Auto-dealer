export type MarketplacePlatform =
  | 'STOREFRONT'
  | 'FACEBOOK'
  | 'CRAIGSLIST'
  | 'EBAY_MOTORS'
  | 'AUTOTRADER'
  | 'CARS_COM'
  | 'CARGURUS';

export type MarketplaceStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'LIVE'
  | 'FAILED'
  | 'EXPIRED'
  | 'REMOVED';

export interface VehicleData {
  id: string;
  vin: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  mileage: number;
  exteriorColor: string;
  interiorColor?: string | null;
  engine?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  fuelType?: string | null;
  bodyStyle?: string | null;
  askingPrice: number;
  status: string;
  photos?: Array<{ url: string }>;
}

export interface ListingData {
  id: string;
  headline: string;
  shortDescription: string;
  longDescription: string;
  featureBulletsJson?: string | null;
  facebookCopy?: string | null;
  craigslistCopy?: string | null;
  suggestedAskingPrice?: number;
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  externalUrl?: string;
  errorMessage?: string;
  status: MarketplaceStatus;
  platform: MarketplacePlatform;
  timestamp: Date;
}

export interface MarketplaceAdapter {
  platformId: MarketplacePlatform;
  displayName: string;
  supportsAutoPublish: boolean;
  requiresManualPosting: boolean;
  validateVehicle(vehicle: VehicleData): { valid: boolean; errors: string[] };
  publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult>;
  update(vehicle: VehicleData, listing: ListingData, externalId: string): Promise<{ success: boolean; errorMessage?: string }>;
  remove(vehicleId: string, externalId?: string | null): Promise<{ success: boolean; errorMessage?: string }>;
  getStatus(externalId: string): Promise<MarketplaceStatus>;
}
