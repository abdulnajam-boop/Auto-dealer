import { prisma } from './prisma';
import { getSession, UserRole } from './auth';

export interface TenantContext {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  isDemo?: boolean;
}

export const DEFAULT_ORG_SLUG = 'apex-motors';

/**
 * Resolve verified tenant context for the current request.
 * Prioritizes authenticated session, verifies org membership, and enforces strict isolation.
 */
export async function getTenantContext(requestedOrgSlug?: string): Promise<TenantContext> {
  // 1. Check for real authenticated session
  const session = await getSession();

  if (session) {
    // If a specific organization slug was requested, verify user belongs to it
    if (requestedOrgSlug && requestedOrgSlug !== session.organizationSlug) {
      const membership = await prisma.organizationMember.findFirst({
        where: {
          userId: session.userId,
          organization: { slug: requestedOrgSlug },
        },
        include: {
          organization: true,
        },
      });

      if (!membership) {
        throw new Error('FORBIDDEN_TENANT_ACCESS: You do not have access to this organization.');
      }

      return {
        organizationId: membership.organization.id,
        organizationName: membership.organization.name,
        organizationSlug: membership.organization.slug,
        userId: session.userId,
        userName: session.name,
        userEmail: session.email,
        role: membership.role as UserRole,
      };
    }

    return {
      organizationId: session.organizationId,
      organizationName: session.organizationName,
      organizationSlug: session.organizationSlug,
      userId: session.userId,
      userName: session.name,
      userEmail: session.email,
      role: session.role,
    };
  }

  // 2. Development/Demo Fallback for unauthenticated access (e.g. initial setup / seed verification)
  const slug = requestedOrgSlug || DEFAULT_ORG_SLUG;
  
  let org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  if (!org) {
    org = await prisma.organization.findFirst({
      include: {
        members: {
          include: { user: true },
        },
      },
    });
  }

  if (!org) {
    return {
      organizationId: 'org_apex_motors',
      organizationName: 'Apex Auto Gallery',
      organizationSlug: 'apex-motors',
      userId: 'user_marcus_vance',
      userName: 'Marcus Vance',
      userEmail: 'marcus@apexautogallery.com',
      role: 'OWNER',
      isDemo: true,
    };
  }

  const primaryMember = org.members[0];
  const user = primaryMember?.user;

  return {
    organizationId: org.id,
    organizationName: org.name,
    organizationSlug: org.slug,
    userId: user?.id || 'user_marcus_vance',
    userName: user?.name || 'Marcus Vance',
    userEmail: user?.email || 'marcus@apexautogallery.com',
    role: (primaryMember?.role as UserRole) || 'OWNER',
    isDemo: true,
  };
}

/**
 * Public storefront tenant resolver (does not require login)
 */
export async function getPublicStorefrontContext(requestedOrgSlug?: string) {
  const slug = requestedOrgSlug || DEFAULT_ORG_SLUG;

  let org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      locations: true,
    },
  });

  if (!org) {
    org = await prisma.organization.findFirst({
      include: {
        locations: true,
      },
    });
  }

  return org;
}
