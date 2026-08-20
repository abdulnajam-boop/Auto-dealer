# DealerOS Product Requirements Document (PRD)

## 1. Product Vision
DealerOS is the all-in-one operating system for independent used-car dealerships. It automates high-friction workflows across inventory sourcing, valuation, listing syndication, buyer negotiation, customer relationship management, deal financing, and post-sale delisting.

## 2. Core Workflows & Specifications

### 2.1 Vehicle Sourcing & Opportunity Intelligence
- **Input Parameters**: VIN, Year, Make, Model, Trim, Mileage, Condition, Sourcing Channel (Manheim, ACV Auctions, Trade-in, Private Party, Copart), Current Bid, Estimated Repair, Transportation & Fees.
- **Valuation Analysis**: Computes Estimated Market Value, Wholesale Target Acquisition, Max Recommended Bid, Expected Gross Profit, ROI, Local Demand Index, Days-to-Sell, and Opportunity Score (0–100).
- **Decision Bands**:
  - Score >= 80: `STRONG BUY`
  - Score >= 65: `BUY`
  - Score >= 50: `WATCH`
  - Score < 50: `PASS`

### 2.2 Inventory Intake & Cost Accounting
- **Vehicle Lifecycle**: `Opportunity` → `Purchased` → `In Transit` → `Reconditioning` → `Ready` → `Listed` → `Pending` → `Sold` → `Wholesale`.
- **Granular Expense Ledger**: Purchase price, auction buy fees, logistics/shipping, mechanical repairs, body shop/paint, detailing, parts, inspection, and lot pack fee.
- **Cost Basis & Margin**: Real-time computation of `Total Cost Basis = Sum(Expenses)`. Dynamic calculation of Gross Profit on target and final sold prices.

### 2.3 AI Listing Studio
- **Multi-Format Content Generation**:
  - Title & One-Line Hook
  - Paragraph Narrative / Storytelling Description
  - Bulleted Feature Highlights & Option Codes
  - Marketplace-Optimized Copy (FB Marketplace, Craigslist BBCode)
  - Social Media Copy with Trending Automotive Hashtags
  - SEO Meta Title & Meta Description
- **Strict Grounding Rule**: The generator strictly references VIN specs, trim level, packages, and recorded condition. No unverified options or phantom features are hallucinated.

### 2.4 Marketplace Hub & Adapter Architecture
- **Adapter Interface**:
  - `validateVehicle(vehicle)`
  - `publish(vehicle, listing)`
  - `update(vehicle, listing)`
  - `remove(vehicle)`
  - `getStatus(vehicle)`
  - `syncMessages()`
- **Supported Channels**:
  - **Dealer Storefront**: Real-time synchronous database publishing.
  - **Facebook Marketplace**: Feed export / 1-click clipboard asset kit.
  - **Craigslist**: Formatted HTML/BBCode ready for immediate posting.
  - **eBay Motors / Autotrader / Cars.com / CarGurus**: Standardized feed & API adapter simulator.
- **Status Lifecycle**: `Draft` → `Pending` → `Live` → `Failed` → `Expired` → `Removed`.

### 2.5 Unified Buyer Inbox & Autonomous AI Sales Agent
- **Communication Channels**: Storefront Live Chat, SMS, WhatsApp, Email, and Marketplace Messages.
- **Negotiation Policy Engine**:
  - Asking Price ($P_{\text{ask}}$)
  - Preferred Price ($P_{\text{pref}}$)
  - Absolute Minimum Price ($P_{\text{min}}$)
- **Safety Boundaries**: The AI Sales Agent will never counter below $P_{\text{min}}$. Any offer below $P_{\text{min}}$ is held for manager review. All bot actions are logged in the `ai_actions` ledger.
- **Capabilities**: Answering specs & condition questions, calculating estimated monthly payments, qualifying trade-in vehicles, scheduling test-drive appointments, and capturing contact information.

### 2.6 CRM & Lead Pipeline
- **Pipeline Stages**: `New` → `Contacted` → `Qualified` → `Appointment` → `Negotiating` → `Pending` → `Sold` → `Lost`.
- **Lead Record**: Name, Email, Phone, Preferred Vehicle, Trade-in Details, Pre-approved Financing Status, Lead Score (1–100), Interaction History, and Assigned Salesperson.

### 2.7 F&I Deal Desk & Documents
- **Financial Desk**: Sale price, trade-in allowance, trade-in payoff, doc fee, state sales tax, title/reg fee, down payment, financed balance, interest rate (APR), term (months), and monthly payment.
- **Document Generation**: Print-ready and downloadable Buyer's Order / Bill of Sale.
- **Deal Execution**: Transitioning deal to `Funded` or `Delivered` triggers:
  1. Vehicle status updated to `Sold`.
  2. Automatic removal of all active marketplace listings.
  3. Realized gross profit calculation & reporting.

### 2.8 Executive Dashboard & Dealer AI Assistant
- **Metrics**: Total Inventory Value, Inventory Cost, Potential Gross Profit, Active Units, Stale Units (>45 days), Leads Pipeline, Unread Conversations, Pending Deals, YTD Sold Units, and Realized Gross Margin.
- **Daily Dealer Briefing**: Daily AI-generated summary of overnight leads, aged inventory alerts, and recommended pricing adjustments.
- **Conversational Assistant**: Context-aware assistant capable of running queries across inventory, margins, and leads.

### 2.9 Public Storefront & Mobile Experience
- **Storefront (/storefront)**: Public-facing responsive showroom with inventory search/filter, vehicle detail pages with high-res photo gallery, payment calculator, test drive booking modal, trade-in valuation intake form, and live AI assistant chat widget.
- **Dealer Mobile/PWA**: Touch-friendly mobile layout with VIN scanner simulator, quick camera/photo upload, instant lead response, and auction bid calculator.
