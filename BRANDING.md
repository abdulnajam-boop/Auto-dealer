# AutoAIdealership Brand Guidelines

## 1. Brand Identity & Product Direction

- **Customer-Facing Product Name:** `AutoAIdealership`
- **Primary Planned Domain:** `autoaidealership.com`
- **Tagline:** *"Smarter Dealers. Better Deals."*
- **Product Positioning:** *"AI-Powered Dealership Operating System"*
- **Target Audience:** Independent automotive dealerships (1 to 250+ inventory units), lot managers, dealer owners, and sales desking teams.

---

## 2. Voice & Tone Principles

1. **Enterprise Authority & Precision:**
   - Speak with the computational confidence of a high-velocity operating system.
   - Avoid generic software clichés; ground all copy in practical dealership terminology (e.g. *floor pricing*, *turn rate*, *acquisition margin*, *F&I desking*, *title provenance*).

2. **Truth in Capabilities:**
   - Never claim a 3rd-party integration or automated feed is live unless it is certified and implemented.
   - Clearly delineate `LIVE`, `IMPLEMENTED / MOCKED`, `COMING SOON`, and `PARTNER REQUIRED` capabilities.

3. **Multi-Tenant Protection:**
   - Emphasize strict organizational boundaries, explainable valuation scores, and bounded AI counter-offer limits.

---

## 3. Visual Identity & Assets

- **Vector Logo Assets:**
  - Full Logo (Dark): `/brand/logo-dark.svg`
  - Full Logo (Light): `/brand/logo-light.svg`
  - Brand Mark: `/brand/mark.svg`
- **Reusable Component:** `src/components/brand/BrandLogo.tsx`
  - Variants: `full`, `compact`, `mark`
  - Sizes: `sm`, `md`, `lg`, `xl`
  - Themes: `dark`, `light`

### Color Palette

| Name | Hex / Tailored Class | Usage |
| :--- | :--- | :--- |
| **Emerald Core** | `#10b981` (`emerald-500`) | Primary brand accent, live badges, primary CTAs |
| **Teal Secondary** | `#14b8a6` (`teal-500`) | Data analytics, gradient accents, secondary highlights |
| **Deep Space** | `#020617` (`slate-950`) | Deep backdrop for high-contrast B2B interface |
| **Slate Surface** | `#0f172a` (`slate-900`) | Card containers, table heads, input backgrounds |
| **Border Muted** | `#1e293b` (`slate-800`) | Clean structural divider lines |
| **Amber Warning** | `#f59e0b` (`amber-500`) | Partner required feeds, audit notices |
| **Purple AI** | `#a855f7` (`purple-500`) | AI Sales Agent workflows, guardrails, intelligent negotiation |

---

## 4. Typography Hierarchy

- **Primary Typeface:** `Inter`, `system-ui`, `-apple-system`, `sans-serif`
- **Monospace Accent:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, monospace (used for VINs, Opportunity Scores, API statuses, and code indicators).

---

## 5. Marketing vs. Storefront Navigation Rules

- **SaaS Marketing Navigation (`autoaidealership.com`):**
  - Items: `Features`, `Pricing`, `Request Demo`, `About Us`, `Integrations`, `Sign In`.
  - Must **NOT** feature consumer car browsing or lease search as primary SaaS navigation.
- **Dealer Public Storefront (`autoaidealership.com/dealer/[slug]`):**
  - Features dealer-specific inventory, financing pre-qualification, vehicle trade-in estimates, and bounded AI buyer interaction according to owner toggles.
