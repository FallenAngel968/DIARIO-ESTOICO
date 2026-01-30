// firebaseConfig.simple.js
// 🔥 CONFIGURACIÓN FIREBASE SÚPER SIMPLIFICADA - SIN WARNINGS

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnTYKaoGgnISEwFycL5BcM5JtbidgQzb0",
  authDomain: "diario-estoico-5225c.firebaseapp.com",
  projectId: "diario-estoico-5225c",
  storageBucket: "diario-estoico-5225c.firebasestorage.app",
  messagingSenderId: "792871192034",
  appId: "1:792871192034:web:75b72ef62b928bbfb325bb"
  // ❌ measurementId removido para evitar errores de Analytics
};

// Inicializar Firebase (evitar duplicados)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Solo Auth - SIN Analytics para evitar warnings
const auth = getAuth(app);

console.log('✅ Firebase inicializado (modo simple)');
console.log('📱 Auth configurado correctamente');

// Exportar solo lo necesario
export { auth };
export default app;