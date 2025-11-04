export const COLORS = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  secondary: '#FF9800',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  accent: '#03DAC6',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#EEEEEE',
  darkGray: '#424242',
  transparent: 'transparent',
  
  // Additional colors for hotel app
  gold: '#FFD700',
  rating: '#FFC107',
  cardShadow: 'rgba(0,0,0,0.1)',
  overlay: 'rgba(0,0,0,0.5)'
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 8,
  padding: 16,
  margin: 16,

  // Font sizes
  largeTitle: 32,
  h1: 24,
  h2: 20,
  h3: 18,
  h4: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  caption: 10,

  // App dimensions
  width: 375,
  height: 812,
  
  // Specific sizes
  buttonHeight: 48,
  inputHeight: 48,
  cardRadius: 12,
  imageRadius: 8
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semiBold: 'System'
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  heavy: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8
  }
};

const appTheme = { COLORS, SIZES, FONTS, SHADOWS };

export default appTheme;