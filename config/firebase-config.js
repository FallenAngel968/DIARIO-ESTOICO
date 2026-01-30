import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnTYKaoGgnISEwFycL5BcM5JtbidgQzb0",
  authDomain: "diario-estoico-5225c.firebaseapp.com",
  projectId: "diario-estoico-5225c",
  storageBucket: "diario-estoico-5225c.firebasestorage.app",
  messagingSenderId: "792871192034",
  appId: "1:792871192034:web:75b72ef62b928bbfb325bb",
  measurementId: "G-18PPPSHRZL"
};

// Inicializar Firebase (evitar duplicados - CRÍTICO)
let app;
try {
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App inicializado');
  } else {
    app = getApp();
    console.log('✅ Firebase App ya existía, usando instancia existente');
  }
} catch (error) {
  console.error('Error inicializando Firebase:', error);
  throw error;
}

// Inicializar Auth
let auth;
try {
  // Usar initializeAuth con AsyncStorage para React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('✅ Firebase Auth inicializado con persistencia AsyncStorage');
} catch (error) {
  // Si ya fue inicializado, obtener la instancia existente
  auth = getAuth(app);
  console.log('✅ Firebase Auth ya estaba inicializado');
}

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Analytics solo en web y si es soportado
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics inicializado');
      }
    })
    .catch(() => {
      // Analytics no disponible, es normal
    });
}

export { analytics, app, auth, db };

