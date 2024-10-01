// middleware.js
import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const sessionToken = req.cookies.get('session_token');
  const uid = req.cookies.get('uid'); 

  // Check if the user is authenticated based on the presence of 'uid' cookie
  const isAuthenticated = !!uid;

  // Check if the user is trying to access login/signup pages
  const isLoginOrSignupPage = pathname.startsWith('/account/login');
  const isSignup = searchParams.get('signup') === 'true';

  // Prevent authenticated users from accessing login or signup pages
  if (isAuthenticated && isLoginOrSignupPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Handle session expiration by using the sessionExpiry cookie or context
  if (isAuthenticated) {
    const sessionExpiry = Cookies.get('sessionExpiry') || req.cookies.get('sessionExpiry');

    // If session has expired, remove the authentication cookies and redirect to login
    if (sessionExpiry && Date.now() > Number(sessionExpiry)) {
      req.cookies.delete('session_token');
      req.cookies.delete('uid');
      req.cookies.delete('sessionExpiry');
      return NextResponse.redirect(new URL('/account/login', req.url));
    }
  }
  return NextResponse.next();
}

// Configure the middleware to apply to login and signup routes
export const config = {
  matcher: ['/account/login'],
};
