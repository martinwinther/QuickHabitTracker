export interface Habit {
  id: string;
  title: string;
  emoji: string;
  startDate: string; // ISO date string
  completedDates: string[]; // Array of ISO date strings
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate: number; // percentage
}

export interface DayStatus {
  date: string;
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
} 