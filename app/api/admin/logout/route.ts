import { NextResponse } from 'next/server';

// POST /api/admin/logout
// Clears the admin_auth cookie.
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  response.cookies.delete('admin_auth');
  return response;
}
