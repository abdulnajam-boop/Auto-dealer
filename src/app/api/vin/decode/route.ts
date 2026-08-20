import { NextResponse } from 'next/server';
import { decodeVin } from '@/lib/vin/decoder';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vin } = body;

    if (!vin || typeof vin !== 'string') {
      return NextResponse.json({ error: 'Valid VIN is required' }, { status: 400 });
    }

    const decoded = await decodeVin(vin);
    return NextResponse.json(decoded);
  } catch (error: any) {
    console.error('Error decoding VIN:', error);
    return NextResponse.json({ error: error.message || 'VIN decode failed' }, { status: 500 });
  }
}
