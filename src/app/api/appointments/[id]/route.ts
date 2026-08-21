import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await params;
    const body = await req.json();
    const { status, scheduledAt, notes } = body;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        lead: true,
        vehicle: true,
      },
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
