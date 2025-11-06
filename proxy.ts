import createIntlMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "ko",
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin page (except login and API routes)
  if (pathname.includes('/admin') && !pathname.includes('/admin/login') && !pathname.startsWith('/api')) {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      // No token, redirect to login
      const locale = pathname.split('/')[1] || 'ko';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the JWT token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
      );
      await jwtVerify(token, secret);

      // Token is valid, continue with intl middleware
      return intlMiddleware(request);
    } catch (error) {
      // Invalid token, redirect to login
      console.error('Invalid token:', error);
      const locale = pathname.split('/')[1] || 'ko';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For non-admin pages, just use intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
