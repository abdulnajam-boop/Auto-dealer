import { NextResponse } from 'next/server';
import { getTenantContext } from '@/lib/tenant';
import { processDealerExecutiveQuery } from '@/lib/ai/executive-assistant';

export async function POST(request: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await processDealerExecutiveQuery({
      organizationId: tenant.organizationId,
      query,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error processing executive assistant query:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
