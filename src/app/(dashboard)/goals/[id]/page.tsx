import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Target, Calendar, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import type { MacroGoal } from '@/types/database';
import { FOCUS_AREAS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GoalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch goal
  const { data: goal, error } = await supabase
    .from('macro_goals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  // Create demo goal if not found
  let macroGoal: MacroGoal;
  if (error || !goal) {
    // Demo goal for demonstration purposes
    const now = new Date().toISOString();
    macroGoal = {
      id,
      user_id: user.id,
      title: 'Mejorar Salud Física',
      description: 'Este es un objetivo de demostración. Crea tus propios objetivos desde la página de Mis Objetivos.',
      area: 'physical_health',
      year: new Date().getFullYear(),
      status: 'active',
      created_at: now,
      updated_at: now,
    } as MacroGoal;
  } else {
    macroGoal = goal as MacroGoal;
  }

  const areaInfo = FOCUS_AREAS.find((a) => a.id === macroGoal.area);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard/goals"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Volver a Metas
      </Link>

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNm0tMTIgMGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZtMCAyNGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZtMTIgMGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30">
                  {areaInfo?.icon && <areaInfo.icon className="h-7 w-7 text-primary" />}
                </div>
                <div>
                  <Badge className="mb-2 bg-primary/20 backdrop-blur-sm text-primary border-primary/30">
                    {areaInfo?.label}
                  </Badge>
                  <h1 className="text-3xl font-bold text-foreground">
                    {macroGoal.title}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge 
                className={
                  macroGoal.status === 'active'
                    ? 'bg-green-500/20 text-green-100 border-green-300/30 backdrop-blur-sm'
                    : 'bg-muted text-foreground border-border backdrop-blur-sm'
                }
              >
                {macroGoal.status === 'active' ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Activa</>
                ) : (
                  <><XCircle className="h-3 w-3 mr-1" /> Completada</>
                )}
              </Badge>
            </div>
          </div>

          {macroGoal.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {macroGoal.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Año {macroGoal.year}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Acciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3 h-14 border-2 hover:border-secondary hover:bg-secondary/5 transition-all group" asChild>
            <Link href={`/dashboard/goals/${id}/edit`} className="block">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <Edit className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Editar Meta</div>
                <div className="text-xs text-muted-foreground">Actualiza título, descripción o área</div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3 h-14 border-2 hover:border-primary hover:bg-primary/5 transition-all group" asChild>
            <Link href="/dashboard/goals/weekly/new" className="block">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Crear Meta Semanal</div>
                <div className="text-xs text-muted-foreground">Divide esta meta en pasos pequeños</div>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-0 shadow-lg bg-card">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Creada:</strong> {new Date(macroGoal.created_at).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Última actualización:</strong> {new Date(macroGoal.updated_at).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
