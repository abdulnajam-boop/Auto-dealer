import { describe, it, expect } from 'vitest';
import { processSalesConversation } from '../src/lib/ai/sales-agent';

describe('Autonomous AI Sales Agent & Negotiation Guardrails', () => {
  const vehicle = {
    id: 'veh_test_1',
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    trim: 'SE',
    mileage: 28400,
    askingPrice: 24900,
    preferredPrice: 23900,
    minPrice: 23000,
    status: 'LISTED',
    exteriorColor: 'Silver',
  };

  it('accepts or counters within approved dealer price boundaries', async () => {
    const result = await processSalesConversation({
      vehicle,
      buyerName: 'David Lee',
      incomingMessage: 'Will you accept $23,900 cash if I come in today?',
      conversationHistory: [],
    });

    expect(result.detectedIntent).toBe('OFFER');
    expect(result.offeredPrice).toBe(23900);
    expect(result.requiresManagerApproval).toBe(false);
    expect(result.replyText).toContain('authorized');
  });

  it('HARD GUARD: Refuses to offer below minimum price and marks for manager review', async () => {
    const result = await processSalesConversation({
      vehicle,
      buyerName: 'Lowball Larry',
      incomingMessage: 'I have $20,000 cash out the door right now.',
      conversationHistory: [],
    });

    expect(result.detectedIntent).toBe('OFFER');
    expect(result.offeredPrice).toBe(20000);
    expect(result.requiresManagerApproval).toBe(true);
    // Must NOT propose $20,000; must enforce min price ($23,000)
    expect(result.counterOfferAmount).toBe(23000);
    expect(result.replyText).toContain('$23,000');
  });

  it('correctly classifies appointment scheduling requests', async () => {
    const result = await processSalesConversation({
      vehicle,
      buyerName: 'Sarah Jenkins',
      incomingMessage: 'Can I come in for a test drive tomorrow at 2pm?',
      conversationHistory: [],
    });

    expect(result.detectedIntent).toBe('APPOINTMENT');
    expect(result.replyText.toLowerCase()).toContain('test drive');
  });
});
