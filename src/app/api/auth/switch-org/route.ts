import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, createSessionToken, setSessionCookie, UserRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required.' },
        { status: 400 }
      );
    }

    // Verify user is a member of target organization
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: session.userId,
        },
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this dealership organization.' },
        { status: 403 }
      );
    }

    const org = membership.organization;
    const role = membership.role as UserRole;

    // Issue updated session token
    const token = await createSessionToken({
      userId: session.userId,
      email: session.email,
      name: session.name,
      organizationId: org.id,
      organizationSlug: org.slug,
      organizationName: org.name,
      role: role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      currentOrganization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        role: role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to switch organization.' },
      { status: 500 }
    );
  }
}
