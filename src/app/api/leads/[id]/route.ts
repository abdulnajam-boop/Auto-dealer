import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: { photos: { where: { isCover: true }, take: 1 } },
        },
        assignedTo: { select: { id: true, name: true, email: true } },
        appointments: { orderBy: { scheduledAt: 'desc' } },
        conversation: {
          include: {
            messages: { orderBy: { createdAt: 'asc' } },
          },
        },
      },
    });

    if (!lead || lead.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await params;
    const body = await req.json();
    const { stage, notes, assignedToUserId, assignedToId, currentOffer, score } = body;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        stage: stage || undefined,
        notes: notes !== undefined ? notes : undefined,
        assignedToId: assignedToId || assignedToUserId || undefined,
        currentOffer: currentOffer ? Number(currentOffer) : undefined,
        score: score ? Number(score) : undefined,
      },
      include: {
        vehicle: true,
        assignedTo: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        action: 'LEAD_UPDATED',
        entityType: 'LEAD',
        entityId: id,
        detailsJson: JSON.stringify({ oldStage: existing.stage, newStage: updated.stage }),
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
