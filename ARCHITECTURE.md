# DealerOS Architecture Design Document

## 1. System Overview
DealerOS is an autonomous, AI-augmented Dealer Management & Operating System (DMS / Dealer OS) engineered specifically for independent and franchise automotive dealerships. It unifies vehicle sourcing, valuation intelligence, inventory intake, reconditioning cost accounting, multi-channel AI marketing, autonomous lead negotiation, F&I deal desking, and executive business analytics into a single multi-tenant platform.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT SURFACES                                   |
|   +--------------------------+  +--------------------+  +---------------------+   |
|   |   Dealer Web Workspace   |  |  Dealer Mobile/PWA |  |  Public Storefront  |   |
|   |     (Next.js App)        |  |    (Responsive)    |  |    (/storefront)     |   |
|   +-------------+------------+  +---------+----------+  +----------+----------+   |
+-----------------|-------------------------|------------------------|--------------+
                  +-------------------------+------------------------+
                                            |
+-------------------------------------------v---------------------------------------+
|                               API & APPLICATION LAYER                             |
|  +-----------------------------------------------------------------------------+  |
|  | Multi-Tenant Auth Guard & Context Resolver (Org, Role, Location Isolation)  |  |
|  +-----------------------------------------------------------------------------+  |
|  | Core Domain Services:                                                       |  |
|  | - Inventory & Reconditioning Service  - Valuation & Vehicle Intelligence   |  |
|  | - AI Listing Studio & Copywriter      - Autonomous AI Sales Agent Engine    |  |
|  | - Multi-Marketplace Adapter Hub       - CRM & Lead Pipeline Service         |  |
|  | - F&I Deal Desk & Documents           - Event Automation & Trigger Engine   |  |
|  | - Dealer Executive AI Assistant       - Analytics & Financial Aggregator    |  |
|  +-----------------------------------------------------------------------------+  |
+-------------------------------------------+---------------------------------------+
                                            |
+-------------------------------------------v---------------------------------------+
|                               DATA & INTEGRATION LAYER                            |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  |  Relational DB      |  |  AI Provider Engine  |  |  Marketplace Adapters    |  |
|  |  (Prisma / SQLite / |  |  (Gemini API /       |  |  - Storefront (Direct)   |  |
|  |   PostgreSQL)       |  |   Heuristic Fallback)|  |  - FB / Craigslist / eBay|  |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  |  Audit & AI Ledger  |  |  NHTSA VIN Decoder   |  |  Event Bus / Webhooks    |  |
|  +---------------------+  +----------------------+  +--------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Multi-Tenancy & Security Architecture
1. **Organization-Scoped Tenancy**: Every operational table (`vehicles`, `leads`, `deals`, `expenses`, `conversations`, `marketplace_accounts`, etc.) enforces an `organizationId` foreign key and compound indexes.
2. **Context Resolution**: Server requests dynamically resolve organization membership and user permissions (`Owner`, `Manager`, `Sales`, `Inventory`, `Finance`, `Viewer`).
3. **AI Action Ledger & Audit Guard**: Any high-stakes action initiated by an AI agent (e.g. publishing listings, price changes, sending counter-offers, delisting vehicles, updating deal documents) is immutably recorded in `ai_actions` and `audit_logs` with timestamps, model IDs, inputs, calculated limits, and human approval status.

---

## 3. Autonomous AI Pipeline
- **Vehicle Intelligence Engine**: Evaluates VIN, condition, mileage, auction fees, and estimated repairs to produce market values, target bids, expected gross profits, days-to-sell, and an Opportunity Score (0-100) with BUY/PASS recommendations.
- **AI Listing Studio**: Ingests verified vehicle specifications and reconditioning history to generate multichannel advertising copy (SEO titles, marketplace descriptions, social media captions with tags) without inventing unverified features.
- **AI Sales Agent**: Operates across SMS, Web Chat, WhatsApp, and Marketplace channels. Respects Dealer-configured pricing thresholds:
  $$\text{Asking Price} \ge \text{Negotiated Price} \ge \text{Absolute Minimum Price}$$
  Automatically answers inventory queries, qualifies trade-in and financing readiness, books test drives, and escalates out-of-bounds buyer requests to human sales managers.
- **Dealer Executive Assistant**: Provides conversational querying over dealership databases via function-calling tools (inventory aging, gross profit per source, lead conversion, auction buy lists).

---

## 4. Event Automation Engine
A reactive event engine triggers standard dealership operations:
- `vehicle.ready` -> Trigger AI Listing draft generation.
- `listing.approved` -> Broadcast to authorized marketplace adapters.
- `message.received` -> Ingest lead into CRM and trigger AI Sales Agent response.
- `vehicle.sold` -> Trigger automatic removal of active marketplace listings and compute realized gross profit.
- `inventory.aged` -> Generate price drop recommendation notification when age > 45 days.
