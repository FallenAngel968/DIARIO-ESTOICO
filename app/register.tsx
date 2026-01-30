import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { register } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa una contraseña');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const result = await register(email, password, displayName);
      
      if (result.success) {
        Alert.alert('Éxito', 'Cuenta creada exitosamente', [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]);
      } else {
        Alert.alert('Error de registro', result.error || 'Error desconocido');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Back Button - Solo si hay pantalla anterior */}
        {/* (En el flujo normal, registro es la primera pantalla) */}

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Crear Cuenta</ThemedText>
          <ThemedText style={styles.subtitle}>
            Únete a la comunidad de pensadores estoicos
          </ThemedText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Nombre (opcional)</ThemedText>
            <View style={[styles.inputContainer, { borderColor: colors.tabIconDefault }]}>
              <Ionicons name="person-outline" size={20} color={colors.tabIconDefault} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Tu nombre"
                placeholderTextColor={colors.tabIconDefault}
                value={displayName}
                onChangeText={setDisplayName}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={[styles.inputContainer, { borderColor: colors.tabIconDefault }]}>
              <Ionicons name="mail-outline" size={20} color={colors.tabIconDefault} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="tu@email.com"
                placeholderTextColor={colors.tabIconDefault}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Contraseña</ThemedText>
            <View style={[styles.inputContainer, { borderColor: colors.tabIconDefault }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.tabIconDefault} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.tabIconDefault}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Confirmar Contraseña</ThemedText>
            <View style={[styles.inputContainer, { borderColor: colors.tabIconDefault }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.tabIconDefault} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.tabIconDefault}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: colors.tint }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.registerButtonText}>Crear Cuenta</ThemedText>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginLink}>
            <ThemedText style={styles.loginLinkText}>¿Ya tienes cuenta? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <ThemedText style={[styles.loginLinkText, { color: colors.tint }]}>
                Inicia sesión
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  form: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  registerButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
  },
});
