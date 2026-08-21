# AutoAIdealership Database Schema Reference

## 1. Multi-Tenant Architecture & Data Scoping
All operational records are strictly scoped by `organizationId`. Cross-tenant querying is prevented at both the application API layer and database query construction.

---

## 2. Relational Data Models

### 2.1 Corporate SaaS & Lead Intake
- **`demo_requests`**: Inbound qualification requests from `/demo` and `/request-demo`.
  - Fields: `id`, `firstName`, `lastName`, `dealershipName`, `businessEmail`, `phone`, `state`, `inventorySize`, `employeeCount`, `currentDms`, `mainChallenge`, `preferredContactMethod`, `preferredDemoDate`, `preferredDemoTime`, `status` (`PENDING`, `CONTACTED`, `SCHEDULED`, `QUALIFIED`, `CLOSED`), `notes`, `createdAt`, `updatedAt`.

### 2.2 Multi-Tenant Organizations & Staffing
- **`organizations`**: Dealership tenant entity.
  - Fields: `id`, `name`, `slug`, `phone`, `email`, `address`, `city`, `state`, `zip`, `website`, `logoUrl`, `settingsJson`, `createdAt`, `updatedAt`.
- **`users`**: Platform users across dealerships.
  - Fields: `id`, `email`, `name`, `passwordHash`, `avatarUrl`, `phone`, `createdAt`, `updatedAt`.
- **`organization_members`**: Organization-to-user membership and role mapping (`OWNER`, `ADMIN`, `MANAGER`, `SALES`, `INVENTORY`, `FINANCE`, `VIEWER`). Compound unique constraint on `[organizationId, userId]`.
- **`user_invitations`**: Pending staff invitations with expiration tokens.
- **`dealer_branding`**: Storefront custom branding and owner feature control center.
  - Fields: `id`, `organizationId`, `heroTitle`, `heroSubtitle`, `primaryColor`, `accentColor`, `tagline`, `aboutUs`, `businessHoursJson`, `socialLinksJson`, `policiesJson`, `customDomain`.
  - **Owner Storefront Toggles**: `showOwnInventory`, `showLeaseDeals`, `showNetworkInventory`, `showPartnerListings`, `showCarfaxCta`, `showFinancingCta`, `showTradeInCta`, `showMakeOffer`, `showScheduleTestDrive`, `showContactDealer`, `showVehicleRecommendations`, `preferredHistoryProvider`.

### 2.3 Inventory, Expense & Vehicle Intelligence
- **`vehicles`**: Master vehicle records.
  - Fields: `id`, `organizationId`, `locationId`, `vin`, `stockNumber`, `year`, `make`, `model`, `trim`, `mileage`, `exteriorColor`, `interiorColor`, `engine`, `transmission`, `drivetrain`, `fuelType`, `bodyStyle`, `purchaseDate`, `purchaseSource`, `purchasePrice`, `totalCostBasis`, `askingPrice`, `preferredPrice`, `minPrice`, `soldPrice`, `soldDate`, `status`, `conditionGrade`, `notes`, `daysInInventory`.
- **`vehicle_photos`**: High-resolution image assets with order index and cover flag.
- **`vehicle_expenses`**: Granular cost ledger items (transport, mechanical repairs, paint, detailing).
- **`opportunities`**: Wholesale, dealer network, and auction evaluation records with explainable 0–100 Opportunity Scores.
- **`vehicle_history_records`**: Normalized vehicle history reports persisted per VIN.
  - Fields: `id`, `organizationId`, `vehicleId`, `vin`, `provider` (`VINAUDIT`, `CARFAX`, `AUTOCHECK`), `reportId`, `titleStatus`, `accidentCount`, `hasAccident`, `salvageRecord`, `junkRecord`, `odometerRollback`, `lastReportedOdometer`, `ownerCount`, `serviceRecordsCount`, `recallCount`, `reportUrl`, `rawReportJson`, `retrievedAt`.

### 2.4 Provider Usage & Entitlement Metering
- **`provider_usage_logs`**: Immutable meter recording external API calls for cost accounting and compliance.
  - Fields: `id`, `organizationId`, `provider` (`VINAUDIT`, `CARFAX`, `AUTOCHECK`, `GEMINI`, `NHTSA`), `endpoint`, `vin`, `status`, `costEstimateCents`, `metadataJson`, `createdAt`.
- **`usage_meters`**: Aggregated monthly quotas per organization.
- **`plans` & `subscriptions`**: Dealership subscription tier definitions (`STARTER`, `PRO`, `AI_PRO`, `ENTERPRISE`).

### 2.5 CRM, Leads, Desking & Automation
- **`leads`**: Dealership CRM leads with stage tracking and trade-in estimates.
- **`deals`**: Digital F&I Buyer's Orders and financing contracts.
- **`listings` & `marketplace_listings`**: Master multi-channel listing copy and syndication tracking.
- **`ai_actions`**: Audited AI operations with price floor checks.
- **`audit_logs`**: Immutable security and financial audit trail.
