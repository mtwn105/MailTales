import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('mailtales_user_token');

  // List of paths that should be protected
  const protectedPaths = ['/dashboard', '/api/email'];

  // Check if the requested path is in the protectedPaths
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !token) {
    // Redirect to login page if accessing a protected route without a session
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  // Check if the token is valid
  const decoded = await verifyToken(token?.value!);
  if (!decoded) {
    console.log("Token is invalid");
    // clear the cookie
    const response = NextResponse.redirect(new URL('/sign-up', request.url));
    response.cookies.delete('mailtales_user_token');
    response.cookies.delete('mailtales_user_details');
    response.cookies.delete('mailtales_user_email');
    return response;
  }

  return NextResponse.next();
}

async function verifyToken(token: string) {
  // Verify the token
  // Call API to verify token
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/auth/verify-token`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    return res.json();
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/email/:path*', '/email/:path*'],
};
