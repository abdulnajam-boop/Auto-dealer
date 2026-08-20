import { NextResponse } from 'next/server';
import { getSession, getUserWithMemberships } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    const userData = await getUserWithMemberships(session.userId);

    if (!userData) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: userData.user,
      currentOrganization: {
        id: session.organizationId,
        name: session.organizationName,
        slug: session.organizationSlug,
        role: session.role,
      },
      organizations: userData.memberships,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve session profile.' },
      { status: 500 }
    );
  }
}
