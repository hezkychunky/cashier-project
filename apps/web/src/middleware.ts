import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('✅ Middleware executed for:', req.nextUrl.pathname);

  const token = req.cookies.get('token')?.value || null;
  const userRole = req.cookies.get('userRole')?.value || null;

  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === '/login';

  console.log('🔎 Token:', token ? 'Exists' : 'None');
  console.log('🔎 User Role:', userRole || 'None');

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  if (!token) {
    if (!isAuthPage) {
      console.log('🚫 No token found. Redirecting to /login.');
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  if (isAuthPage) {
    if (userRole === 'CASHIER') {
      console.log('🔄 Redirecting CASHIER to /cashier.');
      return NextResponse.redirect(new URL('/cashier', req.url));
    }
    if (userRole === 'ADMIN') {
      console.log('🔄 Redirecting ADMIN to /sales-admin.');
      return NextResponse.redirect(new URL('/sales-admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  const restrictedForCashier = [
    '/sales-admin',
    '/account-management',
    '/product-management',
  ];
  const restrictedForAdmin = ['/cashier', '/sales-cashier'];

  if (
    userRole === 'CASHIER' &&
    restrictedForCashier.some((path) => pathname.startsWith(path))
  ) {
    console.log(
      '🚫 CASHIER attempted to access a restricted page. Redirecting to /cashier.',
    );
    return NextResponse.redirect(new URL('/cashier', req.url));
  }

  if (
    userRole === 'ADMIN' &&
    restrictedForAdmin.some((path) => pathname.startsWith(path))
  ) {
    console.log(
      '🚫 ADMIN attempted to access a restricted page. Redirecting to /sales-admin.',
    );
    return NextResponse.redirect(new URL('/sales-admin', req.url));
  }

  console.log(
    '✅ Middleware execution complete. Proceeding to the requested page.',
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cashier/:path*',
    '/sales-admin/:path*',
    '/sales-cashier/:path*',
    '/login',
    '/account-management/:path*',
    '/product-management/:path*',
  ],
};
