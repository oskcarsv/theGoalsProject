// Database types for Supabase
// Run `npm run db:types` to regenerate from your Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'admin';

export type GoalArea = 'physical_health' | 'emotional_health' | 'professional' | 'personal';

export type GoalStatus = 'active' | 'completed' | 'abandoned';

export type EvidenceStatus = 'pending' | 'approved' | 'expired';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          bio: string | null;
          what_makes_you_different: string | null;
          avatar_url: string | null;
          instagram: string | null;
          linkedin: string | null;
          interests: string[] | null;
          focus_areas: string[] | null;
          role: UserRole;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          bio?: string | null;
          what_makes_you_different?: string | null;
          avatar_url?: string | null;
          instagram?: string | null;
          linkedin?: string | null;
          interests?: string[] | null;
          focus_areas?: string[] | null;
          role?: UserRole;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          bio?: string | null;
          what_makes_you_different?: string | null;
          avatar_url?: string | null;
          instagram?: string | null;
          linkedin?: string | null;
          interests?: string[] | null;
          focus_areas?: string[] | null;
          role?: UserRole;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      macro_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          area: string;
          year: number;
          status: GoalStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          area: string;
          year: number;
          status?: GoalStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          area?: string;
          year?: number;
          status?: GoalStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "macro_goals_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      micro_goals: {
        Row: {
          id: string;
          user_id: string;
          macro_goal_id: string | null;
          title: string;
          description: string | null;
          week_start: string;
          week_end: string;
          completed: boolean;
          normalized_category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          macro_goal_id?: string | null;
          title: string;
          description?: string | null;
          week_start: string;
          week_end: string;
          completed?: boolean;
          normalized_category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          macro_goal_id?: string | null;
          title?: string;
          description?: string | null;
          week_start?: string;
          week_end?: string;
          completed?: boolean;
          normalized_category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "micro_goals_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "micro_goals_macro_goal_id_fkey";
            columns: ["macro_goal_id"];
            referencedRelation: "macro_goals";
            referencedColumns: ["id"];
          }
        ];
      };
      evidence: {
        Row: {
          id: string;
          micro_goal_id: string;
          user_id: string;
          image_url: string;
          caption: string | null;
          status: EvidenceStatus;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          micro_goal_id: string;
          user_id: string;
          image_url: string;
          caption?: string | null;
          status?: EvidenceStatus;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          micro_goal_id?: string;
          user_id?: string;
          image_url?: string;
          caption?: string | null;
          status?: EvidenceStatus;
          created_at?: string;
          expires_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "evidence_micro_goal_id_fkey";
            columns: ["micro_goal_id"];
            referencedRelation: "micro_goals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "evidence_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      weekly_reviews: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          week_end: string;
          notes: string | null;
          goals_completed: number;
          goals_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          week_end: string;
          notes?: string | null;
          goals_completed?: number;
          goals_total?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          week_end?: string;
          notes?: string | null;
          goals_completed?: number;
          goals_total?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "weekly_reviews_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      rankings: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          score: number;
          rank: number;
          week_start: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          score?: number;
          rank?: number;
          week_start: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          score?: number;
          rank?: number;
          week_start?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rankings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      matches: {
        Row: {
          id: string;
          user_id_1: string;
          user_id_2: string;
          compatibility_score: number;
          common_goals: string[] | null;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id_1: string;
          user_id_2: string;
          compatibility_score?: number;
          common_goals?: string[] | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id_1?: string;
          user_id_2?: string;
          compatibility_score?: number;
          common_goals?: string[] | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_user_id_1_fkey";
            columns: ["user_id_1"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_user_id_2_fkey";
            columns: ["user_id_2"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      goal_area: GoalArea;
      goal_status: GoalStatus;
      evidence_status: EvidenceStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience types
export type Profile = Tables<'profiles'>;
export type MacroGoal = Tables<'macro_goals'>;
export type MicroGoal = Tables<'micro_goals'>;
export type Evidence = Tables<'evidence'>;
export type WeeklyReview = Tables<'weekly_reviews'>;
export type Ranking = Tables<'rankings'>;
export type Match = Tables<'matches'>;
