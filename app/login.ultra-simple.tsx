// app/login.ultra-simple.tsx
// 🔥 LOGIN ULTRA SIMPLE - MÁXIMA COMPATIBILIDAD

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig.simple';

export default function LoginUltraSimple() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      console.log('🔄 [Ultra-Simple] Iniciando Google Auth...');
      
      // Método más directo posible
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('✅ [Ultra-Simple] Login exitoso:', result.user.email);
      
      Alert.alert(
        '¡Éxito!', 
        `Bienvenido ${result.user.displayName || result.user.email}`,
        [{ text: 'OK' }]
      );
      
    } catch (error: any) {
      console.error('❌ [Ultra-Simple] Error:', error);
      
      let errorMessage = 'Error desconocido';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Login cancelado por el usuario';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'Dominio no autorizado en Google Console';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqueado por el navegador';
          break;
        default:
          errorMessage = `Error: ${error.message || 'Error desconocido'}`;
      }
      
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Login Ultra Simple</Text>
      <Text style={styles.subtitle}>Método más directo posible</Text>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '⏳ Autenticando...' : '🔍 Login con Google'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>📋 Configuración:</Text>
        <Text style={styles.infoText}>✅ Firebase Simple Config</Text>
        <Text style={styles.infoText}>✅ signInWithPopup directo</Text>
        <Text style={styles.infoText}>✅ Sin dependencias extras</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5,
  },
});