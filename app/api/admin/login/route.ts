import { NextResponse } from 'next/server';

// POST /api/admin/login
// Body: { password: string }
// On success: sets an httpOnly cookie "admin_auth" with the password value.
// On failure: returns 401.
export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin password is not configured on the server.' },
        { status: 500 }
      );
    }

    if (typeof password !== 'string' || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Wrong password. Try again.' },
        { status: 401 }
      );
    }

    // Build the response and attach the cookie.
    const response = NextResponse.json({ message: 'Logged in' }, { status: 200 });
    response.cookies.set({
      name: 'admin_auth',
      value: ADMIN_PASSWORD,
      httpOnly: true,        // JS can't read it (basic XSS protection)
      sameSite: 'strict',    // basic CSRF protection
      path: '/',             // sent for all routes
      maxAge: 60 * 60 * 24,  // 1 day
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
