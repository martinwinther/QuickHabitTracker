import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Habit } from '../types/habit';
import { calculateStreak, formatDate } from '../utils/dateUtils';

const HABIT_STORAGE_KEY = '@QuickHabitTracker:habit';

export const useHabitStorage = () => {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load habit from storage
  const loadHabit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(HABIT_STORAGE_KEY);
      if (stored) {
        const parsedHabit: Habit = JSON.parse(stored);
        // Recalculate streak in case it's outdated
        parsedHabit.currentStreak = calculateStreak(parsedHabit.completedDates);
        setHabit(parsedHabit);
      }
    } catch (err) {
      setError('Failed to load habit data');
      console.error('Error loading habit:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save habit to storage
  const saveHabit = useCallback(async (habitData: Habit) => {
    try {
      setError(null);
      await AsyncStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habitData));
      setHabit(habitData);
    } catch (err) {
      setError('Failed to save habit data');
      console.error('Error saving habit:', err);
    }
  }, []);

  // Create a new habit
  const createHabit = useCallback(async (title: string, emoji: string = '✨') => {
    const now = new Date().toISOString();
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: title.trim(),
      emoji,
      startDate: formatDate(new Date()),
      completedDates: [],
      currentStreak: 0,
      bestStreak: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    await saveHabit(newHabit);
    return newHabit;
  }, [saveHabit]);

  // Update habit details
  const updateHabit = useCallback(async (updates: Partial<Pick<Habit, 'title' | 'emoji'>>) => {
    if (!habit) return;
    
    const updatedHabit: Habit = {
      ...habit,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await saveHabit(updatedHabit);
  }, [habit, saveHabit]);

  // Mark today as completed
  const markTodayComplete = useCallback(async () => {
    if (!habit) return false;
    
    const today = formatDate(new Date());
    if (habit.completedDates.includes(today)) {
      return false; // Already completed
    }
    
    const updatedCompletedDates = [...habit.completedDates, today];
    const currentStreak = calculateStreak(updatedCompletedDates);
    const bestStreak = Math.max(habit.bestStreak, currentStreak);
    
    const updatedHabit: Habit = {
      ...habit,
      completedDates: updatedCompletedDates,
      currentStreak,
      bestStreak,
      updatedAt: new Date().toISOString(),
    };
    
    await saveHabit(updatedHabit);
    return true;
  }, [habit, saveHabit]);

  // Remove today's completion
  const unmarkTodayComplete = useCallback(async () => {
    if (!habit) return false;
    
    const today = formatDate(new Date());
    if (!habit.completedDates.includes(today)) {
      return false; // Not completed
    }
    
    const updatedCompletedDates = habit.completedDates.filter(date => date !== today);
    const currentStreak = calculateStreak(updatedCompletedDates);
    
    const updatedHabit: Habit = {
      ...habit,
      completedDates: updatedCompletedDates,
      currentStreak,
      updatedAt: new Date().toISOString(),
    };
    
    await saveHabit(updatedHabit);
    return true;
  }, [habit, saveHabit]);

  // Delete all data and start over
  const resetHabit = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HABIT_STORAGE_KEY);
      setHabit(null);
    } catch (err) {
      setError('Failed to reset habit data');
      console.error('Error resetting habit:', err);
    }
  }, []);

  // Check if today is completed
  const isTodayCompleted = useCallback(() => {
    if (!habit) return false;
    const today = formatDate(new Date());
    return habit.completedDates.includes(today);
  }, [habit]);

  // Initialize on mount
  useEffect(() => {
    loadHabit();
  }, [loadHabit]);

  return {
    habit,
    loading,
    error,
    createHabit,
    updateHabit,
    markTodayComplete,
    unmarkTodayComplete,
    resetHabit,
    isTodayCompleted,
    refreshHabit: loadHabit,
  };
}; 