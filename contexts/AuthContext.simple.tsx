// contexts/AuthContext.simple.tsx
// 🔥 CONTEXTO DE AUTENTICACIÓN SIMPLIFICADO Y FUNCIONAL

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../firebaseConfig';
import { signInWithGoogle, signOutUser } from '../services/auth.service.simple';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 👂 Escuchar cambios de autenticación
  useEffect(() => {
    console.log('🔄 AuthProvider: Configurando listener de autenticación...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔄 AuthProvider: Estado de auth cambió:', firebaseUser?.email || 'No user');
      
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        console.log('✅ AuthProvider: Usuario autenticado:', userData.email);
      } else {
        setUser(null);
        console.log('❌ AuthProvider: Usuario no autenticado');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔐 Login con Google
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 AuthProvider: Iniciando login con Google...');
      const result = await signInWithGoogle();
      
      if (result.success) {
        console.log('✅ AuthProvider: Login exitoso, redirigiendo...');
        // El onAuthStateChanged se encargará de actualizar el usuario
        router.push('/(tabs)');
        return { success: true, user: result.user };
      } else {
        console.log('❌ AuthProvider: Login falló:', result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error inesperado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 AuthProvider: Cerrando sesión...');
      const result = await signOutUser();
      
      if (result.success) {
        console.log('✅ AuthProvider: Logout exitoso, redirigiendo...');
        // El onAuthStateChanged se encargará de limpiar el usuario
        router.push('/login');
        return { success: true };
      } else {
        console.log('❌ AuthProvider: Logout falló:', result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error en logout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};