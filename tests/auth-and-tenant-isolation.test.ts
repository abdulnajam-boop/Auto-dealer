import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/lib/prisma';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  hasPermission,
  ROLE_PERMISSIONS,
  UserRole,
} from '../src/lib/auth';

describe('SaaS Foundation: Authentication, Tenant Isolation & RBAC', () => {
  const apexOrgId = 'org_apex_motors';
  const metroOrgId = 'org_metro_imports';

  beforeAll(async () => {
    // 1. Ensure Apex Auto Gallery exists
    await prisma.organization.upsert({
      where: { slug: 'apex-motors' },
      update: {},
      create: {
        id: apexOrgId,
        name: 'Apex Auto Gallery',
        slug: 'apex-motors',
      },
    });

    // 2. Ensure Metro City Imports exists (2nd tenant)
    await prisma.organization.upsert({
      where: { slug: 'metro-city-imports' },
      update: {},
      create: {
        id: metroOrgId,
        name: 'Metro City Imports',
        slug: 'metro-city-imports',
      },
    });
  });

  describe('1. Password Hashing & Verification', () => {
    it('hashes passwords securely with bcrypt and verifies them accurately', async () => {
      const rawPassword = 'SecretDealerPassword123!';
      const hash = await hashPassword(rawPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(rawPassword);
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);

      const isMatch = await verifyPassword(rawPassword, hash);
      expect(isMatch).toBe(true);

      const isWrongMatch = await verifyPassword('WrongPassword999', hash);
      expect(isWrongMatch).toBe(false);
    });
  });

  describe('2. JWT Session Token Security', () => {
    it('creates and verifies cryptographically signed session tokens', async () => {
      const payload = {
        userId: 'user_marcus_vance',
        email: 'marcus@apexautogallery.com',
        name: 'Marcus Vance',
        organizationId: apexOrgId,
        organizationSlug: 'apex-motors',
        organizationName: 'Apex Auto Gallery',
        role: 'OWNER' as UserRole,
      };

      const token = await createSessionToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // Header.Payload.Signature

      const decoded = await verifySessionToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.organizationId).toBe(payload.organizationId);
      expect(decoded?.role).toBe('OWNER');
    });

    it('rejects tampered or forged tokens', async () => {
      const validToken = await createSessionToken({
        userId: 'user_marcus_vance',
        email: 'marcus@apexautogallery.com',
        name: 'Marcus Vance',
        organizationId: apexOrgId,
        organizationSlug: 'apex-motors',
        organizationName: 'Apex Auto Gallery',
        role: 'OWNER',
      });

      // Tamper with the payload part of the JWT
      const parts = validToken.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}tampered.${parts[2]}`;

      const decoded = await verifySessionToken(tamperedToken);
      expect(decoded).toBeNull();
    });
  });

  describe('3. Role-Based Access Control (RBAC) Matrix', () => {
    it('correctly validates permissions for OWNER role', () => {
      expect(hasPermission('OWNER', 'settings:manage')).toBe(true);
      expect(hasPermission('OWNER', 'financials:view')).toBe(true);
      expect(hasPermission('OWNER', 'inventory:manage')).toBe(true);
      expect(hasPermission('OWNER', 'deals:approve')).toBe(true);
      expect(hasPermission('OWNER', 'ai:manage')).toBe(true);
    });

    it('restricts SALES role from executive and financial settings', () => {
      expect(hasPermission('SALES', 'leads:manage')).toBe(true);
      expect(hasPermission('SALES', 'messages:manage')).toBe(true);
      expect(hasPermission('SALES', 'inventory:view')).toBe(true);
      expect(hasPermission('SALES', 'settings:manage')).toBe(false);
      expect(hasPermission('SALES', 'financials:view')).toBe(false);
      expect(hasPermission('SALES', 'deals:approve')).toBe(false);
    });

    it('enforces INVENTORY role boundaries', () => {
      expect(hasPermission('INVENTORY', 'inventory:manage')).toBe(true);
      expect(hasPermission('INVENTORY', 'expenses:manage')).toBe(true);
      expect(hasPermission('INVENTORY', 'leads:manage')).toBe(false);
      expect(hasPermission('INVENTORY', 'deals:approve')).toBe(false);
    });

    it('enforces FINANCE role capabilities', () => {
      expect(hasPermission('FINANCE', 'deals:manage')).toBe(true);
      expect(hasPermission('FINANCE', 'deals:approve')).toBe(true);
      expect(hasPermission('FINANCE', 'financials:view')).toBe(true);
      expect(hasPermission('FINANCE', 'settings:manage')).toBe(false);
    });

    it('enforces read-only limits for VIEWER role', () => {
      expect(hasPermission('VIEWER', 'inventory:view')).toBe(true);
      expect(hasPermission('VIEWER', 'inventory:manage')).toBe(false);
      expect(hasPermission('VIEWER', 'deals:approve')).toBe(false);
      expect(hasPermission('VIEWER', 'settings:manage')).toBe(false);
    });
  });

  describe('4. Multi-Tenant Database Query Isolation', () => {
    beforeAll(async () => {
      // Create vehicle in Apex Motors
      await prisma.vehicle.upsert({
        where: { id: 'veh_test_apex_isolation' },
        update: {},
        create: {
          id: 'veh_test_apex_isolation',
          organizationId: apexOrgId,
          vin: '1HGCR2F83MA111111',
          stockNumber: 'APEX-ISO-01',
          year: 2023,
          make: 'Acura',
          model: 'Integra',
          mileage: 12000,
          exteriorColor: 'Liquid Carbon Metallic',
          purchasePrice: 28000,
          askingPrice: 33500,
          status: 'LISTED',
        },
      });

      // Create vehicle in Metro City Imports
      await prisma.vehicle.upsert({
        where: { id: 'veh_test_metro_isolation' },
        update: {},
        create: {
          id: 'veh_test_metro_isolation',
          organizationId: metroOrgId,
          vin: '2T1BURHE7MC222222',
          stockNumber: 'METRO-ISO-01',
          year: 2022,
          make: 'Lexus',
          model: 'IS 350',
          mileage: 18500,
          exteriorColor: 'Ultra White',
          purchasePrice: 34000,
          askingPrice: 41000,
          status: 'LISTED',
        },
      });
    });

    it('Apex Motors queries strictly return only Apex inventory and never leak Metro inventory', async () => {
      const apexVehicles = await prisma.vehicle.findMany({
        where: { organizationId: apexOrgId },
      });

      const vinList = apexVehicles.map((v) => v.vin);
      expect(vinList).toContain('1HGCR2F83MA111111');
      expect(vinList).not.toContain('2T1BURHE7MC222222');
    });

    it('Metro Imports queries strictly return only Metro inventory and never leak Apex inventory', async () => {
      const metroVehicles = await prisma.vehicle.findMany({
        where: { organizationId: metroOrgId },
      });

      const vinList = metroVehicles.map((v) => v.vin);
      expect(vinList).toContain('2T1BURHE7MC222222');
      expect(vinList).not.toContain('1HGCR2F83MA111111');
    });
  });

  describe('5. Multi-Organization Switching & Memberships', () => {
    it('supports a single user belonging to multiple organizations with distinct roles', async () => {
      const multiUser = await prisma.user.upsert({
        where: { email: 'multitenant.test@dealeros.local' },
        update: {},
        create: {
          id: 'user_multi_org_test',
          name: 'Multi Org Tester',
          email: 'multitenant.test@dealeros.local',
          passwordHash: await hashPassword('dealer123'),
        },
      });

      // Assign as OWNER in Apex
      await prisma.organizationMember.upsert({
        where: { organizationId_userId: { organizationId: apexOrgId, userId: multiUser.id } },
        update: { role: 'OWNER' },
        create: { organizationId: apexOrgId, userId: multiUser.id, role: 'OWNER' },
      });

      // Assign as VIEWER in Metro
      await prisma.organizationMember.upsert({
        where: { organizationId_userId: { organizationId: metroOrgId, userId: multiUser.id } },
        update: { role: 'VIEWER' },
        create: { organizationId: metroOrgId, userId: multiUser.id, role: 'VIEWER' },
      });

      const memberships = await prisma.organizationMember.findMany({
        where: { userId: multiUser.id },
        include: { organization: true },
      });

      expect(memberships.length).toBe(2);
      const apexMember = memberships.find((m) => m.organizationId === apexOrgId);
      const metroMember = memberships.find((m) => m.organizationId === metroOrgId);

      expect(apexMember?.role).toBe('OWNER');
      expect(metroMember?.role).toBe('VIEWER');
    });
  });
});
