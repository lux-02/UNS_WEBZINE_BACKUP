import { NextResponse } from 'next/server';

// POST /api/auth/logout - Admin logout
export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the admin token cookie
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
