import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/lib/prisma';
import { demoRequestSchema } from '../src/lib/validation/demo-request';
import { storefrontSettingsSchema } from '../src/lib/validation/storefront-settings';
import { vinAuditClient } from '../src/lib/providers/vinaudit/client';
import { getVehicleHistoryProvider } from '../src/lib/providers/vehicle-history/factory';

describe('AutoAIdealership V2: Tenant Isolation, Provider Metering & Storefront Controls', () => {
  const apexOrgId = 'org_apex_motors';
  const metroOrgId = 'org_metro_imports';

  beforeAll(async () => {
    // Ensure test tenant organizations exist
    await prisma.organization.upsert({
      where: { slug: 'apex-motors' },
      update: {},
      create: {
        id: apexOrgId,
        name: 'Apex Auto Gallery',
        slug: 'apex-motors',
      },
    });

    await prisma.organization.upsert({
      where: { slug: 'metro-city-imports' },
      update: {},
      create: {
        id: metroOrgId,
        name: 'Metro City Imports',
        slug: 'metro-city-imports',
      },
    });

    // Ensure dealer brandings exist for both tenants
    await prisma.dealerBranding.upsert({
      where: { organizationId: apexOrgId },
      update: {},
      create: {
        organizationId: apexOrgId,
        heroTitle: 'Apex Auto Gallery Premium Inventory',
        showOwnInventory: true,
        showLeaseDeals: false,
        showNetworkInventory: false,
        showPartnerListings: false,
        showCarfaxCta: true,
        preferredHistoryProvider: 'VINAUDIT',
      },
    });

    await prisma.dealerBranding.upsert({
      where: { organizationId: metroOrgId },
      update: {},
      create: {
        organizationId: metroOrgId,
        heroTitle: 'Metro City Imports',
        showOwnInventory: true,
        showLeaseDeals: true,
        showNetworkInventory: true,
        showPartnerListings: true,
        showCarfaxCta: false,
        preferredHistoryProvider: 'CARFAX',
      },
    });
  });

  describe('1. Demo Request Model & Validation Security', () => {
    it('validates legitimate B2B demo request submissions', () => {
      const validPayload = {
        firstName: 'Marcus',
        lastName: 'Vance',
        dealershipName: 'Vance Auto Group',
        businessEmail: 'marcus@vanceautogroup.com',
        phone: '512-555-0199',
        state: 'TX',
        inventorySize: '51-100',
        employeeCount: '11-25',
        currentDms: 'DealerTrack',
        mainChallenge: 'After-hours lead response times and fragmented inventory tools',
        preferredContactMethod: 'EMAIL' as const,
        preferredDemoDate: '2026-09-15',
        preferredDemoTime: '14:00',
      };

      const parsed = demoRequestSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);
    });

    it('rejects invalid email formats and missing required fields in demo requests', () => {
      const invalidPayload = {
        firstName: '',
        dealershipName: '',
        businessEmail: 'not-an-email',
      };

      const parsed = demoRequestSchema.safeParse(invalidPayload);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const errorFields = parsed.error.issues.map((i) => i.path[0]);
        expect(errorFields).toContain('firstName');
        expect(errorFields).toContain('businessEmail');
        expect(errorFields).toContain('dealershipName');
      }
    });

    it('persists and retrieves demo requests in the database', async () => {
      const demoReq = await prisma.demoRequest.create({
        data: {
          firstName: 'Elena',
          lastName: 'Rostova',
          dealershipName: 'Metro Imports North',
          businessEmail: `elena.test.${Date.now()}@metrocityimports.com`,
          phone: '512-555-0144',
          state: 'TX',
          inventorySize: '101-250',
          employeeCount: '26-50',
          currentDms: 'Frazer',
          mainChallenge: 'Inventory turn speed and desking accuracy',
          preferredContactMethod: 'PHONE',
          status: 'PENDING',
        },
      });

      expect(demoReq.id).toBeDefined();
      expect(demoReq.status).toBe('PENDING');

      const found = await prisma.demoRequest.findUnique({
        where: { id: demoReq.id },
      });
      expect(found).not.toBeNull();
      expect(found?.dealershipName).toBe('Metro Imports North');
    });
  });

  describe('2. Storefront Owner Controls & Tenant Isolation', () => {
    it('validates storefront settings schema with boolean toggles', () => {
      const validSettings = {
        showOwnInventory: true,
        showLeaseDeals: false,
        showNetworkInventory: false,
        showPartnerListings: false,
        showCarfaxCta: true,
        showFinancingCta: true,
        showTradeInCta: true,
        showMakeOffer: true,
        showScheduleTestDrive: true,
        showContactDealer: true,
        showVehicleRecommendations: true,
        preferredHistoryProvider: 'VINAUDIT' as const,
      };

      const parsed = storefrontSettingsSchema.safeParse(validSettings);
      expect(parsed.success).toBe(true);
    });

    it('modifying storefront toggles for Tenant A does NOT affect Tenant B', async () => {
      // Modify Apex Auto Gallery (Tenant A)
      await prisma.dealerBranding.update({
        where: { organizationId: apexOrgId },
        data: {
          showOwnInventory: true,
          showLeaseDeals: false,
          showNetworkInventory: false,
          showPartnerListings: false,
          showCarfaxCta: true,
          preferredHistoryProvider: 'VINAUDIT',
        },
      });

      // Modify Metro City Imports (Tenant B) to contrasting values
      await prisma.dealerBranding.update({
        where: { organizationId: metroOrgId },
        data: {
          showOwnInventory: true,
          showLeaseDeals: true,
          showNetworkInventory: true,
          showPartnerListings: true,
          showCarfaxCta: false,
          preferredHistoryProvider: 'CARFAX',
        },
      });

      // Verify Apex is isolated
      const apexBranding = await prisma.dealerBranding.findUnique({
        where: { organizationId: apexOrgId },
      });
      expect(apexBranding?.showLeaseDeals).toBe(false);
      expect(apexBranding?.showNetworkInventory).toBe(false);
      expect(apexBranding?.showCarfaxCta).toBe(true);
      expect(apexBranding?.preferredHistoryProvider).toBe('VINAUDIT');

      // Verify Metro is isolated
      const metroBranding = await prisma.dealerBranding.findUnique({
        where: { organizationId: metroOrgId },
      });
      expect(metroBranding?.showLeaseDeals).toBe(true);
      expect(metroBranding?.showNetworkInventory).toBe(true);
      expect(metroBranding?.showCarfaxCta).toBe(false);
      expect(metroBranding?.preferredHistoryProvider).toBe('CARFAX');
    });
  });

  describe('3. VinAudit Subsystem & Usage Metering', () => {
    it('executes VinAudit mock fallback and creates ProviderUsageLog scoped to tenant', async () => {
      const testVin = '1HGCR2F83HA000000';
      const initialLogsCount = await prisma.providerUsageLog.count({
        where: { organizationId: apexOrgId, provider: 'VINAUDIT' },
      });

      const response = await vinAuditClient.decodeVin({ vin: testVin }, apexOrgId);

      expect(response).toBeDefined();
      expect(response.vin).toBe(testVin);
      expect(response.year).toBeGreaterThanOrEqual(1990);
      expect(response.make).toBeDefined();

      // Check that a ProviderUsageLog was recorded for apexOrgId
      const newLogsCount = await prisma.providerUsageLog.count({
        where: { organizationId: apexOrgId, provider: 'VINAUDIT' },
      });
      expect(newLogsCount).toBeGreaterThan(initialLogsCount);
    });

    it('queries Market Valuation via VinAudit with tenant usage tracking', async () => {
      const testVin = '1HGCR2F83HA000000';
      const valuation = await vinAuditClient.getMarketValue({ vin: testVin, mileage: 45000, zip: '78759' }, apexOrgId);

      expect(valuation).toBeDefined();
      expect(valuation.averageMarketPrice).toBeGreaterThan(0);
      expect(valuation.belowMarketPrice).toBeLessThan(valuation.aboveMarketPrice);

      const latestLog = await prisma.providerUsageLog.findFirst({
        where: { organizationId: apexOrgId, endpoint: 'marketvalue' },
        orderBy: { createdAt: 'desc' },
      });

      expect(latestLog).not.toBeNull();
      expect(latestLog?.provider).toBe('VINAUDIT');
    });
  });

  describe('4. Vehicle History Provider Architecture & CARFAX Truthful Verification', () => {
    it('returns VinAudit provider with operational mock report', async () => {
      const provider = getVehicleHistoryProvider('VINAUDIT');
      expect(provider.id).toBe('VINAUDIT');
      expect(provider.name).toContain('VinAudit');

      const report = await provider.fetchReport('1HGCR2F83HA000000', apexOrgId);
      expect(report.provider).toBe('VINAUDIT');
      expect(report.titleStatus).toBe('CLEAN');
      expect(report.odometerRollback).toBe(false);
    });

    it('truthfully handles unconfigured CARFAX provider without fabricating fake data', async () => {
      const carfaxProvider = getVehicleHistoryProvider('CARFAX');
      expect(carfaxProvider.id).toBe('CARFAX');

      // In testing environment without CARFAX_API_KEY, isConfigured() is false
      if (!carfaxProvider.isConfigured()) {
        const report = await carfaxProvider.fetchReport('1HGCR2F83HA000000');
        expect(report.status).toBe('UNAUTHORIZED');
        expect(report.titleStatus).toBe('UNKNOWN');
      }
    });
  });

  describe('5. Lead Routing & Storefront Multi-Tenant Attribution', () => {
    it('properly associates leads submitted on a dealer storefront to the host organization', async () => {
      // Create a test lead on Apex Auto Gallery
      const apexLead = await prisma.lead.create({
        data: {
          organizationId: apexOrgId,
          name: 'Jordan Buyer',
          email: 'jordan@example.com',
          phone: '512-555-9988',
          stage: 'NEW',
          notes: 'Source: Storefront Inquiry',
        },
      });

      expect(apexLead.organizationId).toBe(apexOrgId);

      // Verify Metro City Imports cannot see Apex's lead
      const metroLeads = await prisma.lead.findMany({
        where: { organizationId: metroOrgId },
      });
      const hasApexLead = metroLeads.some((l) => l.id === apexLead.id);
      expect(hasApexLead).toBe(false);

      // Clean up test lead
      await prisma.lead.delete({ where: { id: apexLead.id } });
    });
  });
});
