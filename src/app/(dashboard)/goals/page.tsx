import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Calendar, Target } from 'lucide-react';
import type { MacroGoal, MicroGoal } from '@/types/database';
import { getCurrentWeekInfo, formatDateRange } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MacroGoalsList } from '@/components/goals/MacroGoalsList';
import { WeeklyGoalsList } from '@/components/goals/WeeklyGoalsList';

interface MicroGoalWithMacro extends MicroGoal {
  macro_goals?: { title: string } | null;
}

export default async function GoalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentYear = new Date().getFullYear();
  const weekInfo = getCurrentWeekInfo();
  
  let macroGoals: MacroGoal[] = [];
  let weeklyGoals: MicroGoalWithMacro[] = [];

  if (user) {
      const { data: macroGoalsData } = await supabase
        .from('macro_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .order('created_at', { ascending: false });
      macroGoals = (macroGoalsData || []) as MacroGoal[];

      const { data: weeklyGoalsData } = await supabase
        .from('micro_goals')
        .select('*, macro_goals(title)')
        .eq('user_id', user.id)
        .eq('week_start', weekInfo.weekStart.toISOString().split('T')[0])
        .order('created_at', { ascending: false });
      weeklyGoals = (weeklyGoalsData || []) as MicroGoalWithMacro[];
  } else {
     // Mock Data for Guest
     macroGoals = [
         { id: '1', title: 'Correr un Maratón', status: 'active', area: 'physical_health', user_id: 'guest', year: currentYear, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description: 'Entrenar para correr 42km a fin de año' },
         { id: '2', title: 'Leer 12 libros', status: 'active', area: 'professional', user_id: 'guest', year: currentYear, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description: 'Un libro por mes sobre desarrollo personal y finanzas' },
     ] as unknown as MacroGoal[];

     weeklyGoals = [
         { id: '1', title: 'Correr 5km tres veces', completed: false, week_start: weekInfo.weekStart.toISOString(), week_end: weekInfo.weekEnd.toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user_id: 'guest', description: '', macro_goal_id: '1', macro_goals: { title: 'Correr un Maratón' } },
         { id: '2', title: 'Leer capitulo 1 de Atomic Habits', completed: true, week_start: weekInfo.weekStart.toISOString(), week_end: weekInfo.weekEnd.toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user_id: 'guest', description: '', macro_goal_id: '2', macro_goals: { title: 'Leer 12 libros' } },
     ] as unknown as MicroGoalWithMacro[];
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Metas</h1>
          <p className="text-muted-foreground">
            Gestiona tus metas anuales y semanales para el {currentYear}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Link href="/dashboard/goals/weekly/new">
                <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Meta Semanal
                </Button>
            </Link>
          <Link href="/dashboard/goals/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Meta Anual
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="annual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="annual">Anuales ({currentYear})</TabsTrigger>
          <TabsTrigger value="weekly">Esta Semana</TabsTrigger>
        </TabsList>
        
        <TabsContent value="annual" className="pt-6 space-y-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold tracking-tight">
              Metas Anuales
            </h2>
          </div>
          <MacroGoalsList macroGoals={macroGoals} />
        </TabsContent>

        <TabsContent value="weekly" className="pt-6 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold tracking-tight">
                    Semana {weekInfo.weekNumber}: {formatDateRange(weekInfo.weekStart, weekInfo.weekEnd)}
                    </h2>
                </div>
            </div>
            <WeeklyGoalsList weeklyGoals={weeklyGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
