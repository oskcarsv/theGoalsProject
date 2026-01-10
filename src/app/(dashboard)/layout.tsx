import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/layout/Sidebar';
import type { Profile } from '@/types/database';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;

  const guestProfile: Profile = {
    id: 'guest',
    email: 'guest@example.com',
    full_name: 'Invitado',
    bio: 'Explorando la plataforma',
    role: 'user',
    onboarding_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    interests: [],
    focus_areas: ['professional', 'personal'],
    what_makes_you_different: '',
    avatar_url: null,
    instagram: null,
    linkedin: null
  } as Profile;

  if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      profile = profileData as Profile | null;

      if (!profile) {
        // Fallback to guest if profile is missing (prevents redirect loop for broken users)
        profile = guestProfile;
      } else if (!profile.onboarding_completed) {
        redirect('/onboarding');
      }
  } else {
      // Mock Profile for Guest
      profile = guestProfile;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar profile={profile} />
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-y-auto">{children}</main>
    </div>
  );
}

