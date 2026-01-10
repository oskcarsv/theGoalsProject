import {
  Target,
  TrendingUp,
  CheckCircle2,
  Zap,
  Flame,
  Trophy,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
  macroGoalsCount: number;
  totalGoals: number;
  completedGoals: number;
  completionRate: number;
}

export function StatsOverview({ 
  macroGoalsCount, 
  totalGoals, 
  completedGoals, 
  completionRate 
}: StatsOverviewProps) {
  const stats = [
    {
      title: 'Grandes Metas',
      value: macroGoalsCount,
      description: 'Objetivos del año',
      icon: Trophy,
    },
    {
      title: 'Esta Semana',
      value: totalGoals,
      description: 'Tareas planeadas',
      icon: Zap,
    },
    {
      title: 'Completadas',
      value: completedGoals,
      description: 'Logros de la semana',
      icon: CheckCircle2,
    },
    {
      title: 'Racha',
      value: `${completionRate}%`,
      description: 'Nivel de cumplimiento',
      icon: Flame,
      showProgress: true
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index}
            className="group relative bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:translate-y-[-4px] hover:shadow-lg hover:shadow-primary/10"
          >
            <CardContent className="p-4 md:p-6">
              {/* Icon */}
              <div className="inline-flex p-2.5 rounded-xl mb-3 bg-primary/10 group-hover:bg-primary/20 transition-all shadow-sm">
                <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:scale-110 transition-transform" />
              </div>

              <Separator className="mb-3 opacity-40" />

              {/* Title */}
              <h3 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-tight">
                {stat.title}
              </h3>

              {/* Value */}
              <p className="text-2xl md:text-3xl font-black mb-2 text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </p>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-snug">
                {stat.description}
              </p>

              {/* Progress bar */}
              {stat.showProgress && (
                <Progress 
                  value={completionRate} 
                  className="h-2 mt-3 rounded-full" 
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
