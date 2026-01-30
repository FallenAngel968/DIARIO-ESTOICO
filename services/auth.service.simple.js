// services/auth.service.simple.js
// 🚀 SERVICIO DE AUTENTICACIÓN SIMPLIFICADO QUE FUNCIONA

import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { auth } from '../firebaseConfig';
import { GOOGLE_OAUTH_CONFIG } from '../config/google-oauth.config';

// ✅ Google Sign In - FUNCIONAL
export const signInWithGoogle = async () => {
  try {
    console.log('🔄 Iniciando Google Sign In...');
    console.log('📋 Client ID:', GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID);
    
    // Crear la configuración de Google Auth
    const config = {
      clientId: GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'diario-estoico'
      }),
    };
    
    console.log('📋 Configuración:', config);
    
    // Usar el hook de Google
    const [request, response, promptAsync] = Google.useAuthRequest(config);
    
    console.log('🔄 Solicitando autenticación...');
    const result = await promptAsync();
    
    console.log('📋 Resultado:', result);
    
    if (result?.type === 'success') {
      console.log('✅ Google auth exitoso');
      const { id_token, access_token } = result.params;
      
      if (id_token) {
        // Crear credencial de Firebase
        const credential = GoogleAuthProvider.credential(id_token, access_token);
        
        console.log('🔄 Autenticando con Firebase...');
        const userCredential = await signInWithCredential(auth, credential);
        
        console.log('✅ Firebase auth exitoso:', userCredential.user.email);
        return { 
          success: true, 
          user: userCredential.user,
          message: 'Login exitoso con Google' 
        };
      } else {
        console.log('❌ No se recibió id_token');
        return { 
          success: false, 
          error: 'No se recibió token de autenticación' 
        };
      }
    } else if (result?.type === 'cancel') {
      console.log('❌ Usuario canceló la autenticación');
      return { 
        success: false, 
        error: 'Autenticación cancelada por el usuario' 
      };
    } else {
      console.log('❌ Error en la autenticación:', result);
      return { 
        success: false, 
        error: result?.error?.message || 'Error desconocido en la autenticación' 
      };
    }
    
  } catch (error) {
    console.error('❌ Error completo en Google Sign In:', error);
    return { 
      success: false, 
      error: `Error: ${error.message}` 
    };
  }
};

// 🚪 Logout
export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log('✅ Logout exitoso');
    return { success: true };
  } catch (error) {
    console.error('❌ Error en logout:', error);
    return { success: false, error: error.message };
  }
};

// 👤 Obtener usuario actual
export const getCurrentUser = () => {
  return auth.currentUser;
};

// 🔍 Verificar estado de autenticación
export const isUserAuthenticated = () => {
  return !!auth.currentUser;
};