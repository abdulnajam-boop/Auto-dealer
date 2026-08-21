# AutoAIdealership: Autonomous AI Dealership Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-teal.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-brightgreen.svg)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-Passing-green.svg)](https://eslint.org/)

**AutoAIdealership** (`autoaidealership.com`) is a production-grade multi-tenant AI Dealership Operating System engineered for modern independent automotive dealerships. It unifies wholesale vehicle intelligence, instant VIN decoding, automated multi-format copywriting, 1-click storefront publishing, lead capture, VIP test drive booking, 8-stage CRM sales pipeline, and post-sale inventory delisting with real-time profit accounting.

*Tagline:* **Smarter Dealers. Better Deals.**

---

## ⚡ Complete 19-Step Dealership Operating Workflow

A dealership owner can execute the complete end-to-end lifecycle within the platform:

1. **Register** (`/register`): Set up dealer account with first/last name, phone, email, and dealership name.
2. **Onboard** (`/onboarding`): 5-step interactive setup wizard (info, classification, inventory scope, branding, feature CTAs).
3. **Log In** (`/login`): Secure session authentication with HTTP-only cookie tokens.
4. **Command Center** (`/dashboard`): Real KPI analytics (active units, cost basis, potential gross profit, days in stock).
5. **Configure Settings** (`/settings`): RBAC roles, storefront toggles (11 controls), and AI floor limits.
6. **Add Vehicle** (`/inventory/new`): Intake lot inventory with instant 17-character VIN decode.
7. **Decode VIN** (`/api/vin/decode`): NHTSA VPIC / VinAudit spec extraction with provenance tags.
8. **Store Vehicle**: Save factory specifications, acquisition source, asking price, and minimum floor price.
9. **Upload Photos** (`/inventory/[id]` -> *Photos*): Upload gallery photos, assign cover image, and run studio background removal.
10. **Record Recon Expenses** (`/inventory/[id]` -> *Expenses*): Log parts, mechanical repair, and detailing; automatically updates cost basis.
11. **Generate Listing** (`/listings`): AI copywriter creates Story narrative, Facebook Marketplace, Craigslist, Social, and SEO metadata.
12. **1-Click Storefront Publishing**: Publish listing directly to the dealership's public showroom.
13. **Public Showroom** (`/dealer/[slug]`): Customers browse inventory, specs, and certified vehicle history badges.
14. **Customer Vehicle Detail** (`/dealer/[slug]/inventory/[id]`): Interactive customer tools (Test Drive, Make Offer, Financing, Trade-In).
15. **Capture Lead** (`/api/consumer/leads`): Customer inquiry creates CRM lead with `stage: 'NEW'` and instant staff notification.
16. **Schedule Test Drive** (`/api/consumer/appointments`): Customer books showroom appointment; lead moves to `APPOINTMENT`.
17. **CRM Pipeline Operations** (`/leads`): 8-stage Kanban pipeline (`NEW` -> `CONTACTED` -> `QUALIFIED` -> `APPOINTMENT` -> `NEGOTIATING` -> `PENDING` -> `SOLD` -> `LOST`).
18. **Appointments Desk** (`/appointments`): Confirm, reschedule, or complete customer test drives.
19. **Mark Vehicle Sold**: Dealer logs sold price and date; system delists vehicle from storefront, archives listing, creates deal, and computes realized gross profit.

---

## 🏗️ Architecture & Database

- **Database Engine**: PostgreSQL (`provider = "postgresql"`).
- **Migration Strategy**: Version-controlled migrations (`prisma/migrations/`) executed via `npx prisma migrate deploy`.
- **Tenant Isolation**: Row-level isolation on all queries scoped to `organizationId`.
- **Security Vault**: AES-256-GCM encryption (`src/lib/security/credentials.ts`) for all external provider secrets.

```
Auto-dealer/
├── .github/workflows/
│   └── ci.yml                     # Automated CI pipeline with PostgreSQL service
├── prisma/
│   ├── schema.prisma              # Relational models with multi-tenant indexes
│   └── migrations/                # Versioned PostgreSQL DDL migrations
├── src/
│   ├── app/
│   │   ├── (auth)/                # Multi-tenant login & dealer registration
│   │   ├── (dealer)/              # Dealership Operating System portal
│   │   │   ├── dashboard/         # Command center & KPI analytics
│   │   │   ├── onboarding/        # 5-step Dealership Setup Wizard
│   │   │   ├── inventory/         # DMS vehicle list & intake (/inventory/new)
│   │   │   ├── listings/          # AI Listing Studio & multi-format copy
│   │   │   ├── leads/             # 8-stage CRM Kanban pipeline
│   │   │   ├── appointments/      # Test drive & showroom appointment desk
│   │   │   ├── deals/             # Digital F&I desking & contracting
│   │   │   ├── analytics/         # Turnover & margin reports
│   │   │   └── settings/          # Storefront Controls & Team RBAC
│   │   ├── dealer/[slug]/         # Public branded dealership showroom
│   │   └── api/                   # Scoped REST API handlers
│   ├── components/                # React UI components & BrandLogo
│   └── lib/                       # Security vault, VIN decoders, and AI agents
└── tests/                         # Vitest test suite verifying 19-step workflow
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or later (v20+ recommended)
- **PostgreSQL**: v14 or later

### 2. Setup & Execution
```bash
# 1. Clone repository
git clone https://github.com/abdulnajam-boop/Auto-dealer.git
cd Auto-dealer

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set your PostgreSQL DATABASE_URL, JWT_SECRET, and ENCRYPTION_SECRET

# 4. Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma migrate deploy

# 5. Start Development Server
npm run dev
```

Visit:
- **AutoAIdealership Platform**: `http://localhost:3000`
- **Dealer Registration**: `http://localhost:3000/register`
- **Dealership Command Center**: `http://localhost:3000/dashboard`
- **Public Showroom**: `http://localhost:3000/dealer/apex-motors`

---

## 🧪 Testing & Verification

```bash
# Run Vitest test suite
npm test

# Run TypeScript check
npm run typecheck

# Run Linter
npm run lint

# Compile production build
npm run build
```

See [MVP_TESTING.md](file:///c:/Users/abdul/Documents/Auto-dealer/MVP_TESTING.md) for detailed manual testing procedures.

---

## 📄 License & Intellectual Property
© AutoAIdealership (`autoaidealership.com`). All rights reserved.
