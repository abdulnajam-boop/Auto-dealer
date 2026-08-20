import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId = `sess_${Date.now()}`,
      consumerProfileId,
      eventType,
      entityType,
      entityId,
      metadata,
    } = body;

    if (!eventType || !entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing required event fields (eventType, entityType, entityId)' },
        { status: 400 }
      );
    }

    const event = await prisma.consumerEvent.create({
      data: {
        consumerProfileId: consumerProfileId || null,
        sessionId,
        eventType,
        entityType,
        entityId,
        metadataJson: metadata ? JSON.stringify(metadata) : null,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: any) {
    console.error('Error in POST /api/consumer/events:', err);
    return NextResponse.json(
      { error: 'Failed to record event', details: err.message },
      { status: 500 }
    );
  }
}
