import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext } from '@/lib/tenant';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(tenant.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage team members' }, { status: 403 });
    }

    const { email, name, role = 'SALES' } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Upsert user
    const defaultPasswordHash = bcrypt.hashSync('dealer123', 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        name,
        passwordHash: defaultPasswordHash,
      },
    });

    // Create or update organization membership
    const member = await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: tenant.organizationId,
          userId: user.id,
        },
      },
      update: { role },
      create: {
        organizationId: tenant.organizationId,
        userId: user.id,
        role,
      },
    });

    // Log audit action
    await prisma.auditLog.create({
      data: {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        action: 'USER_INVITED',
        entityType: 'USER',
        entityId: user.id,
        detailsJson: JSON.stringify({ invitedEmail: email, role }),
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (err: any) {
    console.error('Error in POST /api/settings/team:', err);
    return NextResponse.json({ error: err.message || 'Failed to add team member' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (!['OWNER', 'ADMIN'].includes(tenant.role)) {
      return NextResponse.json({ error: 'Forbidden: Only owners and admins can modify user roles' }, { status: 403 });
    }

    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    const member = await prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId: tenant.organizationId,
          userId,
        },
      },
      data: { role },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        action: 'USER_ROLE_CHANGED',
        entityType: 'USER',
        entityId: userId,
        detailsJson: JSON.stringify({ newRole: role }),
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (err: any) {
    console.error('Error in PATCH /api/settings/team:', err);
    return NextResponse.json({ error: err.message || 'Failed to update user role' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (!['OWNER', 'ADMIN'].includes(tenant.role)) {
      return NextResponse.json({ error: 'Forbidden: Only owners and admins can remove team members' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (userId === tenant.userId) {
      return NextResponse.json({ error: 'Cannot remove your own active membership' }, { status: 400 });
    }

    await prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId: tenant.organizationId,
          userId,
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        action: 'USER_REMOVED',
        entityType: 'USER',
        entityId: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in DELETE /api/settings/team:', err);
    return NextResponse.json({ error: err.message || 'Failed to remove team member' }, { status: 500 });
  }
}
