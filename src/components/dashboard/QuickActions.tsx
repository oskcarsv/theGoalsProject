import Link from 'next/link';
import {
  Plus,
  Calendar,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
  const actions = [
    {
      title: 'Nueva Meta Anual',
      description: 'Define un nuevo objetivo a largo plazo',
      icon: Plus,
      href: '/goals/new',
      color: 'from-primary/20 to-primary/5'
    },
    {
      title: 'Planificar Semana',
      description: 'Organiza tus micro-objetivos',
      icon: Calendar,
      href: '/goals/weekly/new',
      color: 'from-secondary/20 to-secondary/5'
    },
    {
      title: 'Revisión Semanal',
      description: 'Registra tu progreso y evidencia',
      icon: CheckCircle,
      href: '/review',
      color: 'from-green-500/20 to-green-500/5'
    }
  ];

  return (
    <Card className="border border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-bold">Acciones rápidas</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Gestiona tus metas</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} href={action.href} className="block group">
              <div className={`relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${action.color} p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]`}>
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm border border-border group-hover:border-primary/50 group-hover:shadow-md transition-all">
                    <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base mb-0.5 group-hover:text-primary transition-colors">
                      {action.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
