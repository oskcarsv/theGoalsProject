import { createClient } from '@/lib/supabase/server';
import {
  CalendarCheck,
  CheckCircle,
  ImageIcon,
  Sparkles,
  ClipboardCheck,
  Share2,
  TrendingUp,
  Zap,
  MessageCircle,
  Target,
} from 'lucide-react';
import { getCurrentWeekInfo, formatDateRange } from '@/lib/utils';
import { NORMALIZED_CATEGORIES } from '@/types';
import type { MicroGoal, Evidence } from '@/types/database';
import EvidenceUpload from './EvidenceUpload';
import GoalToggle from './GoalToggle';
import { ReviewActionButtons } from './ReviewActionButtons';
import { EmptyGoalsButton, PlanNextWeekButton } from './ReviewButtons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface MicroGoalWithEvidence extends MicroGoal {
  evidence?: Evidence[];
}

export default async function ReviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const weekInfo = getCurrentWeekInfo();
  let weeklyGoals: MicroGoalWithEvidence[] = [];

  if (user) {
    // Get this week's micro goals with evidence
    const { data: weeklyGoalsData } = await supabase
      .from('micro_goals')
      .select(
        `
        *,
        evidence(*)
      `
      )
      .eq('user_id', user.id)
      .eq('week_start', weekInfo.weekStart.toISOString().split('T')[0])
      .order('created_at', { ascending: false });

    weeklyGoals = (weeklyGoalsData || []) as MicroGoalWithEvidence[];
  } else {
    // Mock Data for Guest
    weeklyGoals = [
       { 
         id: '1', 
         title: 'Correr 5km tres veces', 
         completed: false, 
         week_start: weekInfo.weekStart.toISOString(), 
         week_end: weekInfo.weekEnd.toISOString(), 
         created_at: new Date().toISOString(), 
         updated_at: new Date().toISOString(), 
         user_id: 'guest',
         description: '',
         macro_goal_id: '1',
         normalized_category: 'exercise',
         evidence: []
       },
       {
         id: '2',
         title: 'Leer capitulo 1 de Atomic Habits', 
         completed: true,
         week_start: weekInfo.weekStart.toISOString(),
         week_end: weekInfo.weekEnd.toISOString(), 
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(), 
         user_id: 'guest', 
         description: '',
         macro_goal_id: '2',
         normalized_category: 'reading',
         evidence: [
           { 
             id: 'ev1',
             user_id: 'guest',
             micro_goal_id: '2', 
             image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 
             caption: 'Leído en la mañana', 
             status: 'approved',
             created_at: new Date().toISOString(),
             expires_at: new Date().toISOString()
           }
         ] as unknown as Evidence[]
       },
    ] as unknown as MicroGoalWithEvidence[];
  }

  const completedGoals = weeklyGoals.filter((g) => g.completed).length;
  const totalGoals = weeklyGoals.length;
  const completionRate =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const getCategoryInfo = (categoryId: string) => {
    return NORMALIZED_CATEGORIES.find((c) => c.id === categoryId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CalendarCheck className="h-8 w-8 text-primary" />
          Review Semanal
        </h1>
        <p className="text-muted-foreground">
          Semana {weekInfo.weekNumber} {' '}
          {formatDateRange(weekInfo.weekStart, weekInfo.weekEnd)}
        </p>
      </div>

      {/* Performance Overview Card - Improved */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20 overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                Tu reporte para la reunión
              </CardTitle>
              <CardDescription className="text-base">
                Resumen listo para compartir en tu sesión de rendición de cuentas
              </CardDescription>
            </div>
            {/* Performance Badge */}
            <div className="text-right">
              <div className="inline-block px-4 py-2 rounded-xl bg-background/50 border border-border">
                <p className="text-4xl font-black text-primary">{completionRate}%</p>
                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">
                  {completionRate >= 90 ? '🌟 Excelente' :
                   completionRate >= 70 ? '💪 Muy Bien' :
                   completionRate >= 50 ? '🤔 Regular' :
                   '🔥 Desafiante'}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                ✅ Metas Completadas
              </p>
              <p className="text-3xl font-black text-primary">{completedGoals}</p>
              <p className="text-xs text-muted-foreground mt-2">de {totalGoals} metas</p>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-secondary/50 transition-colors">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                ⏳ Pendientes
              </p>
              <p className="text-3xl font-black text-muted-foreground">{totalGoals - completedGoals}</p>
              <p className="text-xs text-muted-foreground mt-2">metas en progreso</p>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-colors">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                💎 Racha
              </p>
              <p className="text-3xl font-black text-primary">Semana {weekInfo.weekNumber}</p>
              <p className="text-xs text-muted-foreground mt-2">mantén el momentum</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progreso Semanal</span>
              <span className="text-xs text-muted-foreground">{completedGoals}/{totalGoals}</span>
            </div>
            <Progress value={completionRate} className="h-3 rounded-full" />
          </div>

          {/* Action Buttons */}
          <ReviewActionButtons 
            completedGoals={completedGoals}
            totalGoals={totalGoals}
            completionRate={completionRate}
            goals={weeklyGoals.map(g => ({ title: g.title, completed: g.completed }))}
            weekNumber={weekInfo.weekNumber}
          />

          {/* Tips Section */}
          <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
            <div className="flex gap-3 items-start">
              <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">💡 Consejo para la reunión:</p>
                <p className="text-muted-foreground mt-1">
                  {completionRate >= 80 
                    ? 'Excelente trabajo. Considera desafiar con metas más ambiciosas la próxima semana.'
                    : completionRate >= 60
                    ? 'Buen progreso. Identifica qué obstaculizó tus metas pendientes y ajusta la estrategia.'
                    : 'Semana difícil. Sé amable contigo mismo. Analiza si las metas eran realistas o si faltó tiempo.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Metas de esta semana
          </h2>
          <Badge variant="secondary">{weeklyGoals.length} metas</Badge>
        </div>
        
        {weeklyGoals.length > 0 ? (
          <div className="grid gap-6">
            {weeklyGoals.map((goal, index) => {
              const category = goal.normalized_category
                ? getCategoryInfo(goal.normalized_category)
                : null;

              return (
                <Card 
                  key={goal.id}
                  className={`transition-all ${goal.completed ? 'border-border/50 bg-muted/20' : 'border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Check and details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            {category && (
                              <Badge variant="outline" className="mb-2 bg-primary/5 border-primary/30 text-primary">
                                <span className="mr-1">{category.icon}</span>
                                {category.label}
                              </Badge>
                            )}
                            <h3 className={`text-lg font-semibold leading-tight ${goal.completed ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}>
                              {goal.title}
                            </h3>
                            {goal.completed && (
                              <div className="flex items-center gap-2 mt-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs font-medium text-green-600 dark:text-green-400">Completado</span>
                              </div>
                            )}
                          </div>
                          <GoalToggle goal={goal} readOnly={!user} />
                        </div>
                        
                        {goal.description && (
                          <p className="text-sm text-muted-foreground">
                            {goal.description}
                          </p>
                        )}
                      </div>

                      {/* Right: Evidence Upload */}
                      <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
                          <ImageIcon className="h-4 w-4" />
                          Evidencia
                        </h4>
                        
                        {/* Evidence List */}
                        {goal.evidence && goal.evidence.length > 0 ? (
                            <div className="space-y-3 mb-4">
                                {goal.evidence.map((ev) => (
                                    <div key={ev.id} className="relative group rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={ev.image_url}
                                            alt="Evidence"
                                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge 
                                              variant={ev.status === 'approved' ? 'default' : 'secondary'}
                                              className={ev.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500/80'}
                                            >
                                                {ev.status === 'approved' ? '✅ Aprobado' : '⏳ Pendiente'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-muted-foreground mb-4 italic p-3 rounded-lg bg-muted/30 border border-dashed border-border">
                                📸 Sube una foto para validar esta meta
                            </div>
                        )}

                        {user && (
                            <EvidenceUpload
                                goalId={goal.id} 
                                userId={user.id}
                            />
                        )}
                        {!user && (
                            <div className="p-3 bg-muted/50 rounded-lg text-xs text-center text-muted-foreground border border-border">
                                Solo lectura (Modo Invitado)
                            </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No tienes metas configuradas para esta semana.</p>
              <div className="mt-4">
                <EmptyGoalsButton />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Planning for Next Week */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Próxima semana
          </CardTitle>
          <CardDescription>
            Prepara tus metas para seguir avanzando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlanNextWeekButton />
        </CardContent>
      </Card>
    </div>
  );
}
