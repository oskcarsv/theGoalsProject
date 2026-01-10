import { Heart, Sparkles, Dumbbell, Briefcase, type LucideIcon } from 'lucide-react';

export * from './database';

// Common types used across the app
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  onboardingCompleted: boolean;
}

export interface OnboardingData {
  fullName: string;
  bio: string;
  whatMakesYouDifferent: string;
  focusAreas: string[];
  interests: string[];
  instagram?: string;
  linkedin?: string;
}

export interface WeekInfo {
  weekStart: Date;
  weekEnd: Date;
  weekNumber: number;
  year: number;
}

// Normalized goal categories for ranking
export const NORMALIZED_CATEGORIES = [
  { id: 'gym', label: 'Ir al gimnasio', icon: '💪' },
  { id: 'reading', label: 'Leer más', icon: '📚' },
  { id: 'nutrition', label: 'Comer bien', icon: '🥗' },
  { id: 'sleep', label: 'Dormir a la misma hora', icon: '😴' },
  { id: 'meditation', label: 'Meditar', icon: '🧘' },
  { id: 'learning', label: 'Aprender algo nuevo', icon: '🎓' },
  { id: 'networking', label: 'Networking', icon: '🤝' },
  { id: 'side_project', label: 'Proyecto personal', icon: '💻' },
  { id: 'exercise', label: 'Ejercicio general', icon: '🏃' },
  { id: 'other', label: 'Otro', icon: '🎯' },
] as const;

export type NormalizedCategory = typeof NORMALIZED_CATEGORIES[number]['id'];

// Focus areas
export const FOCUS_AREAS = [
  { id: 'physical_health', label: 'Salud Física', icon: Dumbbell, color: 'bg-green-500', description: 'Metas relacionadas con ejercicio, nutrición y bienestar físico' },
  { id: 'emotional_health', label: 'Salud Emocional', icon: Heart, color: 'bg-pink-500', description: 'Metas de crecimiento personal, relaciones y bienestar mental' },
  { id: 'professional', label: 'Profesional/Trabajo', icon: Briefcase, color: 'bg-blue-500', description: 'Metas de carrera, proyectos y desarrollo profesional' },
  { id: 'personal', label: 'Personal', icon: Sparkles, color: 'bg-purple-500', description: 'Hobbies, aprendizaje y objetivos personales' },
] as const;

export type FocusArea = typeof FOCUS_AREAS[number]['id'];
