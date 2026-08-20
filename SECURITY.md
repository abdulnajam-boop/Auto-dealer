# DealerOS Security & Compliance Architecture

## 1. Multi-Tenant Isolation
1. **Server-Side Context Verification**: Every database query executes through session-verified organization filters (`organizationId = tenant.organizationId`).
2. **Session Security**: Session tokens are cryptographically signed using Web Crypto algorithms (`HS256`) via `jose`, storing `userId`, `organizationId`, and `role`. Tokens are transmitted exclusively in secure HTTP-only cookies (`dealeros_session`).
3. **Password Security**: All user passwords are encrypted using `bcryptjs` with salt rounds = 10. Passwords are never returned in API payloads.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Capability / Permission | OWNER | ADMIN | MANAGER | SALES | INVENTORY | FINANCE | VIEWER |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manage Dealership Profile & Billing** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Invite & Manage Staff Roles** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Profit Margins & Cost Basis** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Approve AI Price Floor Overrides** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Structure & Execute F&I Deals** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Manage Active Inventory & Recon** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Engage Leads & Unified Inbox** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Publish / Edit Marketplace Listings** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Read-Only Dashboard Analytics** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 3. Responsible AI Guardrails & Financial Protection
- **Hard Price Floor Invariants**: The Autonomous AI Sales Agent evaluates mathematical bounds:
  $$\text{Asking Price} \ge \text{Proposed Counter} \ge \text{Absolute Minimum Floor}$$
- **Out-of-Bounds Escalation**: Offers below floor price or requests for non-standard financing are held for manager review.
- **AI Audit Trail**: Every AI tool invocation, generated prompt, and suggested action is recorded in `ai_actions`.

---

## 4. Consumer Data Privacy & Explicit Consent
- **Opt-In Consent Records**: Guest leads log explicit consent (`MARKETING_SMS`, `MARKETING_EMAIL`, `TERMS_OF_SERVICE`) with IP timestamps.
- **First-Party Data Only**: No third-party tracking pixels or unauthorized data sharing between dealerships.
- **GDPR & CCPA Ready**: Full support for customer data export, communication preference updates, and erasure requests.
