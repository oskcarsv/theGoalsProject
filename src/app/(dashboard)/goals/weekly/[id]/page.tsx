import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Target,
  CheckCircle2,
  Edit,
  Upload,
  Trash2,
} from 'lucide-react';
import { FOCUS_AREAS, NORMALIZED_CATEGORIES } from '@/types';
import type { MicroGoal, MacroGoal } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import EvidenceUpload from '@/app/(dashboard)/review/EvidenceUpload';

interface WeeklyGoalPageProps {
  params: Promise<{ id: string }>;
}

export default async function WeeklyGoalPage({ params }: WeeklyGoalPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the weekly goal
  const { data: goal, error } = await supabase
    .from('micro_goals')
    .select('*')
    .eq('id', id)
    .single();

  // Create demo goal if not found
  let goalData: MicroGoal;
  if (error || !goal) {
    // Calculate week dates for demo
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const now = new Date().toISOString();
    
    // Demo goal for demonstration purposes
    goalData = {
      id,
      user_id: user.id,
      macro_goal_id: null,
      title: 'Hacer 3 sesiones de ejercicio',
      description: 'Este es un objetivo semanal de demostración. Crea tus propios objetivos desde la página de Mis Objetivos.',
      week_start: weekStart.toISOString().split('T')[0],
      week_end: weekEnd.toISOString().split('T')[0],
      completed: false,
      normalized_category: 'gym',
      created_at: now,
      updated_at: now,
    } as MicroGoal;
  } else {
    goalData = goal as MicroGoal;
  }

  // Fetch associated macro goal if exists
  let macroGoal: MacroGoal | null = null;
  if (goalData.macro_goal_id) {
    const { data: macroData } = await supabase
      .from('macro_goals')
      .select('*')
      .eq('id', goalData.macro_goal_id)
      .single();
    macroGoal = macroData as MacroGoal | null;
  }

  // Get area info
  const areaInfo = goalData.normalized_category ? FOCUS_AREAS.find((a) => a.id === goalData.normalized_category) : undefined;
  const AreaIcon = areaInfo?.icon;

  // Get category info from normalized categories
  const categoryInfo = goalData.normalized_category ? NORMALIZED_CATEGORIES.find(
    (cat) => cat.id === goalData.normalized_category
  ) : undefined;

  // Calculate week number and year from week_start
  const weekStart = new Date(goalData.week_start);
  const weekNumber = Math.ceil((weekStart.getDate() - weekStart.getDay() + 1) / 7);
  const year = weekStart.getFullYear();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>

        {/* Gradient Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-8 shadow-xl">
          {/* SVG Pattern Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {AreaIcon && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                    <AreaIcon className="h-7 w-7 text-white" />
                  </div>
                )}
                <div>
                  <Badge
                    variant="secondary"
                    className="mb-2 bg-primary/20 backdrop-blur-sm text-primary border-primary/30"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Semana {weekNumber}, {year}
                  </Badge>
                  <h1 className="text-3xl font-bold text-foreground">
                    {goalData.title}
                  </h1>
                </div>
              </div>

              {goalData.description && (
                <p className="text-white/90 text-lg max-w-2xl">
                  {goalData.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-4">
                <Badge
                  variant={goalData.completed ? 'default' : 'secondary'}
                  className={
                    goalData.completed
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-white/20 backdrop-blur-sm text-white border-white/30'
                  }
                >
                  {goalData.completed ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completado
                    </>
                  ) : (
                    <>
                      <Target className="h-3 w-3 mr-1" />
                      En progreso
                    </>
                  )}
                </Badge>

                {areaInfo && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 backdrop-blur-sm text-primary border-primary/30"
                  >
                    {areaInfo.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Goal Link */}
      {macroGoal && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Meta Anual Relacionada</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Link
              href={`/goals/${macroGoal.id}`}
              className="group flex items-center justify-between p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-all border-2 border-border hover:border-primary"
            >
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {macroGoal.title}
                </h3>
                {macroGoal.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {macroGoal.description}
                  </p>
                )}
              </div>
              <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary rotate-180 transition-colors" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Edit Goal */}
        <Card className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
          <Link href={`/dashboard/goals/weekly/${id}/edit`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/80 group-hover:scale-110 transition-transform">
                    <Edit className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Editar Objetivo</CardTitle>
                    <CardDescription>
                      Modificar título, descripción o estado
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        {/* Upload Evidence */}
        {!goalData.completed && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                  <Upload className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Subir Evidencia</CardTitle>
                  <CardDescription>
                    Comparte tu progreso con una foto
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EvidenceUpload goalId={id} userId={user.id} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Objetivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Fecha de creación
              </p>
              <p className="font-medium">
                {new Date(goalData.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Estado</p>
              <p className="font-medium">
                {goalData.completed ? 'Completado' : 'En progreso'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Categoría</p>
              <p className="font-medium">{areaInfo?.label || 'Sin categoría'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Semana</p>
              <p className="font-medium">
                Semana {weekNumber} de {year}
              </p>
            </div>
          </div>

          {goalData.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Descripción</p>
              <p className="text-foreground leading-relaxed">
                {goalData.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
