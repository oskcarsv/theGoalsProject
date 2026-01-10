import { createClient } from './client';
import { createClient as createServerSupabaseClient } from './server';
import type { Database, Profile, MacroGoal, MicroGoal, Evidence, Ranking } from '@/types/database';

// Type helpers for Supabase queries
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type MacroGoalRow = Database['public']['Tables']['macro_goals']['Row'];
export type MicroGoalRow = Database['public']['Tables']['micro_goals']['Row'];
export type EvidenceRow = Database['public']['Tables']['evidence']['Row'];
export type RankingRow = Database['public']['Tables']['rankings']['Row'];

// Client-side queries
export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data as ProfileRow | null;
}

export async function getAllProfiles(): Promise<ProfileRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return (data || []) as ProfileRow[];
}

export async function getMacroGoals(userId: string): Promise<MacroGoalRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('macro_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data || []) as MacroGoalRow[];
}

export async function getMicroGoals(userId: string, weekStart?: string, weekEnd?: string): Promise<MicroGoalRow[]> {
  const supabase = createClient();
  let query = supabase
    .from('micro_goals')
    .select('*, macro_goals(*)')
    .eq('user_id', userId);
  
  if (weekStart && weekEnd) {
    query = query.gte('week_start', weekStart).lte('week_end', weekEnd);
  }
  
  const { data } = await query.order('created_at', { ascending: false });
  return (data || []) as MicroGoalRow[];
}

export async function getMicroGoalsWithEvidence(userId: string, weekStart?: string, weekEnd?: string) {
  const supabase = createClient();
  let query = supabase
    .from('micro_goals')
    .select('*, macro_goals(*), evidence(*)')
    .eq('user_id', userId);
  
  if (weekStart && weekEnd) {
    query = query.gte('week_start', weekStart).lte('week_end', weekEnd);
  }
  
  const { data } = await query.order('created_at', { ascending: false });
  return data || [];
}

export async function getRankings(): Promise<RankingRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('rankings')
    .select('*, profiles(*)');
  return (data || []) as RankingRow[];
}

export async function getMatchableProfiles(currentUserId: string): Promise<ProfileRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .eq('onboarding_completed', true);
  return (data || []) as ProfileRow[];
}
