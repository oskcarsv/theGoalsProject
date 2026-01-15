import Link from 'next/link';
import { Target, ArrowUpRight, Activity, Heart, Briefcase, User } from 'lucide-react';
import type { MacroGoal } from '@/types/database';
import { FOCUS_AREAS } from '@/types';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MacroGoalsListProps {
  macroGoals: MacroGoal[];
}

const AREA_ICONS: Record<string, React.ElementType> = {
  physical_health: Activity,
  emotional_health: Heart,
  professional: Briefcase,
  personal: User,
};

export function MacroGoalsList({ macroGoals }: MacroGoalsListProps) {
  const getAreaInfo = (areaId: string) => {
    return FOCUS_AREAS.find((a) => a.id === areaId);
  };

  if (macroGoals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
        <Target className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No hay metas anuales aún</h3>
        <p className="text-muted-foreground max-w-sm mt-2 mb-6">
          Define tus objetivos principales para este año y comienza a trabajar en ellos.
        </p>
        <Link href="/goals/new">
          <Button>Crear mi primera meta</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {macroGoals.map((goal) => {
        const area = getAreaInfo(goal.area);
        const IconComponent = AREA_ICONS[goal.area] || Target;
        
        return (
          <Link key={goal.id} href={`/goals/${goal.id}`} className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:scale-[1.02] bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                       <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-medium">
                     {area?.label}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors">
                    {goal.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                 {goal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {goal.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                 <div className="w-full flex items-center justify-between text-xs mt-auto">
                    <span className={cn(
                      "px-2 py-1 rounded-full font-medium",
                      goal.status === 'completed' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                        {goal.status === 'completed' ? '✅ Completada' : '⏳ En progreso'}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </div>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
