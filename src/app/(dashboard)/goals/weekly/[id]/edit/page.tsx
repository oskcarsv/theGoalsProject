'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FOCUS_AREAS } from '@/types';
import type { MicroGoal, MacroGoal } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditWeeklyGoalPageProps {
  params: Promise<{ id: string }>;
}

export default function EditWeeklyGoalPage({ params }: EditWeeklyGoalPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      await fetchGoal(resolvedParams.id);
    };
    init();
  }, [params]);

  const fetchGoal = async (goalId: string) => {
    const supabase = createClient();

    const { data: goal, error } = await supabase
      .from('micro_goals')
      .select('*')
      .eq('id', goalId)
      .single();

    if (error || !goal) {
      router.push('/dashboard');
      return;
    }

    setTitle(goal.title);
    setDescription(goal.description || '');
    setCategory(goal.normalized_category || '');
    setCompleted(goal.completed);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    const { error } = await supabase
      .from('micro_goals')
      .update({
        title,
        description: description || null,
        normalized_category: category || null,
        completed,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating goal:', error);
      setSaving(false);
      return;
    }

    router.push(`/goals/weekly/${id}`);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este objetivo? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setDeleting(true);

    const supabase = createClient();

    const { error } = await supabase
      .from('micro_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal:', error);
      setDeleting(false);
      return;
    }

    router.push('/dashboard');
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
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/goals/weekly/${id}`} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-foreground">
          Editar Objetivo Semanal
        </h1>
        <p className="text-muted-foreground mt-2">
          Modifica los detalles de tu objetivo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Objetivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Hacer ejercicio 3 veces esta semana"
                required
                className="h-12 text-base border-2 focus:border-primary"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles adicionales sobre tu objetivo..."
                rows={4}
                className="resize-none border-2 focus:border-primary"
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Categoría</Label>
              <div className="grid grid-cols-2 gap-3">
                {FOCUS_AREAS.map((area) => {
                  const Icon = area.icon;
                  const isSelected = category === area.id;

                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setCategory(area.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50 bg-card hover:bg-muted/50'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isSelected
                            ? 'bg-gradient-to-br from-primary to-secondary'
                            : 'bg-muted'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isSelected ? 'text-white' : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {area.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completed Toggle */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <button
                type="button"
                onClick={() => setCompleted(!completed)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  completed
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium">
                    {completed ? 'Completado ✓' : 'En progreso'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {completed
                      ? 'Haz clic para marcar como pendiente'
                      : 'Haz clic para marcar como completado'}
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    completed ? 'bg-green-500' : 'bg-muted'
                  } relative`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                      completed ? 'left-6' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
              className="border-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || !title.trim()}
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all px-8 text-primary-foreground"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
