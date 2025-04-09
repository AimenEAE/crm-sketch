// import { createServerClient } from '@/lib/supabase/middleware' // No longer needed for redirects
import { updateSession } from '@/lib/supabase/middleware' // Handles response cookies
import { type NextRequest } from 'next/server'
// import { NextResponse } from 'next/server' // No longer needed

export async function middleware(request: NextRequest) {
  // The simplest middleware: just refresh the session cookie and allow the request.
  // No auth checks or redirects are performed here.
  return await updateSession(request);
}

// Matcher: Run middleware on all paths except static assets, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 