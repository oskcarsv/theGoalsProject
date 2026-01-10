import Link from 'next/link';
import { CheckCircle2, Circle, ArrowRight, Target } from 'lucide-react';
import type { MicroGoal } from '@/types/database';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MicroGoalWithMacro extends MicroGoal {
  macro_goals?: { title: string } | null;
}

interface WeeklyGoalsListProps {
  weeklyGoals: MicroGoalWithMacro[];
}

export function WeeklyGoalsList({ weeklyGoals }: WeeklyGoalsListProps) {
  if (weeklyGoals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
        <Circle className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No hay objetivos semanales</h3>
        <p className="text-muted-foreground max-w-sm mt-2 mb-6">
          Divide tus metas anuales en tareas más pequeñas y manejables para esta semana.
        </p>
        <Link href="/dashboard/goals/weekly/new">
           <Button variant="outline">Planificar semana</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {weeklyGoals.map((goal) => (
        <Card key={goal.id} className="group transition-all hover:border-primary/50">
          <CardHeader className="pb-2 space-y-0">
            <div className="flex justify-between items-start mb-2">
               <Badge variant="secondary" className="font-normal text-xs">
                 Semana Actual
               </Badge>
               {goal.completed ? (
                   <CheckCircle2 className="h-5 w-5 text-primary" />
               ) : (
                   <Circle className="h-5 w-5 text-muted-foreground" />
               )}
            </div>
            <CardTitle className={`text-base font-medium leading-tight ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
              {goal.title}
            </CardTitle>
            {goal.macro_goals && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span className="truncate max-w-[200px]">{goal.macro_goals.title}</span>
                </div>
            )}
          </CardHeader>
          <CardContent className="pb-4">
             <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Estado</span>
                    <span>{goal.completed ? 'Completado' : 'Pendiente'}</span>
                </div>
                <Progress value={goal.completed ? 100 : 0} className="h-1.5" />
             </div>
          </CardContent>
           <CardFooter className="pt-0">
             <Link href={`/dashboard/goals/weekly/${goal.id}`} className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-transparent px-0 text-muted-foreground group-hover:text-primary">
                    <span className="text-xs">Ver detalles</span>
                    <ArrowRight className="h-4 w-4" />
                </Button>
             </Link>
           </CardFooter>
        </Card>
      ))}
    </div>
  );
}
