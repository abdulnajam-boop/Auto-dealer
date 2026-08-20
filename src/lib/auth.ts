import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'SALES' | 'INVENTORY' | 'FINANCE' | 'VIEWER';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  organizationId: string;
  organizationSlug: string;
  organizationName: string;
  role: UserRole;
  exp?: number;
  iat?: number;
}

export interface UserOrganizationMembership {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: UserRole;
  isPrimary?: boolean;
}

export const SESSION_COOKIE_NAME = 'dealeros_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Secure key for JWT signing
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'dealeros-super-secure-jwt-session-secret-key-32chars!'
);

/**
 * Hash a plain password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a plain password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Create a signed JWT session token
 */
export async function createSessionToken(payload: Omit<SessionPayload, 'exp' | 'iat'>): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Get current session from Next.js cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Set the HTTP-only session cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require an authenticated session in Server Components or Route Handlers
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

/**
 * Require a specific role or set of roles for RBAC enforcement
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

/**
 * Granular Permission Matrix for RBAC
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  OWNER: [
    'org:manage',
    'users:manage',
    'manage_team',
    'settings:manage',
    'integrations:manage',
    'financials:view',
    'financials:export',
    'view_financials',
    'view_cost_basis',
    'inventory:manage',
    'pricing:override',
    'deals:approve',
    'approve_deals',
    'deals:manage',
    'leads:manage',
    'messages:manage',
    'ai:manage',
    'audit:view',
  ],
  ADMIN: [
    'org:manage',
    'users:manage',
    'manage_team',
    'settings:manage',
    'integrations:manage',
    'financials:view',
    'financials:export',
    'view_financials',
    'view_cost_basis',
    'inventory:manage',
    'pricing:override',
    'deals:approve',
    'approve_deals',
    'deals:manage',
    'leads:manage',
    'messages:manage',
    'ai:manage',
    'audit:view',
  ],
  MANAGER: [
    'users:view',
    'settings:view',
    'financials:view',
    'view_financials',
    'view_cost_basis',
    'inventory:manage',
    'pricing:override',
    'deals:approve',
    'approve_deals',
    'deals:manage',
    'leads:manage',
    'messages:manage',
    'ai:manage',
    'audit:view',
  ],
  SALES: [
    'inventory:view',
    'leads:manage',
    'messages:manage',
    'deals:view',
    'deals:draft',
  ],
  INVENTORY: [
    'inventory:manage',
    'inventory:view',
    'view_cost_basis',
    'expenses:manage',
    'opportunities:view',
  ],
  FINANCE: [
    'deals:manage',
    'deals:approve',
    'approve_deals',
    'deals:view',
    'financials:view',
    'view_financials',
    'view_cost_basis',
    'expenses:manage',
    'inventory:view',
  ],
  VIEWER: [
    'inventory:view',
    'leads:view',
    'deals:view',
  ],
};

/**
 * Check whether a given role holds a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

/**
 * Retrieve user profile and all organization memberships
 */
export async function getUserWithMemberships(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user) return null;

  const memberships: UserOrganizationMembership[] = user.memberships.map((m) => ({
    organizationId: m.organization.id,
    organizationName: m.organization.name,
    organizationSlug: m.organization.slug,
    role: m.role as UserRole,
  }));

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
    },
    memberships,
  };
}
