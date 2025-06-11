import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Animations, BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/Design';

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
  isNewRecord?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  bestStreak,
  isNewRecord = false,
}) => {
  const scale = useSharedValue(1);
  const glowIntensity = useSharedValue(0);
  const recordAnimation = useSharedValue(0);

  useEffect(() => {
    if (isNewRecord) {
      // Celebration animation for new record
      scale.value = withSequence(
        withSpring(1.05, Animations.snappySpring),
        withSpring(1, Animations.gentleSpring)
      );
      
      // Record glow effect
      recordAnimation.value = withSequence(
        withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      );
    } else {
      // Gentle update animation
      scale.value = withSequence(
        withSpring(1.02, Animations.spring),
        withSpring(1, Animations.spring)
      );
    }
  }, [currentStreak, isNewRecord]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedRecordStyle = useAnimatedStyle(() => ({
    opacity: recordAnimation.value,
    transform: [{ scale: 1 + recordAnimation.value * 0.1 }],
  }));

  const getStreakText = () => {
    if (currentStreak === 0) return 'Start your streak!';
    if (currentStreak === 1) return '1 day streak';
    return `${currentStreak} day streak`;
  };

  const getBestStreakText = () => {
    if (bestStreak === 0) return '';
    if (bestStreak === currentStreak && currentStreak > 1) {
      return '🎉 New personal best!';
    }
    return `Best: ${bestStreak} days`;
  };

  const getStreakEmoji = () => {
    if (currentStreak === 0) return '🌱';
    if (currentStreak === 1) return '✨';
    if (currentStreak < 7) return '🔥';
    if (currentStreak < 30) return '💪';
    if (currentStreak < 100) return '🚀';
    return '👑';
  };

  const getProgressPercentage = () => {
    if (bestStreak === 0) return currentStreak / 30 * 100;
    return Math.min((currentStreak / bestStreak) * 100, 100);
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {/* New Record Glow */}
      {isNewRecord && (
        <Animated.View style={[styles.recordGlow, animatedRecordStyle]}>
          <LinearGradient
            colors={[Colors.systemOrange, Colors.systemPink]}
            style={styles.recordGlowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      )}

      {/* Main Card */}
      <LinearGradient
        colors={[Colors.systemBackground, Colors.secondarySystemBackground]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Inner highlight */}
        <View style={styles.innerHighlight} />
        
        <View style={styles.content}>
          {/* Main Streak Info */}
          <View style={styles.streakInfo}>
            <Text style={styles.emoji}>{getStreakEmoji()}</Text>
            <View style={styles.textSection}>
              <Text style={[styles.streakNumber, Typography.largeTitle]}>
                {currentStreak}
              </Text>
              <Text style={[styles.streakLabel, Typography.headline, {
                color: currentStreak === 0 ? Colors.tertiaryLabel : Colors.label
              }]}>
                {currentStreak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          {currentStreak > 0 && (
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage()}%`,
                    }
                  ]} 
                />
              </View>
              
              {/* Best Streak Info */}
              {getBestStreakText() !== '' && (
                <Text style={[
                  styles.bestStreakText,
                  Typography.caption1,
                  isNewRecord && styles.newRecordText
                ]}>
                  {getBestStreakText()}
                </Text>
              )}
            </View>
          )}

          {/* Motivational Text */}
          {currentStreak === 0 && (
            <Text style={[styles.motivationalText, Typography.subheadline]}>
              Every journey begins with a single step
            </Text>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.screenPadding,
    marginVertical: Spacing.md,
    position: 'relative',
  },
  
  recordGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: BorderRadius.card + 8,
  },
  
  recordGlowGradient: {
    flex: 1,
    borderRadius: BorderRadius.card + 8,
    opacity: 0.4,
  },
  
  card: {
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    ...Shadows.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
  },
  
  content: {
    position: 'relative',
    zIndex: 1,
  },
  
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  
  emoji: {
    fontSize: 48,
    marginRight: Spacing.md,
  },
  
  textSection: {
    alignItems: 'center',
  },
  
  streakNumber: {
    color: Colors.label,
    textAlign: 'center',
    lineHeight: 41,
  },
  
  streakLabel: {
    textAlign: 'center',
    marginTop: -Spacing.xs,
  },
  
  progressSection: {
    marginTop: Spacing.sm,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: Colors.quaternarySystemFill,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.systemGreen,
  },
  
  bestStreakText: {
    textAlign: 'center',
    color: Colors.secondaryLabel,
  },
  
  newRecordText: {
    color: Colors.systemOrange,
    fontWeight: '600',
  },
  
  motivationalText: {
    textAlign: 'center',
    color: Colors.tertiaryLabel,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
}); 