'use client';

import Link from 'next/link';
import { Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyGoalsButton() {
  return (
    <Button 
      asChild
      size="sm"
      className="gap-2"
    >
      <Link href="/dashboard/goals/weekly/new">
        <Target className="h-4 w-4" />
        Crear metas para esta semana
      </Link>
    </Button>
  );
}

export function PlanNextWeekButton() {
  return (
    <Button 
      asChild
      className="w-full gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg"
    >
      <Link href="/dashboard/goals/weekly/new">
        <Sparkles className="h-4 w-4" />
        Planificar metas para la siguiente semana
      </Link>
    </Button>
  );
}
