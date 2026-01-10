import { createClient } from '@/lib/supabase/server';
import { Trophy, Medal, Crown, TrendingUp, Users } from 'lucide-react';
import { getCurrentWeekInfo, formatDateRange, getInitials, cn } from '@/lib/utils';
import { NORMALIZED_CATEGORIES } from '@/types';
import type { Tables } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Ranking = Tables<'rankings'>;

interface RankingWithProfile {
  id: string;
  user_id: string;
  category: string;
  score: number;
  rank: number;
  week_start: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default async function RankingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const weekInfo = getCurrentWeekInfo();

  // Get rankings for this week with user profiles
  const { data: rankingsData } = await supabase
    .from('rankings')
    .select(
      `
      *,
      profiles!inner(full_name, avatar_url)
    `
    )
    .eq('week_start', weekInfo.weekStart.toISOString().split('T')[0])
    .order('score', { ascending: false });

  const rankings = (rankingsData || []) as RankingWithProfile[];

  // Group rankings by category
  const rankingsByCategory = NORMALIZED_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.id] = rankings
        .filter((r) => r.category === cat.id)
        .sort((a, b) => b.score - a.score)
        .map((r, idx) => ({ ...r, rank: idx + 1 }));
      return acc;
    },
    {} as Record<string, RankingWithProfile[]>
  );

  // Get user's position in each category
  const userRankings = NORMALIZED_CATEGORIES.map((cat) => {
    const categoryRankings = rankingsByCategory[cat.id] || [];
    const userRanking = categoryRankings.find((r) => r.user_id === user!.id);
    return {
      category: cat,
      rank: userRanking?.rank || null,
      score: userRanking?.score || 0,
      totalParticipants: categoryRankings.length,
    };
  }).filter((r) => r.rank !== null);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500/20" />;
      case 2:
        return <Medal className="h-6 w-6 text-secondary" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-muted-foreground font-bold text-sm">#{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-foreground">Ranking</h1>
        </div>
        <p className="text-muted-foreground">
          Semana {weekInfo.weekNumber} •{' '}
          {formatDateRange(weekInfo.weekStart, weekInfo.weekEnd)}
        </p>
      </div>

      {/* User's Rankings Summary */}
      {userRankings.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Tu posición esta semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {userRankings.map(({ category, rank, score, totalParticipants }) => (
                <div
                  key={category.id}
                  className="rounded-xl bg-muted p-4 text-center"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <p className="mt-1 text-sm text-muted-foreground">{category.label}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {getRankIcon(rank!)}
                    <span className="text-sm text-muted-foreground">
                      de {totalParticipants}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Rankings */}
      <div className="space-y-6">
        {NORMALIZED_CATEGORIES.map((category) => {
          const categoryRankings = rankingsByCategory[category.id] || [];
          if (categoryRankings.length === 0) return null;

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <CardTitle className="text-lg">
                    {category.label}
                  </CardTitle>
                  <Badge variant="secondary" className="ml-auto">
                    <Users className="mr-1 inline h-4 w-4" />
                    {categoryRankings.length} participantes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {categoryRankings.slice(0, 10).map((ranking) => {
                  const isCurrentUser = ranking.user_id === user!.id;
                  const profile = ranking.profiles as any;

                  return (
                    <div
                      key={ranking.id}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        isCurrentUser
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="w-8 flex justify-center">
                        {getRankIcon(ranking.rank)}
                      </div>

                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">
                            {getInitials(profile.full_name || 'U')}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <p
                          className={cn(
                            'font-medium truncate',
                            isCurrentUser
                              ? 'text-primary'
                              : 'text-foreground'
                          )}
                        >
                          {profile.full_name || 'Usuario'}
                          {isCurrentUser && (
                            <span className="text-xs ml-2 opacity-70">(Tú)</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium text-foreground">{ranking.score}</span>
                        <span className="text-sm">pts</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}

        {Object.values(rankingsByCategory).every((r) => r.length === 0) && (
          <Card className="py-12 text-center">
            <CardContent>
              <Trophy className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">
                No hay rankings aún
              </h3>
              <p className="text-muted-foreground">
                Completa metas con categorías para aparecer en el ranking
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
