'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { UpdateTables, MicroGoal } from '@/types/database';

interface GoalToggleProps {
  goal: MicroGoal;
  readOnly?: boolean;
}

export default function GoalToggle({ goal, readOnly = false }: GoalToggleProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(goal.completed);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (readOnly) return;

    setLoading(true);
    const newStatus = !isCompleted;
    setIsCompleted(newStatus); 

    const supabase = createClient();
    const updateData: UpdateTables<'micro_goals'> = { completed: newStatus };

    const { error } = await supabase
      .from('micro_goals')
      .update(updateData)
      .eq('id', goal.id);

    if (error) {
      console.error('Error updating goal:', error);
      setIsCompleted(!newStatus); 
    } else {
      router.refresh(); 
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || readOnly}
      className={`flex-shrink-0 focus:outline-none ${
        readOnly ? 'cursor-default opacity-80' : 'hover:scale-110 active:scale-95 transition-transform'
      }`}
      aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
    >
      {isCompleted ? (
        <CheckCircle className="h-6 w-6 text-primary" />
      ) : (
        <Circle className="h-6 w-6 text-muted-foreground" />
      )}
    </button>
  );
}
