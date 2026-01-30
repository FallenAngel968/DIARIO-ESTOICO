// app/login.working.tsx
// 🔐 PANTALLA DE LOGIN QUE FUNCIONA CON FIREBASE WEB

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext.working';

export default function LoginWorkingScreen() {
  const { loginWithGoogle, loading, error } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      console.log('🔄 [LoginWorking] Iniciando login...');
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ [LoginWorking] Login exitoso');
        Alert.alert('¡Éxito!', 'Login exitoso con Google', [{ text: 'OK' }]);
      } else {
        console.log('❌ [LoginWorking] Login falló:', result.error);
        Alert.alert(
          'Error de Autenticación',
          result.error || 'No se pudo iniciar sesión con Google',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ [LoginWorking] Error inesperado:', error);
      Alert.alert(
        'Error',
        'Ocurrió un error inesperado. Por favor intenta de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTestNavigation = () => {
    console.log('🧪 [LoginWorking] Navegación de prueba');
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔥 Login Working</Text>
          <Text style={styles.subtitle}>
            Versión que funciona con Firebase Web Auth
          </Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>📋 Estado del Sistema:</Text>
          <Text style={styles.statusItem}>✅ Firebase configurado</Text>
          <Text style={styles.statusItem}>✅ Client ID: 999144177603-...</Text>
          <Text style={styles.statusItem}>✅ Auth Web disponible</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Google Button */}
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>🔍</Text>
                <Text style={styles.buttonText}>Login con Google (Web)</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Test Button */}
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={handleTestNavigation}
          >
            <Text style={styles.buttonText}>🧪 Ir a Home (Sin Auth)</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Autenticando con Firebase Web...</Text>
          </View>
        )}

        {/* Debug Info */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>🔍 Debug Info:</Text>
          <Text style={styles.debugText}>Platform: Web</Text>
          <Text style={styles.debugText}>Auth Method: Firebase Web</Text>
          <Text style={styles.debugText}>Domain: {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e7d32',
  },
  statusItem: {
    fontSize: 14,
    color: '#388e3c',
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  googleButton: {
    backgroundColor: '#4285f4',
  },
  testButton: {
    backgroundColor: '#ff9500',
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  debugContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 12,
    color: '#666',
  },
  debugText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
});