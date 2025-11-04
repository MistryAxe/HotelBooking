import React, { createContext, useState, useEffect, useContext } from 'react';
import { subscribeToAuthChanges } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const newUserFlag = await AsyncStorage.getItem('isNewUser');
        const onboardingFlag = await AsyncStorage.getItem('hasCompletedOnboarding');
        
        setIsNewUser(newUserFlag === 'true');
        setHasCompletedOnboarding(onboardingFlag === 'true');
      } else {
        setIsNewUser(false);
        setHasCompletedOnboarding(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isNewUser,
    hasCompletedOnboarding,
    setIsNewUser,
    setHasCompletedOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
