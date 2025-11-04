import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sign up new user
export const signUpUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false
    });

    await AsyncStorage.setItem('isNewUser', 'true');

    return { success: true, user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
};

// Sign in existing user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const hasCompletedOnboarding = userDoc.data()?.hasCompletedOnboarding || false;
    
    await AsyncStorage.setItem('hasCompletedOnboarding', hasCompletedOnboarding.toString());
    
    return { success: true, user: userCredential.user, hasCompletedOnboarding };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.multiRemove(['hasCompletedOnboarding', 'isNewUser']);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
};

// Update user profile
export const updateUserProfile = async (uid, updates) => {
  try {
    await updateDoc(doc(db, 'users', uid), updates);
    
    if (updates.name && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: updates.name });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
};

// Mark onboarding as completed
export const completeOnboarding = async (uid) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      hasCompletedOnboarding: true
    });
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    await AsyncStorage.removeItem('isNewUser');
    return { success: true };
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return { success: false, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Get user profile error:', error);
    return { success: false, error: error.message };
  }
};

// Auth state listener
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Helper: Get user-friendly error messages
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    default:
      return 'An error occurred. Please try again';
  }
};
