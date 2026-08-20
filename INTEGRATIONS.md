# DealerOS Integration Architecture & Provider Specifications

## 1. Valuation & VIN Decoding Integrations

### 1.1 NHTSA VIN Decoder API (Live / Free Government Endpoint)
- **Endpoint**: `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{VIN}?format=json`
- **Extracted Fields**: Model Year, Make, Model, Trim Level, Body Class, Engine Cylinders, Displacement (L), Fuel Type, Drive Type, Transmission Style, Plant Country.

### 1.2 Valuation Provider Interface (`ValuationProvider`)
```typescript
export interface ValuationProvider {
  name: string;
  getMarketValuation(input: {
    vin: string;
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number;
    condition: 'EXCELLENT' | 'CLEAN' | 'AVERAGE' | 'ROUGH';
    zipCode?: string;
  }): Promise<{
    estimatedRetail: number;
    estimatedTradeIn: number;
    estimatedAuctionWholesale: number;
    marketDemandScore: number; // 1-100
    avgDaysToSell: number;
    comparableListings: Array<{
      price: number;
      mileage: number;
      dealer: string;
      distanceMiles: number;
    }>;
  }>;
}
```

---

## 2. Marketplace Hub Adapters

### 2.1 Adapter Interface (`MarketplaceAdapter`)
```typescript
export interface MarketplaceAdapter {
  platformId: string;
  displayName: string;
  supportsAutoPublish: boolean;
  validateVehicle(vehicle: Vehicle): { valid: boolean; errors: string[] };
  publish(vehicle: Vehicle, listing: Listing): Promise<{ externalId: string; externalUrl: string }>;
  update(vehicle: Vehicle, listing: Listing, externalId: string): Promise<{ success: boolean }>;
  remove(vehicleId: string, externalId: string): Promise<{ success: boolean }>;
  getStatus(externalId: string): Promise<'LIVE' | 'EXPIRED' | 'REMOVED' | 'FAILED'>;
}
```

### 2.2 Implemented Adapters
1. **Storefront Adapter**: Synchronous local database publishing immediately rendering inventory to `/storefront`.
2. **Facebook Marketplace Adapter**: Generates 1-click clipboard bundle with clean copy, photo pack, and auto-reply routing tag.
3. **Craigslist Adapter**: Generates rich BBCode/HTML structured template for copy-paste posting.
4. **eBay Motors / Autotrader / Cars.com / CarGurus**: Mock API & Feed simulator with realistic latency and audit log sync.

---

## 3. Communication & Channel Adapters
- **Storefront Web Chat**: Real-time bidirectional WebSocket/Server-Sent-Events simulation directly hooked to the Dealer Unified Inbox.
- **SMS / Twilio Adapter Interface**: Inbound webhook parses SMS text into active conversations.
- **WhatsApp Business Adapter Interface**: Maps incoming WhatsApp customer inquiries to CRM Leads.

---

## 4. AI Service Architecture (Gemini API & Fallback)
- **Primary Engine**: Google Gemini API via `@google/genai` or standard REST endpoint.
- **Deterministic Heuristic Engine**: Built-in rule-based fallback ensuring zero downtime if API keys are not supplied. Performs full mathematical valuation, listing synthesis, negotiation bound enforcement, and assistant function calls.
