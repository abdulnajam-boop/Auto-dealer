import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const appointments = await prisma.appointment.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        lead: true,
        vehicle: {
          select: { id: true, year: true, make: true, model: true, stockNumber: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();
    const { leadId, vehicleId, scheduledAt, appointmentType, notes } = body;

    if (!scheduledAt) {
      return NextResponse.json({ error: 'scheduledAt date is required' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        organizationId: tenant.organizationId,
        leadId: leadId || null,
        vehicleId: vehicleId || null,
        customerName: body.customerName || 'Direct VIP Customer',
        customerPhone: body.customerPhone || null,
        customerEmail: body.customerEmail || null,
        scheduledAt: new Date(scheduledAt),
        type: appointmentType || 'TEST_DRIVE',
        status: 'SCHEDULED',
        notes: notes || null,
      },
      include: {
        lead: true,
        vehicle: true,
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
