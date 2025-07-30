import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

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
      const inLoginPage = currentPath === 'login';
      
      if (!user && !inLoginPage) {
        // Usuario no autenticado y no está en la página de login
        router.replace('/login');
      } else if (user && inLoginPage) {
        // Usuario autenticado pero está en la página de login
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
  const inLoginPage = currentPath === 'login';
  if (!user && !inLoginPage) {
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
