# DealerOS Database Schema Reference

## 1. Core Models & Entity Relationships

### 1.1 Multi-Tenant Organization & Staffing
- **`organizations`**: Dealership tenant entity. Fields: `id`, `name`, `slug`, `phone`, `email`, `address`, `city`, `state`, `zip`, `website`, `logoUrl`, `settingsJson`, `createdAt`, `updatedAt`.
- **`users`**: Platform users across dealerships. Fields: `id`, `email`, `name`, `passwordHash`, `avatarUrl`, `phone`, `createdAt`, `updatedAt`.
- **`organization_members`**: Organization-to-user membership and role mapping (`OWNER`, `ADMIN`, `MANAGER`, `SALES`, `INVENTORY`, `FINANCE`, `VIEWER`). Compound unique constraint on `[organizationId, userId]`.
- **`user_invitations`**: Pending staff invitations. Fields: `id`, `organizationId`, `email`, `role`, `token`, `status`, `invitedById`, `expiresAt`, `createdAt`.
- **`dealer_branding`**: Custom dealership branding for white-labeled showrooms (`/dealer/[slug]`). Fields: `id`, `organizationId`, `heroTitle`, `heroSubtitle`, `primaryColor`, `accentColor`, `tagline`, `aboutUs`, `businessHoursJson`, `socialLinksJson`, `policiesJson`, `customDomain`.

### 1.2 Inventory, Valuation & Sourcing
- **`vehicles`**: Master vehicle records. Fields: `id`, `organizationId`, `locationId`, `vin`, `stockNumber`, `year`, `make`, `model`, `trim`, `mileage`, `exteriorColor`, `interiorColor`, `engine`, `transmission`, `drivetrain`, `fuelType`, `bodyStyle`, `purchaseDate`, `purchaseSource`, `purchasePrice`, `totalCostBasis`, `askingPrice`, `preferredPrice`, `minPrice`, `soldPrice`, `soldDate`, `status` (`OPPORTUNITY`, `PURCHASED`, `IN_TRANSIT`, `RECONDITIONING`, `READY`, `LISTED`, `PENDING`, `SOLD`, `WHOLESALE`), `conditionGrade`, `notes`, `daysInInventory`.
- **`vehicle_photos`**: High-res image assets. Fields: `id`, `vehicleId`, `url`, `thumbnailUrl`, `caption`, `isCover`, `orderIndex`.
- **`vehicle_expenses`**: Granular cost ledger items (transport, mechanical repairs, paint, detailing). Fields: `id`, `organizationId`, `vehicleId`, `category`, `description`, `vendor`, `amount`, `date`, `receiptUrl`.
- **`opportunities`**: Dealership acquisition evaluation records. Fields: `id`, `organizationId`, `vin`, `year`, `make`, `model`, `trim`, `mileage`, `conditionGrade`, `sourceChannel`, `currentBid`, `buyFee`, `transportEstimate`, `repairEstimate`, `estimatedMarketValue`, `targetAcquisitionPrice`, `maxRecommendedBid`, `expectedSalePrice`, `expectedGrossProfit`, `expectedRoiPercent`, `daysToSellEstimate`, `demandScore`, `opportunityScore`, `recommendation`, `status`, `valuationDataJson`.
- **`opportunity_candidates`**: Cross-dealer and wholesale arbitrage opportunities. Fields: `id`, `organizationId`, `sourceType`, `sourceDealerName`, `sourceLocation`, `vin`, `year`, `make`, `model`, `trim`, `mileage`, `askingPrice`, `estimatedNegotiatedPrice`, `estimatedMarketValue`, `estimatedTransportCost`, `estimatedReconCost`, `estimatedGrossMargin`, `opportunityScore`, `daysListed`, `listingUrl`, `provenanceJson`, `status`.
- **`dealer_network_listings`**: Inter-dealership wholesale availability. Fields: `id`, `organizationId`, `vehicleId`, `availabilityType`, `wholesaleAskingPrice`, `networkNotes`, `isPublicToNetwork`.

### 1.3 Lease Deal Discovery
- **`lease_offers`**: Verified manufacturer and dealership lease programs. Fields: `id`, `organizationId`, `vehicleId`, `year`, `make`, `model`, `trim`, `msrp`, `monthlyPayment`, `effectiveMonthlyCost`, `dueAtSigning`, `termMonths`, `mileageAllowancePerYear`, `residualPercentage`, `residualValue`, `moneyFactor`, `dealerDiscount`, `manufacturerIncentive`, `conquestIncentive`, `loyaltyIncentive`, `acquisitionFee`, `dispositionFee`, `regionEligibility`, `dealScore`, `scoreExplanationJson`, `offerExpiresAt`, `sourceProvider`, `isVerified`.

### 1.4 Consumer Marketplace & Intent Engine
- **`consumer_profiles`**: Shoppers browsing the marketplace. Fields: `id`, `email`, `name`, `phone`, `passwordHash`, `isVerified`, `zipCode`.
- **`consumer_events`**: First-party intent events (`vehicle.viewed`, `vehicle.saved`, `test_drive.requested`, `offer.submitted`). Fields: `id`, `consumerProfileId`, `sessionId`, `eventType`, `entityType`, `entityId`, `metadataJson`, `ipAddress`.
- **`vehicle_interests`**: Real-time vehicle interest level (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) with quote and test-drive flags. Fields: `id`, `organizationId`, `consumerProfileId`, `vehicleId`, `leadId`, `intentLevel`, `viewCount`.
- **`consent_records`**: Legal opt-in ledger (`MARKETING_SMS`, `MARKETING_EMAIL`, `TERMS_OF_SERVICE`). Fields: `id`, `consumerProfileId`, `email`, `phone`, `consentType`, `granted`, `ipAddress`, `userAgent`, `timestamp`.

### 1.5 CRM, Listings, Desking & Automation
- **`leads`**: Dealership CRM leads. Fields: `id`, `organizationId`, `conversationId`, `vehicleId`, `name`, `email`, `phone`, `preferredContactMethod`, `tradeInYear`, `tradeInMake`, `tradeInModel`, `tradeInMileage`, `tradeInEstimate`, `financingNeeded`, `downPaymentAmount`, `creditTier`, `initialOffer`, `currentOffer`, `stage`, `score`, `assignedToId`, `notes`.
- **`deals`**: F&I Buyer's Orders and contracts. Fields: `id`, `organizationId`, `vehicleId`, `leadId`, `buyerName`, `buyerEmail`, `buyerPhone`, `salePrice`, `docFee`, `taxAmount`, `titleRegFee`, `tradeInAllowance`, `tradeInPayoff`, `cashDownPayment`, `financedAmount`, `aprRate`, `loanTermMonths`, `monthlyPayment`, `totalDue`, `dealStatus`.
- **`listings`** & **`marketplace_listings`**: Master listing copy and syndicated marketplace states (Facebook, Autotrader, Storefront, Craigslist).
- **`automation_rules`** & **`automation_runs`**: Triggered automations (`VEHICLE_READY`, `LISTING_APPROVED`, `MESSAGE_RECEIVED`, `VEHICLE_SOLD`).
- **`ai_actions`**: Audited AI operations with price floors and approval flags.
- **`audit_logs`**: Immutable security and financial audit trail.
- **`plans`**, **`subscriptions`**, **`usage_meters`**: SaaS billing and entitlement tracking.
