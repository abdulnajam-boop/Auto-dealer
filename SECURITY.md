# AutoAIdealership Security, Privacy & Compliance Architecture

## 1. Multi-Tenant Isolation & Zero Cross-Leakage

1. **Row-Level Organization Isolation**:
   - Every database read and mutation is strictly filtered by `organizationId`.
   - Dedicated automated test suites (`tests/tenant-isolation-v2.test.ts` and `tests/auth-and-tenant-isolation.test.ts`) assert that operations from Tenant A can never read, modify, or infer data from Tenant B.
2. **Session Security & Token Signing**:
   - Authenticated sessions use cryptographically signed JWT tokens (`HS256` via Web Crypto API / `jose`).
   - Tokens contain `userId`, `organizationId`, `organizationSlug`, and `role`, transmitted in secure HTTP-only cookies (`autoai_session` / `dealeros_session`).
3. **Password Security**:
   - Passwords are salted and hashed using `bcryptjs` with salt work factor = 10. Raw passwords are never persisted or returned in API responses.

---

## 2. Server-Side Secret Protection

- **Provider Credentials**: `VINAUDIT_API_KEY`, `CARFAX_API_KEY`, `AUTOCHECK_API_KEY`, `GEMINI_API_KEY`, and `JWT_SECRET` are strictly server-side environment variables.
- **Client Bundle Sanitization**: Build scripts prevent accidental exposure of private environment variables to client-side bundles (only `NEXT_PUBLIC_*` flags are bundled).

---

## 3. Public API Protection & Anti-Spam Architecture

- **B2B Demo Requests (`/api/demo`)**:
  - **In-Memory Rate Limiting**: Enforces a sliding window limit of 5 requests per 10 minutes per IP address.
  - **Bot Honeypot Protection**: Hidden input fields detect and silently deflect automated bot submissions.
  - **Zod Strict Validation**: Validates all incoming payloads against `demoRequestSchema` before database persistence.

---

## 4. Responsible AI Safety & Financial Guardrails

- **Hard Negotiation Invariant Floor**:
  - The AI Sales Agent mathematically checks dealer minimum prices:
    $$\text{Asking Price} \ge \text{Proposed Counter-Offer} \ge \text{Absolute Minimum Floor}$$
  - The AI cannot commit to an unauthorized discount, fee waiver, or sub-floor price without manual manager authorization.
- **Explainable Data Provenance**:
  - Every valuation, comp, and history report transparently records its source, confidence score, and timestamp.
- **Audit Trails**:
  - All automated AI actions are permanently recorded in `ai_actions` and external API usage is logged in `provider_usage_logs`.
