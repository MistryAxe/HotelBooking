import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4BsYQ3Wp2MqHukDzvc5w9wkwlWe1Tq_0",
  authDomain: "hotel-booking-app-7619f.firebaseapp.com",
  projectId: "hotel-booking-app-7619f",
  storageBucket: "hotel-booking-app-7619f.firebasestorage.app",
  messagingSenderId: "67672003985",
  appId: "1:67672003985:web:696c4edabddaba84d77630",
  measurementId: "G-FLWBGEJWL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;