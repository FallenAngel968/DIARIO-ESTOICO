import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  React.useEffect(() => {
    if (!isLoading) {
      const currentPath = segments.join('/');
      const inAuthFlow = currentPath === 'login' || currentPath === 'register';
      
      if (!user && !inAuthFlow) {
        // Usuario no autenticado y no está en login/registro - mostrar registro
        router.replace('/register');
      } else if (user && inAuthFlow) {
        // Usuario autenticado pero está en login/registro - ir a tabs
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, segments, router]);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Verificando autenticación...</Text>
      </View>
    );
  }

  // Si no hay usuario y está en una página protegida, mostrar spinner mientras redirige
  const currentPath = segments.join('/');
  const inAuthFlow = currentPath === 'login' || currentPath === 'register';
  if (!user && !inAuthFlow) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Redirigiendo...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
