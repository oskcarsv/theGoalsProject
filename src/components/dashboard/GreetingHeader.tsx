import { Sparkles, Calendar } from 'lucide-react';
import type { Profile } from '@/types/database';
import type { WeekInfo } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface GreetingHeaderProps {
  profile: Profile | null;
  weekInfo: WeekInfo;
  formatDateRange: (start: Date, end: Date) => string;
  fallbackName?: string;
}

export function GreetingHeader({ profile, weekInfo, formatDateRange, fallbackName }: GreetingHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const displayName = profile?.full_name || fallbackName || 'Invitado';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-card to-secondary/10 border border-border p-6 md:p-8 mb-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {/* Left side */}
        <div className="flex items-start gap-4 flex-1">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/20 shadow-lg shadow-primary/10 transition-all hover:scale-105">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {getInitials(profile?.full_name || 'IN')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <Badge 
              variant="secondary" 
              className="mb-3 transition-all bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {getGreeting()}
            </Badge>

            <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-foreground">
              {firstName}
            </h1>

            <p className="text-muted-foreground font-medium">
              ¡Hagamos que esta semana cuente!
            </p>
          </div>
        </div>

        {/* Right side - Week */}
        <div className="hidden md:block bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border shadow-sm transition-all hover:scale-105">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold">Semana</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-foreground">
            {weekInfo.weekNumber}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {formatDateRange(weekInfo.weekStart, weekInfo.weekEnd)}
          </div>
        </div>
      </div>

      {/* Mobile week info */}
      <div className="md:hidden mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Semana {weekInfo.weekNumber}</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatDateRange(weekInfo.weekStart, weekInfo.weekEnd)}</span>
        </div>
      </div>
    </div>
  );
}
