import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Ensure 'next' path handles the basePath logic correctly if needed,
  // but generally relying on absolute URL construction relative to origin is safer.
  // Since we have a basePath of '/goals', we want to make sure we redirect there.
  let next = requestUrl.searchParams.get('next') ?? '/dashboard';
  
  // If next doesn't start with /goals and we are in the context where /goals is required (which is always now due to basePath),
  // we might need to prepend it IF origin is the raw domain without basePath handled.
  // However, with next.config basePath, accessing /auth/callback implies /goals/auth/callback.
  
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Clean up 'next' param to avoid duplication if it already has the base path
      const forwardedUrl = new URL(next, origin);
      
      // If we are using basePath: '/goals' in next.config, 
      // Next.js middleware/router expects URLs to include it when external, 
      // but internal routing often hides it. 
      // Let's construct the absolute URL.
      
      // FIX: Manually ensure /goals prefix if it's missing and we are not using internal next routing behavior
      // Because we are doing a raw NextResponse.redirect using string or URL.
      
      // Check if next path already includes /goals to avoid /goals/goals/dashboard
      if (!next.startsWith('/goals')) {
         // Construct the final URL. If basePath is set, we usually want redirects to go to origin + basePath + path
         // We can hardcode /goals here to be safe given the architectural change.
         return NextResponse.redirect(`${origin}/goals${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/goals/auth/auth-code-error`);
}
