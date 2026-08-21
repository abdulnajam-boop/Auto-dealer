-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "dealerType" TEXT DEFAULT 'INDEPENDENT',
    "inventorySize" TEXT DEFAULT '1-25',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" INTEGER NOT NULL DEFAULT 1,
    "settingsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SALES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "phone" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "locationId" TEXT,
    "vin" TEXT NOT NULL,
    "stockNumber" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "mileage" INTEGER NOT NULL,
    "exteriorColor" TEXT NOT NULL,
    "interiorColor" TEXT,
    "engine" TEXT,
    "transmission" TEXT,
    "drivetrain" TEXT,
    "fuelType" TEXT,
    "bodyStyle" TEXT,
    "doors" INTEGER,
    "featuresJson" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchaseSource" TEXT,
    "purchasePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCostBasis" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "askingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "preferredPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "soldPrice" DOUBLE PRECISION,
    "soldDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'READY',
    "conditionGrade" TEXT,
    "notes" TEXT,
    "daysInInventory" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_photos" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_documents" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_expenses" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vendor" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "mileage" INTEGER NOT NULL,
    "conditionGrade" TEXT NOT NULL DEFAULT 'CLEAN',
    "sourceChannel" TEXT NOT NULL,
    "sourceLocation" TEXT,
    "currentBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "buyFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transportEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repairEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedMarketValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetAcquisitionPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxRecommendedBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedSalePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedGrossProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedRoiPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "daysToSellEstimate" INTEGER NOT NULL DEFAULT 30,
    "demandScore" INTEGER NOT NULL DEFAULT 75,
    "opportunityScore" INTEGER NOT NULL DEFAULT 70,
    "recommendation" TEXT NOT NULL DEFAULT 'BUY',
    "status" TEXT NOT NULL DEFAULT 'ANALYZING',
    "valuationDataJson" TEXT,
    "convertedVehicleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_items" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "auctionPlatform" TEXT NOT NULL,
    "auctionDate" TIMESTAMP(3),
    "runNumber" TEXT,
    "lane" TEXT,
    "startingBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'WATCHING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auction_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "featureBulletsJson" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "facebookCopy" TEXT,
    "craigslistCopy" TEXT,
    "socialCopy" TEXT,
    "hashtagsJson" TEXT,
    "suggestedAskingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_accounts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "encryptedApiKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "settingsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_listings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "externalId" TEXT,
    "externalUrl" TEXT,
    "publishedPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "buyerName" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "buyerEmail" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'STOREFRONT_CHAT',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "leadScore" INTEGER NOT NULL DEFAULT 60,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "conversationId" TEXT,
    "vehicleId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "preferredContactMethod" TEXT NOT NULL DEFAULT 'SMS',
    "tradeInYear" INTEGER,
    "tradeInMake" TEXT,
    "tradeInModel" TEXT,
    "tradeInMileage" INTEGER,
    "tradeInEstimate" DOUBLE PRECISION,
    "financingNeeded" BOOLEAN NOT NULL DEFAULT true,
    "downPaymentAmount" DOUBLE PRECISION,
    "creditTier" TEXT,
    "initialOffer" DOUBLE PRECISION,
    "currentOffer" DOUBLE PRECISION,
    "stage" TEXT NOT NULL DEFAULT 'NEW',
    "score" INTEGER NOT NULL DEFAULT 65,
    "assignedToId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT,
    "vehicleId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "type" TEXT NOT NULL DEFAULT 'TEST_DRIVE',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 45,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "leadId" TEXT,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT,
    "buyerPhone" TEXT,
    "buyerAddress" TEXT,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "docFee" DOUBLE PRECISION NOT NULL DEFAULT 499,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "titleRegFee" DOUBLE PRECISION NOT NULL DEFAULT 150,
    "accessoriesAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tradeInAllowance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tradeInPayoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashDownPayment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "financedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aprRate" DOUBLE PRECISION NOT NULL DEFAULT 6.99,
    "loanTermMonths" INTEGER NOT NULL DEFAULT 60,
    "monthlyPayment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dealStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "fundedDate" TIMESTAMP(3),
    "deliveredDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal_documents" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deal_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rules" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "triggerEvent" TEXT NOT NULL,
    "conditionsJson" TEXT,
    "actionsJson" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_runs" (
    "id" TEXT NOT NULL,
    "automationRuleId" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "entityId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "logDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_actions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "agentType" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "promptInput" TEXT,
    "toolCallsJson" TEXT,
    "outputResult" TEXT,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "detailsJson" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "linkUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealer_branding" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "heroTitle" TEXT DEFAULT 'Find Your Next Exceptional Vehicle',
    "heroSubtitle" TEXT DEFAULT 'Transparent pricing, verified vehicle histories, and frictionless financing.',
    "primaryColor" TEXT DEFAULT '#10b981',
    "accentColor" TEXT DEFAULT '#14b8a6',
    "tagline" TEXT DEFAULT 'Integrity in Every Transaction',
    "aboutUs" TEXT,
    "businessHoursJson" TEXT,
    "socialLinksJson" TEXT,
    "policiesJson" TEXT,
    "customDomain" TEXT,
    "showOwnInventory" BOOLEAN NOT NULL DEFAULT true,
    "showLeaseDeals" BOOLEAN NOT NULL DEFAULT false,
    "showNetworkInventory" BOOLEAN NOT NULL DEFAULT false,
    "showPartnerListings" BOOLEAN NOT NULL DEFAULT false,
    "showCarfaxCta" BOOLEAN NOT NULL DEFAULT true,
    "showFinancingCta" BOOLEAN NOT NULL DEFAULT true,
    "showTradeInCta" BOOLEAN NOT NULL DEFAULT true,
    "showMakeOffer" BOOLEAN NOT NULL DEFAULT true,
    "showScheduleTestDrive" BOOLEAN NOT NULL DEFAULT true,
    "showContactDealer" BOOLEAN NOT NULL DEFAULT true,
    "showVehicleRecommendations" BOOLEAN NOT NULL DEFAULT true,
    "preferredHistoryProvider" TEXT NOT NULL DEFAULT 'VINAUDIT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dealer_branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_invitations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SALES',
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "invitedById" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumer_profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "zipCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumer_events" (
    "id" TEXT NOT NULL,
    "consumerProfileId" TEXT,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadataJson" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumer_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_interests" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "consumerProfileId" TEXT,
    "vehicleId" TEXT,
    "leadId" TEXT,
    "intentLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "viewCount" INTEGER NOT NULL DEFAULT 1,
    "hasRequestedQuote" BOOLEAN NOT NULL DEFAULT false,
    "hasRequestedTest" BOOLEAN NOT NULL DEFAULT false,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_vehicles" (
    "id" TEXT NOT NULL,
    "consumerProfileId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "consumerProfileId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "consentType" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_candidates" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceDealerName" TEXT,
    "sourceLocation" TEXT,
    "vin" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "mileage" INTEGER NOT NULL,
    "askingPrice" DOUBLE PRECISION NOT NULL,
    "estimatedNegotiatedPrice" DOUBLE PRECISION NOT NULL,
    "estimatedMarketValue" DOUBLE PRECISION NOT NULL,
    "estimatedTransportCost" DOUBLE PRECISION NOT NULL DEFAULT 450,
    "estimatedReconCost" DOUBLE PRECISION NOT NULL DEFAULT 600,
    "estimatedGrossMargin" DOUBLE PRECISION NOT NULL,
    "opportunityScore" INTEGER NOT NULL DEFAULT 75,
    "daysListed" INTEGER NOT NULL DEFAULT 15,
    "listingUrl" TEXT,
    "provenanceJson" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealer_network_listings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "availabilityType" TEXT NOT NULL DEFAULT 'RETAIL_ONLY',
    "wholesaleAskingPrice" DOUBLE PRECISION,
    "networkNotes" TEXT,
    "isPublicToNetwork" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dealer_network_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lease_offers" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT NOT NULL,
    "msrp" DOUBLE PRECISION NOT NULL,
    "monthlyPayment" DOUBLE PRECISION NOT NULL,
    "effectiveMonthlyCost" DOUBLE PRECISION NOT NULL,
    "dueAtSigning" DOUBLE PRECISION NOT NULL,
    "termMonths" INTEGER NOT NULL DEFAULT 36,
    "mileageAllowancePerYear" INTEGER NOT NULL DEFAULT 10000,
    "residualPercentage" DOUBLE PRECISION NOT NULL DEFAULT 58,
    "residualValue" DOUBLE PRECISION NOT NULL,
    "moneyFactor" DOUBLE PRECISION NOT NULL DEFAULT 0.00195,
    "dealerDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "manufacturerIncentive" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conquestIncentive" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loyaltyIncentive" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "acquisitionFee" DOUBLE PRECISION NOT NULL DEFAULT 695,
    "dispositionFee" DOUBLE PRECISION NOT NULL DEFAULT 350,
    "regionEligibility" TEXT NOT NULL DEFAULT 'National',
    "dealScore" INTEGER NOT NULL DEFAULT 85,
    "scoreExplanationJson" TEXT,
    "offerExpiresAt" TIMESTAMP(3),
    "sourceProvider" TEXT NOT NULL DEFAULT 'DEALER_INVENTORY',
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lease_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceMonthly" DOUBLE PRECISION NOT NULL,
    "priceAnnual" DOUBLE PRECISION NOT NULL,
    "maxVehicles" INTEGER NOT NULL DEFAULT 50,
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "featuresJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_meters" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "periodDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_meters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_requests" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dealershipName" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "inventorySize" TEXT,
    "employeeCount" TEXT,
    "currentDms" TEXT,
    "mainChallenge" TEXT,
    "preferredContactMethod" TEXT NOT NULL DEFAULT 'EMAIL',
    "preferredDemoDate" TEXT,
    "preferredDemoTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_history_records" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "vehicleId" TEXT,
    "vin" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'VINAUDIT',
    "reportId" TEXT,
    "titleStatus" TEXT,
    "accidentCount" INTEGER NOT NULL DEFAULT 0,
    "hasAccident" BOOLEAN NOT NULL DEFAULT false,
    "salvageRecord" BOOLEAN NOT NULL DEFAULT false,
    "junkRecord" BOOLEAN NOT NULL DEFAULT false,
    "odometerRollback" BOOLEAN NOT NULL DEFAULT false,
    "lastReportedOdometer" INTEGER,
    "ownerCount" INTEGER NOT NULL DEFAULT 1,
    "serviceRecordsCount" INTEGER NOT NULL DEFAULT 0,
    "recallCount" INTEGER NOT NULL DEFAULT 0,
    "reportUrl" TEXT,
    "rawReportJson" TEXT,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_history_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_usage_logs" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "provider" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "vin" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "costEstimateCents" INTEGER NOT NULL DEFAULT 0,
    "metadataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");
CREATE INDEX "organizations_slug_idx" ON "organizations"("slug");

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");

CREATE UNIQUE INDEX "organization_members_organizationId_userId_key" ON "organization_members"("organizationId", "userId");
CREATE INDEX "organization_members_organizationId_idx" ON "organization_members"("organizationId");
CREATE INDEX "organization_members_userId_idx" ON "organization_members"("userId");

CREATE INDEX "locations_organizationId_idx" ON "locations"("organizationId");

CREATE INDEX "vehicles_organizationId_idx" ON "vehicles"("organizationId");
CREATE INDEX "vehicles_organizationId_status_idx" ON "vehicles"("organizationId", "status");
CREATE INDEX "vehicles_organizationId_vin_idx" ON "vehicles"("organizationId", "vin");
CREATE INDEX "vehicles_organizationId_stockNumber_idx" ON "vehicles"("organizationId", "stockNumber");
CREATE INDEX "vehicles_vin_idx" ON "vehicles"("vin");

CREATE INDEX "vehicle_photos_vehicleId_idx" ON "vehicle_photos"("vehicleId");
CREATE INDEX "vehicle_photos_vehicleId_isCover_idx" ON "vehicle_photos"("vehicleId", "isCover");

CREATE INDEX "vehicle_documents_vehicleId_idx" ON "vehicle_documents"("vehicleId");

CREATE INDEX "vehicle_expenses_organizationId_idx" ON "vehicle_expenses"("organizationId");
CREATE INDEX "vehicle_expenses_organizationId_vehicleId_idx" ON "vehicle_expenses"("organizationId", "vehicleId");
CREATE INDEX "vehicle_expenses_vehicleId_idx" ON "vehicle_expenses"("vehicleId");

CREATE INDEX "opportunities_organizationId_idx" ON "opportunities"("organizationId");
CREATE INDEX "opportunities_organizationId_status_idx" ON "opportunities"("organizationId", "status");
CREATE INDEX "opportunities_vin_idx" ON "opportunities"("vin");

CREATE INDEX "auction_items_organizationId_idx" ON "auction_items"("organizationId");
CREATE INDEX "auction_items_organizationId_status_idx" ON "auction_items"("organizationId", "status");

CREATE INDEX "listings_organizationId_idx" ON "listings"("organizationId");
CREATE INDEX "listings_organizationId_vehicleId_idx" ON "listings"("organizationId", "vehicleId");
CREATE INDEX "listings_organizationId_status_idx" ON "listings"("organizationId", "status");

CREATE UNIQUE INDEX "marketplace_accounts_organizationId_platform_key" ON "marketplace_accounts"("organizationId", "platform");
CREATE INDEX "marketplace_accounts_organizationId_idx" ON "marketplace_accounts"("organizationId");

CREATE INDEX "marketplace_listings_organizationId_idx" ON "marketplace_listings"("organizationId");
CREATE INDEX "marketplace_listings_organizationId_platform_status_idx" ON "marketplace_listings"("organizationId", "platform", "status");
CREATE INDEX "marketplace_listings_vehicleId_idx" ON "marketplace_listings"("vehicleId");

CREATE INDEX "conversations_organizationId_idx" ON "conversations"("organizationId");
CREATE INDEX "conversations_organizationId_channel_status_idx" ON "conversations"("organizationId", "channel", "status");

CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");

CREATE UNIQUE INDEX "leads_conversationId_key" ON "leads"("conversationId");
CREATE INDEX "leads_organizationId_idx" ON "leads"("organizationId");
CREATE INDEX "leads_organizationId_stage_idx" ON "leads"("organizationId", "stage");
CREATE INDEX "leads_organizationId_createdAt_idx" ON "leads"("organizationId", "createdAt");

CREATE INDEX "appointments_organizationId_idx" ON "appointments"("organizationId");
CREATE INDEX "appointments_organizationId_status_idx" ON "appointments"("organizationId", "status");
CREATE INDEX "appointments_organizationId_scheduledAt_idx" ON "appointments"("organizationId", "scheduledAt");

CREATE INDEX "deals_organizationId_idx" ON "deals"("organizationId");
CREATE INDEX "deals_organizationId_dealStatus_idx" ON "deals"("organizationId", "dealStatus");
CREATE INDEX "deals_organizationId_createdAt_idx" ON "deals"("organizationId", "createdAt");

CREATE INDEX "deal_documents_dealId_idx" ON "deal_documents"("dealId");

CREATE INDEX "automation_rules_organizationId_idx" ON "automation_rules"("organizationId");
CREATE INDEX "automation_runs_automationRuleId_idx" ON "automation_runs"("automationRuleId");

CREATE INDEX "ai_actions_organizationId_idx" ON "ai_actions"("organizationId");
CREATE INDEX "ai_actions_organizationId_agentType_createdAt_idx" ON "ai_actions"("organizationId", "agentType", "createdAt");

CREATE INDEX "audit_logs_organizationId_idx" ON "audit_logs"("organizationId");
CREATE INDEX "audit_logs_organizationId_entityType_entityId_idx" ON "audit_logs"("organizationId", "entityType", "entityId");

CREATE INDEX "notifications_organizationId_idx" ON "notifications"("organizationId");
CREATE INDEX "notifications_organizationId_isRead_idx" ON "notifications"("organizationId", "isRead");

CREATE UNIQUE INDEX "dealer_branding_organizationId_key" ON "dealer_branding"("organizationId");
CREATE UNIQUE INDEX "dealer_branding_customDomain_key" ON "dealer_branding"("customDomain");
CREATE INDEX "dealer_branding_organizationId_idx" ON "dealer_branding"("organizationId");

CREATE UNIQUE INDEX "user_invitations_token_key" ON "user_invitations"("token");
CREATE INDEX "user_invitations_organizationId_idx" ON "user_invitations"("organizationId");
CREATE INDEX "user_invitations_organizationId_email_idx" ON "user_invitations"("organizationId", "email");

CREATE UNIQUE INDEX "consumer_profiles_email_key" ON "consumer_profiles"("email");
CREATE INDEX "consumer_profiles_email_idx" ON "consumer_profiles"("email");

CREATE INDEX "consumer_events_sessionId_eventType_idx" ON "consumer_events"("sessionId", "eventType");
CREATE INDEX "consumer_events_entityType_entityId_idx" ON "consumer_events"("entityType", "entityId");

CREATE INDEX "vehicle_interests_organizationId_idx" ON "vehicle_interests"("organizationId");
CREATE INDEX "vehicle_interests_organizationId_intentLevel_idx" ON "vehicle_interests"("organizationId", "intentLevel");

CREATE UNIQUE INDEX "saved_vehicles_consumerProfileId_vehicleId_key" ON "saved_vehicles"("consumerProfileId", "vehicleId");

CREATE INDEX "consent_records_email_consentType_idx" ON "consent_records"("email", "consentType");

CREATE INDEX "opportunity_candidates_organizationId_idx" ON "opportunity_candidates"("organizationId");
CREATE INDEX "opportunity_candidates_organizationId_sourceType_status_idx" ON "opportunity_candidates"("organizationId", "sourceType", "status");
CREATE INDEX "opportunity_candidates_vin_idx" ON "opportunity_candidates"("vin");

CREATE INDEX "dealer_network_listings_organizationId_idx" ON "dealer_network_listings"("organizationId");
CREATE INDEX "dealer_network_listings_organizationId_availabilityType_idx" ON "dealer_network_listings"("organizationId", "availabilityType");

CREATE INDEX "lease_offers_organizationId_idx" ON "lease_offers"("organizationId");
CREATE INDEX "lease_offers_organizationId_make_model_idx" ON "lease_offers"("organizationId", "make", "model");
CREATE INDEX "lease_offers_dealScore_idx" ON "lease_offers"("dealScore");

CREATE UNIQUE INDEX "plans_code_key" ON "plans"("code");

CREATE INDEX "subscriptions_organizationId_idx" ON "subscriptions"("organizationId");
CREATE INDEX "subscriptions_organizationId_status_idx" ON "subscriptions"("organizationId", "status");

CREATE UNIQUE INDEX "usage_meters_organizationId_metricName_periodDate_key" ON "usage_meters"("organizationId", "metricName", "periodDate");
CREATE INDEX "usage_meters_organizationId_idx" ON "usage_meters"("organizationId");

CREATE INDEX "demo_requests_businessEmail_status_idx" ON "demo_requests"("businessEmail", "status");
CREATE INDEX "demo_requests_createdAt_idx" ON "demo_requests"("createdAt");

CREATE INDEX "vehicle_history_records_vin_idx" ON "vehicle_history_records"("vin");
CREATE INDEX "vehicle_history_records_organizationId_vin_idx" ON "vehicle_history_records"("organizationId", "vin");

CREATE INDEX "provider_usage_logs_organizationId_idx" ON "provider_usage_logs"("organizationId");
CREATE INDEX "provider_usage_logs_organizationId_provider_idx" ON "provider_usage_logs"("organizationId", "provider");
CREATE INDEX "provider_usage_logs_provider_endpoint_createdAt_idx" ON "provider_usage_logs"("provider", "endpoint", "createdAt");

-- AddForeignKeys
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "locations" ADD CONSTRAINT "locations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "vehicle_photos" ADD CONSTRAINT "vehicle_photos_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "auction_items" ADD CONSTRAINT "auction_items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "auction_items" ADD CONSTRAINT "auction_items_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "listings" ADD CONSTRAINT "listings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "listings" ADD CONSTRAINT "listings_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "marketplace_accounts" ADD CONSTRAINT "marketplace_accounts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conversations" ADD CONSTRAINT "conversations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "leads" ADD CONSTRAINT "leads_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "leads" ADD CONSTRAINT "leads_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "leads" ADD CONSTRAINT "leads_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "appointments" ADD CONSTRAINT "appointments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "deals" ADD CONSTRAINT "deals_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deals" ADD CONSTRAINT "deals_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "deals" ADD CONSTRAINT "deals_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "deal_documents" ADD CONSTRAINT "deal_documents_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_automationRuleId_fkey" FOREIGN KEY ("automationRuleId") REFERENCES "automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_actions" ADD CONSTRAINT "ai_actions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_actions" ADD CONSTRAINT "ai_actions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dealer_branding" ADD CONSTRAINT "dealer_branding_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "consumer_events" ADD CONSTRAINT "consumer_events_consumerProfileId_fkey" FOREIGN KEY ("consumerProfileId") REFERENCES "consumer_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "vehicle_interests" ADD CONSTRAINT "vehicle_interests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vehicle_interests" ADD CONSTRAINT "vehicle_interests_consumerProfileId_fkey" FOREIGN KEY ("consumerProfileId") REFERENCES "consumer_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "saved_vehicles" ADD CONSTRAINT "saved_vehicles_consumerProfileId_fkey" FOREIGN KEY ("consumerProfileId") REFERENCES "consumer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_consumerProfileId_fkey" FOREIGN KEY ("consumerProfileId") REFERENCES "consumer_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "opportunity_candidates" ADD CONSTRAINT "opportunity_candidates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dealer_network_listings" ADD CONSTRAINT "dealer_network_listings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lease_offers" ADD CONSTRAINT "lease_offers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "usage_meters" ADD CONSTRAINT "usage_meters_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vehicle_history_records" ADD CONSTRAINT "vehicle_history_records_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vehicle_history_records" ADD CONSTRAINT "vehicle_history_records_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "provider_usage_logs" ADD CONSTRAINT "provider_usage_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
