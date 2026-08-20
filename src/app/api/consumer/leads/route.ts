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
      leadType = 'GENERAL_INQUIRY',
      message,
      offerAmount,
      preferredDate,
      tradeInDetails,
      consentSms = true,
      consentEmail = true,
    } = body;

    if (!organizationId || !name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Missing required lead parameters (organizationId, name, and email/phone required)' },
        { status: 400 }
      );
    }

    // 1. Upsert Consumer Profile if email provided
    let consumerProfileId: string | null = null;
    if (email) {
      const consumer = await prisma.consumerProfile.upsert({
        where: { email },
        update: {
          name,
          phone: phone || undefined,
        },
        create: {
          email,
          name,
          phone,
          isVerified: true,
        },
      });
      consumerProfileId = consumer.id;

      // 2. Log Explicit Consent Records
      if (consentSms && phone) {
        await prisma.consentRecord.create({
          data: {
            consumerProfileId: consumer.id,
            email,
            phone,
            consentType: 'MARKETING_SMS',
            granted: true,
            ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
            userAgent: req.headers.get('user-agent') || 'Browser',
          },
        });
      }

      if (consentEmail) {
        await prisma.consentRecord.create({
          data: {
            consumerProfileId: consumer.id,
            email,
            consentType: 'MARKETING_EMAIL',
            granted: true,
            ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
            userAgent: req.headers.get('user-agent') || 'Browser',
          },
        });
      }
    }

    // 3. Create Dealership CRM Lead
    const lead = await prisma.lead.create({
      data: {
        organizationId,
        vehicleId: vehicleId || null,
        name,
        email: email || null,
        phone: phone || null,
        preferredContactMethod: phone ? 'SMS' : 'EMAIL',
        initialOffer: offerAmount ? parseFloat(offerAmount) : null,
        currentOffer: offerAmount ? parseFloat(offerAmount) : null,
        stage: 'NEW',
        score: offerAmount || preferredDate ? 85 : 70,
        notes: `Source: Consumer Marketplace (${leadType}). ${message ? `Note: ${message}` : ''} ${tradeInDetails ? `Trade-in: ${tradeInDetails}` : ''}`,
      },
    });

    // 4. Record Vehicle Interest if vehicleId provided
    if (vehicleId) {
      await prisma.vehicleInterest.create({
        data: {
          organizationId,
          consumerProfileId,
          vehicleId,
          leadId: lead.id,
          intentLevel: offerAmount || preferredDate ? 'HIGH' : 'MEDIUM',
          hasRequestedQuote: Boolean(offerAmount),
          hasRequestedTest: Boolean(preferredDate),
        },
      });
    }

    // 5. Create Dealership Staff Notification
    await prisma.notification.create({
      data: {
        organizationId,
        title: `New Marketplace Lead: ${name}`,
        message: `${leadType} received for ${vehicleId ? 'vehicle inquiry' : 'dealership'}. Score: ${lead.score}/100.`,
        type: 'SUCCESS',
        linkUrl: '/leads',
      },
    });

    // 6. Log First-Party Intent Event
    await prisma.consumerEvent.create({
      data: {
        consumerProfileId,
        sessionId: `sess_${Date.now()}`,
        eventType: leadType === 'TEST_DRIVE' ? 'test_drive.requested' : 'availability.requested',
        entityType: vehicleId ? 'VEHICLE' : 'DEALER',
        entityId: vehicleId || organizationId,
        metadataJson: JSON.stringify({ leadId: lead.id, leadType }),
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Inquiry successfully processed and delivered to dealership CRM',
    });
  } catch (err: any) {
    console.error('Error in POST /api/consumer/leads:', err);
    return NextResponse.json(
      { error: 'Internal server error processing lead', details: err.message },
      { status: 500 }
    );
  }
}
