import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/evidence', '/custody-events', '/actors', '/sql-views', '/triggers', '/audit'];
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // In a real app, you'd check a JWT token or session here
    // For now, we're handling auth client-side
    // The dashboard components will redirect to login if no user is authenticated
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
