# AutoAIdealership: AI-Powered Dealership Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-teal.svg)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-36%20Passing-brightgreen.svg)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-9%20Passing-green.svg)](https://eslint.org/)

**AutoAIdealership** (`autoaidealership.com`) is an enterprise multi-tenant AI Dealership Operating System engineered for independent automotive dealerships. It unifies wholesale opportunity intelligence, 24/7 bounded AI buyer negotiation, VinAudit vehicle history normalization, digital F&I desking, owner storefront controls, and post-sale inventory delisting.

*Tagline:* **Smarter Dealers. Better Deals.**

---

## ⚡ Core Platform Capabilities

### 1. B2B Marketing & SaaS Presentation
- **Corporate Homepage (`/`)**: Value proposition for independent lots, interactive video demo modal with fallback poster, modular feature previews, and transparent pricing previews.
- **Request Demo & Trial Hub (`/demo`, `/request-demo`)**: Comprehensive qualification form (inventory size, staff count, DMS, main challenge, contact preference, preferred demo date/time) with in-memory IP rate limiting, honeypot spam protection, and database persistence.
- **Transparent SaaS Pricing (`/pricing`)**: Tiered plans (**Starter** $249, **Pro** $499, **AI Pro** $799, **Enterprise** $1,499) with full entitlement matrices and annual billing toggles.
- **About Us (`/about`)**: Independent dealer focus, margin protection, transparent data provenance, and bounded AI principles.
- **Provider & Integration Directory (`/integrations`)**: Complete directory with status transparency (`LIVE`, `IMPLEMENTED`, `PARTNER REQUIRED`, `RESEARCH REQUIRED`, `MANUAL`).

### 2. Dealership Operations Portal (DealerOS)
- **Executive Command Center (`/dashboard`)**: Daily AI morning briefings, inventory turnover velocity, profit margins, and aged lot alerts.
- **Opportunity Intelligence (`/opportunities`)**: VIN decoding, wholesale comp calculations, transport and recon modeling, and 0–100 explainable Opportunity Scoring.
- **24/7 Bounded AI Sales Concierge (`/messages`)**: Customer negotiation bot with strict invariant floor pricing ($P_{\text{min}}$) and human escalation triggers.
- **Owner Storefront & Content Center (`/settings`)**: 11 independent toggles controlling public inventory feeds (Own Inventory, Lease Deals, Network Listings, Partner Listings) and conversion CTAs (CARFAX/History, Financing, Trade-In, Make Offer, Schedule Test Drive).
- **VinAudit Subsystem (`src/lib/providers/vinaudit/`)**: Normalized vehicle specifications, Plate-to-VIN lookups, title brand records, market valuation comps, and tenant usage metering (`ProviderUsageLog`).
- **F&I Desking & Paperless Documents (`/deals`, `/documents`)**: Contract structuring with state doc fees, sales tax, APR calculations, and printable Buyer's Orders.
- **Multi-Tenant Storefront (`/dealer/[slug]`, `/storefront`)**: Dealer-branded showroom with real-time leads routed exclusively to the hosting organization.

---

## 🏗️ Architecture Overview

```
Auto-dealer/
├── .github/workflows/
│   └── ci.yml                     # Automated CI pipeline (lint, typecheck, test, build)
├── prisma/
│   ├── schema.prisma              # 27 relational models with multi-tenant isolation
│   └── seed.ts                    # Realistic demo seed data (vehicles, leads, brandings)
├── src/
│   ├── app/
│   │   ├── (auth)/                # Multi-tenant login & dealer registration
│   │   ├── (dealer)/              # Dealer Operating System protected portal
│   │   │   ├── dashboard/         # KPIs & AI briefings
│   │   │   ├── opportunities/     # Sourcing intelligence & comp scoring
│   │   │   ├── inventory/         # DMS vehicle management
│   │   │   ├── listings/          # AI Listing Studio
│   │   │   ├── messages/          # Unified inbox & AI sales agent
│   │   │   ├── leads/             # CRM Kanban pipeline
│   │   │   ├── deals/             # Digital F&I desking
│   │   │   ├── analytics/         # Turnover & margin reports
│   │   │   └── settings/          # Owner Storefront Controls & Team RBAC
│   │   ├── api/
│   │   │   ├── demo/              # Rate-limited demo request endpoint
│   │   │   ├── settings/storefront# Owner toggle update endpoint
│   │   │   ├── vin/decode/        # NHTSA & VinAudit VIN decoder
│   │   │   └── assistant/query/   # Natural language dealer copilot
│   │   ├── demo/                  # Request Demo / Trial onboarding page
│   │   ├── pricing/               # SaaS pricing & entitlement matrix
│   │   ├── about/                 # About AutoAIdealership story
│   │   ├── features/              # Audited truthful capability showcase
│   │   └── integrations/          # Provider & auction status directory
│   ├── components/
│   │   ├── brand/                 # BrandLogo SVG vector components
│   │   └── marketing/             # MarketingHeader & MarketingFooter
│   └── lib/
│       ├── providers/
│       │   ├── vinaudit/          # Centralized VinAudit client & usage meter
│       │   └── vehicle-history/   # Factory pattern for VinAudit, CARFAX, AutoCheck
│       └── validation/            # Zod schemas (demo request, storefront settings)
└── tests/                         # Vitest automated test suite (36 tests)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### 2. Quick Setup
```bash
# 1. Clone repository
git clone https://github.com/abdulnajam-boop/Auto-dealer.git
cd Auto-dealer

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Initialize Database
npm run db:push
npm run db:seed

# 5. Start Development Server
npm run dev
```

Visit:
- **AutoAIdealership Website**: `http://localhost:3000`
- **Request Demo**: `http://localhost:3000/demo`
- **Pricing**: `http://localhost:3000/pricing`
- **Dealer Portal**: `http://localhost:3000/dashboard`
- **Dealer Storefront**: `http://localhost:3000/dealer/apex-motors`

---

## 🧪 Quality & Test Verification

```bash
# 1. Code Quality & Linting (ESLint 9)
npm run lint

# 2. Strict TypeScript Verification
npm run typecheck

# 3. Unit, Integration & Multi-Tenant Isolation Tests (Vitest)
npm test

# 4. Production Next.js Bundle Compilation
npm run build
```

---

## 🔒 Security & Tenant Sovereignty

- **Row-Level Tenant Isolation**: All vehicle inventory, pricing margins, CRM customer records, and VinAudit usage logs are strictly scoped by `organizationId`.
- **Server-Side API Key Protection**: External provider credentials (`VINAUDIT_API_KEY`, `CARFAX_API_KEY`, `GEMINI_API_KEY`) are kept strictly server-side and never leaked to client bundles.
- **Hard Negotiation Invariant Floor**: AI sales counter-offers mathematically cannot breach dealer-configured minimum floor prices without manual human authorization.

---

## 📄 License & Intellectual Property
© AutoAIdealership (`autoaidealership.com`). All rights reserved.
