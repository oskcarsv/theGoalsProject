import Link from 'next/link';
import { MicroGoal } from '@/types/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, CheckCircle2, Circle, Sparkles, TrendingUp } from 'lucide-react';

interface RecentActivityProps {
  weeklyGoals: MicroGoal[];
  completedGoals: number;
  totalGoals: number;
}

export function RecentActivity({ weeklyGoals, completedGoals, totalGoals }: RecentActivityProps) {
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  
  return (
    <Card className="md:col-span-1 border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-bold">Tu Enfoque</CardTitle>
              <CardDescription className="text-xs">
                {completedGoals === totalGoals && totalGoals > 0 
                  ? "¡Semana completa! 🎉" 
                  : totalGoals === 0
                  ? "Planifica tu semana"
                  : `${completedGoals} de ${totalGoals} completadas`}
              </CardDescription>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge 
              className={`font-bold ${
                progress >= 80 ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' :
                progress >= 50 ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30' :
                'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30'
              }`}
              variant="outline"
            >
              {Math.round(progress)}%
            </Badge>
          </div>
        </div>
        
        {/* Progress bar - Improved */}
        <div className="mt-3 space-y-1">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden border border-border/50">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full shadow-lg shadow-primary/20"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">{totalGoals} metas</p>
        </div>
      </CardHeader>

      <Separator className="opacity-40" />

      <CardContent className="pt-4">
        {weeklyGoals.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
              <Sparkles className="h-7 w-7 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground mb-4 text-sm font-medium">
              No hay metas activas esta semana.
            </p>
            <Button asChild variant="outline" size="sm" className="gap-2 border-border hover:border-primary/50">
              <Link href="/goals/weekly/new">
                <Target className="h-4 w-4" />
                Planificar semana
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {weeklyGoals.slice(0, 5).map((goal) => (
              <Link key={goal.id} href={`/goals/weekly/${goal.id}`}>
                <div 
                  className="group flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <div className="flex-shrink-0 transition-transform group-hover:scale-110">
                    {goal.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    )}
                  </div>
                  
                  <span className={`flex-1 text-sm font-medium leading-snug ${
                    goal.completed 
                      ? 'line-through text-muted-foreground/60' 
                      : 'text-foreground group-hover:text-primary'
                  }`}>
                    {goal.title}
                  </span>
                  
                  {goal.completed && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 opacity-50" />
                  )}
                </div>
              </Link>
            ))}
            
            {weeklyGoals.length > 5 && (
              <Button variant="ghost" className="w-full text-xs mt-3 text-muted-foreground hover:text-primary" asChild>
                <Link href="/goals">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Ver todas las {weeklyGoals.length} metas →
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
