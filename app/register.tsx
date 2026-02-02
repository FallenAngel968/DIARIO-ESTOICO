import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/hooks/useAuth';


const { width } = Dimensions.get('window');

// Paleta de Identidad NOUS
const NOUS_COLORS = {
  black: '#0B0B0B',
  gold: '#D4AF37',
  blue: '#7FB7D8',
  card: '#161616',
  border: '#2A2A2A',
  white: '#FFFFFF',
  muted: '#666666',
};

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para el Modal Personalizado
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', isSuccess: false });

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();

  const showAlert = (title: string, message: string, isSuccess = false) => {
    setAlertConfig({ visible: true, title, message, isSuccess });
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Atención', 'La mente clara requiere datos completos.');
      return false;
    }
    if (password !== confirmPassword) {
      showAlert('Discordancia', 'Las contraseñas no coinciden. Busca la armonía.');
      return false;
    }
    if (password.length < 6) {
      showAlert('Fortaleza', 'Tu contraseña debe ser más fuerte (mínimo 6 caracteres).');
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
        showAlert('Éxito', 'Tu camino en NOUS ha comenzado.', true);
      } else {
        showAlert('Error', result.error || 'No pudimos crear tu espacio.');
      }
    } catch (error: any) {
      showAlert('Error', error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers de Social Login
  const handleSocialSignIn = async (method: () => Promise<any>, name: string) => {
    try {
      setIsLoading(true);
      const result = await method();
      
      if (result.success) {
        showAlert('Éxito', `Bienvenido a NOUS, ${name === 'Facebook' ? 'desde Facebook' : name}`, true);
        // La navegación ocurre en el onPress del botón del modal
      } else {
        showAlert('Error', result.error || `No se pudo conectar con ${name}`);
      }
    } catch (error: any) {
      showAlert('Error', `Error inesperado: ${error.message || name}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: NOUS_COLORS.black }]}>
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header con Logo */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.minimalBack}>
              <Ionicons name="chevron-back" size={24} color={NOUS_COLORS.gold} />
            </TouchableOpacity>
            
            <Image 
              source={require('../assets/images/logoDiarioEstoico.jpg')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.title}>UNIRSE A NOUS</ThemedText>
            <ThemedText style={styles.subtitle}>Comienza tu viaje hacia el autocontrol</ThemedText>
          </View>

          {/* Social Registration */}
          <View style={styles.socialGroup}>
            <SocialButton
              icon="logo-google"
              title="Google"
              onPress={() => handleSocialSignIn(signInWithGoogle, 'Google')}
            />
            <SocialButton
              icon="logo-facebook"
              title="Facebook"
              onPress={() => handleSocialSignIn(signInWithFacebook, 'Facebook')}
            />
            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={4}
                style={styles.appleButton}
                onPress={() => handleSocialSignIn(signInWithApple, 'Apple')}
              />
            )}
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>O REGÍSTRATE CON EMAIL</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Formulario de Email */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>NOMBRE DE DISCÍPULO</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Marco Aurelio"
                placeholderTextColor="#333"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>CORREO ELECTRÓNICO</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="tu@reflexion.com"
                placeholderTextColor="#333"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>CONTRASEÑA</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#333"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>CONFIRMAR CONTRASEÑA</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#333"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: NOUS_COLORS.gold }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color={NOUS_COLORS.black} /> : 
              <ThemedText style={styles.primaryButtonText}>CREAR CUENTA</ThemedText>}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>¿Ya tienes una cuenta?</ThemedText>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <ThemedText style={styles.footerLink}>INICIAR SESIÓN</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* MODAL DE ALERTAS PERSONALIZADO */}
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons 
              name={alertConfig.isSuccess ? "checkmark-circle-outline" : "alert-circle-outline"} 
              size={40} 
              color={alertConfig.isSuccess ? NOUS_COLORS.blue : NOUS_COLORS.gold} 
            />
            <ThemedText style={styles.modalTitle}>{alertConfig.title}</ThemedText>
            <ThemedText style={styles.modalMessage}>{alertConfig.message}</ThemedText>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: alertConfig.isSuccess ? NOUS_COLORS.blue : NOUS_COLORS.gold }]}
              onPress={() => {
                setAlertConfig({ ...alertConfig, visible: false });
                if (alertConfig.isSuccess && alertConfig.title === 'Éxito') {
                  // Si es exitoso y dice "Éxito", navega a tabs
                  router.replace('/(tabs)');
                }
              }}
            >
              <ThemedText style={styles.modalCloseButtonText}>CONTINUAR</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Sub-componente Botón Social
function SocialButton({ icon, title, onPress }: any) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        { opacity: pressed ? 0.6 : 1 }
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color={NOUS_COLORS.white} />
      <ThemedText style={styles.socialButtonText}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingBottom: 60 },
  
  // Header
  header: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  minimalBack: { alignSelf: 'flex-start', padding: 10, marginLeft: -15 },
  logoImage: { width: 80, height: 80, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '200', color: NOUS_COLORS.gold, letterSpacing: 8 },
  subtitle: { fontSize: 12, color: NOUS_COLORS.white, opacity: 0.5, letterSpacing: 1, marginTop: 5 },

  // Social
  socialGroup: { flexDirection: 'column', gap: 12, marginBottom: 30 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: NOUS_COLORS.border,
    gap: 10,
  },
  socialButtonText: { fontSize: 13, fontWeight: '500', color: NOUS_COLORS.white, letterSpacing: 1 },
  appleButton: { height: 50 },

  // Divider
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: NOUS_COLORS.border },
  dividerText: { fontSize: 9, color: NOUS_COLORS.muted, letterSpacing: 2 },

  // Form
  form: { gap: 20 },
  inputGroup: { marginBottom: 5 },
  label: { fontSize: 9, color: NOUS_COLORS.gold, letterSpacing: 2, marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: NOUS_COLORS.border,
    color: NOUS_COLORS.white,
    paddingVertical: 10,
    fontSize: 16,
  },
  primaryButton: { height: 55, justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginTop: 15 },
  primaryButtonText: { color: NOUS_COLORS.black, fontWeight: '700', letterSpacing: 2, fontSize: 13 },

  // Footer
  footer: { marginTop: 40, alignItems: 'center', gap: 10 },
  footerText: { color: NOUS_COLORS.muted, fontSize: 13 },
  footerLink: { color: NOUS_COLORS.blue, fontWeight: '700', fontSize: 12, letterSpacing: 2 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { 
    width: width * 0.85, 
    backgroundColor: NOUS_COLORS.card, 
    borderRadius: 12, 
    padding: 30, 
    borderWidth: 1, 
    borderColor: NOUS_COLORS.border,
    alignItems: 'center'
  },
  modalTitle: { color: NOUS_COLORS.white, fontSize: 18, fontWeight: '700', marginTop: 15, letterSpacing: 1 },
  modalMessage: { color: NOUS_COLORS.white, textAlign: 'center', opacity: 0.7, lineHeight: 22, marginVertical: 20 },
  modalCloseButton: { width: '100%', paddingVertical: 15, alignItems: 'center', borderRadius: 4 },
  modalCloseButtonText: { color: NOUS_COLORS.black, fontWeight: '800', letterSpacing: 2 }
});