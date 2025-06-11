import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from 'react-native-reanimated';
import { Animations, Colors, Shadows, Spacing, Typography } from '../../constants/Design';
import {
    getDayName,
    getMonthDay,
    getWeekDates,
    isPastDate,
    isToday
} from '../../utils/dateUtils';

interface MiniCalendarProps {
  completedDates: string[];
  centerDate?: Date;
  showWeekNames?: boolean;
}

interface DayItemProps {
  date: string;
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
  index: number;
}

const DayItem: React.FC<DayItemProps> = ({ 
  date, 
  isCompleted, 
  isToday: isTodayDate, 
  isPast, 
  index 
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animation
    scale.value = withDelay(
      index * 50,
      withSpring(1, Animations.gentleSpring)
    );
    opacity.value = withDelay(
      index * 50,
      withSpring(1, Animations.gentleSpring)
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const dayNumber = getMonthDay(date);
  const dayName = getDayName(date);

  const getCircleStyle = () => {
    if (isTodayDate) {
      return isCompleted ? styles.todayCompleted : styles.today;
    }
    if (isCompleted) {
      return styles.completed;
    }
    if (isPast) {
      return styles.missed;
    }
    return styles.future;
  };

  const getTextStyle = () => {
    if (isTodayDate || isCompleted) {
      return styles.completedText;
    }
    if (isPast) {
      return styles.missedText;
    }
    return styles.futureText;
  };

  return (
    <Animated.View style={[styles.dayContainer, animatedStyle]}>
      <Text style={[styles.dayName, Typography.caption2]}>{dayName}</Text>
      <View style={[styles.dayCircle, getCircleStyle()]}>
        {isCompleted ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <Text style={[styles.dayNumber, getTextStyle(), Typography.footnote]}>
            {dayNumber}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  completedDates,
  centerDate,
  showWeekNames = true,
}) => {
  const weekDates = getWeekDates(centerDate);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {weekDates.map((date, index) => (
          <DayItem
            key={date}
            date={date}
            isCompleted={completedDates.includes(date)}
            isToday={isToday(date)}
            isPast={isPastDate(date)}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.screenPadding,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  dayContainer: {
    alignItems: 'center',
    minWidth: 44,
  },
  dayName: {
    color: Colors.tertiaryLabel,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayNumber: {
    textAlign: 'center',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.systemBackground,
    textAlign: 'center',
  },
  
  // Day States
  today: {
    backgroundColor: Colors.systemBlue,
    borderColor: Colors.systemBlue,
    ...Shadows.small,
  },
  todayCompleted: {
    backgroundColor: Colors.systemGreen,
    borderColor: Colors.systemGreen,
    ...Shadows.small,
  },
  completed: {
    backgroundColor: Colors.systemGreen,
    borderColor: Colors.systemGreen,
    ...Shadows.small,
  },
  missed: {
    backgroundColor: Colors.tertiarySystemFill,
    borderColor: Colors.separator,
  },
  future: {
    backgroundColor: Colors.secondarySystemFill,
    borderColor: Colors.separator,
  },
  
  // Text Colors
  completedText: {
    color: Colors.systemBackground,
  },
  missedText: {
    color: Colors.tertiaryLabel,
  },
  futureText: {
    color: Colors.secondaryLabel,
  },
}); 