import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  startOfWeek,
  endOfWeek,
  getWeek,
  getYear,
  addWeeks,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { WeekInfo } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentWeekInfo(): WeekInfo {
  const now = new Date();
  return {
    weekStart: startOfWeek(now, { weekStartsOn: 1 }), // Monday
    weekEnd: endOfWeek(now, { weekStartsOn: 1 }),
    weekNumber: getWeek(now, { weekStartsOn: 1 }),
    year: getYear(now),
  };
}

export function getWeekInfo(date: Date): WeekInfo {
  return {
    weekStart: startOfWeek(date, { weekStartsOn: 1 }),
    weekEnd: endOfWeek(date, { weekStartsOn: 1 }),
    weekNumber: getWeek(date, { weekStartsOn: 1 }),
    year: getYear(date),
  };
}

export function getNextWeekInfo(): WeekInfo {
  const nextWeek = addWeeks(new Date(), 1);
  return getWeekInfo(nextWeek);
}

export function formatDateRange(start: Date, end: Date): string {
  return `${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM yyyy', { locale: es })}`;
}

export function formatDate(date: Date): string {
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateCompatibilityScore(
  user1FocusAreas: string[],
  user2FocusAreas: string[],
  user1Interests: string[],
  user2Interests: string[]
): number {
  const focusAreaOverlap = user1FocusAreas.filter((area) =>
    user2FocusAreas.includes(area)
  ).length;
  const interestOverlap = user1Interests.filter((interest) =>
    user2Interests.includes(interest)
  ).length;

  const maxFocusAreas = Math.max(user1FocusAreas.length, user2FocusAreas.length);
  const maxInterests = Math.max(user1Interests.length, user2Interests.length);

  const focusAreaScore = maxFocusAreas > 0 ? focusAreaOverlap / maxFocusAreas : 0;
  const interestScore = maxInterests > 0 ? interestOverlap / maxInterests : 0;

  // Weight focus areas more heavily (60/40)
  return Math.round((focusAreaScore * 0.6 + interestScore * 0.4) * 100);
}
