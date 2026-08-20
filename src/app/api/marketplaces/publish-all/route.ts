import { NextResponse } from 'next/server';
import { getTenantContext } from '@/lib/tenant';
import { publishEverywhere } from '@/lib/marketplaces/orchestrator';

export async function POST(request: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await request.json();
    const { vehicleId, listingId, platforms } = body;

    if (!vehicleId || !listingId) {
      return NextResponse.json({ error: 'vehicleId and listingId are required' }, { status: 400 });
    }

    const results = await publishEverywhere(
      tenant.organizationId,
      vehicleId,
      listingId,
      platforms
    );

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Error publishing to marketplaces:', error);
    return NextResponse.json({ error: error.message || 'Publishing failed' }, { status: 500 });
  }
}
