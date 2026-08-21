# AutoAIdealership Product Requirements Document (PRD)

## 1. Product Direction & Positioning
- **Product Name:** `AutoAIdealership`
- **Planned Primary Domain:** `autoaidealership.com`
- **Tagline:** *"Smarter Dealers. Better Deals."*
- **Product Positioning:** *"AI-Powered Dealership Operating System"*
- **Target Audience:** Independent automotive dealers (1 to 250+ inventory units), general managers, sales teams, and dealership owners.

---

## 2. Platform Experiences & Information Architecture

### 2.1 Corporate B2B Website (`autoaidealership.com`)
- **Primary Navigation Structure:**
  - `Features` (`/features`): Live capabilities, bounded AI negotiation, opportunity scoring, and truthful feed roadmaps.
  - `Pricing` (`/pricing`): Predictable SaaS tiers, entitlement limits, and monthly/annual toggles.
  - `Request Demo` (`/demo`, `/request-demo`): Comprehensive B2B lead capture with demographic qualification.
  - `About Us` (`/about`): Independent dealership mission, margin preservation, and bounded AI principles.
  - `Integrations` (`/integrations`): Transparent provider status directory (`LIVE`, `IMPLEMENTED`, `PARTNER REQUIRED`, `RESEARCH REQUIRED`, `MANUAL`).
  - `Sign In` (`/login`): Secure portal authentication.
- **Navigation Constraint:**
  - Marketing navigation does **NOT** promote retail consumer car shopping or lease browsing. All navigation is strictly oriented around B2B SaaS dealer acquisition.

### 2.2 Dealership Operating SaaS (DealerOS Portal)
- **Executive Command Center (`/dashboard`)**: Daily AI morning briefings, inventory velocity desk, margin tracking, and aged lot alerts.
- **Opportunity Intelligence (`/opportunities`, `/auctions`)**: Sourcing intelligence, 17-character NHTSA and VinAudit decoding, reconditioning & transport cost basis, and explainable 0–100 Opportunity Scores.
- **24/7 Bounded AI Sales Concierge (`/messages`)**: Multi-channel lead messaging adhering strictly to dealer invariant minimum floor prices ($P_{\text{min}}$).
- **Owner Storefront & Content Controls (`/settings`)**: 11 independent toggles controlling public inventory feeds (Own Inventory, Lease Deals, Network Listings, Partner Listings) and conversion CTAs.
- **VinAudit Integration Subsystem (`src/lib/providers/vinaudit/`)**: Dedicated client providing VIN specifications, Plate-to-VIN lookup, title brand history, market valuation comps, and tenant usage metering.
- **F&I Desking & Paperless Documents (`/deals`, `/documents`)**: Structuring with state doc fees, sales tax, APR calculations, and printable Buyer's Orders.

### 2.3 Dealer-Branded Storefront (`/dealer/[slug]`, `/storefront`)
- **Public Showroom**: Displays active dealer inventory according to owner toggles.
- **Lead Capture & Attribution**: Every test drive request, trade-in appraisal, financing pre-qualification, and chat inquiry is strictly routed to the hosting dealer's CRM.

---

## 3. Subscription Tiers & Entitlement Matrix

| Entitlement | Starter ($249/mo) | Pro ($499/mo) | AI Pro ($799/mo) | Enterprise ($1,499/mo) |
| :--- | :--- | :--- | :--- | :--- |
| **Active Inventory Limit** | 30 Vehicles | 100 Vehicles | 250 Vehicles | Unlimited |
| **Authorized Staff Seats** | 3 Seats (RBAC) | 8 Seats (RBAC) | 15 Seats (RBAC) | Unlimited |
| **Bounded AI Sales Agent** | 1,000 actions / mo | 5,000 actions / mo | Unlimited | Custom Tuned |
| **VinAudit History Reports**| 25 / mo | 100 / mo | 300 / mo | Volume Tier |
| **Opportunity Intelligence**| Standard | Full Arbitrage | Full Arbitrage + Comps | Full Arbitrage |
| **Background Removal Studio**| Standard | Included | Included | Included |
| **Plate-to-VIN Scanner** | Standard | Standard | Included | Included |
| **Storefront Lease Deals** | Configurable (Off) | Configurable (Off) | Configurable (On) | Configurable (On) |
| **Multi-Rooftop Management**| — | — | — | Included |

---

## 4. Vehicle Data & History Provider Architecture

1. **Provider Factory (`src/lib/providers/vehicle-history/factory.ts`)**:
   - `VinAuditHistoryProvider`: Standard provider querying factory build data, title brand records, and market comps.
   - `CarfaxHistoryProvider`: Truthfully returns `status: 'UNAUTHORIZED'` when commercial credentials are not provided.
   - `AutoCheckHistoryProvider`: Experian commercial provider interface.
2. **Usage Tracking (`ProviderUsageLog`)**:
   - Every API invocation tracks `organizationId`, `provider`, `endpoint`, `vin`, `status`, and `costEstimateCents`.
