'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FOCUS_AREAS } from '@/types';
import type { MacroGoal } from '@/types/database';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditGoalPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      await loadGoal(resolvedParams.id);
    };
    init();
  }, [params]);

  const loadGoal = async (goalId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { data: goal, error: fetchError } = await supabase
      .from('macro_goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !goal) {
      router.push('/goals');
      return;
    }

    const macroGoal = goal as MacroGoal;
    setTitle(macroGoal.title);
    setDescription(macroGoal.description || '');
    setArea(macroGoal.area);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!area) {
      setError('Por favor selecciona un área de enfoque');
      setSaving(false);
      return;
    }

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from('macro_goals')
      .update({
        title,
        description: description || null,
        area,
      })
      .eq('id', id);

    if (updateError) {
      setError('Error al actualizar la meta. Por favor intenta de nuevo.');
      setSaving(false);
      return;
    }

    router.push(`/goals/${id}`);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
      return;
    }

    setDeleting(true);
    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from('macro_goals')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('Error al eliminar la meta.');
      setDeleting(false);
      return;
    }

    router.push('/goals');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href={`/goals/${id}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Volver a Meta
      </Link>

      <Card className="border-0 shadow-2xl">
        <CardHeader className="space-y-1 bg-gradient-to-br from-primary/10 to-secondary/5 pb-8">
          <CardTitle className="text-2xl font-bold">Editar Meta Anual</CardTitle>
          <CardDescription>
            Actualiza tu objetivo a largo plazo
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Título de la meta *
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 text-base border-2"
                placeholder="Ej: Correr un maratón completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Descripción (opcional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] border-2"
                placeholder="¿Por qué esta meta es importante para ti? ¿Qué lograrás al completarla?"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Área de enfoque *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FOCUS_AREAS.map((focusArea) => (
                  <button
                    key={focusArea.id}
                    type="button"
                    onClick={() => setArea(focusArea.id)}
                    className={cn(
                      'group relative h-20 rounded-2xl border-2 transition-all duration-300 text-left p-4',
                      'hover:scale-105 hover:shadow-lg',
                      area === focusArea.id
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/50 bg-card'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl transition-all flex-shrink-0',
                        area === focusArea.id
                          ? 'bg-primary/10'
                          : 'bg-muted group-hover:bg-muted/80'
                      )}>
                        <focusArea.icon className={cn('h-5 w-5', area === focusArea.id ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                      <span className={cn(
                        'font-medium text-sm',
                        area === focusArea.id ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {focusArea.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all text-primary-foreground"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar Cambios
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                className="h-12 px-6 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                {deleting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
