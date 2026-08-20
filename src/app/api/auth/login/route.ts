import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionToken, setSessionCookie, UserRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, requestedOrgId } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 2. Verify password hash
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.memberships.length === 0) {
      return NextResponse.json(
        { error: 'User does not belong to any organization. Please contact your administrator.' },
        { status: 403 }
      );
    }

    // 3. Determine active organization
    let activeMembership = user.memberships[0];
    if (requestedOrgId) {
      const matched = user.memberships.find((m) => m.organizationId === requestedOrgId);
      if (matched) activeMembership = matched;
    }

    const org = activeMembership.organization;
    const role = activeMembership.role as UserRole;

    // 4. Create session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      organizationId: org.id,
      organizationSlug: org.slug,
      organizationName: org.name,
      role: role,
    });

    // 5. Set session cookie
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      currentOrganization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        role: role,
      },
      organizations: user.memberships.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
      })),
    });
  } catch (error: any) {
    console.error('[AUTH_LOGIN_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred during authentication.' },
      { status: 500 }
    );
  }
}
