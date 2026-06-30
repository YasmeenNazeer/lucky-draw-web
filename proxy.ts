import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple admin password protection.
// The correct password is set via the ADMIN_PASSWORD env variable.
// When the user logs in successfully, we set an httpOnly cookie called "admin_auth".
// In this proxy, we just check whether that cookie exists and matches the password.
//
// /admin/login is exempt so the user can actually see the login form.
// Also exempt API routes under /api/admin (login, logout, etc.) so they work without the cookie.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to API routes under /api/admin (login, logout, etc.)
  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // Allow access to the login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Only protect /admin routes (but let /admin/login through via above check).
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // If the env variable isn't set, fail closed (deny access) and log a warning.
  if (!ADMIN_PASSWORD) {
    console.warn('ADMIN_PASSWORD is not set. /admin is locked.');
    // Redirect to login without error param for simplicity; login page can show generic error.
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const cookie = request.cookies.get('admin_auth')?.value;
  if (cookie === ADMIN_PASSWORD) {
    // Authenticated — let the request through.
    return NextResponse.next();
  }

  // Not authenticated — send to login page.
  return NextResponse.redirect(new URL('/admin/login', request.url));
}

// Only run this proxy for /admin/* paths.
export const config = {
  matcher: '/admin/:path*',
};