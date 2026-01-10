import { Clock, Users, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AccountabilityCornerProps {
  weekNumber: number;
  completionRate: number;
  totalGoals: number;
  completedGoals: number;
}

export function AccountabilityCorner({
  weekNumber,
  completionRate,
  totalGoals,
  completedGoals,
}: AccountabilityCornerProps) {
  const getDay = () => new Date().getDay();
  const isThursday = getDay() === 4;
  const daysUntilThursday = (4 - getDay() + 7) % 7;
  
  const getMeetingMessage = () => {
    if (isThursday) {
      return '¡Es jueves! Hoy es la reunión de accountability. Prepara tu reporte.';
    } else if (daysUntilThursday <= 2) {
      return `Reunión de accountability en ${daysUntilThursday} día${daysUntilThursday === 1 ? '' : 's'}`;
    }
    return `Próxima reunión en ${daysUntilThursday} días`;
  };

  const getPerformanceColor = () => {
    if (completionRate >= 80) return 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400';
    if (completionRate >= 60) return 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400';
    if (completionRate >= 40) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400';
    return 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400';
  };

  const getMotivationalMessage = () => {
    if (completionRate >= 90) {
      return '¡Excelente ritmo! Mantén este momentum para la reunión 🔥';
    } else if (completionRate >= 70) {
      return 'Buen progreso. Puedes terminalo en los días que quedan 💪';
    } else if (completionRate >= 50) {
      return 'Aún hay tiempo. Enfócate en tus prioridades 🎯';
    } else {
      return 'No te desanimes. Cada pequeño paso cuenta 🌱';
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-pulse" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              Accountability
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {getMeetingMessage()}
            </CardDescription>
          </div>
          {isThursday && (
            <Badge className="bg-primary text-primary-foreground animate-pulse">
              HOYYYY!
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Performance Summary */}
        <div className={`p-4 rounded-lg border ${getPerformanceColor()}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase">Tu avance esta semana</span>
            <span className="text-lg font-black">{completionRate}%</span>
          </div>
          <p className="text-sm font-medium">
            {completedGoals}/{totalGoals} metas completadas
          </p>
        </div>

        {/* Motivational Message */}
        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <p className="text-sm text-foreground font-medium">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Meeting Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
            <p className="text-2xl font-bold text-primary">📍</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">GRUPAL</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
            <p className="text-2xl font-bold text-secondary">💬</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">RENDICIÓN</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2 pt-2">
          <Link href="/dashboard/review" className="block">
            <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg">
              <MessageSquare className="h-4 w-4" />
              Ver mi reporte
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
          
          {isThursday && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <p className="text-xs font-bold text-primary uppercase">
                ✨ Recuerda copiar tu reporte para WhatsApp
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
