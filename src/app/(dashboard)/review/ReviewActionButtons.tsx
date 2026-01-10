'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CopyReportButton from './CopyReportButton';

interface ReviewActionButtonsProps {
  completedGoals: number;
  totalGoals: number;
  completionRate: number;
  goals: { title: string; completed: boolean }[];
  weekNumber: number;
}

export function ReviewActionButtons({
  completedGoals,
  totalGoals,
  completionRate,
  goals,
  weekNumber,
}: ReviewActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <CopyReportButton 
        completedGoals={completedGoals}
        totalGoals={totalGoals}
        completionRate={completionRate}
        goals={goals}
        weekNumber={weekNumber}
      />
      <Button 
        variant="outline"
        className="flex-1 gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
      >
        <MessageCircle className="h-4 w-4" />
        Ver retroalimentación del grupo
      </Button>
    </div>
  );
}
