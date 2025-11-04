export const COLORS = {
  // Primary colors
  primary: '#1E90FF',      // Dodger Blue
  primaryDark: '#1873CC',
  primaryLight: '#4FA3FF',
  
  // Secondary colors
  secondary: '#FF6B6B',
  secondaryDark: '#EE5A52',
  secondaryLight: '#FF8787',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  lightGray: '#D3D3D3',
  darkGray: '#4A4A4A',
  background: '#F5F5F5',
  
  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  
  // UI colors
  border: '#E0E0E0',
  divider: '#BDBDBD',
  disabled: '#9E9E9E',
  
  // Transparency
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
};

export const SIZES = {
  // App dimensions
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,
  margin: 16,
  
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 14,
  caption: 12,
  small: 10,
  
  // Icon sizes
  icon: 24,
  iconSmall: 16,
  iconLarge: 32,
  
  // Button sizes
  buttonHeight: 50,
  buttonHeightSmall: 40,
  
  // Input sizes
  inputHeight: 50,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  
  h1: { fontSize: SIZES.h1, fontWeight: 'bold' },
  h2: { fontSize: SIZES.h2, fontWeight: 'bold' },
  h3: { fontSize: SIZES.h3, fontWeight: 'bold' },
  h4: { fontSize: SIZES.h4, fontWeight: 'bold' },
  h5: { fontSize: SIZES.h5, fontWeight: '600' },
  h6: { fontSize: SIZES.h6, fontWeight: '600' },
  body: { fontSize: SIZES.body, fontWeight: 'normal' },
  caption: { fontSize: SIZES.caption, fontWeight: 'normal' },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

const theme = { COLORS, SIZES, FONTS, SHADOWS };

export default theme;
