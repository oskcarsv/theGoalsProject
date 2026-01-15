'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NORMALIZED_CATEGORIES } from '@/types';
import type { MacroGoal, InsertTables } from '@/types/database';
import { getCurrentWeekInfo, formatDateRange, cn } from '@/lib/utils';
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
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

export default function NewWeeklyGoalPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [macroGoalId, setMacroGoalId] = useState<string>('none');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [macroGoals, setMacroGoals] = useState<MacroGoal[]>([]);

  const weekInfo = getCurrentWeekInfo();

  useEffect(() => {
    const fetchMacroGoals = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('macro_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .eq('year', new Date().getFullYear());

        if (data) {
          setMacroGoals(data as MacroGoal[]);
        }
      }
    };

    fetchMacroGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const newGoal: InsertTables<'micro_goals'> = {
      user_id: user.id,
      title,
      description: description || null,
      macro_goal_id: macroGoalId === 'none' ? null : macroGoalId,
      normalized_category: category || null,
      week_start: weekInfo.weekStart.toISOString().split('T')[0],
      week_end: weekInfo.weekEnd.toISOString().split('T')[0],
    };

    const { error: insertError } = await supabase
      .from('micro_goals')
      .insert(newGoal as any);

    if (insertError) {
      setError('Error al crear la meta. Por favor intenta de nuevo.');
      setLoading(false);
      return;
    }

    router.push('/goals');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/goals"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Metas
      </Link>

      <Card>
        <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Nueva Meta Semanal</CardTitle>
                <CardDescription>
                  Semana {weekInfo.weekNumber}: {formatDateRange(weekInfo.weekStart, weekInfo.weekEnd)}
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
                  placeholder="Ej: Leer 50 páginas"
                  required
                />
              </div>

               <div className="space-y-2">
                <Label htmlFor="macroGoal">Vincular a meta anual (opcional)</Label>
                <Select value={macroGoalId} onValueChange={setMacroGoalId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una meta anual..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin vincular (Meta aislada)</SelectItem>
                         {macroGoals.map((goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                                {goal.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">
                  Si esta tarea ayuda a cumplir un objetivo mayor, selecciónalo aquí.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Categoría (opcional)</Label>
                <div className="flex flex-wrap gap-2">
                  {NORMALIZED_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(category === cat.id ? '' : cat.id)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                            category === cat.id 
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105" 
                                : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles adicionales..."
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all text-primary-foreground">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando meta...
                  </>
                ) : (
                  'Crear Meta Semanal'
                )}
              </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
