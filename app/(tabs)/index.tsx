import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { HabitModal } from '../../components/HabitModal';
import { CompletionButton } from '../../components/ui/CompletionButton';
import { MiniCalendar } from '../../components/ui/MiniCalendar';
import { StreakCounter } from '../../components/ui/StreakCounter';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/Design';
import { useHabitStorage } from '../../hooks/useHabitStorage';
import { useHaptics } from '../../hooks/useHaptics';

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { light, success } = useHaptics();

  const {
    habit,
    loading,
    error,
    createHabit,
    updateHabit,
    markTodayComplete,
    unmarkTodayComplete,
    resetHabit,
    isTodayCompleted,
    refreshHabit,
  } = useHabitStorage();

  const handleCompletionToggle = async () => {
    const wasCompleted = isTodayCompleted();
    let success = false;

    if (wasCompleted) {
      success = await unmarkTodayComplete();
    } else {
      success = await markTodayComplete();
    }

    if (success) {
      light();
    }
  };

  const handleHabitSave = async (title: string, emoji: string) => {
    if (habit) {
      await updateHabit({ title, emoji });
    } else {
      await createHabit(title, emoji);
    }
    success();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshHabit();
    setTimeout(() => setRefreshing(false), 500);
  };

     const isNewRecord = !!(habit && habit.currentStreak === habit.bestStreak && habit.currentStreak > 1);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.systemGroupedBackground} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.systemBlue}
            colors={[Colors.systemBlue]}
          />
        }
      >
        {!habit ? (
          /* Welcome State */
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeEmoji}>🌟</Text>
              <Text style={styles.welcomeTitle}>Start Your First Habit</Text>
              <Text style={styles.welcomeSubtitle}>
                Choose one habit to focus on.{'\n'}
                Small steps lead to big changes.
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setIsModalVisible(true)}
              >
                <LinearGradient
                  colors={[Colors.systemBlue, Colors.systemIndigo]}
                  style={styles.startButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.startButtonText}>Create Habit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Habit Tracking State */
          <View style={styles.habitContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.appTitle}>Today</Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Main Completion Button */}
            <CompletionButton
              isCompleted={isTodayCompleted()}
              onPress={handleCompletionToggle}
              emoji={habit.emoji}
              title={habit.title}
            />

            {/* Streak Counter */}
            <StreakCounter
              currentStreak={habit.currentStreak}
              bestStreak={habit.bestStreak}
              isNewRecord={isNewRecord}
            />

            {/* Mini Calendar */}
            <MiniCalendar completedDates={habit.completedDates} />

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{habit.completedDates.length}</Text>
                <Text style={styles.statLabel}>Total Days</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{habit.bestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {Math.round((habit.completedDates.length / Math.max(1, 
                    Math.ceil((new Date().getTime() - new Date(habit.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                  )) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                // Add confirmation alert
                resetHabit();
              }}
            >
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Habit Modal */}
      <HabitModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleHabitSave}
        onDelete={resetHabit}
        initialTitle={habit?.title}
        initialEmoji={habit?.emoji}
        isEditing={!!habit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.systemGroupedBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.secondaryLabel,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xxxl,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
    minHeight: 600,
  },
  welcomeContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  welcomeEmoji: {
    fontSize: 100,
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    ...Typography.largeTitle,
    color: Colors.label,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  welcomeSubtitle: {
    ...Typography.body,
    color: Colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
  },
  startButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.button,
  },
  startButtonGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minWidth: 160,
  },
  startButtonText: {
    ...Typography.headline,
    color: Colors.systemBackground,
  },
  habitContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.systemGroupedBackground,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    ...Typography.largeTitle,
    color: Colors.label,
  },
  editButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  editButtonText: {
    ...Typography.body,
    color: Colors.systemBlue,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.secondarySystemGroupedBackground,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  statNumber: {
    ...Typography.title1,
    color: Colors.label,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption1,
    color: Colors.secondaryLabel,
    textAlign: 'center',
  },
  resetButton: {
    alignSelf: 'center',
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  resetButtonText: {
    ...Typography.callout,
    color: Colors.systemRed,
  },
});
