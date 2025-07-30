import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthTestScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando estado de autenticación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Autenticación</Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.label}>✅ Usuario autenticado</Text>
          <Text>UID: {user.uid}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Nombre: {user.displayName || 'No disponible'}</Text>
          <Text>Proveedor: {user.providerData[0]?.providerId || 'No disponible'}</Text>
        </View>
      ) : (
        <View style={styles.userInfo}>
          <Text style={styles.label}>❌ Usuario NO autenticado</Text>
          <Text>Deberías ser redirigido a /login</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});
