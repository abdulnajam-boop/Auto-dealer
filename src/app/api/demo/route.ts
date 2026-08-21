import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DemoRequestSchema } from '@/lib/validation/demo-request';

// In-memory rate limiting map for demo requests per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // max 5 submissions per IP per 15 min

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = DemoRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMap = parseResult.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: 'Invalid submission data', details: errorMap },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Check for obvious disposable email or spam bot honeypot if provided
    if ((body as Record<string, unknown>).website_hp) {
      // Honeypot field filled by bots
      return NextResponse.json({ success: true, message: 'Demo request received' });
    }

    const demoRequest = await prisma.demoRequest.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        dealershipName: data.dealershipName.trim(),
        businessEmail: data.businessEmail.trim().toLowerCase(),
        phone: data.phone.trim(),
        state: data.state.trim(),
        inventorySize: data.inventorySize || null,
        employeeCount: data.employeeCount || null,
        currentDms: data.currentDms || null,
        mainChallenge: data.mainChallenge || null,
        preferredContactMethod: data.preferredContactMethod || 'EMAIL',
        preferredDemoDate: data.preferredDemoDate || null,
        preferredDemoTime: data.preferredDemoTime || null,
        ipAddress: ip,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! An AutoAIdealership specialist will reach out shortly to schedule your personalized live demo.',
      id: demoRequest.id,
    });
  } catch (error: any) {
    console.error('Error handling demo request:', error);
    return NextResponse.json(
      { error: 'Failed to submit demo request. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Admin-only listing of demo requests (can be filtered by status)
  try {
    const demoRequests = await prisma.demoRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ demoRequests });
  } catch (error: any) {
    console.error('Error fetching demo requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo requests' },
      { status: 500 }
    );
  }
}
