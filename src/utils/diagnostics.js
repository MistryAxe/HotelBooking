import { Alert } from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

// Diagnostics utility to help debug common issues
export const runDiagnostics = () => {
  const issues = [];
  
  // Check theme constants
  if (!COLORS) issues.push('COLORS not defined in theme');
  if (!SIZES) issues.push('SIZES not defined in theme');
  if (!FONTS) issues.push('FONTS not defined in theme');
  if (!SHADOWS) issues.push('SHADOWS not defined in theme');
  
  // Check required colors
  const requiredColors = ['primary', 'background', 'text', 'textSecondary', 'white', 'gray', 'lightGray'];
  requiredColors.forEach(color => {
    if (!COLORS[color]) issues.push(`COLORS.${color} not defined`);
  });
  
  // Check required sizes
  const requiredSizes = ['padding', 'base', 'radius', 'h1', 'h3', 'body1', 'body2', 'body3', 'cardRadius'];
  requiredSizes.forEach(size => {
    if (!SIZES[size]) issues.push(`SIZES.${size} not defined`);
  });
  
  // Check required shadows
  const requiredShadows = ['light', 'medium'];
  requiredShadows.forEach(shadow => {
    if (!SHADOWS[shadow]) issues.push(`SHADOWS.${shadow} not defined`);
  });
  
  if (issues.length > 0) {
    console.warn('Theme issues found:', issues);
    Alert.alert(
      'Theme Issues Detected',
      `Found ${issues.length} issues:\n${issues.slice(0, 5).join('\n')}${issues.length > 5 ? '\n...and more' : ''}`,
      [{ text: 'OK' }]
    );
    return false;
  }
  
  console.log('✅ All theme diagnostics passed!');
  return true;
};

// Check network connectivity (for image loading)
export const checkNetworkImages = async () => {
  const testImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    'https://via.placeholder.com/300x200'
  ];
  
  try {
    const promises = testImages.map(url => 
      fetch(url, { method: 'HEAD' })
        .then(response => ({ url, success: response.ok }))
        .catch(() => ({ url, success: false }))
    );
    
    const results = await Promise.all(promises);
    const failedImages = results.filter(result => !result.success);
    
    if (failedImages.length > 0) {
      console.warn('Network image issues:', failedImages);
      return false;
    }
    
    console.log('✅ Network images accessible!');
    return true;
  } catch (error) {
    console.error('Network check failed:', error);
    return false;
  }
};

// Log device and environment info
export const logEnvironmentInfo = () => {
  const info = {
    platform: require('react-native').Platform.OS,
    version: require('react-native').Platform.Version,
    timestamp: new Date().toISOString()
  };
  
  console.log('📱 Environment Info:', info);
  return info;
};

// Complete diagnostics runner
export const runCompleteCheck = async () => {
  console.log('🔍 Running complete diagnostics...');
  
  logEnvironmentInfo();
  const themeCheck = runDiagnostics();
  const networkCheck = await checkNetworkImages();
  
  const allPassed = themeCheck && networkCheck;
  
  if (allPassed) {
    console.log('🎉 All diagnostics passed! App should work correctly.');
  } else {
    console.warn('⚠️ Some diagnostics failed. Check the issues above.');
  }
  
  return allPassed;
};