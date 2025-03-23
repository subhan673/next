import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define public and private paths
const PUBLIC_PATHS = ['/login', '/register'];
const PRIVATE_PATHS = ['/', '/user' ]; // Add more private paths as needed

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token
  const token = await getToken({ req: request });
    console.log(token); 
    
  // Check if the current path is public
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Check if the current path is private
  const isPrivatePath = PRIVATE_PATHS.includes(pathname);

  // If the user is logged in and tries to access a public path, redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is not logged in and tries to access a private path, redirect to login
  if (!token && isPrivatePath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to continue if no conditions are met
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: ['/',  '/login', '/register', '/user',],
};