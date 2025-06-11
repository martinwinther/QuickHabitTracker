
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const isToday = (dateString: string): boolean => {
  const today = formatDate(new Date());
  return dateString === today;
};

export const isPastDate = (dateString: string): boolean => {
  const today = formatDate(new Date());
  return dateString < today;
};

export const isFutureDate = (dateString: string): boolean => {
  const today = formatDate(new Date());
  return dateString > today;
};

export const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

export const getDaysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort().reverse(); // Most recent first
  const today = formatDate(new Date());
  const yesterday = getDaysAgo(1);
  
  let streak = 0;
  let currentDate = today;
  
  // Check if today is completed
  if (sortedDates.includes(today)) {
    streak = 1;
    currentDate = yesterday;
  } else if (sortedDates.includes(yesterday)) {
    // If today isn't completed but yesterday is, start from yesterday
    streak = 1;
    currentDate = getDaysAgo(2);
  } else {
    return 0; // No recent completions
  }
  
  // Count consecutive days backwards
  let daysBack = streak === 1 && sortedDates.includes(today) ? 1 : 2;
  while (sortedDates.includes(getDaysAgo(daysBack))) {
    streak++;
    daysBack++;
  }
  
  return streak;
};

export const getWeekDates = (centerDate?: Date): string[] => {
  const center = centerDate || new Date();
  const dates: string[] = [];
  
  // Get 7 days centered around the given date
  for (let i = -3; i <= 3; i++) {
    const date = new Date(center);
    date.setDate(date.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

export const getDayName = (dateString: string): string => {
  const date = parseDate(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getMonthDay = (dateString: string): number => {
  const date = parseDate(dateString);
  return date.getDate();
}; 