# DealerOS Database Schema & Entity Relationship Model

## 1. Multi-Tenant Relational Model

```
+-------------------+       +-----------------------+       +-------------------+
|   Organization    | 1---N |  OrganizationMember   | N---1 |       User        |
+-------------------+       +-----------------------+       +-------------------+
          | 1
          |---N +-------------------+
          |     |     Location      |
          |     +-------------------+
          |
          |---N +-------------------+       +-------------------+
          |     |      Vehicle      | 1---N |   VehiclePhoto    |
          |     +-------------------+       +-------------------+
          |               | 1               +-------------------+
          |               |---N             |  VehicleExpense   |
          |               |                 +-------------------+
          |               | 1               +-------------------+
          |               |---N             |  VehicleDocument  |
          |               |                 +-------------------+
          |               | 1               +-------------------+
          |               |---N             |      Listing      |
          |               |                 +-------------------+
          |               | 1               +-------------------+
          |               |---N             |MarketplaceListing |
          |               |                 +-------------------+
          |               | 1
          |               |---N +-------------------+
          |                     |       Deal        | 1---N DealDocument
          |                     +-------------------+
          |
          |---N +-------------------+       +-------------------+
          |     |    Opportunity    |       |    AuctionItem    |
          |     +-------------------+       +-------------------+
          |
          |---N +-------------------+ 1---N +-------------------+
          |     |   Conversation    |-------|      Message      |
          |     +-------------------+       +-------------------+
          |               | 1
          |               |---1 +-------------------+
          |                     |       Lead        | 1---N +-------------------+
          |                     +-------------------+       |    Appointment    |
          |                                                 +-------------------+
          |---N +-------------------+
          |     |  AutomationRule   | 1---N AutomationRun
          |     +-------------------+
          |
          |---N +-------------------+
          |     |     AiAction      |
          |     +-------------------+
          |
          +---N +-------------------+
                |     AuditLog      |
                +-------------------+
```

## 2. Table Specifications Summary

1. **`organizations`**: `id`, `name`, `slug`, `phone`, `email`, `address`, `city`, `state`, `zip`, `website`, `logoUrl`, `settingsJson`, `createdAt`, `updatedAt`
2. **`users`**: `id`, `email`, `name`, `passwordHash`, `avatarUrl`, `phone`, `createdAt`, `updatedAt`
3. **`organization_members`**: `id`, `organizationId`, `userId`, `role` (OWNER, MANAGER, SALES, INVENTORY, FINANCE, VIEWER), `createdAt`
4. **`locations`**: `id`, `organizationId`, `name`, `address`, `city`, `state`, `zip`, `phone`, `isPrimary`
5. **`vehicles`**: `id`, `organizationId`, `locationId`, `vin`, `stockNumber`, `year`, `make`, `model`, `trim`, `mileage`, `exteriorColor`, `interiorColor`, `engine`, `transmission`, `drivetrain`, `fuelType`, `bodyStyle`, `doors`, `featuresJson`, `purchaseDate`, `purchaseSource`, `purchasePrice`, `totalCostBasis`, `askingPrice`, `preferredPrice`, `minPrice`, `soldPrice`, `soldDate`, `status` (OPPORTUNITY, PURCHASED, IN_TRANSIT, RECONDITIONING, READY, LISTED, PENDING, SOLD, WHOLESALE), `notes`, `createdAt`, `updatedAt`
6. **`vehicle_photos`**: `id`, `vehicleId`, `url`, `thumbnailUrl`, `caption`, `isCover`, `orderIndex`, `createdAt`
7. **`vehicle_expenses`**: `id`, `organizationId`, `vehicleId`, `category` (ACQUISITION, AUCTION_FEE, TRANSPORTATION, MECHANICAL, BODY_PAINT, DETAILING, PARTS, INSPECTION, ADVERTISING, OTHER), `description`, `vendor`, `amount`, `date`, `receiptUrl`, `createdAt`
8. **`opportunities`**: `id`, `organizationId`, `vin`, `year`, `make`, `model`, `trim`, `mileage`, `conditionGrade`, `sourceChannel`, `sourceLocation`, `currentBid`, `buyFee`, `transportEstimate`, `repairEstimate`, `estimatedMarketValue`, `targetAcquisitionPrice`, `maxRecommendedBid`, `expectedSalePrice`, `expectedGrossProfit`, `expectedRoiPercent`, `daysToSellEstimate`, `demandScore`, `opportunityScore`, `recommendation` (STRONG_BUY, BUY, WATCH, PASS), `status` (ANALYZING, WATCHLIST, BIDDING, WON, LOST, REJECTED), `valuationDataJson`, `createdAt`, `updatedAt`
9. **`auction_items`**: `id`, `organizationId`, `opportunityId`, `auctionPlatform` (MANHEIM, ACV, COPART, ADESA, OTHER), `auctionDate`, `runNumber`, `lane`, `currentBid`, `maxBid`, `status` (WATCHING, BID_PLACED, WON, LOST, PASSED), `notes`, `createdAt`
10. **`listings`**: `id`, `organizationId`, `vehicleId`, `headline`, `shortDescription`, `longDescription`, `featureBulletsJson`, `seoTitle`, `seoDescription`, `facebookCopy`, `craigslistCopy`, `socialCopy`, `hashtagsJson`, `suggestedAskingPrice`, `status` (DRAFT, APPROVED, PUBLISHED, ARCHIVED), `generatedAt`, `approvedAt`, `createdAt`, `updatedAt`
11. **`marketplace_accounts`**: `id`, `organizationId`, `platform` (STOREFRONT, FACEBOOK, CRAIGSLIST, EBAY_MOTORS, AUTOTRADER, CARS_COM, CARGURUS), `accountName`, `apiKey`, `status` (ACTIVE, DISCONNECTED, ERROR), `settingsJson`, `createdAt`
12. **`marketplace_listings`**: `id`, `organizationId`, `listingId`, `vehicleId`, `platform`, `externalId`, `externalUrl`, `publishedPrice`, `status` (DRAFT, PENDING, LIVE, FAILED, EXPIRED, REMOVED), `errorMessage`, `lastSyncedAt`, `createdAt`, `updatedAt`
13. **`conversations`**: `id`, `organizationId`, `vehicleId`, `buyerName`, `buyerPhone`, `buyerEmail`, `channel` (STOREFRONT_CHAT, SMS, WHATSAPP, EMAIL, FACEBOOK, OTHER), `status` (ACTIVE, SNOOZED, RESOLVED, ARCHIVED), `lastMessageAt`, `createdAt`, `updatedAt`
14. **`messages`**: `id`, `conversationId`, `senderType` (BUYER, DEALER_USER, AI_SALES_AGENT), `senderName`, `content`, `metadataJson`, `createdAt`
15. **`leads`**: `id`, `organizationId`, `conversationId`, `vehicleId`, `name`, `email`, `phone`, `preferredContactMethod`, `tradeInYear`, `tradeInMake`, `tradeInModel`, `tradeInMileage`, `tradeInEstimate`, `financingNeeded`, `downPaymentAmount`, `creditTier`, `initialOffer`, `currentOffer`, `stage` (NEW, CONTACTED, QUALIFIED, APPOINTMENT, NEGOTIATING, PENDING, SOLD, LOST), `score`, `assignedToId`, `notes`, `createdAt`, `updatedAt`
16. **`appointments`**: `id`, `organizationId`, `leadId`, `vehicleId`, `type` (TEST_DRIVE, VEHICLE_INSPECTION, TRADE_IN_APPRAISAL, DELIVERY, SIGNING), `scheduledAt`, `durationMinutes`, `status` (SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW), `notes`, `createdAt`, `updatedAt`
17. **`deals`**: `id`, `organizationId`, `vehicleId`, `leadId`, `buyerName`, `buyerEmail`, `buyerPhone`, `buyerAddress`, `salePrice`, `docFee`, `taxAmount`, `titleRegFee`, `accessoriesAmount`, `tradeInAllowance`, `tradeInPayoff`, `cashDownPayment`, `financedAmount`, `aprRate`, `loanTermMonths`, `monthlyPayment`, `totalDue`, `dealStatus` (DRAFT, PENDING_APPROVAL, APPROVED, CONTRACTED, FUNDED, DELIVERED, CANCELLED), `createdAt`, `updatedAt`
18. **`deal_documents`**: `id`, `dealId`, `documentType` (BUYERS_ORDER, BILL_OF_SALE, ODOMETER_DISCLOSURE, FINANCING_AGREEMENT, TITLE_APPLICATION), `title`, `fileUrl`, `status` (DRAFT, READY, SIGNED), `createdAt`
19. **`automation_rules`**: `id`, `organizationId`, `name`, `triggerEvent` (VEHICLE_READY, LISTING_APPROVED, MESSAGE_RECEIVED, INVENTORY_AGED, VEHICLE_SOLD, OFFER_RECEIVED), `conditionsJson`, `actionsJson`, `isActive`, `createdAt`, `updatedAt`
20. **`automation_runs`**: `id`, `automationRuleId`, `triggerEvent`, `entityId`, `status` (SUCCESS, FAILED, SKIPPED), `logDetails`, `createdAt`
21. **`ai_actions`**: `id`, `organizationId`, `userId`, `agentType` (SALES_AGENT, VALUATION_ANALYST, LISTING_COPYWRITER, EXECUTIVE_ASSISTANT, PRICING_BOT), `actionType`, `promptInput`, `toolCallsJson`, `outputResult`, `requiresApproval`, `isApproved`, `createdAt`
22. **`audit_logs`**: `id`, `organizationId`, `userId`, `action`, `entityType`, `entityId`, `detailsJson`, `ipAddress`, `createdAt`
