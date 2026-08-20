import { prisma } from '../prisma';
import { generateVehicleListing } from '../ai/copywriter';
import { publishEverywhere, delistVehicleEverywhere } from '../marketplaces/orchestrator';
import { processSalesConversation } from '../ai/sales-agent';

export type DealershipEvent =
  | 'vehicle.created'
  | 'vehicle.updated'
  | 'vehicle.purchased'
  | 'vehicle.ready'
  | 'listing.generated'
  | 'listing.approved'
  | 'listing.published'
  | 'listing.failed'
  | 'message.received'
  | 'lead.created'
  | 'offer.received'
  | 'appointment.created'
  | 'deal.created'
  | 'vehicle.sold'
  | 'inventory.aged'
  | 'expense.created';

export interface EventPayload {
  event: DealershipEvent;
  organizationId: string;
  entityId: string;
  data?: Record<string, any>;
}

export async function dispatchDealershipEvent(payload: EventPayload): Promise<{
  success: boolean;
  actionsTriggered: string[];
}> {
  const { event, organizationId, entityId, data } = payload;
  const actionsTriggered: string[] = [];

  try {
    // 1. Log event occurrence
    await prisma.auditLog.create({
      data: {
        organizationId,
        action: `EVENT_${event.toUpperCase().replace('.', '_')}`,
        entityType: 'EVENT',
        entityId,
        detailsJson: data ? JSON.stringify(data) : undefined,
      },
    });

    // 2. Event Handlers
    switch (event) {
      // WHEN vehicle.ready -> Generate AI Listing Draft
      case 'vehicle.ready': {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id: entityId },
          include: { expenses: true },
        });
        if (vehicle) {
          const generated = await generateVehicleListing({
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            trim: vehicle.trim,
            mileage: vehicle.mileage,
            exteriorColor: vehicle.exteriorColor,
            interiorColor: vehicle.interiorColor,
            engine: vehicle.engine,
            transmission: vehicle.transmission,
            drivetrain: vehicle.drivetrain,
            askingPrice: vehicle.askingPrice,
            stockNumber: vehicle.stockNumber,
            conditionGrade: vehicle.conditionGrade,
            reconditioningNotes: vehicle.expenses.map((e) => `${e.category}: ${e.description}`),
          });

          await prisma.listing.create({
            data: {
              organizationId,
              vehicleId: vehicle.id,
              headline: generated.headline,
              shortDescription: generated.shortDescription,
              longDescription: generated.longDescription,
              featureBulletsJson: JSON.stringify(generated.featureBullets),
              seoTitle: generated.seoTitle,
              seoDescription: generated.seoDescription,
              facebookCopy: generated.facebookCopy,
              craigslistCopy: generated.craigslistCopy,
              socialCopy: generated.socialCopy,
              hashtagsJson: JSON.stringify(generated.hashtags),
              suggestedAskingPrice: generated.suggestedAskingPrice,
              status: 'DRAFT',
            },
          });

          await prisma.notification.create({
            data: {
              organizationId,
              title: 'AI Listing Generated',
              message: `AI Listing draft created for ${vehicle.year} ${vehicle.make} ${vehicle.model} (Stock #${vehicle.stockNumber}). Review and approve for publishing.`,
              type: 'INFO',
              linkUrl: `/listings`,
            },
          });

          actionsTriggered.push('GENERATE_AI_LISTING');
        }
        break;
      }

      // WHEN listing.approved -> Publish to all configured marketplace adapters
      case 'listing.approved': {
        const listing = await prisma.listing.findUnique({
          where: { id: entityId },
        });
        if (listing) {
          await publishEverywhere(organizationId, listing.vehicleId, listing.id);
          actionsTriggered.push('PUBLISH_EVERYWHERE');
        }
        break;
      }

      // WHEN vehicle.sold -> Remove active marketplace listings and notify dealer
      case 'vehicle.sold': {
        const delistResult = await delistVehicleEverywhere(organizationId, entityId);
        actionsTriggered.push(`DELISTED_${delistResult.removedCount}_MARKETPLACES`);

        const vehicle = await prisma.vehicle.findUnique({ where: { id: entityId } });
        if (vehicle) {
          const profit = (vehicle.soldPrice || vehicle.askingPrice) - vehicle.totalCostBasis;
          await prisma.notification.create({
            data: {
              organizationId,
              title: 'Vehicle Sold & Listings Removed',
              message: `${vehicle.year} ${vehicle.make} ${vehicle.model} sold! Realized gross profit: $${profit.toLocaleString()}. Active marketplace listings have been closed.`,
              type: 'SUCCESS',
              linkUrl: `/inventory/${vehicle.id}`,
            },
          });
        }
        break;
      }

      // WHEN message.received -> Process with AI Sales Agent and update Lead
      case 'message.received': {
        const message = await prisma.message.findUnique({
          where: { id: entityId },
          include: {
            conversation: {
              include: {
                vehicle: true,
                lead: true,
                messages: { orderBy: { createdAt: 'desc' }, take: 5 },
              },
            },
          },
        });

        if (message && message.senderType === 'BUYER' && message.conversation.vehicle) {
          const v = message.conversation.vehicle;
          const agentResult = await processSalesConversation({
            vehicle: {
              id: v.id,
              year: v.year,
              make: v.make,
              model: v.model,
              trim: v.trim,
              mileage: v.mileage,
              askingPrice: v.askingPrice,
              preferredPrice: v.preferredPrice,
              minPrice: v.minPrice,
              status: v.status,
              exteriorColor: v.exteriorColor,
            },
            buyerName: message.conversation.buyerName,
            incomingMessage: message.content,
            conversationHistory: message.conversation.messages.map((m) => ({
              senderType: m.senderType,
              content: m.content,
            })),
            channel: message.conversation.channel,
          });

          // Create AI response message
          await prisma.message.create({
            data: {
              conversationId: message.conversationId,
              senderType: 'AI_SALES_AGENT',
              senderName: 'Alex (AI Sales Assistant)',
              content: agentResult.replyText,
              metadataJson: JSON.stringify({
                detectedIntent: agentResult.detectedIntent,
                offeredPrice: agentResult.offeredPrice,
                requiresManagerApproval: agentResult.requiresManagerApproval,
              }),
            },
          });

          // Create / update lead
          await prisma.lead.upsert({
            where: { conversationId: message.conversationId },
            update: {
              currentOffer: agentResult.offeredPrice || undefined,
              stage: agentResult.detectedIntent === 'OFFER' ? 'NEGOTIATING' : agentResult.detectedIntent === 'APPOINTMENT' ? 'APPOINTMENT' : 'CONTACTED',
              score: Math.min(95, (message.conversation.lead?.score || 60) + 10),
            },
            create: {
              organizationId,
              conversationId: message.conversationId,
              vehicleId: v.id,
              name: message.conversation.buyerName,
              email: message.conversation.buyerEmail,
              phone: message.conversation.buyerPhone,
              initialOffer: agentResult.offeredPrice || undefined,
              currentOffer: agentResult.offeredPrice || undefined,
              stage: agentResult.detectedIntent === 'OFFER' ? 'NEGOTIATING' : 'CONTACTED',
              score: 70,
            },
          });

          // Log AI action
          await prisma.aiAction.create({
            data: {
              organizationId,
              agentType: 'SALES_AGENT',
              actionType: 'DRAFT_RESPONSE',
              promptInput: message.content,
              outputResult: agentResult.replyText,
              requiresApproval: agentResult.requiresManagerApproval,
              isApproved: !agentResult.requiresManagerApproval,
            },
          });

          actionsTriggered.push('AI_SALES_AGENT_REPLIED');
        }
        break;
      }

      default:
        break;
    }

    return { success: true, actionsTriggered };
  } catch (error: any) {
    console.error('Error dispatching dealership event:', error);
    return { success: false, actionsTriggered };
  }
}
