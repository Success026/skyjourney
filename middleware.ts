// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  
  // Skip checking for the admin login page itself
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  // Redirect to login if no token is present and the path is protected
  if (!token && (path.startsWith('/dashboard') || path.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
  }

  // Restrict access to admin routes
  if (path.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};