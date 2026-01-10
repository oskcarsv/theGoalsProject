import { createClient } from '@/lib/supabase/server';
import {
  Users,
  Heart,
  Instagram,
  Linkedin,
  ExternalLink,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { FOCUS_AREAS } from '@/types';
import { getInitials, calculateCompatibilityScore } from '@/lib/utils';
import type { Tables } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type Profile = Tables<'profiles'>;

export default async function MatchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentProfile: Profile | null = null;
  let otherProfiles: Profile[] = [];

  if (user) {
    // Get current user's profile
    const { data: currentProfileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    currentProfile = currentProfileData as Profile | null;

    // Get all other users
    const { data: otherProfilesData } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .eq('onboarding_completed', true);
    
    otherProfiles = (otherProfilesData || []) as Profile[];
  }

  // Calculate compatibility scores
  const matches = (otherProfiles || [])
    .map((profile) => {
      const score = calculateCompatibilityScore(
        (currentProfile?.focus_areas as string[]) || [],
        (profile.focus_areas as string[]) || [],
        (currentProfile?.interests as string[]) || [],
        (profile.interests as string[]) || []
      );

      const commonAreas = ((currentProfile?.focus_areas as string[]) || []).filter(
        (area) => ((profile.focus_areas as string[]) || []).includes(area)
      );

      const commonInterests = (
        (currentProfile?.interests as string[]) || []
      ).filter((interest) =>
        ((profile.interests as string[]) || []).includes(interest)
      );

      return {
        profile,
        score,
        commonAreas,
        commonInterests,
      };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  const getAreaInfo = (areaId: string) => {
    return FOCUS_AREAS.find((a) => a.id === areaId);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-secondary/10 border border-border p-8 mb-8 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-blob"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">
              Match
            </h1>
            <p className="text-muted-foreground font-medium italic">
              Conecta con personas que comparten tus metas
            </p>
          </div>
        </div>
      </div>

      {/* Matches List */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {matches.map(({ profile, score, commonAreas, commonInterests }) => (
            <Card key={profile.id} className="group bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px] overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  {/* Avatar Section */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/20 group-hover:border-primary/50 transition-all shadow-xl shadow-primary/10 group-hover:scale-110">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                        {getInitials(profile.full_name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-background">
                      {score}%
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="min-w-0 flex-1 space-y-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                          {profile.full_name || 'Usuario'}
                        </h3>
                        <Badge variant="secondary" className="mt-2 text-primary font-bold bg-primary/10 border-primary/20 px-3 py-1">
                          <Heart className="h-3.5 w-3.5 mr-1.5 fill-primary" />
                          Misma sintonía
                        </Badge>
                      </div>
                      <ArrowRight className="h-6 w-6 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all mt-2" />
                    </div>

                    {profile.bio && (
                      <p className="text-base text-muted-foreground leading-relaxed italic">
                        "{profile.bio}"
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Common Areas */}
                      {commonAreas.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            Áreas en común
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {commonAreas.map((areaId) => {
                              const area = getAreaInfo(areaId);
                              const AreaIcon = area?.icon;
                              return (
                                <Badge
                                  key={areaId}
                                  variant="outline"
                                  className="gap-2 px-3 py-1.5 bg-background/50 border-border group-hover:border-primary/30 transition-colors"
                                >
                                  {AreaIcon && <AreaIcon className="h-4 w-4 text-primary" />}
                                  <span className="font-bold text-xs">{area?.label}</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Common Interests */}
                      {commonInterests.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            Gustos similares
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {commonInterests.slice(0, 5).map((interest) => (
                              <Badge
                                key={interest}
                                variant="secondary"
                                className="text-[10px] bg-muted/50 border border-border"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {(profile.instagram || profile.linkedin) && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
                        {profile.instagram && (
                          <a
                            href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-xs font-black hover:shadow-lg hover:scale-105 transition-all"
                          >
                            <Instagram className="h-4 w-4" />
                            Instagram
                          </a>
                        )}
                        {profile.linkedin && (
                          <a
                            href={
                              profile.linkedin.startsWith('http')
                                ? profile.linkedin
                                : `https://${profile.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-xl text-xs font-black hover:shadow-lg hover:scale-105 transition-all"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border border-dashed border-border">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              No hay matches disponibles aún
            </h3>
            <p className="mx-auto max-w-md text-muted-foreground leading-relaxed">
              Cuando más usuarios se unan y completen su perfil, podrás encontrar
              personas con metas y gustos similares a los tuyos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="mt-8 bg-card border border-border hover:border-primary/50 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-lg shadow-primary/20 transition-all hover:scale-110">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                ¿Cómo funciona el matching?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El sistema de match conecta usuarios basándose en áreas de enfoque
                e intereses compartidos. Mientras más cosas tengas en común con
                alguien, mayor será su porcentaje de compatibilidad. Conéctate con
                personas afines para apoyarse mutuamente en alcanzar sus metas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
