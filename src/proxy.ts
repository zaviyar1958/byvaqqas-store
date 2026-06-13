import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const authCookie = request.cookies.get('admin_auth');
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
