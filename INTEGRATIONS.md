# DealerOS Automotive Data, Auction & Marketplace Integration Architecture

## 1. Executive Summary & Integration Principles
DealerOS connects independent and franchise dealerships to real-world automotive data providers, dealer auctions, multi-channel advertising marketplaces, and communication networks. 

### Core Architectural Rules:
1. **Zero Scraping & Terms Compliance**: Never blindly scrape websites, bypass CAPTCHAs, or violate platform Terms of Service. Integrations use official REST/GraphQL APIs, certified dealer inventory syndication feeds, licensed data feeds, or authorized partner programs.
2. **Honest Capability Representation**: If an automated API does not exist for a platform (e.g. consumer Craigslist or non-partner Facebook Marketplace), the platform operates in **Manual Publishing Mode** with copy-ready bundles and guided workflows. Unsupported integrations are never faked as live.
3. **Data Provenance & Explainability**: Every valuation, specification, history entry, and AI decision must track its origin (`LIVE`, `PROVIDER_DATA`, `CALCULATED`, `DEALER_ENTERED`, `ESTIMATED`, `SIMULATED`), timestamp, and confidence score.
4. **Cost Control & Caching**: External commercial APIs (CARFAX, Black Book, Manheim MMR) are rate-limited, cached with TTLs, and metered per organization.
5. **Secure Credential Architecture**: API keys, OAuth tokens, and secrets are stored encrypted and isolated per tenant. Passwords and AuctionACCESS PINs are never stored in raw database columns.

---

## 2. Integration Capability Matrix

| Provider | Category | Integration Type | Auth Type | Dealer License Req. | AuctionACCESS Req. | Read / Search | Vehicle Data | History | Valuation | Bidding / Buy | Publish Listing | Delist on Sale | Messages / Leads | Estimated Cost | Implementation Status |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **NHTSA VPIC** | VEHICLE_DATA | `LIVE_API` | Public / None | No | No | N/A | Yes | Recalls Only | No | N/A | N/A | N/A | N/A | Free | **LIVE (Active)** |
| **Manheim (Cox)** | AUCTIONS | `PARTNER_API` / `DEALER_FEED` | OAuth2 / API Key | **Yes** | **Yes** | Yes | Yes | Yes (MMR) | Yes (MMR) | Yes (Proxy/Live) | N/A | N/A | N/A | Enterprise Subscription | **RESEARCH_REQUIRED** |
| **ACV Auctions** | AUCTIONS | `PARTNER_API` | OAuth2 / API Key | **Yes** | **Yes** | Yes | Yes | Yes | Yes | Yes (API Bids) | N/A | N/A | N/A | Per-transaction / Partner | **RESEARCH_REQUIRED** |
| **Copart** | AUCTIONS | `PARTNER_API` / `DEALER_FEED` | Member API / B2B | **Yes** | No (Copart ID) | Yes | Yes | Condition | No | Yes (Prelim/Live) | N/A | N/A | N/A | Member Fees | **RESEARCH_REQUIRED** |
| **IAAI** | AUCTIONS | `PARTNER_API` / `DEALER_FEED` | B2B Portal / API | **Yes** | No (IAAI ID) | Yes | Yes | Condition | No | Yes | N/A | N/A | N/A | Member Fees | **RESEARCH_REQUIRED** |
| **CarMax Auctions** | AUCTIONS | `MANUAL` / `DEALER_FEED` | Web Portal Session | **Yes** | **Yes** | Manual/Feed | Yes | Condition | No | Manual/Portal | N/A | N/A | N/A | Free Registration | **MOCK / MANUAL** |
| **Capital Auto Auction** | AUCTIONS | `MANUAL` | Web Portal | Optional | No | Manual | Basic | No | No | Manual/Portal | N/A | N/A | N/A | Public/Dealer | **MOCK / MANUAL** |
| **CARFAX** | VEHICLE_DATA | `PARTNER_API` | API Key / B2B OAuth | No | No | N/A | Yes | **Full History** | No | N/A | N/A | N/A | N/A | ~$15 - $40/report | **RESEARCH_REQUIRED** |
| **AutoCheck (Experian)** | VEHICLE_DATA | `PARTNER_API` | API Key / B2B | No | No | N/A | Yes | **Full History** | Score | N/A | N/A | N/A | N/A | ~$10 - $25/report | **RESEARCH_REQUIRED** |
| **VinAudit** | VEHICLE_DATA | `LIVE_API` | REST API Key | No | No | N/A | Yes | NMVTIS Title | Yes | N/A | N/A | N/A | N/A | $1 - $5/call | **PARTNER_API (Candidate 1)** |
| **VINData** | VEHICLE_DATA | `LIVE_API` | REST API Key | No | No | N/A | Yes | NMVTIS / Commercial | Yes | N/A | N/A | N/A | N/A | Commercial Tier | **RESEARCH_REQUIRED** |
| **Techsalerator** | VEHICLE_DATA | `PARTNER_API` | API Key | No | No | N/A | Yes | Ownership/B2B | No | N/A | N/A | N/A | N/A | Enterprise Contract | **RESEARCH_REQUIRED** |
| **Storefront (Direct)** | MARKETPLACES | `LIVE_API` | Internal DB | No | No | Yes | Yes | Yes | Yes | Yes | **Yes (Instant)** | **Yes** | **Yes (Live Chat)** | Included | **LIVE (Active)** |
| **Facebook Marketplace** | MARKETPLACES | `PARTNER_API` / `MANUAL` | Meta Commerce / DMS Feed | No | No | Yes | N/A | N/A | N/A | N/A | Feed (Approved) / Manual | Yes (Feed) | Yes (Webhooks) | Free / Catalog Fee | **MANUAL / FEED_READY** |
| **Autotrader (Cox)** | MARKETPLACES | `DEALER_FEED` / `PARTNER_API` | Dealer Inventory Feed | **Yes** | No | Yes | N/A | N/A | N/A | N/A | Feed (Homenet/FTP) | Yes | Yes (Lead API) | Commercial Contract | **MOCK / FEED_READY** |
| **Cars.com** | MARKETPLACES | `DEALER_FEED` / `PARTNER_API` | Inventory Feed / API | **Yes** | No | Yes | N/A | N/A | N/A | N/A | Feed (FTP/API) | Yes | Yes (Lead API) | Commercial Contract | **MOCK / FEED_READY** |
| **CarGurus** | MARKETPLACES | `DEALER_FEED` / `PARTNER_API` | Inventory Feed / API | **Yes** | No | Yes | N/A | N/A | Deal Rating | N/A | Feed (FTP/API) | Yes | Yes (Lead API) | Commercial Contract | **MOCK / FEED_READY** |
| **Craigslist** | MARKETPLACES | `MANUAL` / `PARTNER_API` | Account Token / Posting API | No | No | Yes | N/A | N/A | N/A | N/A | Manual Bundle / $5 Posting | Manual | Email Relay | $5/posting | **MANUAL (Ready)** |
| **Bring a Trailer** | MARKETPLACES | `MANUAL` / `PARTNER_API` | Submission API | No | No | Yes | N/A | N/A | Collector | N/A | Submission Review | On Sale | Comments Relay | Listing Fee ($99+) | **MOCK / MANUAL** |
| **Cars & Bids** | MARKETPLACES | `MANUAL` | Submission API | No | No | Yes | N/A | N/A | Enthusiast | N/A | Submission Review | On Sale | Comments Relay | Free to Submit | **MOCK / MANUAL** |
| **KBB Instant Cash Offer** | VALUATION | `PARTNER_API` | Cox Partner API | **Yes** | No | Yes | Yes | N/A | **Trade/Retail** | Acquisition | N/A | N/A | Yes (Acquisition Lead) | Commercial Contract | **RESEARCH_REQUIRED** |

---

## 3. Auto Auction Integration Architecture

### 3.1 Normalized Auction Vehicle Model
The unified search interface ingests multi-source auction feeds into a standard data structure:

```typescript
export interface NormalizedAuctionItem {
  provider: 'MANHEIM' | 'ACV' | 'COPART' | 'IAAI' | 'CARMAX' | 'CAPITAL_AUTO' | 'MOCK';
  auctionId: string;
  externalUrl: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number;
  location: {
    facilityName: string;
    city: string;
    state: string;
    zip: string;
    distanceMiles?: number;
  };
  seller: string;
  saleDate: string; // ISO 8601
  auctionType: 'LIVE_LANE' | 'TIMED_ONLINE' | 'BUY_NOW' | 'SEALED_BID';
  runNumber?: string;
  lane?: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  estimatedBuyerFee: number;
  conditionGrade: 'EXCELLENT' | 'CLEAN' | 'AVERAGE' | 'ROUGH';
  damageType?: string;
  titleStatus: 'CLEAN' | 'SALVAGE' | 'REBUILT' | 'NON_REPAIRABLE' | 'PENDING';
  photos: string[];
  announcements: string[];
  sellerNotes?: string;
  historyIndicators: {
    hasCarfax: boolean;
    hasAutoCheck: boolean;
    structuralDamageDisclosed: boolean;
    odometerDiscrepancy: boolean;
  };
  provenance: {
    retrievedAt: string;
    expiresAt: string;
    sourceReferenceId: string;
    isSimulated: boolean;
  };
}
```

### 3.2 Auction Center Sourcing Workflow
```
[ AUCTION SEARCH & FILTERS ]
          │ (Make, Model, Year, Mileage, Distance, Damage, Title, Opportunity Score)
          ▼
[ VEHICLE INTELLIGENCE EVALUATION ]
          │ (Calculates Market Value, Buy Fees, Transport, Reconditioning, ROI)
          ▼
[ WATCHLIST & BID MANAGEMENT ]
          │ (Sets Max Recommended Bid based on Dealer Profit Bounds)
          ▼
[ BID EXECUTION / PROVIDER HANDOFF ]
          │ (API Bid where authorized, or 1-Click Secure Deep-Link to Lane)
          ▼
[ AUCTION WON -> 1-CLICK CONVERT TO INVENTORY ]
          │ (Transfers VIN, Specs, Cost Basis to Inventory & Triggers AI Listing Studio)
          ▼
[ RECONDITIONING & MARKETING ]
```

### 3.3 Dealership Access & Compliance Metadata
DealerOS records non-secret compliance metadata in `OrganizationSettings`:
- `dealerLicenseNumber`, `dealerLicenseState`, `dealerLicenseExpiration`
- `auctionAccessMemberId`, `auctionAccessStatus` (`ACTIVE`, `VERIFICATION_PENDING`, `EXPIRED`)
- `copartAccountVerified`, `iaaiAccountVerified`, `acvAccountVerified`
- Secure API keys & OAuth Refresh Tokens stored in encrypted key vaults.

---

## 4. Buy / Sell Marketplace Architecture

### 4.1 Master Listing Paradigm
The dealership creates **one master vehicle record** inside DealerOS. The system then automatically optimizes, adapts, and formats the copy for all destination channels:

```
                      ┌───────────────────────────┐
                      │    MASTER DEALER LISTING  │
                      │  (Specs, Photos, Margin)  │
                      └─────────────┬─────────────┘
                                    │
                       [ AI LISTING STUDIO ]
                                    │ (Generates SEO, Social, Bulleted, & Classified copy)
                                    ▼
                      ┌───────────────────────────┐
                      │ DEALER 1-CLICK APPROVAL   │
                      └─────────────┬─────────────┘
                                    │
     ┌──────────────────┬───────────┴───────────┬──────────────────┐
     ▼                  ▼                       ▼                  ▼
[ STOREFRONT ]     [ META / FB ]         [ CARGURUS / COGNIT ] [ CRAIGSLIST ]
(Synchronous DB)   (Automotive Catalog/  (Automated Dealer     (Formatted Template +
                    Manual Bundle)        Syndication Feed)     Direct Link)
```

### 4.2 Facebook Marketplace Strategy & Meta Automotive API Policy
Meta strictly regulates automotive listings on Facebook Marketplace:
1. **Automotive Catalog Feed**: Dealerships with verified Meta Business Managers can upload structured inventory feeds (TSV/XML/Catalog API) linked to their Facebook Business Page.
2. **Personal Profile / Manual Mode**: For non-catalog accounts, automated posting bots violate Meta's Platform Policy and risk account suspension. DealerOS provides **Manual Publishing Mode**:
   - Generates compliant, emoji-formatted Facebook title, structured specs, price, and watermark-free photo set.
   - 1-Click "Copy Facebook Pack" + "Open Facebook Marketplace" button.
   - Seamless transition: when the dealer connects an approved Meta Catalog API, syndication happens automatically without modifying vehicle inventory.

### 4.3 Unified Marketplace Inbox
Buyer communications from active listings (Storefront Web Chat, SMS via Twilio, Facebook Messenger webhooks, Autotrader/Cars.com leads) are normalized into the **DealerOS Unified Inbox**:
- **Normalized Schema**: `conversationId`, `marketplacePlatform`, `buyerName`, `contactInfo`, `vehicleId`, `buyerIntent`, `currentOffer`.
- **AI Sales Agent Guard**: Operates under strict dealership boundaries:
  $$\text{Asking Price} \ge \text{Offered Counter-Price} \ge \text{Absolute Min Price}$$
- Out-of-band offers automatically require Manager Approval.

---

## 5. Vehicle Data Providers Architecture

### 5.1 Capability-Based Provider Interface (`VehicleDataProvider`)
Different data vendors supply different slices of vehicle intelligence. Providers implement only their authorized capabilities:

```typescript
export interface VehicleDataProvider {
  providerId: string;
  displayName: string;
  tier: 'FREE' | 'COMMERCIAL_PER_CALL' | 'SUBSCRIPTION';
  
  // Supported capability flags
  capabilities: {
    vinDecode: boolean;
    specifications: boolean;
    accidentHistory: boolean;
    titleBrandStatus: boolean;
    odometerVerification: boolean;
    serviceRecords: boolean;
    recallData: boolean;
    marketValuation: boolean;
    auctionTransactions: boolean;
  };

  decodeVin?(vin: string): Promise<DecodedVehicleSpecs>;
  getHistoryReport?(vin: string): Promise<VehicleHistoryProvenance>;
  getRecalls?(vin: string): Promise<VehicleRecallData[]>;
  getValuation?(vin: string, mileage: number, condition: string): Promise<MarketValuationData>;
}
```

### 5.2 NHTSA VPIC Integration Boundaries
- **Supported / Authoritative**: Model Year, Make, Model, Trim, Body Class, Engine, Displacement, Fuel Type, Drivetrain, Plant Country, Manufacturer Recalls.
- **Explicitly NOT Supported**: Commercial accident records, ownership history, service logs, dealer market valuations, or wholesale auction prices (these require commercial providers such as CARFAX, AutoCheck, Black Book, or VinAudit).

---

## 6. Vehicle Opportunity Engine & Data Provenance

### 6.1 Explainable Opportunity Score Formula
The Opportunity Score (0-100) is synthesized from 8 weighted pillars:
$$\text{Score} = w_1 \cdot \text{Margin} + w_2 \cdot \text{Demand} + w_3 \cdot \text{DaysToSell} + w_4 \cdot \text{ConditionRisk} + w_5 \cdot \text{TitleRisk} + w_6 \cdot \text{PriceCompetitiveness} + w_7 \cdot \text{Transport} + w_8 \cdot \text{DealerTrackRecord}$$

### 6.2 Data Provenance Schema
Every valuation and data point in the UI exposes its audit trace:
```json
{
  "metric": "estimatedMarketValue",
  "value": 24400,
  "provenanceType": "PROVIDER_DATA",
  "primarySource": "VinAudit Market API",
  "supportingSources": [
    { "source": "Storefront Comps", "sampleSize": 8, "median": 24500 },
    { "source": "Dealer Historical Sales", "sampleSize": 3, "avgSoldPrice": 24200 }
  ],
  "retrievedAt": "2026-08-20T04:45:00Z",
  "confidence": "HIGH",
  "isSimulated": false
}
```

---

## 7. Caching, Cost Metering & Auto-Delisting Engine

### 7.1 Provider Usage & Cost Metering
All commercial API calls are audited in `api_usage_logs`:
- `provider`: (e.g. `VINAUDIT`, `CARFAX`, `TWILIO`, `GEMINI_AI`)
- `organizationId`: Dealership tenant ID
- `endpoint`: API route called
- `costCents`: Estimated or billed API cost
- `cacheHit`: Boolean (prevents duplicate billing on repeated page loads)
- `timestamp`: UTC datetime

### 7.2 Post-Sale Automated Multi-Marketplace Delisting
When a vehicle status changes to `SOLD` (e.g. via F&I deal delivery):
1. Event `vehicle.sold` is dispatched to the Automation Engine.
2. `MarketplaceOrchestrator.delistVehicleEverywhere(orgId, vehicleId)` triggers removals across:
   - Public Storefront (instant status update)
   - Facebook Marketplace (catalog delist or dealer notification)
   - Connected Dealer Feeds (Homenet, Autotrader, Cars.com, CarGurus)
3. Audit log records the delisting result with timestamps and alerts the dealer if any manual action is required.

---

## 8. Recommended Next Implementation Sequence

Based on verified official API availability, business ROI, implementation complexity, and developer license requirements:

1. **Phase 1 (Immediate Next Step): VinAudit / Commercial VIN & NMVTIS Data Integration**
   - **Why**: Official REST API available with low per-call cost ($1-$2), no strict dealer license requirement for sandbox, provides real NMVTIS title brand checks, odometer checks, and live market pricing to immediately replace simulated numbers.
2. **Phase 2: Real PostgreSQL Dual-Mode & Schema Validation (Zod)**
   - **Why**: Ensures database performance, relational integrity, and rock-solid validation across all API endpoints.
3. **Phase 3: Meta Automotive Catalog Feed & Manual FB Marketplace Toolkit**
   - **Why**: Provides highest lead-generation volume for independent dealerships without violating Meta anti-bot policies.
4. **Phase 4: ACV / Manheim Auction Partner Integration**
   - **Why**: High business value for automated inventory sourcing once dealer license and AuctionACCESS credentials are provided.
