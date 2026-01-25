import { TextStyle } from 'react-native';
// Text
export const typography = {
  display: {
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 40,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 28,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
};

// Depthhhh
export const elevation = {
  level0: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  level1: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  level2: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  level3: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  level4: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  level5: {
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
};

// COLORS

export const colors = {
  primary: '#2E7D32',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',

  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  textMuted: '#9CA3AF',
  textWhite: '#F9FAFB',

  // Background colors
  bgPrimary: '#fbfbfb',
  bgSecondary: '#f5f5f5',
  bgTertiary: '#fafafa',

  // Border colors
  borderLight: '#f0f0f0',
  borderMedium: '#ddd',
  borderDark: '#ccc',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// SPACING

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// TOUCH TARGETS

export const touchTarget = {
  minimum: 44,
  comfortable: 48,
  large: 56,
};


export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 30,
  circle: 9999,
};

// GRADIENTS

export const gradients = {
  blueRedHorizontal: {
    colors: ['#007bff', '#dc3545'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  }
};
