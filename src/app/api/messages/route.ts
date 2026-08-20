import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { dispatchDealershipEvent } from '@/lib/automations/engine';

export async function GET(request: Request) {
  try {
    const tenant = await getTenantContext();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          vehicle: { include: { photos: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          lead: true,
        },
      });
      return NextResponse.json(conversation);
    }

    const conversations = await prisma.conversation.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        vehicle: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        lead: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await request.json();
    const { conversationId, vehicleId, buyerName, buyerPhone, buyerEmail, content, channel, senderType } = body;

    let targetConvId = conversationId;

    if (!targetConvId) {
      const newConv = await prisma.conversation.create({
        data: {
          organizationId: tenant.organizationId,
          vehicleId: vehicleId || null,
          buyerName: buyerName || 'Interested Buyer',
          buyerPhone: buyerPhone || null,
          buyerEmail: buyerEmail || null,
          channel: channel || 'STOREFRONT_CHAT',
          status: 'ACTIVE',
        },
      });
      targetConvId = newConv.id;
    }

    const msg = await prisma.message.create({
      data: {
        conversationId: targetConvId,
        senderType: senderType || 'BUYER',
        senderName: senderType === 'DEALER_USER' ? tenant.userName : buyerName || 'Buyer',
        content,
      },
    });

    await prisma.conversation.update({
      where: { id: targetConvId },
      data: {
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (senderType === 'BUYER' || !senderType) {
      await dispatchDealershipEvent({
        event: 'message.received',
        organizationId: tenant.organizationId,
        entityId: msg.id,
        data: { conversationId: targetConvId, content },
      });
    }

    const updatedConv = await prisma.conversation.findUnique({
      where: { id: targetConvId },
      include: {
        vehicle: { include: { photos: true } },
        messages: { orderBy: { createdAt: 'asc' } },
        lead: true,
      },
    });

    return NextResponse.json({ success: true, conversation: updatedConv, message: msg });
  } catch (error: any) {
    console.error('Error posting message:', error);
    return NextResponse.json({ error: error.message || 'Message dispatch failed' }, { status: 500 });
  }
}
