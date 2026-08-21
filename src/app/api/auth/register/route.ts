import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken, setSessionCookie, UserRole } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, name, email, password, dealershipName, city, state, phone } = body;

    const resolvedFirstName = firstName || (name ? name.split(' ')[0] : '');
    const resolvedLastName = lastName || (name ? name.split(' ').slice(1).join(' ') : '');
    const fullName = `${resolvedFirstName} ${resolvedLastName}`.trim() || name;

    if (!fullName || !email || !password || !dealershipName) {
      return NextResponse.json(
        { error: 'First name, last name, email, password, and dealership name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // 2. Generate unique slug for dealership
    let baseSlug = slugify(dealershipName);
    if (!baseSlug) baseSlug = 'dealer';
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. Hash password securely
    const passwordHash = await hashPassword(password);

    // 4. Ensure default starter plan exists
    let starterPlan = await prisma.plan.findUnique({
      where: { code: 'STARTER' },
    });

    if (!starterPlan) {
      starterPlan = await prisma.plan.create({
        data: {
          code: 'STARTER',
          name: 'Starter Tier',
          priceMonthly: 249,
          priceAnnual: 2388,
          maxVehicles: 30,
          maxUsers: 3,
          featuresJson: JSON.stringify(['INVENTORY', 'STOREFRONT', 'BASIC_CRM']),
        },
      });
    }

    // 5. Create user, organization, member, primary location, branding, and subscription in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: fullName,
          email: normalizedEmail,
          passwordHash,
          phone: phone || null,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: dealershipName.trim(),
          slug,
          phone: phone || null,
          city: city || null,
          state: state || 'TX',
          dealerType: 'INDEPENDENT',
          inventorySize: '1-25',
          onboardingCompleted: false,
          onboardingStep: 1,
          settingsJson: JSON.stringify({
            docFee: 499,
            salesTaxRate: 0.0625,
            titleRegFee: 150,
            aiAutoReplyEnabled: true,
            minProfitTarget: 1500,
            requireApprovalForOffers: true,
            maxAiDiscount: 1000,
          }),
        },
      });

      const member = await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: 'OWNER',
        },
      });

      // Create primary location
      await tx.location.create({
        data: {
          organizationId: organization.id,
          name: 'Main Showroom',
          address: '100 Auto Blvd',
          city: city || 'Austin',
          state: state || 'TX',
          zip: '78701',
          phone: phone || null,
          isPrimary: true,
        },
      });

      // Create default dealer branding
      await tx.dealerBranding.create({
        data: {
          organizationId: organization.id,
          heroTitle: `Welcome to ${dealershipName.trim()}`,
          heroSubtitle: 'Exceptional pre-owned vehicles, transparent pricing, and instant financing.',
          primaryColor: '#10b981',
          accentColor: '#14b8a6',
          tagline: 'Quality Vehicles. Trusted Service.',
          showOwnInventory: true,
          showLeaseDeals: false,
          showNetworkInventory: false,
          showPartnerListings: false,
          showCarfaxCta: true,
          showFinancingCta: true,
          showTradeInCta: true,
          showMakeOffer: true,
          showScheduleTestDrive: true,
          showContactDealer: true,
          showVehicleRecommendations: true,
          preferredHistoryProvider: 'VINAUDIT',
        },
      });

      // Create 14-day starter trial subscription
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      await tx.subscription.create({
        data: {
          organizationId: organization.id,
          planId: starterPlan.id,
          status: 'TRIAL',
          currentPeriodStart: new Date(),
          currentPeriodEnd: trialEndDate,
        },
      });

      // Create default marketplace accounts
      const defaultMarketplaces = ['STOREFRONT', 'FACEBOOK', 'CRAIGSLIST', 'EBAY_MOTORS'];
      for (const platform of defaultMarketplaces) {
        await tx.marketplaceAccount.create({
          data: {
            organizationId: organization.id,
            platform,
            accountName: `${organization.name} (${platform})`,
            status: 'ACTIVE',
          },
        });
      }

      return { user, organization, member };
    });

    const { user, organization } = result;

    // 6. Create and set HTTP-only session cookie
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      organizationId: organization.id,
      organizationSlug: organization.slug,
      organizationName: organization.name,
      role: 'OWNER',
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      redirectUrl: `/onboarding`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      currentOrganization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        role: 'OWNER' as UserRole,
      },
    });
  } catch (error: any) {
    console.error('[AUTH_REGISTER_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred during registration.' },
      { status: 500 }
    );
  }
}
