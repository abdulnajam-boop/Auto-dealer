# DealerOS Security & Compliance Policy

## 1. Multi-Tenant Isolation & Authorization
- **Tenant Scope Enforcement**: All data mutations and queries must resolve the caller's verified `organizationId`.
- **Role-Based Access Control (RBAC)**:
  - `OWNER`: Full administrative control, billing, organization settings, user provisioning.
  - `MANAGER`: Sourcing, inventory, approvals, pricing modifications, AI policy configuration.
  - `SALES`: Lead management, messaging, customer quotes within permitted negotiation thresholds.
  - `INVENTORY`: Vehicle intake, photo uploads, repair/expense logging.
  - `FINANCE`: Deal structuring, tax calculation, F&I documents, bill of sale generation.
  - `VIEWER`: Read-only access to inventory and basic metrics.

## 2. Autonomous AI Safety & Guardrails
- **Strict Price Floor Invariance**: The AI Sales Agent is physically incapable of finalizing or offering a price lower than the vehicle's `minPrice`.
- **Human-in-the-Loop Approval Gates**:
  - Out-of-band price requests require explicit Manager approval.
  - Initial listing publication to external marketplaces requires one-click Dealer confirmation.
  - Modifying deal terms requires Finance or Manager role.
- **AI Action Audit Ledger**: Every prompt, tool invocation, generated response, and automated decision is immutably recorded in `ai_actions` with a cryptographic timestamp and organization ID.

## 3. Data Protection & Hygiene
- **Secret Management**: API keys and webhook secrets must be provided via environment variables (`.env.local`) and never logged or exposed in client bundles.
- **PII Protection**: Buyer phone numbers and email addresses are masked for lower-tier roles where applicable and strictly isolated per dealership tenant.
