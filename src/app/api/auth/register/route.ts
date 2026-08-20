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
    const { name, email, password, dealershipName, city, state, phone } = body;

    if (!name || !email || !password || !dealershipName) {
      return NextResponse.json(
        { error: 'Name, email, password, and dealership name are required.' },
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
        { error: 'An account with this email address already exists. Please log in.' },
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

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create user, organization, member, primary location, and default marketplace accounts in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
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
          state: state || null,
          settingsJson: JSON.stringify({
            docFee: 499,
            salesTaxRate: 0.0625,
            titleRegFee: 150,
            aiAutoReplyEnabled: true,
            minProfitTarget: 1500,
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
          address: '100 Dealership Way',
          city: city || 'Austin',
          state: state || 'TX',
          zip: '78701',
          phone: phone || null,
          isPrimary: true,
        },
      });

      // Create marketplace accounts
      const defaultMarketplaces = ['STOREFRONT', 'FACEBOOK', 'CRAIGSLIST', 'EBAY_MOTORS'];
      for (const platform of defaultMarketplaces) {
        await tx.marketplaceAccount.create({
          data: {
            organizationId: organization.id,
            platform,
            accountName: `${organization.name} (${platform})`,
            status: platform === 'STOREFRONT' ? 'ACTIVE' : 'ACTIVE',
          },
        });
      }

      return { user, organization, member };
    });

    const { user, organization } = result;

    // 5. Create and set session cookie
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
