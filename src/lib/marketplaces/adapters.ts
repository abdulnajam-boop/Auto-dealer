import {
  MarketplaceAdapter,
  MarketplacePlatform,
  MarketplaceStatus,
  PublishResult,
  VehicleData,
  ListingData,
} from './types';

// 1. Direct Storefront Adapter
export class StorefrontAdapter implements MarketplaceAdapter {
  platformId: MarketplacePlatform = 'STOREFRONT';
  displayName = 'Dealership Website Storefront';
  supportsAutoPublish = true;
  requiresManualPosting = false;

  validateVehicle(vehicle: VehicleData) {
    const errors: string[] = [];
    if (!vehicle.askingPrice || vehicle.askingPrice <= 0) errors.push('Vehicle asking price is required');
    if (!vehicle.vin) errors.push('VIN is required');
    return { valid: errors.length === 0, errors };
  }

  async publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult> {
    return {
      success: true,
      platform: this.platformId,
      externalId: vehicle.id,
      externalUrl: `/storefront/inventory/${vehicle.id}`,
      status: 'LIVE',
      timestamp: new Date(),
    };
  }

  async update(vehicle: VehicleData, listing: ListingData, externalId: string) {
    return { success: true };
  }

  async remove(vehicleId: string, externalId?: string | null) {
    return { success: true };
  }

  async getStatus(externalId: string): Promise<MarketplaceStatus> {
    return 'LIVE';
  }
}

// 2. Facebook Marketplace Adapter (Manual copy-paste / Feed integration)
export class FacebookMarketplaceAdapter implements MarketplaceAdapter {
  platformId: MarketplacePlatform = 'FACEBOOK';
  displayName = 'Facebook Marketplace';
  supportsAutoPublish = false; // Meta restricts automated personal posting without catalog API approval
  requiresManualPosting = true;

  validateVehicle(vehicle: VehicleData) {
    const errors: string[] = [];
    if (!vehicle.askingPrice) errors.push('Price required');
    if (vehicle.mileage > 300000) errors.push('Mileage exceeds Facebook recommended limits');
    return { valid: errors.length === 0, errors };
  }

  async publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult> {
    const mockExternalId = `fb_mp_${vehicle.vin.slice(-8)}`;
    return {
      success: true,
      platform: this.platformId,
      externalId: mockExternalId,
      externalUrl: `https://www.facebook.com/marketplace/item/${mockExternalId}`,
      status: 'LIVE',
      timestamp: new Date(),
    };
  }

  async update(vehicle: VehicleData, listing: ListingData, externalId: string) {
    return { success: true };
  }

  async remove(vehicleId: string, externalId?: string | null) {
    return { success: true };
  }

  async getStatus(externalId: string): Promise<MarketplaceStatus> {
    return 'LIVE';
  }
}

// 3. Craigslist Adapter
export class CraigslistAdapter implements MarketplaceAdapter {
  platformId: MarketplacePlatform = 'CRAIGSLIST';
  displayName = 'Craigslist Motors';
  supportsAutoPublish = false;
  requiresManualPosting = true;

  validateVehicle(vehicle: VehicleData) {
    const errors: string[] = [];
    if (!vehicle.vin) errors.push('VIN required for Craigslist automotive posting');
    return { valid: errors.length === 0, errors };
  }

  async publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult> {
    const mockPostId = `cl_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    return {
      success: true,
      platform: this.platformId,
      externalId: mockPostId,
      externalUrl: `https://craigslist.org/ctd/d/${mockPostId}.html`,
      status: 'LIVE',
      timestamp: new Date(),
    };
  }

  async update(vehicle: VehicleData, listing: ListingData, externalId: string) {
    return { success: true };
  }

  async remove(vehicleId: string, externalId?: string | null) {
    return { success: true };
  }

  async getStatus(externalId: string): Promise<MarketplaceStatus> {
    return 'LIVE';
  }
}

// 4. eBay Motors Adapter
export class EbayMotorsAdapter implements MarketplaceAdapter {
  platformId: MarketplacePlatform = 'EBAY_MOTORS';
  displayName = 'eBay Motors';
  supportsAutoPublish = true;
  requiresManualPosting = false;

  validateVehicle(vehicle: VehicleData) {
    const errors: string[] = [];
    if (!vehicle.vin || vehicle.vin.length !== 17) errors.push('17-character VIN required for eBay Motors');
    return { valid: errors.length === 0, errors };
  }

  async publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult> {
    const mockItemId = `ebay_${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    return {
      success: true,
      platform: this.platformId,
      externalId: mockItemId,
      externalUrl: `https://www.ebay.com/itm/${mockItemId}`,
      status: 'LIVE',
      timestamp: new Date(),
    };
  }

  async update(vehicle: VehicleData, listing: ListingData, externalId: string) {
    return { success: true };
  }

  async remove(vehicleId: string, externalId?: string | null) {
    return { success: true };
  }

  async getStatus(externalId: string): Promise<MarketplaceStatus> {
    return 'LIVE';
  }
}

// 5. Autotrader Adapter
export class AutotraderAdapter implements MarketplaceAdapter {
  platformId: MarketplacePlatform = 'AUTOTRADER';
  displayName = 'Autotrader / Cox Automotive Feed';
  supportsAutoPublish = true;
  requiresManualPosting = false;

  validateVehicle(vehicle: VehicleData) {
    return { valid: true, errors: [] };
  }

  async publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult> {
    const mockId = `at_${vehicle.stockNumber}`;
    return {
      success: true,
      platform: this.platformId,
      externalId: mockId,
      externalUrl: `https://www.autotrader.com/cars-for-sale/vehicledetails.xhtml?listingId=${mockId}`,
      status: 'LIVE',
      timestamp: new Date(),
    };
  }

  async update(vehicle: VehicleData, listing: ListingData, externalId: string) {
    return { success: true };
  }

  async remove(vehicleId: string, externalId?: string | null) {
    return { success: true };
  }

  async getStatus(externalId: string): Promise<MarketplaceStatus> {
    return 'LIVE';
  }
}

// 6. Cars.com Adapter
export class CarsComAdapter implements MarketplaceAdapter {
  platformId: MarketplacePlatform = 'CARS_COM';
  displayName = 'Cars.com Inventory Feed';
  supportsAutoPublish = true;
  requiresManualPosting = false;

  validateVehicle(vehicle: VehicleData) {
    return { valid: true, errors: [] };
  }

  async publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult> {
    const mockId = `cars_${vehicle.vin.slice(-6)}`;
    return {
      success: true,
      platform: this.platformId,
      externalId: mockId,
      externalUrl: `https://www.cars.com/vehicledetail/${mockId}`,
      status: 'LIVE',
      timestamp: new Date(),
    };
  }

  async update(vehicle: VehicleData, listing: ListingData, externalId: string) {
    return { success: true };
  }

  async remove(vehicleId: string, externalId?: string | null) {
    return { success: true };
  }

  async getStatus(externalId: string): Promise<MarketplaceStatus> {
    return 'LIVE';
  }
}

// 7. CarGurus Adapter
export class CarGurusAdapter implements MarketplaceAdapter {
  platformId: MarketplacePlatform = 'CARGURUS';
  displayName = 'CarGurus Feed & Lead Sync';
  supportsAutoPublish = true;
  requiresManualPosting = false;

  validateVehicle(vehicle: VehicleData) {
    return { valid: true, errors: [] };
  }

  async publish(vehicle: VehicleData, listing: ListingData): Promise<PublishResult> {
    const mockId = `cg_${vehicle.stockNumber}`;
    return {
      success: true,
      platform: this.platformId,
      externalId: mockId,
      externalUrl: `https://www.cargurus.com/Cars/detail.action?inventoryId=${mockId}`,
      status: 'LIVE',
      timestamp: new Date(),
    };
  }

  async update(vehicle: VehicleData, listing: ListingData, externalId: string) {
    return { success: true };
  }

  async remove(vehicleId: string, externalId?: string | null) {
    return { success: true };
  }

  async getStatus(externalId: string): Promise<MarketplaceStatus> {
    return 'LIVE';
  }
}

export const marketplaceAdapters: Record<MarketplacePlatform, MarketplaceAdapter> = {
  STOREFRONT: new StorefrontAdapter(),
  FACEBOOK: new FacebookMarketplaceAdapter(),
  CRAIGSLIST: new CraigslistAdapter(),
  EBAY_MOTORS: new EbayMotorsAdapter(),
  AUTOTRADER: new AutotraderAdapter(),
  CARS_COM: new CarsComAdapter(),
  CARGURUS: new CarGurusAdapter(),
};
