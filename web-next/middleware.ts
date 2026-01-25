import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Let Next.js handle static files and rewrites
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only intercept specific paths if needed
    '/((?!api|_next/static|_next/image|favicon.ico|flutter-assets).*)',
  ],
}