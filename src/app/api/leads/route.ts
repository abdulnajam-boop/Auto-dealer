import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage');

    const whereClause: any = { organizationId: tenant.organizationId };
    if (stage && stage !== 'ALL') {
      whereClause.stage = stage;
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: { id: true, year: true, make: true, model: true, stockNumber: true, askingPrice: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        conversation: {
          include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();
    const { name, email, phone, vehicleId, stage, score, notes, initialOffer, assignedToUserId, assignedToId } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        organizationId: tenant.organizationId,
        vehicleId: vehicleId || null,
        name,
        email: email || null,
        phone: phone || null,
        stage: stage || 'NEW',
        score: score ? Number(score) : 75,
        notes: notes || null,
        initialOffer: initialOffer ? Number(initialOffer) : null,
        currentOffer: initialOffer ? Number(initialOffer) : null,
        assignedToId: assignedToId || assignedToUserId || null,
      },
      include: {
        vehicle: true,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
