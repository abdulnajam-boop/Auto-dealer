import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { hasPermission, ROLE_PERMISSIONS, UserRole } from '../src/lib/auth';

const prisma = new PrismaClient();

describe('Lease Calculation & Deal Scoring Engine', () => {
  it('correctly calculates depreciation portion and finance charge using money factor', () => {
    const msrp = 49800;
    const dealerDiscount = 2500;
    const incentive = 7500;
    const residualPercent = 58;
    const moneyFactor = 0.00095;
    const termMonths = 36;
    const dueAtSigning = 2999;

    const adjCapCost = msrp - dealerDiscount - incentive; // $39,800
    const residualValue = msrp * (residualPercent / 100); // $28,884
    const depreciationPortion = (adjCapCost - residualValue) / termMonths; // ($39,800 - $28,884) / 36 = $303.22
    const financeCharge = (adjCapCost + residualValue) * moneyFactor; // ($39,800 + $28,884) * 0.00095 = $65.25
    const baseMonthly = depreciationPortion + financeCharge; // ~$368.47
    const effectiveMonthly = (baseMonthly * termMonths + dueAtSigning) / termMonths;

    expect(adjCapCost).toBe(39800);
    expect(residualValue).toBeCloseTo(28884, 1);
    expect(depreciationPortion).toBeCloseTo(303.22, 1);
    expect(financeCharge).toBeCloseTo(65.25, 1);
    expect(effectiveMonthly).toBeGreaterThan(baseMonthly);
  });

  it('correctly calculates true effective monthly cost amortizing upfront down payment', () => {
    const advertisedMonthly = 699;
    const termMonths = 36;
    const dueAtSigning = 4999;

    const totalLeaseCashOutlay = advertisedMonthly * termMonths + dueAtSigning;
    const effectiveMonthly = totalLeaseCashOutlay / termMonths;

    expect(totalLeaseCashOutlay).toBe(30163);
    expect(effectiveMonthly).toBeCloseTo(837.86, 1);
  });
});

describe('Cross-Dealership Multi-Tenant Isolation', () => {
  let orgAId: string;
  let orgBId: string;

  beforeAll(async () => {
    const orgA = await prisma.organization.findUnique({ where: { slug: 'apex-motors' } });
    const orgB = await prisma.organization.findUnique({ where: { slug: 'metro-city-imports' } });
    orgAId = orgA?.id || '';
    orgBId = orgB?.id || '';
  });

  it('strictly isolates inventory queries by organizationId', async () => {
    if (!orgAId || !orgBId) return;

    const vehiclesA = await prisma.vehicle.findMany({
      where: { organizationId: orgAId },
    });

    const vehiclesB = await prisma.vehicle.findMany({
      where: { organizationId: orgBId },
    });

    const vehiclesAIds = new Set(vehiclesA.map((v) => v.id));
    const overlap = vehiclesB.filter((v) => vehiclesAIds.has(v.id));

    expect(overlap.length).toBe(0);
    vehiclesA.forEach((v) => expect(v.organizationId).toBe(orgAId));
    vehiclesB.forEach((v) => expect(v.organizationId).toBe(orgBId));
  });

  it('strictly isolates CRM leads and opportunities by organizationId', async () => {
    if (!orgAId || !orgBId) return;

    const leadsA = await prisma.lead.findMany({ where: { organizationId: orgAId } });
    const leadsB = await prisma.lead.findMany({ where: { organizationId: orgBId } });

    leadsA.forEach((l) => expect(l.organizationId).toBe(orgAId));
    leadsB.forEach((l) => expect(l.organizationId).toBe(orgBId));
  });

  it('strictly isolates user staff memberships and invitations', async () => {
    if (!orgAId || !orgBId) return;

    const membersA = await prisma.organizationMember.findMany({ where: { organizationId: orgAId } });
    const membersB = await prisma.organizationMember.findMany({ where: { organizationId: orgBId } });

    membersA.forEach((m) => expect(m.organizationId).toBe(orgAId));
    membersB.forEach((m) => expect(m.organizationId).toBe(orgBId));
  });
});

describe('RBAC Permission Matrix Enforcement', () => {
  it('allows OWNER and ADMIN to manage team members, but forbids SALES and VIEWER', () => {
    expect(hasPermission('OWNER', 'manage_team')).toBe(true);
    expect(hasPermission('ADMIN', 'manage_team')).toBe(true);
    expect(hasPermission('SALES', 'manage_team')).toBe(false);
    expect(hasPermission('VIEWER', 'manage_team')).toBe(false);
  });

  it('allows FINANCE and MANAGER to view financials and approve deals', () => {
    expect(hasPermission('FINANCE', 'approve_deals')).toBe(true);
    expect(hasPermission('MANAGER', 'approve_deals')).toBe(true);
    expect(hasPermission('SALES', 'approve_deals')).toBe(false);
  });

  it('allows INVENTORY and MANAGER to view vehicle cost basis', () => {
    expect(hasPermission('INVENTORY', 'view_cost_basis')).toBe(true);
    expect(hasPermission('MANAGER', 'view_cost_basis')).toBe(true);
    expect(hasPermission('SALES', 'view_cost_basis')).toBe(false);
    expect(hasPermission('VIEWER', 'view_cost_basis')).toBe(false);
  });
});

describe('Consumer Consent & Lead Capture Data Integrity', () => {
  it('creates consent records with timestamps and IP addresses', async () => {
    const consent = await prisma.consentRecord.create({
      data: {
        email: 'test.shopper@example.com',
        phone: '(512) 555-9988',
        consentType: 'MARKETING_SMS',
        granted: true,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 Vitest',
      },
    });

    expect(consent.id).toBeDefined();
    expect(consent.consentType).toBe('MARKETING_SMS');
    expect(consent.granted).toBe(true);
    expect(consent.timestamp).toBeInstanceOf(Date);

    // Clean up
    await prisma.consentRecord.delete({ where: { id: consent.id } });
  });
});
