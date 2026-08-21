# AutoAIdealership Architecture Design Document

## 1. System Overview & B2B Positioning
**AutoAIdealership** (`autoaidealership.com`) is an enterprise-grade, multi-tenant AI Dealership Operating System engineered for independent automotive dealerships, lot managers, and sales teams.

```
+--------------------------------------------------------------------------------------------------------------------+
|                                                  CLIENT SURFACES                                                   |
|  +---------------------------+  +-------------------------------+  +--------------------------------------------+  |
|  | Corporate SaaS Site       |  | DealerOS Management           |  | Dealer-Branded Storefront                  |  |
|  | (autoaidealership.com /)  |  | (/d/[slug]/dashboard)         |  | (/dealer/[slug])                           |  |
|  | - Features, Pricing, Demo |  | - Arbitrage, CRM, Desking     |  | - Owner-Controlled Inventory & CTAs        |  |
|  | - Transparent Integrations|  | - VinAudit & History Provider |  | - Bounded AI Buyer Interaction             |  |
|  +-------------+-------------+  +---------------+---------------+  +--------------------+-----------------------+  |
+----------------|--------------------------------|---------------------------------------|--------------------------+
                 +--------------------------------+---------------------------------------+
                                                  |
+-------------------------------------------------v------------------------------------------------------------------+
|                                           API & SECURITY GATEWAY                                                   |
|  +--------------------------------------------------------------------------------------------------------------+  |
|  | - Next.js App Router Middleware & Cryptographically Signed Session Tokens (jose JWT)                         |  |
|  | - Organization Multi-Tenant Context Resolver (Row-level organizationId filtering on all database operations)  |  |
|  | - Anti-Spam & Rate-Limiting Engine for Public Inquiries & Demo Requests (/api/demo)                          |  |
|  +--------------------------------------------------------------------------------------------------------------+  |
|  | Core Domain Subsystems:                                                                                      |  |
|  | - Sourcing Intelligence & Arbitrage Engine       - Autonomous Bounded AI Sales Agent (Price Floors)          |  |
|  | - VinAudit Integration & Usage Metering          - Normalized Vehicle History Provider Factory (VinAudit,CF) |  |
|  | - Owner Storefront Content Control Hub (11 CTAs) - Digital F&I Desking & Paperless Buyer's Order Vault       |  |
|  +--------------------------------------------------------------------------------------------------------------+  |
+-------------------------------------------------+------------------------------------------------------------------+
                                                  |
+-------------------------------------------------v------------------------------------------------------------------+
|                                            DATA & INTEGRATION LAYER                                                |
|  +---------------------------+  +--------------------------+  +-------------------------------------------------+  |
|  | Relational Database       |  | Vehicle Data Providers   |  | Marketplace & Syndication Adapters              |  |
|  | - PostgreSQL (Production) |  | - NHTSA VPIC (Live API)  |  | - Dealer Storefront (Direct Scoped DB)          |  |
|  | - SQLite (Dev / Test)     |  | - VinAudit API Suite     |  | - Meta Catalog XML Feed (Configurable)          |  |
|  | - Prisma ORM Model Layer  |  | - CARFAX & AutoCheck     |  | - Autotrader / Classifieds Syndication Feed     |  |
|  | - ProviderUsageLog Meter  |  | - Auction Watchlists     |  | - Real-Time CRM Webhooks & Calendar Sync        |  |
|  +---------------------------+  +--------------------------+  +-------------------------------------------------+  |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Multi-Tenancy & Data Sovereignty Architecture

1. **Strict Database Isolation**:
   - Every operational query is explicitly scoped: `where: { organizationId: currentTenant.id }`.
   - Dedicated test suite (`tests/tenant-isolation-v2.test.ts`) verifies zero cross-tenant data leakage across inventory, leads, pricing strategies, and API cost meters.

2. **Role-Based Access Control (RBAC)**:
   - `OWNER`: Full administrative control, billing, storefront toggles, and user management.
   - `ADMIN`: User management and full operational features.
   - `MANAGER`: Desking approvals, inventory intake, and lead assignment.
   - `SALES`: CRM pipeline, customer conversations, and AI listing creation.
   - `INVENTORY`: Vehicle acquisitions, reconditioning expense ledgers, and auction watchlists.
   - `FINANCE`: F&I calculations, loan desking, and paperless Buyer's Orders.
   - `VIEWER`: Read-only reporting.

3. **Owner Storefront & Content Controls**:
   - Each dealership owner independently configures 11 boolean toggles:
     - `showOwnInventory` (default: ON)
     - `showLeaseDeals` (default: OFF)
     - `showNetworkInventory` (default: OFF)
     - `showPartnerListings` (default: OFF)
     - `showCarfaxCta` (default: ON)
     - `showFinancingCta` (default: ON)
     - `showTradeInCta` (default: ON)
     - `showMakeOffer` (default: ON)
     - `showScheduleTestDrive` (default: ON)
     - `showContactDealer` (default: ON)
     - `showVehicleRecommendations` (default: ON)
     - `preferredHistoryProvider` (default: `VINAUDIT`)

---

## 3. Vehicle Data & VinAudit Provider Architecture

- **Centralized Client (`src/lib/providers/vinaudit/client.ts`)**:
  - Secure, server-side-only execution using `VINAUDIT_API_KEY`.
  - Comprehensive service methods: `decodeVin`, `getPlateToVin`, `getVehicleHistory`, `getMarketValue`, `getMarketListings`, `getOwnershipCost`, `getVehicleImages`, `removeBackground`.
  - Built-in deterministic mock adapter when `VINAUDIT_API_KEY` is not present, allowing zero-friction local development without fabricated external claims.
- **Provider Usage Metering (`src/lib/providers/vinaudit/usageMeter.ts`)**:
  - Every API invocation records an immutable log in `ProviderUsageLog` (tracking tenant, endpoint, VIN, cost estimate, and status) and increments monthly aggregation in `UsageMeter`.
- **Vehicle History Factory (`src/lib/providers/vehicle-history/factory.ts`)**:
  - Normalized interface `VehicleHistoryProvider` and report contract `NormalizedVehicleHistoryReport`.
  - Supports `VinAuditHistoryProvider`, `CarfaxHistoryProvider`, and `AutoCheckHistoryProvider`.
  - Truthful degradation: Unconfigured providers return `status: 'UNAUTHORIZED'` with zero fabricated records.

---

## 4. B2B Demo Request & Anti-Spam Architecture

- **Input Validation (`src/lib/validation/demo-request.ts`)**: Server-side Zod schema enforcing valid business email formats, phone numbers, state selections, and operational demographic metadata.
- **Anti-Spam Defenses (`src/app/api/demo/route.ts`)**:
  - Hidden bot honeypot field (`website_hp`) rejecting automated submissions.
  - In-memory client IP rate limiter (maximum 5 requests per 10-minute window per IP).
- **Persistent Storage**: Validated requests are committed to the `DemoRequest` database model with tracking status (`PENDING`, `CONTACTED`, `SCHEDULED`, `QUALIFIED`, `CLOSED`).
