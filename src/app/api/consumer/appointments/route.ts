import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationId,
      vehicleId,
      name,
      email,
      phone,
      appointmentDate,
      appointmentType = 'TEST_DRIVE',
      notes,
    } = body;

    if (!organizationId || !name || !appointmentDate || (!email && !phone)) {
      return NextResponse.json(
        { error: 'organizationId, name, appointmentDate, and contact info are required' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(appointmentDate);

    // 1. Create or link CRM Lead
    const lead = await prisma.lead.create({
      data: {
        organizationId,
        vehicleId: vehicleId || null,
        name,
        email: email || null,
        phone: phone || null,
        stage: 'APPOINTMENT',
        score: 90,
        notes: `Test Drive requested for ${parsedDate.toLocaleString()}. ${notes ? `Notes: ${notes}` : ''}`,
      },
    });

    // 2. Create Appointment record
    const appointment = await prisma.appointment.create({
      data: {
        organizationId,
        leadId: lead.id,
        vehicleId: vehicleId || null,
        customerName: name,
        customerPhone: phone || null,
        customerEmail: email || null,
        scheduledAt: parsedDate,
        type: appointmentType || 'TEST_DRIVE',
        status: 'SCHEDULED',
        notes: notes || `Customer: ${name} (${phone || email})`,
      },
    });

    // 3. Notification for dealer
    await prisma.notification.create({
      data: {
        organizationId,
        title: `New Test Drive Scheduled: ${name}`,
        message: `Scheduled for ${parsedDate.toLocaleString()}`,
        type: 'SUCCESS',
        linkUrl: '/appointments',
      },
    });

    return NextResponse.json({
      success: true,
      appointment,
      lead,
      message: 'Test drive appointment booked successfully',
    });
  } catch (error: any) {
    console.error('[APPOINTMENT_CREATE_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Failed to schedule appointment' }, { status: 500 });
  }
}
