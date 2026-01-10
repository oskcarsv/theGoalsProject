'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FOCUS_AREAS } from '@/types';
import type { InsertTables } from '@/types/database';
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
  CardTitle,
  CardFooter
} from '@/components/ui/card';

export default function NewGoalPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!area) {
      setError('Por favor selecciona un área de enfoque');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const newGoal: InsertTables<'macro_goals'> = {
      user_id: user.id,
      title,
      description: description || null,
      area: area,
      year: new Date().getFullYear(),
    };

    const { error: insertError } = await supabase
      .from('macro_goals')
      .insert(newGoal as any);

    if (insertError) {
      setError('Error al crear la meta. Por favor intenta de nuevo.');
      setLoading(false);
      return;
    }

    router.push('/dashboard/goals');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/goals"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Metas
      </Link>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Nueva Meta Anual</CardTitle>
                <CardDescription>
                   Define un objetivo principal para {new Date().getFullYear()}
                </CardDescription>
              </div>
            </div>
        </CardHeader>
        <CardContent>
             <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título de la meta <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Leer 12 libros"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre por qué quieres lograr esto..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Área de enfoque <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOCUS_AREAS.map((focusArea) => {
                    const Icon = focusArea.icon;
                    return (
                      <div
                        key={focusArea.id}
                        onClick={() => setArea(focusArea.id)}
                        className={cn(
                          'cursor-pointer rounded-xl border p-4 transition-all hover:bg-accent hover:border-primary/50 flex items-start gap-4',
                          area === focusArea.id
                            ? 'border-primary ring-1 ring-primary bg-primary/5 shadow-lg shadow-primary/10'
                            : 'bg-card border-border'
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          area === focusArea.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{focusArea.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                            {focusArea.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full font-bold shadow-lg shadow-primary/20">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando meta...
                  </>
                ) : (
                  'Crear Meta'
                )}
              </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
