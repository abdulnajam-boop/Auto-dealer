# DealerOS Architecture Design Document

## 1. System Overview
DealerOS is an autonomous, AI-augmented Dealer Operating System & Consumer Automotive Platform engineered for independent and franchise dealerships, as well as retail car shoppers.

```
+--------------------------------------------------------------------------------------------------------------------+
|                                                  CLIENT SURFACES                                                   |
|  +--------------------+  +----------------------+  +--------------------+  +---------------------+  +------------+ |
|  | Corporate SaaS Site|  | DealerOS Management  |  | Branded Showroom   |  | Consumer Marketplace|  | Lease Deals| |
|  | (dealeros.com / /) |  | (/d/[slug]/dashboard)|  | (/dealer/[slug])   |  | (/cars, /cars/[id]) |  |(/lease-deals)|
|  +---------+----------+  +----------+-----------+  +---------+----------+  +----------+----------+  +-----+------+ |
+------------|------------------------|------------------------|------------------------|-------------------|--------+
             +------------------------+------------------------+------------------------+-------------------+
                                                               |
+--------------------------------------------------------------v-----------------------------------------------------+
|                                           API & SECURITY GATEWAY                                                   |
|  +--------------------------------------------------------------------------------------------------------------+  |
|  | - Next.js Edge Middleware & JWT Session Guard (HTTP-only signed cookies via jose)                             |  |
|  | - Path-Based & Subdomain Multi-Tenant Context Resolver (Organization, Membership, and 6-Role RBAC Matrix)    |  |
|  | - First-Party Consumer Intent & Lead Capture Engine (Explicit SMS/Email Consent Logging)                    |  |
|  +--------------------------------------------------------------------------------------------------------------+  |
|  | Core Domain Services:                                                                                        |  |
|  | - Vehicle Intelligence & Arbitrage Engine      - Autonomous AI Sales Agent Engine (Bounded Negotiations)     |  |
|  | - Omnichannel Master Listing Studio & Delist   - Mathematical Lease Calculator & Explainable Deal Scorer     |  |
|  | - Real-Time Auction Ingestion & Run Lists      - CRM, Unified Inbox & Digital F&I Desking                    |  |
|  | - Team & User Management with RBAC Guards      - Provider Cost Metering & Caching Layer                      |  |
|  +--------------------------------------------------------------------------------------------------------------+  |
+--------------------------------------------------------------+-----------------------------------------------------+
                                                               |
+--------------------------------------------------------------v-----------------------------------------------------+
|                                            DATA & INTEGRATION LAYER                                                |
|  +---------------------------+  +--------------------------+  +-------------------------------------------------+  |
|  | Relational Database       |  | Automotive Data Feeds    |  | Marketplace & Communication Adapters            |  |
|  | - PostgreSQL (Prod)      |  | - NHTSA VPIC (Live API)  |  | - Branded Storefront (Direct DB)                |  |
|  | - SQLite (Dev / Test)     |  | - VinAudit (NMVTIS Comps)|  | - Meta Automotive Catalog (Feed / Manual Kit)   |  |
|  | - Prisma ORM Model Layer  |  | - CARFAX / AutoCheck     |  | - Autotrader / Cars.com (Syndication Feed)      |  |
|  | - Immutable Audit Logs    |  | - Manheim / ACV Auctions |  | - Twilio 2-Way SMS & Live Web Chat              |  |
|  +---------------------------+  +--------------------------+  +-------------------------------------------------+  |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Multi-Tenancy & Path-Based Routing Architecture
1. **Path-Based Tenancy**:
   - `/d/[dealerSlug]/dashboard` -> Dealership operating workspace.
   - `/dealer/[dealerSlug]` -> Public branded showroom powered by DealerOS.
   - Domain architecture supports future subdomains (`[dealerSlug].dealeros.com`) and custom CNAME domains (`cars.[dealership].com`) without changing core business logic.
2. **Strict Server-Side Isolation**: Every database query executes with `where: { organizationId: tenant.organizationId }`. Users can only access dealerships where they have an active `OrganizationMember` record.
3. **6-Role Granular RBAC**:
   - `OWNER`: Full administrative access, billing, team management, and pricing control.
   - `ADMIN`: Full access and user management.
   - `MANAGER`: Desking approvals, inventory intake, and lead assignment.
   - `SALES`: CRM, active leads, web chat, and listing copy creation.
   - `INVENTORY`: Vehicle acquisitions, recon ledger, and auction watchlist.
   - `FINANCE`: F&I contracts, loans, buyer orders, and bill of sale documents.
   - `VIEWER`: Read-only reporting.

---

## 3. Mathematical Rule Engines & Data Provenance

### 3.1 Vehicle Opportunity & Arbitrage Engine
Calculates net acquisition viability across auctions, dealer networks, and private listings:
$$\text{Expected Margin} = \text{Estimated Market Value} - (\text{Acquisition Price} + \text{Transport} + \text{Reconditioning} + \text{Fees})$$
$$\text{Opportunity Score} = w_1 \cdot \text{Margin} + w_2 \cdot \text{Demand} + w_3 \cdot \text{DaysToSell} + w_4 \cdot \text{ConditionRisk} + w_5 \cdot \text{TitleRisk}$$

Every numerical calculation tags its provenance: `LIVE`, `PROVIDER_DATA`, `CALCULATED`, `DEALER_ENTERED`, `ESTIMATED`, or `SIMULATED`.

### 3.2 Lease Calculator & Explainable Deal Score
$$\text{Residual Value} = \text{MSRP} \times \text{Residual Percentage}$$
$$\text{Depreciation Portion} = \frac{\text{Adjusted Cap Cost} - \text{Residual Value}}{\text{Term}}$$
$$\text{Finance Charge} = (\text{Adjusted Cap Cost} + \text{Residual Value}) \times \text{Money Factor}$$
$$\text{Base Payment} = \text{Depreciation Portion} + \text{Finance Charge}$$
$$\text{Effective Monthly Cost} = \frac{\text{Monthly Payment} \times \text{Term} + \text{Due at Signing} + \text{Unavoidable Fees}}{\text{Term}}$$

---

## 4. Consumer Intent Engine & Lead Capture
1. **Guest Lead Capture**: Shoppers submit inquiries without forced upfront account creation.
2. **Explicit Consent Ledger**: Captures `MARKETING_SMS`, `MARKETING_EMAIL`, and `TERMS_OF_SERVICE` consent with IP addresses and user agents.
3. **First-Party Intent Events**: Tracks behavioral milestones (`vehicle.viewed`, `vehicle.saved`, `test_drive.requested`, `offer.submitted`) to calculate real-time lead urgency in the dealership CRM.
