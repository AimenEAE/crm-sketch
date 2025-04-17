// import { createServerClient } from '@/lib/supabase/middleware' // No longer needed for redirects
// import { updateSession } from '@/lib/supabase/middleware' // Handles response cookies - REMOVED
import { type NextRequest, NextResponse } from 'next/server'
// import { NextResponse } from 'next/server' // No longer needed

export async function middleware(request: NextRequest) {
  // The simplest middleware: just refresh the session cookie and allow the request. - REMOVED
  // No auth checks or redirects are performed here.
  // return await updateSession(request); - REMOVED

  // Since Supabase is removed, just pass the request through.
  // You might want to add different logic here later.
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
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