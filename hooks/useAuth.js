// hooks/useAuth.js

import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../config/firebase-config';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription
  }, []);

  // Función para registrar usuario con email
  const register = async (email, password, displayName = '') => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre si se proporciona
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      setUser(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      const errorMsg = error.message || 'Error registrando usuario';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión con email
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      const errorMsg = error.message || 'Error iniciando sesión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // En Expo, usamos un método simplificado
      Alert.alert('Google Sign-In', 'Redirigiendo a Google para autenticar...');
      // En producción, necesitarás configurar Google OAuth correctamente
      // por ahora es un placeholder
      return { success: false, error: 'Google Sign-In no configurado aún' };
    } catch (error) {
      const errorMsg = error.message || 'Error con Google Sign-In';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Facebook Sign-In usando OAuth Flow
  const signInWithFacebook = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📱 Iniciando Facebook OAuth flow');

      const facebookAppId = '1844602839820714';
      const redirectUrl = 'https://diario-estoico-5225c.firebaseapp.com/__/auth/handler';

      // Construir URL de Facebook OAuth
      const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=token&scope=public_profile,email`;

      // Abrir en navegador
      const result = await WebBrowser.openAuthSessionAsync(
        facebookAuthUrl,
        redirectUrl
      );

      console.log('📱 Resultado de OAuth:', result.type);

      if (result.type === 'cancel') {
        const errorMsg = 'Login de Facebook cancelado';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }

      if (result.type === 'success') {
        // Extraer token de la URL
        const url = new URL(result.url);
        const accessToken = url.hash.split('access_token=')[1]?.split('&')[0];

        if (!accessToken) {
          throw new Error('No se pudo obtener el token de Facebook');
        }

        console.log('🔐 Token obtenido de Facebook');

        // Crear credencial de Firebase
        const credential = FacebookAuthProvider.credential(accessToken);

        // Autenticar con Firebase
        const userCredential = await signInWithCredential(auth, credential);
        console.log('✅ Usuario autenticado en Firebase');

        // Obtener datos del usuario de Facebook
        if (!userCredential.user.displayName) {
          try {
            const response = await fetch(
              `https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`
            );
            const data = await response.json();

            if (data.name) {
              await updateProfile(userCredential.user, {
                displayName: data.name,
              });
              console.log('👤 Perfil actualizado');
            }
          } catch (e) {
            console.log('⚠️ Error actualizando perfil:', e);
          }
        }

        setUser(userCredential.user);
        setLoading(false);
        return { success: true, user: userCredential.user };
      }

      throw new Error('Error desconocido en Facebook OAuth');
    } catch (error) {
      const errorMsg = error.message || 'Error con Facebook Sign-In';
      console.error('❌ Error en Facebook:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Apple Sign-In (iOS)
  const signInWithApple = async () => {
    setLoading(true);
    setError(null);
    try {
      Alert.alert('Apple Sign-In', 'Abriendo Apple Authentication...');
      // En producción, necesitarás configurar Apple OAuth correctamente
      return { success: false, error: 'Apple Sign-In no configurado aún' };
    } catch (error) {
      const errorMsg = error.message || 'Error con Apple Sign-In';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      const errorMsg = error.message || 'Error cerrando sesión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el usuario actual
  const getCurrentUser = () => {
    return auth.currentUser;
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getCurrentUser,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    isAuthenticated: !!user
  };
};