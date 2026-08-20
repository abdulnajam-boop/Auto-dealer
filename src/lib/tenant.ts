import { prisma } from './prisma';

export interface TenantContext {
  organizationId: string;
  organizationName: string;
  userId: string;
  userName: string;
  role: 'OWNER' | 'MANAGER' | 'SALES' | 'INVENTORY' | 'FINANCE' | 'VIEWER';
}

export const DEFAULT_ORG_SLUG = 'apex-motors';

export async function getTenantContext(requestedOrgSlug?: string): Promise<TenantContext> {
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
      userId: 'user_marcus_vance',
      userName: 'Marcus Vance',
      role: 'OWNER',
    };
  }

  const primaryMember = org.members[0];
  const user = primaryMember?.user;

  return {
    organizationId: org.id,
    organizationName: org.name,
    userId: user?.id || 'user_marcus_vance',
    userName: user?.name || 'Marcus Vance',
    role: (primaryMember?.role as TenantContext['role']) || 'OWNER',
  };
}
