import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'dealeros_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'dealeros-super-secure-jwt-session-secret-key-32chars!'
);

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/storefront',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/vin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static files, Next.js internals, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Check for public paths
  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // 3. Verify session token from cookie
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

  // 4. If logged in and accessing auth pages (login/register), redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. If root path '/', redirect to dashboard (or login if not authenticated)
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 6. Protect private pages
  if (!isAuthenticated && !isPublicPath) {
    // For API requests, return 401 JSON
    if (pathname.startsWith('/api/')) {
      // Allow demo fallback during local development testing if needed, else 401
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
