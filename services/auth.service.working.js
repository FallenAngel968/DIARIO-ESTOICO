// services/auth.service.working.js
// 🚀 SERVICIO DE AUTENTICACIÓN QUE REALMENTE FUNCIONA

import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig.simple';

// 🔑 Tu Client ID real
const GOOGLE_CLIENT_ID = '999144177603-4kv7o6rkr6iqcvmea3mpf4jmr86d1qj0.apps.googleusercontent.com';

// ✅ Google Sign In con enfoque directo
export const signInWithGoogle = async () => {
  try {
    console.log('🔄 [Auth] Iniciando Google Sign In...');
    console.log('📋 [Auth] Client ID:', GOOGLE_CLIENT_ID);
    
    // Crear provider de Google
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('🔄 [Auth] Creando popup de Google...');
    
    // Usar signInWithPopup directamente
    const result = await signInWithPopup(auth, provider);
    
    console.log('✅ [Auth] Google popup exitoso');
    console.log('📧 [Auth] Usuario:', result.user.email);
    
    return { 
      success: true, 
      user: result.user,
      message: 'Login exitoso con Google' 
    };
    
  } catch (error) {
    console.error('❌ [Auth] Error detallado:', error);
    console.error('❌ [Auth] Error code:', error.code);
    console.error('❌ [Auth] Error message:', error.message);
    
    // Manejo de errores específicos
    if (error.code === 'auth/popup-closed-by-user') {
      return { 
        success: false, 
        error: 'Login cancelado - Popup cerrado por el usuario' 
      };
    }
    
    if (error.code === 'auth/unauthorized-domain') {
      return { 
        success: false, 
        error: 'Dominio no autorizado - Verifica Google Console' 
      };
    }
    
    if (error.code === 'auth/popup-blocked') {
      return { 
        success: false, 
        error: 'Popup bloqueado - Permite popups en tu navegador' 
      };
    }
    
    return { 
      success: false, 
      error: `Error de Google Auth: ${error.message}` 
    };
  }
};

// 🚪 Logout
export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log('✅ [Auth] Logout exitoso');
    return { success: true };
  } catch (error) {
    console.error('❌ [Auth] Error en logout:', error);
    return { success: false, error: error.message };
  }
};

// 👤 Usuario actual
export const getCurrentUser = () => auth.currentUser;

// 🔍 Estado de autenticación
export const isUserAuthenticated = () => !!auth.currentUser;