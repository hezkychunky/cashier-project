import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('✅ Middleware executed for:', req.nextUrl.pathname);

  // Read authentication cookies
  const token = req.cookies.get('token')?.value || null;
  const userRole = req.cookies.get('userRole')?.value || null;

  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === '/login';

  console.log('🔎 Token:', token ? 'Exists' : 'None');
  console.log('🔎 User Role:', userRole || 'None');

  // 🛑 Prevent Middleware from Affecting API or Static Files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // 🔐 Redirect Unauthorized Users to Login
  if (!token) {
    if (!isAuthPage) {
      console.log('🚫 No token found. Redirecting to /login.');
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // 🔄 Redirect Authenticated Users from /login to Their Dashboard
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

  // 🛑 Role-Based Page Restrictions
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

// 🏗 Apply Middleware Only to Relevant Pages
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
