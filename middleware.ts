import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token');
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
