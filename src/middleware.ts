import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/session';

/**
 * @next/auth middleware for updating Supabase session
 * This runs on every request to ensure the user session is up to date
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
