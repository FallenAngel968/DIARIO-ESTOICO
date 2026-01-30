// app/login.simple.tsx
// 🔐 PANTALLA DE LOGIN SIMPLIFICADA Y FUNCIONAL

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext.simple';

export default function LoginSimpleScreen() {
  const { loginWithGoogle, loading, error } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      console.log('🔄 LoginScreen: Usuario presionó botón de Google');
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ LoginScreen: Login exitoso, el contexto manejará la navegación');
        // El AuthContext ya maneja la navegación a /(tabs)
      } else {
        console.log('❌ LoginScreen: Login falló:', result.error);
        Alert.alert(
          'Error de Autenticación',
          result.error || 'No se pudo iniciar sesión con Google',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ LoginScreen: Error inesperado:', error);
      Alert.alert(
        'Error',
        'Ocurrió un error inesperado. Por favor intenta de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTestNavigation = () => {
    // Para probar navegación sin autenticación
    console.log('🧪 LoginScreen: Navegación de prueba');
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Diario Estoico</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para comenzar tu práctica estoica
          </Text>
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
                <Text style={styles.buttonText}>Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Test Button (Development only) */}
          {__DEV__ && (
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={handleTestNavigation}
            >
              <Text style={styles.buttonText}>🧪 Navegación de Prueba</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Autenticando...</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Al continuar, aceptas nuestros términos y condiciones
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  googleButton: {
    backgroundColor: '#4285f4',
    shadowColor: '#4285f4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  testButton: {
    backgroundColor: '#ff9500',
    shadowColor: '#ff9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});