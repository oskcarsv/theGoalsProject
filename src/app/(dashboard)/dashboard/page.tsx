import { createClient } from '@/lib/supabase/server';
import { getCurrentWeekInfo, formatDateRange } from '@/lib/utils';
import type { Profile, MicroGoal } from '@/types/database';
import { GreetingHeader } from '@/components/dashboard/GreetingHeader';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const weekInfo = getCurrentWeekInfo();
  
  let profile: Profile | null = null;
  let macroGoalsCount = 0;
  let weeklyGoals: MicroGoal[] = [];

  if (user) {
    // 1. Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    profile = profileData as Profile | null;

    // 2. Get macro goals count
    const { count } = await supabase
      .from('macro_goals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active');
    
    macroGoalsCount = count || 0;

    // 3. Get this week's micro goals
    const { data: weeklyGoalsData } = await supabase
      .from('micro_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekInfo.weekStart.toISOString().split('T')[0]);

    weeklyGoals = (weeklyGoalsData || []) as MicroGoal[];
  } else {
    // MOCK DATA for Guest/Demo Mode
    profile = {
      full_name: 'Invitado',
      email: 'guest@demo.com',
      avatar_url: null,
      role: 'user',
      created_at: new Date().toISOString(),
      id: 'guest',
      updated_at: new Date().toISOString()
    } as Profile; 

    macroGoalsCount = 0;
    weeklyGoals = []; 
  }

  const completedGoals = weeklyGoals.filter((g) => g.completed).length;
  const totalGoals = weeklyGoals.length;
  const completionRate =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <GreetingHeader 
        profile={profile} 
        weekInfo={weekInfo} 
        formatDateRange={formatDateRange} 
        fallbackName={userName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity 
          weeklyGoals={weeklyGoals}
          completedGoals={completedGoals}
          totalGoals={totalGoals}
        />
      </div>
    </div>
  );
}
