# DealerOS: AI-Powered Dealer Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-teal.svg)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-Passing-brightgreen.svg)](https://vitest.dev/)

An end-to-end, production-ready AI-powered SaaS Operating System engineered specifically for independent used-car dealerships. DealerOS consolidates sourcing opportunity evaluation, inventory intake, reconditioning cost accounting, grounded AI listing generation, omni-channel marketplace syndication, unified lead messaging, autonomous AI negotiation guardrails, F&I deal structuring, automated post-sale delisting, and executive analytics into a unified multi-tenant platform.

---

## ⚡ Key Features & Capabilities

- **Executive Command Center (`/dashboard`)**: Daily AI dealer briefings, active inventory desk, financial KPIs, and aged unit alerts.
- **Vehicle Intelligence Sourcing (`/opportunities` & `/auctions`)**: Live NHTSA VPIC 17-char VIN decoding, MMR comp valuation, Target Acquisition & Max Bid calculations, 0–100 Opportunity Scoring, and 1-click won auction intake.
- **DMS Inventory & 360 Detail View (`/inventory` & `/inventory/[id]`)**: Lifecycle tracking from `SOURCING` to `SOLD`, photo galleries, reconditioning expense ledgers, and profit margin analysis.
- **AI Listing Studio (`/listings`)**: Grounded multi-format copywriter producing narrative stories, vehicle highlights, Facebook Marketplace copy, Craigslist templates, social media captions with hashtags, and SEO tags.
- **Marketplace Adapter Hub (`/marketplaces`)**: 1-click "Publish Everywhere" syndication supporting Storefront, Facebook Marketplace, Craigslist, eBay Motors, Autotrader, Cars.com, and CarGurus.
- **Unified Inbox & Autonomous AI Sales Agent (`/messages`)**: Omni-channel chat manager enforcing strict dealer negotiation boundaries ($P_{\text{min}}$ invariant price floors).
- **CRM Pipeline & VIP Appointments (`/leads` & `/appointments`)**: Kanban pipeline tracking customer journeys and scheduling test drives and trade-in appraisals.
- **F&I Deal Desk & Documents Vault (`/deals` & `/documents`)**: Deal structuring (taxes, doc fee, down payment, APR rate, monthly payment), printable state Bills of Sale / Buyer's Orders, and 1-click "Deliver & Complete Sale" that triggers automated post-sale delisting.
- **Executive Analytics & AI Copilot (`/analytics` & `/assistant`)**: Realized gross profit calculation, inventory turnover velocity, profit by sourcing channel, and conversational natural language database inspection.
- **Public Customer Storefront (`/storefront`)**: Modern consumer-facing showroom featuring searchable inventory, vehicle detail pages (`/storefront/inventory/[id]`), financing pre-approval, trade-in equity estimator, and live AI Sales Concierge (`Alex`).

---

## 🏗️ System Architecture

```
dealer-os/
├── docker-compose.yml          # Optional local PostgreSQL container
├── prisma/
│   ├── schema.prisma           # 24 relational models (multi-tenant)
│   └── seed.ts                 # Realistic demo data (22+ vehicles, leads, deals)
├── src/
│   ├── app/
│   │   ├── (dealer)/           # Dealer Operating System protected portal
│   │   │   ├── dashboard/      # Executive KPIs & AI briefings
│   │   │   ├── opportunities/  # Sourcing intelligence & VIN decoder
│   │   │   ├── auctions/       # Live auction lane bidding tracker
│   │   │   ├── inventory/      # DMS vehicle catalog & 360 details
│   │   │   ├── listings/       # AI Listing Studio
│   │   │   ├── marketplaces/   # Syndication orchestrator hub
│   │   │   ├── messages/       # Unified inbox & AI sales agent
│   │   │   ├── leads/          # CRM Kanban pipeline
│   │   │   ├── appointments/   # Scheduled test drives
│   │   │   ├── deals/          # F&I deal desk & closing
│   │   │   ├── expenses/       # Reconditioning cost ledger
│   │   │   ├── analytics/      # Financial turnover & channel ROI
│   │   │   ├── assistant/      # Conversational executive AI copilot
│   │   │   ├── documents/      # Printable Bill of Sale vault
│   │   │   ├── automations/    # Reactive event rules & webhooks
│   │   │   └── settings/       # Tenant profiles & AI guardrails
│   │   ├── storefront/         # Public customer showroom & portal
│   │   └── api/                # REST & AI backend route handlers
│   ├── components/             # Reusable UI widgets & modals
│   └── lib/                    # Core business logic & AI engines
│       ├── ai/                 # Gemini API & deterministic fallback engines
│       ├── valuation/          # Vehicle intelligence & scoring formulas
│       ├── vin/                # NHTSA VPIC decoder
│       ├── marketplaces/       # Adapter pattern implementations
│       ├── automations/        # Event bus & lifecycle triggers
│       └── tenant.ts           # Multi-tenant context resolution
└── tests/                      # Automated Vitest test suites
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **Docker** *(Optional)*: For local PostgreSQL container

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/abdulnajam-boop/Auto-dealer.git
cd Auto-dealer

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Default configuration (zero-config SQLite):
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="" # Optional: fallback deterministic local engine is active when unset
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="DealerOS"
DEFAULT_ORG_ID="org_apex_motors"
ENABLE_MOCK_MARKETPLACES="true"
```

*(Optional PostgreSQL Database)*:
```bash
docker compose up -d
# Update .env: DATABASE_URL="postgresql://dealeros:dealeros_dev_password@localhost:5432/dealeros_db?schema=public"
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client and push schema to database
npm run db:push

# Seed realistic dealership demo data (22+ vehicles, leads, deals, expenses)
npm run db:seed
```

### 5. Running the Application
```bash
# Start Next.js development server
npm run dev
```

Open your browser to:
- **Dealer Operating System**: `http://localhost:3000/dashboard`
- **Public Customer Showroom**: `http://localhost:3000/storefront`

---

## 🧪 Testing & Verification

```bash
# Run unit, integration, and full lifecycle E2E tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Build for production
npm run build
```

---

## 🔒 Security & Privacy

- **Tenant Isolation**: Every database query is strictly filtered by `organizationId`.
- **Server-Side AI Abstraction**: External AI models (Gemini) are exclusively invoked through backend route handlers. API keys are never exposed to the client.
- **Hard Negotiation Invariant Floor**: The AI sales negotiator strictly enforces $P_{\text{min}}$ price boundaries and cannot commit to below-floor pricing without explicit manager approval.
- **Audit Logging**: All automated AI operations and deal state mutations are recorded in immutable audit ledgers.

---

## 📄 License
Private & Confidential. All rights reserved.
