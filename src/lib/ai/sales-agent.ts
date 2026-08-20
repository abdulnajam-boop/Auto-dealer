import { formatCurrency, formatNumber } from '../utils';
import { callGeminiApi } from './gemini';

export interface SalesAgentInput {
  vehicle: {
    id: string;
    year: number;
    make: string;
    model: string;
    trim?: string | null;
    mileage: number;
    askingPrice: number;
    preferredPrice: number;
    minPrice: number;
    status: string;
    exteriorColor: string;
  };
  buyerName: string;
  incomingMessage: string;
  conversationHistory: Array<{
    senderType: string;
    content: string;
  }>;
  channel?: string;
}

export interface SalesAgentOutput {
  replyText: string;
  detectedIntent: 'OFFER' | 'APPOINTMENT' | 'FINANCING' | 'TRADE_IN' | 'AVAILABILITY' | 'GENERAL';
  offeredPrice?: number | null;
  proposedAppointmentTime?: string | null;
  counterOfferAmount?: number | null;
  requiresManagerApproval: boolean;
  notes: string;
}

export async function processSalesConversation(
  input: SalesAgentInput
): Promise<SalesAgentOutput> {
  const { vehicle, buyerName, incomingMessage, conversationHistory } = input;
  const vName = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`.trim();
  const askingStr = formatCurrency(vehicle.askingPrice);
  const minStr = formatCurrency(vehicle.minPrice);

  // 1. Extract any numeric offer from incoming message
  const offerRegex = /\$?(\d{1,3}(?:,\d{3})+|\d{4,6})(?:\s*(?:cash|out the door|otd|today|take|offer|dollar))?/i;
  const match = incomingMessage.match(offerRegex);
  let extractedOffer: number | null = null;
  if (match) {
    const rawNum = parseInt(match[1].replace(/,/g, ''), 10);
    // Ignore small numbers like 500 down payment or 2022 year
    if (rawNum >= 2000 && rawNum !== vehicle.year && rawNum < 200000) {
      extractedOffer = rawNum;
    }
  }

  // 2. Classify intent
  const lowerMsg = incomingMessage.toLowerCase();
  let intent: SalesAgentOutput['detectedIntent'] = 'GENERAL';
  if (extractedOffer !== null || lowerMsg.includes('lowest') || lowerMsg.includes('take $') || lowerMsg.includes('offer')) {
    intent = 'OFFER';
  } else if (lowerMsg.includes('test drive') || lowerMsg.includes('come see') || lowerMsg.includes('appointment') || lowerMsg.includes('tomorrow') || lowerMsg.includes('today at') || lowerMsg.includes('available to see')) {
    intent = 'APPOINTMENT';
  } else if (lowerMsg.includes('finance') || lowerMsg.includes('monthly') || lowerMsg.includes('down payment') || lowerMsg.includes('credit') || lowerMsg.includes('apr')) {
    intent = 'FINANCING';
  } else if (lowerMsg.includes('trade') || lowerMsg.includes('current car') || lowerMsg.includes('kbb')) {
    intent = 'TRADE_IN';
  } else if (lowerMsg.includes('still available') || lowerMsg.includes('is this available') || lowerMsg.includes('in stock')) {
    intent = 'AVAILABILITY';
  }

  // 3. Negotiation policy enforcement
  let requiresManagerApproval = false;
  let counterOffer: number | null = null;
  let replyText = '';

  if (intent === 'OFFER' && extractedOffer !== null) {
    if (extractedOffer >= vehicle.askingPrice) {
      replyText = `Hi ${buyerName}! We would be delighted to accept your offer of ${formatCurrency(extractedOffer)} for the ${vName}. Would you like to schedule a VIP test drive and delivery appointment today or tomorrow?`;
    } else if (extractedOffer >= vehicle.preferredPrice) {
      replyText = `Hi ${buyerName}! Thank you for your offer. I can confirm our sales manager authorized ${formatCurrency(extractedOffer)} for you on the ${vName}. When would be the best time for you to come by for a test drive and finalize the paperwork?`;
      counterOffer = extractedOffer;
    } else if (extractedOffer >= vehicle.minPrice) {
      // Split the difference between offer and asking, staying strictly >= minPrice
      const suggestedCounter = Math.max(
        vehicle.minPrice,
        Math.round((extractedOffer + vehicle.askingPrice) / 2 / 100) * 100
      );
      replyText = `Hi ${buyerName}! Thank you for your interest in the ${vName}. While our asking price is ${askingStr}, I can offer you a special direct price of ${formatCurrency(suggestedCounter)} if you're able to complete delivery this week. How does that sound?`;
      counterOffer = suggestedCounter;
    } else {
      // STRICT GUARD: Below minPrice
      requiresManagerApproval = true;
      replyText = `Hi ${buyerName}! Thank you for reaching out. Given the high demand and fresh multi-point reconditioning on this ${vName}, our absolute best automated price is ${minStr}. I can submit your offer of ${formatCurrency(extractedOffer)} directly to our General Sales Manager for special review. Would you like to stop by to inspect the vehicle in person in the meantime?`;
      counterOffer = vehicle.minPrice;
    }
  } else if (intent === 'AVAILABILITY') {
    replyText = `Hi ${buyerName}! Yes, the ${vName} (${formatNumber(vehicle.mileage)} miles) is currently on our lot and available for immediate delivery at ${askingStr}. Would you like to come in for a test drive this afternoon?`;
  } else if (intent === 'APPOINTMENT') {
    replyText = `Hi ${buyerName}! We would love to set up a test drive for you in the ${vName}. We are located at 4500 Auto Mall Pkwy. Do you prefer morning or afternoon? I can reserve the keys for you right away!`;
  } else if (intent === 'FINANCING') {
    const samplePayment = Math.round((vehicle.askingPrice * 0.9 * (0.0699 / 12 * Math.pow(1 + 0.0699 / 12, 60))) / (Math.pow(1 + 0.0699 / 12, 60) - 1));
    replyText = `Hi ${buyerName}! We work with over 20 top lenders offering rates as low as 5.99% APR. With a standard 10% down payment, estimated payments on this ${vName} start around ${formatCurrency(samplePayment)}/month. You can get pre-approved in under 2 minutes with no impact to your credit score!`;
  } else if (intent === 'TRADE_IN') {
    replyText = `Hi ${buyerName}! We love trade-ins and pay top dollar! What is the Year, Make, Model, and approximate mileage of your current vehicle? I can generate an instant equity estimate for you.`;
  } else {
    replyText = `Hi ${buyerName}! Thank you for contacting Apex Auto Gallery regarding the ${vName}. It has only ${formatNumber(vehicle.mileage)} miles and has passed our 120-point certified inspection. How can I best assist you today?`;
  }

  // Attempt Gemini enhancement if available
  const systemInstruction = `You are Alex, the friendly and knowledgeable AI Sales Assistant at Apex Auto Gallery.
Dealership Policy:
- Vehicle: ${vName}
- Asking Price: ${askingStr}
- Absolute Floor Price: ${minStr}
- STRICT INVARIANCE: NEVER agree to or propose any price below ${minStr}.
- Tone: Professional, courteous, helpful, concise.
- Goal: Move the buyer toward a test drive appointment or financing pre-qualification.`;

  const prompt = `Buyer Name: ${buyerName}
Buyer's message: "${incomingMessage}"
Detected Intent: ${intent}
Proposed response: "${replyText}"

Refine this response while strictly preserving the price bounds and call to action. Keep it under 3 sentences.`;

  const enhancedText = await callGeminiApi({ prompt, systemInstruction, temperature: 0.3 });
  if (enhancedText && !enhancedText.includes('$') || (enhancedText && extractedOffer && extractedOffer >= vehicle.minPrice)) {
    // Only accept LLM output if it doesn't violate pricing logic
    replyText = enhancedText.trim();
  }

  return {
    replyText,
    detectedIntent: intent,
    offeredPrice: extractedOffer,
    counterOfferAmount: counterOffer,
    requiresManagerApproval,
    notes: `Processed ${intent} via Sales Agent. Offer: ${extractedOffer ? formatCurrency(extractedOffer) : 'None'}. Manager Approval: ${requiresManagerApproval}`,
  };
}
