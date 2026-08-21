# AutoAIdealership Provider & Integration Architecture

## 1. Executive Summary & Integration Principles

AutoAIdealership (`autoaidealership.com`) connects independent dealerships to vehicle data repositories, history providers, auction networks, and classified marketplaces under five strict principles:

1. **Terms Compliance & Zero Scraping**: Integrations strictly use official APIs, certified catalog feeds, or guided manual publishing workflows. Automated web scraping of protected classifieds is prohibited.
2. **Truth in Capabilities**: Supported capabilities are clearly delineated (`LIVE`, `IMPLEMENTED`, `PARTNER REQUIRED`, `RESEARCH REQUIRED`, `MANUAL`). Unsupported integrations are never faked as operational.
3. **Data Provenance**: Every vehicle valuation, history record, and AI counter-offer tags its source, sample count, and timestamp.
4. **Server-Side API Security**: All vendor API credentials are kept strictly server-side in encrypted environment variables and never exposed to browser bundles.
5. **Usage Metering**: All vendor API calls log immutable entries into `ProviderUsageLog` for tenant accounting and auditability.

---

## 2. Integration Capability Directory

| Provider | Category | Access Method | Dealer License Req. | Status | Capabilities |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **NHTSA VPIC API** | VEHICLE_DATA | Official Public API | No | **LIVE** | 17-Char VIN Decoding, Factory Specs, Safety Recalls |
| **VinAudit API Suite** | VEHICLE_DATA | Official REST API | No | **IMPLEMENTED** | VIN Specs, Plate-to-VIN, History Records, Market Value & Comps, Background Removal |
| **CARFAX** | VEHICLE_DATA | Commercial Agreement | No | **PARTNER REQUIRED** | Accident History, Service Records, Title Provenance (Returns unauthorized if unconfigured) |
| **AutoCheck (Experian)**| VEHICLE_DATA | Commercial Agreement | No | **PARTNER REQUIRED** | AutoCheck Score, Auction History, Title Records |
| **Dealer Storefront** | MARKETPLACES | First-Party Database | No | **LIVE** | 1-Click Publishing, Real-Time Inquiries, Owner Storefront Controls |
| **Facebook Marketplace**| MARKETPLACES | Meta Catalog XML/CSV | No | **COMING SOON** | Structured Automotive Catalog Feed |
| **Autotrader (Cox)** | MARKETPLACES | Certified FTP/API Feed| **Yes** | **PARTNER REQUIRED** | Third-Party Classifieds Syndication |
| **Cars.com / CarGurus** | MARKETPLACES | Certified FTP Feed | **Yes** | **PARTNER REQUIRED** | Third-Party Classifieds Syndication |
| **Manheim (Cox)** | AUCTIONS | Dealer ACCESS / API | **Yes** | **RESEARCH REQUIRED** | Lane Search, MMR Valuation Comps, Simulcast Bidding (TBD) |
| **ACV Auctions** | AUCTIONS | Dealer API / Token | **Yes** | **RESEARCH REQUIRED** | Condition Report Normalization, Watchlists (TBD) |
| **Copart & IAAI** | AUCTIONS | Member Feed / API | **Yes** | **RESEARCH REQUIRED** | Run List Search, Salvage Title Verification |
| **Bring a Trailer** | AUCTIONS | Manual / Watchlist | No | **MANUAL** | Enthusiast Historical Comps |
| **Cars & Bids** | AUCTIONS | Manual / Watchlist | No | **MANUAL** | Modern Enthusiast Historical Comps |
| **eBay Motors** | AUCTIONS | eBay REST API | No | **COMING SOON** | Public Auction Comps & Syndication |

---

## 3. VinAudit Subsystem Architecture

The centralized VinAudit client is located at `src/lib/providers/vinaudit/`:

- **Client (`client.ts`)**:
  - `decodeVin(params, organizationId)`: Decodes specifications, engine, transmission, MSRP.
  - `getPlateToVin(params, organizationId)`: Converts state + license plate into 17-character VIN.
  - `getVehicleHistory(params, organizationId)`: Returns NMVTIS title brand, salvage, junk, flood, and odometer records.
  - `getMarketValue(params, organizationId)`: Provides below-market, average, above-market, trade-in, and wholesale pricing.
  - `getMarketListings(params, organizationId)`: Returns active regional comps with distance and dealer names.
  - `getOwnershipCost(params, organizationId)`: Provides 5-year cost of ownership projections.
  - `getVehicleImages(params, organizationId)`: Retrieves OEM high-res angle photos.
  - `removeBackground(params, organizationId)`: Studio background removal for dealer inventory photos.
- **Mock Fallback**:
  - When `VINAUDIT_API_KEY` is not set or in test environments, the client operates in high-fidelity mock mode and logs `ProviderUsageLog` with `status: CACHE_HIT`.
- **Usage Metering (`usageMeter.ts`)**:
  - Inserts `ProviderUsageLog` records with cost estimates and increments monthly aggregation in `UsageMeter`.

---

## 4. Vehicle History Provider Factory

Located at `src/lib/providers/vehicle-history/`:
- `getVehicleHistoryProvider(providerId)` returns an instance implementing `VehicleHistoryProvider`:
  - `VinAuditHistoryProvider`: Queries VinAudit and saves normalized records to `prisma.vehicleHistoryRecord`.
  - `CarfaxHistoryProvider`: Specifically verifies `isConfigured()`. If false, returns `status: UNAUTHORIZED` with zero fabricated reports.
  - `AutoCheckHistoryProvider`: Commercial Experian provider interface.
