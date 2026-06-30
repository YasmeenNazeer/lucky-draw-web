import { NextResponse } from 'next/server';

// POST /api/admin/logout
// Clears the admin_auth cookie using the same options it was set with.
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  // Delete the cookie using the same attributes it was set with (path and sameSite)
  response.cookies.delete('admin_auth', {
    path: '/',
    sameSite: 'strict',
  });
  return response;
}
