import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Animations, Colors, Shadows, Spacing, Typography } from '../../constants/Design';
import { useHaptics } from '../../hooks/useHaptics';

interface CompletionButtonProps {
  isCompleted: boolean;
  onPress: () => void;
  emoji: string;
  title: string;
  disabled?: boolean;
}

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(width * 0.55, 200);

export const CompletionButton: React.FC<CompletionButtonProps> = ({
  isCompleted,
  onPress,
  emoji,
  title,
  disabled = false,
}) => {
  const { success, light } = useHaptics();
  const scale = useSharedValue(1);
  const progress = useSharedValue(isCompleted ? 1 : 0);
  const glowIntensity = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(isCompleted ? 1 : 0, Animations.gentleSpring);
    glowIntensity.value = withSpring(isCompleted ? 1 : 0, Animations.gentleSpring);
  }, [isCompleted]);

  // Gentle pulse animation when not completed
  useEffect(() => {
    if (!isCompleted) {
      const startPulse = () => {
        pulseAnimation.value = withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        );
      };
      
      startPulse();
      const interval = setInterval(startPulse, 4000);
      return () => clearInterval(interval);
    }
  }, [isCompleted, pulseAnimation]);

  const handlePress = () => {
    if (disabled) return;

    // Haptic feedback
    if (!isCompleted) {
      runOnJS(success)();
    } else {
      runOnJS(light)();
    }

    // Press animation
    scale.value = withSequence(
      withSpring(0.92, Animations.snappySpring),
      withSpring(1, Animations.spring)
    );

    // Celebration animation for completion
    if (!isCompleted) {
      glowIntensity.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withSpring(1, Animations.gentleSpring)
      );
    }

    setTimeout(() => {
      onPress();
    }, 100);
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pulseAnimation.value }
    ],
    opacity: disabled ? 0.6 : 1,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowIntensity.value * 0.3,
    transform: [{ scale: 1 + glowIntensity.value * 0.1 }],
  }));

  const animatedCheckmarkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: progress.value },
      { rotate: `${progress.value * 360}deg` },
    ],
  }));

  const animatedEmojiStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 1 - progress.value * 0.2 }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.15]),
  }));

  return (
    <View style={styles.container}>
      {/* Glow Effect */}
      <Animated.View style={[styles.glowContainer, animatedGlowStyle]}>
        <LinearGradient
          colors={[Colors.systemGreen, Colors.success]}
          style={styles.glow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Main Button */}
      <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={handlePress}
          disabled={disabled}
          style={styles.touchable}
        >
          <View style={styles.button}>
            {/* Background Gradient */}
            <LinearGradient
              colors={isCompleted 
                ? [Colors.success, Colors.systemGreen] 
                : [Colors.systemBackground, Colors.secondarySystemBackground]
              }
              style={styles.backgroundGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Inner Shadow/Highlight */}
              <View style={[styles.innerHighlight, isCompleted && styles.innerHighlightCompleted]} />
              
              {/* Content */}
              <View style={styles.content}>
                {/* Emoji when not completed */}
                <Animated.View style={[styles.iconContainer, animatedEmojiStyle]}>
                  <Text style={styles.emoji}>{emoji}</Text>
                </Animated.View>

                {/* Checkmark when completed */}
                <Animated.View style={[styles.iconContainer, animatedCheckmarkStyle]}>
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                </Animated.View>
              </View>

              {/* Success Overlay */}
              <Animated.View style={[styles.successOverlay, animatedOverlayStyle]} />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Title and Status */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, Typography.title1]}>{title}</Text>
        <Text style={[styles.subtitle, Typography.subheadline, {
          color: isCompleted ? Colors.success : Colors.secondaryLabel
        }]}>
          {isCompleted ? '✨ Completed today!' : 'Tap to complete'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.screenPadding,
  },
  
  glowContainer: {
    position: 'absolute',
    width: BUTTON_SIZE + 40,
    height: BUTTON_SIZE + 40,
    borderRadius: (BUTTON_SIZE + 40) / 2,
  },
  
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: (BUTTON_SIZE + 40) / 2,
  },
  
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  
  touchable: {
    borderRadius: BUTTON_SIZE / 2,
  },
  
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    ...Shadows.large,
  },
  
  backgroundGradient: {
    flex: 1,
    borderRadius: BUTTON_SIZE / 2,
    position: 'relative',
  },
  
  innerHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: BUTTON_SIZE * 0.4,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  
  innerHighlightCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  checkmarkContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  
  checkmark: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.success,
    textAlign: 'center',
  },
  
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.success,
    borderRadius: BUTTON_SIZE / 2,
  },
  
  textContainer: {
    alignItems: 'center',
    maxWidth: width - Spacing.screenPadding * 2,
  },
  
  title: {
    color: Colors.label,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  
  subtitle: {
    textAlign: 'center',
  },
}); 