// Ejemplo de configuración para Firebase
// Copia este archivo como firebase-config.js y actualiza con tus credenciales

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase (obtener de Firebase Console)
const firebaseConfig = {
  // Reemplaza estos valores con los de tu proyecto Firebase
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Para obtener estas credenciales:
// 1. Ve a https://console.firebase.google.com/
// 2. Selecciona tu proyecto o crea uno nuevo
// 3. Ve a "Configuración del proyecto" (ícono de engrane)
// 4. En la pestaña "General", baja hasta "Tus apps"
// 5. Si no tienes una app web, haz clic en "Agregar app" y selecciona el ícono web (</>)
// 6. Copia la configuración que aparece

// Configuración adicional necesaria:

// GOOGLE SIGN-IN
// Client IDs (obtener de Google Cloud Console)
export const GOOGLE_CLIENT_IDS = {
  ios: "123456789-abcdefghijklmnop.apps.googleusercontent.com",
  android: "123456789-qrstuvwxyz.apps.googleusercontent.com", 
  web: "123456789-1234567890.apps.googleusercontent.com"
};

// Para obtener los Client IDs de Google:
// 1. Ve a https://console.cloud.google.com/
// 2. Selecciona tu proyecto o crea uno nuevo
// 3. Ve a "APIs y servicios" > "Credenciales"
// 4. Crea credenciales OAuth 2.0 para cada plataforma

// FACEBOOK LOGIN
// App ID (obtener de Facebook Developers)
export const FACEBOOK_APP_ID = "1234567890123456";

// Para obtener el App ID de Facebook:
// 1. Ve a https://developers.facebook.com/
// 2. Crea una nueva app o selecciona una existente
// 3. Ve a "Configuración" > "Básica"
// 4. Copia el "ID de la app"

// URL SCHEME
// Scheme personalizado para tu app (debe coincidir con app.json)
export const APP_SCHEME = "diario-estoico";

// Para configurar el URL scheme:
// 1. Actualiza app.json con: "scheme": "tu-app-scheme"
// 2. El scheme debe ser único y en minúsculas

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);
export default app;
