# AutoAIdealership MVP Testing Guide

This guide provides end-to-end verification instructions for the **AutoAIdealership** platform across the complete 19-step dealership operating lifecycle.

---

## 1. Prerequisites & Environment Setup

### Environment Variables (.env)
Create a `.env` file from `.env.example`:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/autoaidealership?schema=public"

# Security & Sessions
JWT_SECRET="generate-a-secure-random-32-byte-hex-string-here"
ENCRYPTION_SECRET="generate-a-secure-random-64-character-hex-string"

# Provider Integrations (Optional for local development / testing)
VINAUDIT_API_KEY="your-vinaudit-api-key"
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### Initializing Database & Prisma Client
```bash
# 1. Generate TypeScript Prisma Client
npx prisma generate

# 2. Deploy PostgreSQL migrations
npx prisma migrate deploy

# 3. (Optional) Run Database Seeder
npm run db:seed
```

---

## 2. Testing the Complete 19-Step MVP Dealership Workflow

| Step # | Workflow Stage | Where to Test | What to Verify |
|---|---|---|---|
| **1** | **Dealer Registration** | `/register` | Register with First Name, Last Name, Phone, Email, Password, Dealership Name, City, State. Verify automatic redirection to `/onboarding`. |
| **2** | **Dealership Setup Wizard** | `/onboarding` | Complete 5-step wizard (Info, Classification, Inventory scope, Branding, Storefront Feature CTAs). Click "Save & Launch Dashboard". |
| **3** | **Authentication & Login** | `/login` | Log in with registered credentials. Session token cookie is set with HTTP-only security flags. |
| **4** | **Command Center Dashboard** | `/dashboard` | Verify real KPI calculations (Active Units, Cost Basis, Potential Gross Margin, Days in Inventory) computed from database. |
| **5** | **Dealership Settings** | `/settings` | Verify Multi-tenant settings, 6-role RBAC permissions, Storefront feature toggles, and AI autonomous floor settings. |
| **6** | **Vehicle Intake & VIN Decode** | `/inventory/new` | Enter 17-character VIN (e.g. `4T1B11HK5NU123456`) and click **Decode VIN**. Verify specifications populate with data source tag (`NHTSA_LIVE_API`). |
| **7** | **Operational Data Entry** | `/inventory/new` | Enter Stock #, Mileage, Purchase Price ($18,500), Asking Price ($24,500), and Minimum Floor ($20,500). Click **Save Vehicle to Inventory**. |
| **8** | **Vehicle Intelligence Detail** | `/inventory/[id]` | Verify 8 interactive tabs: *Overview, Pricing, History, Market Comps, Photos, Expenses, Listings, Leads*. |
| **9** | **Recon Expense Accounting** | `/inventory/[id]` -> *Expenses* | Add reconditioning expense (e.g. $450 Mechanical, $350 Detailing). Verify vehicle `totalCostBasis` dynamically updates to $19,300. |
| **10** | **Photo Management & Studio** | `/inventory/[id]` -> *Photos* | Add image URL, assign cover photo, and trigger studio background removal. |
| **11** | **AI Listing Studio** | `/listings` or `/inventory/[id]` | Generate multi-format listing copy (Story, Facebook Marketplace, Craigslist, Social, SEO). Edit copy and save draft. |
| **12** | **1-Click Storefront Publishing** | `/inventory/[id]` -> *Listings* | Click **1-Click Publish to Storefront**. Vehicle status updates to `LISTED` and `MarketplaceListing` is set to `LIVE`. |
| **13** | **Public Dealership Showroom** | `/dealer/[slug]` | Visit public dealer showroom without logging in. Verify inventory renders with photos, pricing, and dealer guarantees. |
| **14** | **Vehicle Detail & Customer CTAs** | `/dealer/[slug]/inventory/[id]` | Inspect public vehicle detail page. Verify Schedule Test Drive, Make Offer, Financing, and Trade-In modals. |
| **15** | **Lead Capture** | Public Vehicle Detail modal | Submit customer inquiry / offer. Verify `Lead` record is created in CRM with `stage: 'NEW'` and audit notification. |
| **16** | **VIP Test Drive Scheduling** | Public Vehicle Detail modal | Schedule test drive. Verify appointment is created in `/appointments` and lead stage transitions to `APPOINTMENT`. |
| **17** | **CRM Pipeline Operations** | `/leads` | Open 8-stage Kanban CRM. Shift lead stage to `NEGOTIATING`, assign staff salesperson, and append activity notes. |
| **18** | **Test Drive Desk** | `/appointments` | Click **Confirm** or **Complete** on scheduled test drive. |
| **19** | **Mark Vehicle Sold & Profit Logging**| `/inventory/[id]` | Click **Mark Vehicle Sold**. Enter sold price ($24,000) and buyer details. Verify vehicle status -> `SOLD`, storefront delisted, deal record created, and gross profit (+$4,700) logged. |

---

## 3. Automated Test Suite Execution

Run the complete automated test suite verifying multi-tenant isolation, cryptographic security, and the 19-step workflow:

```bash
# Run Vitest test suite
npm test

# Run Typecheck
npm run typecheck

# Run Linter
npm run lint

# Build production bundle
npm run build
```

---

## 4. Multi-Tenant Isolation Verification

- **Organization Scoping**: All queries for vehicles, leads, deals, appointments, and conversations enforce `organizationId = tenant.organizationId`.
- **Cross-Tenant Guard**: If Dealer A attempts to view or modify an inventory item or lead belonging to Dealer B, the system returns an immediate 404 Not Found.
- **Credential Storage**: External provider API keys are encrypted at rest using AES-256-GCM (`src/lib/security/credentials.ts`) and never exposed in client API responses.
