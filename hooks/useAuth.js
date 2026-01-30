// hooks/useAuth.js
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
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

  // Facebook Sign-In
  const signInWithFacebook = async () => {
    setLoading(true);
    setError(null);
    try {
      Alert.alert('Facebook Sign-In', 'Redirigiendo a Facebook para autenticar...');
      // En producción, necesitarás configurar Facebook OAuth correctamente
      return { success: false, error: 'Facebook Sign-In no configurado aún' };
    } catch (error) {
      const errorMsg = error.message || 'Error con Facebook Sign-In';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
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