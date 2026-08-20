# DealerOS Product Requirements Document (PRD)

## 1. Product Vision & Architecture
DealerOS is the comprehensive automotive retail operating system serving both **B2B Dealerships** (operating platform, inventory management, auction sourcing, CRM, F&I desking, AI sales autonomy) and **B2C Vehicle Shoppers** (consumer marketplace, lease deal discovery, direct showroom scheduling, transparent out-the-door pricing).

### Four Core Platform Experiences:
1. **DealerOS Corporate Website** (`/`, `/features`, `/pricing`, `/integrations`, `/demo`, `/security`): SaaS marketing website showcasing value to dealership owners.
2. **Dealership Management SaaS** (`/d/[dealerSlug]/dashboard`, `/inventory`, `/opportunities`, `/deals`, `/crm`, `/settings`): High-turn internal operating system with strict multi-tenant isolation and 6-role RBAC.
3. **Branded Dealership Showrooms** (`/dealer/[dealerSlug]`): White-labeled public website powered by DealerOS with dealer branding, inventory, and scheduling.
4. **Consumer Vehicle & Lease Marketplace** (`/cars`, `/cars/[id]`, `/lease-deals`): Nationwide shopper discovery engine for buying and leasing vehicles with transparent out-the-door pricing and explainable Deal Scores.

---

## 2. Core Modules & Specifications

### 2.1 Corporate SaaS Website (`/`, `/features`, `/pricing`, `/demo`, `/integrations`)
- **Homepage Messaging**: "One platform to buy, manage, market and sell vehicles."
- **Primary CTAs**: START FREE TRIAL (`/register`), BOOK DEMO (`/demo`), SIGN IN (`/login`).
- **Pillars Covered**: Autonomous AI Sales Agent, Cross-Dealer Arbitrage Engine, Omnichannel Listing Studio, Auction Center, Lease Deal Discovery, F&I Desking, and Unified Inbox.
- **Pricing Plans**: Starter ($249/mo), Professional ($499/mo), Enterprise ($1,299/mo) with 20% annual discount.

### 2.2 Dealership Onboarding & Path-Based Tenancy
- **Self-Service Signup**: Collects dealership name, owner name, email, phone, physical lot address, and preferred dealership slug (`/dealer/[slug]` and `/d/[slug]/dashboard`).
- **Automatic Provisioning**: Organization tenant, owner account, default location, F&I defaults ($499 doc fee, 6.25% state tax), default branding, and sample inventory.
- **Path-Based Tenancy**: Strict database query isolation; prevents cross-dealer data leakage.

### 2.3 Team & User Management (Settings -> Team & Users)
- **Role Hierarchy**: `OWNER`, `ADMIN`, `MANAGER`, `SALES`, `INVENTORY`, `FINANCE`, `VIEWER`.
- **Server-Side Enforcement**: Only `OWNER` and `ADMIN` can invite users, assign roles, or remove members. Cost basis and private margins are hidden from unauthorized roles.
- **Audit Logging**: Every invitation, role change, price override, and deal execution is recorded with timestamps and user attribution.

### 2.4 Consumer Automotive Marketplace (`/cars`, `/cars/[id]`)
- **Platform-Wide Inventory Search**: Real-time filtering across Make, Model, Trim, Year, Price Range, Max Monthly Payment, Mileage, Fuel Type (EV / Hybrid / Gas), Drivetrain, and ZIP radius.
- **Vehicle Cards**: High-res photo, condition grade, asking price, estimated monthly payment (60 mos @ 5.99%), dealer location, and 1-click test drive link.
- **Vehicle Detail Page (`/cars/[id]`)**: Photo gallery, decoded NHTSA VIN specifications, dealer hours/contact, similar vehicles, and guest lead capture modals:
  - `CHECK AVAILABILITY`
  - `MESSAGE DEALER`
  - `SCHEDULE TEST DRIVE`
  - `MAKE OFFER`
  - `START FINANCING`
  - `VALUE TRADE-IN`
- **Explicit Consent**: Captures explicit opt-in consent for SMS and email marketing with IP timestamps.

### 2.5 Public Lease Deal Discovery (`/lease-deals`)
- **Lease Deal Discovery**: Aggregates OEM programs and verified dealer lease specials.
- **True Effective Monthly Cost**: Computes exact cost amortization:
  $$\text{Effective Monthly Cost} = \frac{\text{Monthly Payment} \times \text{Term} + \text{Due at Signing} + \text{Unavoidable Fees}}{\text{Term}}$$
- **Explainable Lease Deal Score (0–100)**: Evaluates residual value percentage, money factor APR equivalent, manufacturer incentives, and upfront down payment.
- **Interactive Lease Calculator**: Live input adjustment for MSRP, discount, incentives, residual %, money factor, term, due at signing, and state taxes.

### 2.6 Opportunity Center & Cross-Dealer Arbitrage
- **Multi-Source Sourcing Tabs**: `AUCTIONS`, `DEALER INVENTORY`, `PRIVATE MARKET`, `TRADE-INS`, `WHOLESALE`, `LEASE RETURNS`, `WATCHLIST`.
- **Arbitrage Mathematics**:
  $$\text{Expected Margin} = \text{Estimated Market Value} - (\text{Acquisition Price} + \text{Transport} + \text{Reconditioning} + \text{Fees})$$
- **Data Provenance**: Every metric identifies whether it is `LIVE`, `PROVIDER_DATA`, `CALCULATED`, `DEALER_ENTERED`, `ESTIMATED`, or `SIMULATED`.

### 2.7 Master Listing Studio & Multi-Marketplace Hub
- **Single Master Listing**: AI Listing Studio creates tailored copy for Storefront, Facebook Marketplace, Autotrader, Cars.com, and Craigslist.
- **Automated Post-Sale Delisting**: When a deal closes (`vehicle.status = SOLD`), the system triggers instant delisting across all connected channels.

### 2.8 Autonomous AI Sales Agent & Unified Inbox
- **Bounded Negotiation Engine**: AI negotiates strictly within dealer-approved price boundaries: $\text{Asking Price} \ge \text{Counter Price} \ge \text{Min Floor Price}$.
- **Omnichannel Inbox**: Unifies customer conversations across Storefront Web Chat, SMS via Twilio, and Facebook Messenger into a single desk.

### 2.9 F&I Deal Desk & Legal Documents
- **Complete Desking Calculations**: Vehicle price, doc fee, state sales tax, title/registration, trade-in allowance, trade-in payoff, down payment, financed amount, APR, term, and monthly payment.
- **Document Generation**: Print-ready Buyer's Order and Bill of Sale contracts.
