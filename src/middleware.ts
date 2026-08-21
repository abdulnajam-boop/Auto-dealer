import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'dealeros_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'dealeros-super-secure-jwt-session-secret-key-32chars!'
);

const PUBLIC_PREFIXES = [
  '/_next',
  '/api/_',
  '/brand',
  '/public',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/api/auth',
  '/api/demo',
  '/api/consumer',
  '/api/vin',
  '/login',
  '/register',
  '/demo',
  '/request-demo',
  '/pricing',
  '/about',
  '/features',
  '/integrations',
  '/contact',
  '/security',
  '/cars',
  '/lease-deals',
  '/lease-intelligence',
  '/dealer',
  '/storefront',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow root homepage '/' directly as public B2B marketing page
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 2. Allow static files, Next.js internals, and public marketing / storefront / consumer paths
  if (
    pathname.includes('.') ||
    PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  ) {
    // If authenticated user visits /login or /register, redirect to dashboard
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (token && (pathname === '/login' || pathname === '/register')) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
        const orgSlug = (payload as any)?.organizationSlug || 'dashboard';
        return NextResponse.redirect(new URL(orgSlug !== 'dashboard' ? `/d/${orgSlug}/dashboard` : '/dashboard', request.url));
      } catch {
        // Invalid token, allow login page
      }
    }
    return NextResponse.next();
  }

  // 3. Verify session token for protected routes
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // 4. Protect private dealer routes
  if (!isAuthenticated) {
    // For API requests, return 401 JSON
    if (pathname.startsWith('/api/')) {
      // Allow demo fallback during local development testing if enabled
      if (process.env.ALLOW_DEMO_TENANT === 'true') {
        return NextResponse.next();
      }
      return NextResponse.json(
        { error: 'Unauthorized. Authentication session required.' },
        { status: 401 }
      );
    }

    // For page requests, redirect to /login with callbackUrl
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
