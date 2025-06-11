import { Platform } from 'react-native';

// Apple's 2025 Color System
export const Colors = {
  // System Colors (iOS 17+)
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemIndigo: '#5856D6',
  systemOrange: '#FF9500',
  systemPink: '#FF2D92',
  systemPurple: '#AF52DE',
  systemRed: '#FF3B30',
  systemTeal: '#5AC8FA',
  systemYellow: '#FFCC00',

  // Label Colors
  label: '#000000',
  secondaryLabel: '#3C3C43',
  tertiaryLabel: '#3C3C4399',
  quaternaryLabel: '#3C3C432E',

  // Background Colors  
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  
  // Grouped Background Colors
  systemGroupedBackground: '#F2F2F7',
  secondarySystemGroupedBackground: '#FFFFFF',
  tertiarySystemGroupedBackground: '#F2F2F7',

  // Fill Colors
  systemFill: '#78788033',
  secondarySystemFill: '#78788028',
  tertiarySystemFill: '#7676801E',
  quaternarySystemFill: '#74748014',

  // Separator Colors
  separator: '#3C3C4349',
  opaqueSeparator: '#C6C6C8',

  // Custom App Colors
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  
  // Gradients
  gradients: {
    primary: ['#007AFF', '#5856D6'] as const,
    success: ['#30D158', '#34C759'] as const,
    warm: ['#FF9500', '#FF2D92'] as const,
  }
};

// Typography System (SF Pro)
export const Typography = {
  // Large Titles
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    letterSpacing: 0.37,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  
  // Titles
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: 0.36,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.35,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600' as const,
    letterSpacing: 0.38,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },

  // Headlines
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.41,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },

  // Body
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
    letterSpacing: -0.41,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  bodyEmphasized: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.41,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },

  // Callout
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as const,
    letterSpacing: -0.32,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },

  // Subheadline  
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: -0.24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },

  // Footnote
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },

  // Caption
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.07,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
};

// Spacing System (Apple's 8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Semantic spacing
  cardPadding: 20,
  screenPadding: 20,
  sectionSpacing: 32,
  itemSpacing: 16,
};

// Border Radius System
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  
  // Semantic radius
  card: 16,
  button: 12,
  modal: 20,
};

// Shadow System
export const Shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: { elevation: 2 },
  }),
  
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),
  
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),
  
  button: Platform.select({
    ios: {
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: { elevation: 6 },
  }),
};

// Animation Presets
export const Animations = {
  spring: {
    damping: 15,
    stiffness: 300,
  },
  
  gentleSpring: {
    damping: 20,
    stiffness: 200,
  },
  
  snappySpring: {
    damping: 12,
    stiffness: 400,
  },
};

// Component Sizes
export const Sizes = {
  touchTarget: 44, // Apple's minimum touch target
  buttonHeight: 50,
  inputHeight: 48,
  tabBarHeight: 83,
  navBarHeight: 44,
}; 