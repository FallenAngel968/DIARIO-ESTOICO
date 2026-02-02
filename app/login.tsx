import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
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

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para el Modal Personalizado
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '' });

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithFacebook, signInWithApple, login } = useAuth();

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Atención', 'La disciplina requiere orden. Completa todos los campos.');
      return;
    }
    try {
      setIsLoading(true);
      const result = await login(email, password);
      if (result.success) router.replace('/(tabs)');
      else showAlert('Error', result.error || 'No se pudo validar tu entrada.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers de Social Login (Manteniendo tu lógica)
  const handleSocialSignIn = async (method: () => Promise<any>, name: string) => {
    try {
      setIsLoading(true);
      await method();
      router.replace('/(tabs)');
    } catch (error: any) {
      showAlert('Error', error.message || `Error al iniciar con ${name}`);
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
          {/* Logo Section - Identidad NOUS */}
          <View style={styles.logoSection}>
            <Image 
              source={require('../assets/images/logoDiarioEstoico.jpg')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.brandName}>NOUS</ThemedText>
            <View style={styles.divider} />
            <ThemedText style={styles.tagline}>
              DOMINA TU MENTE, POSEE TU DESTINO
            </ThemedText>
          </View>

          {!showEmailForm ? (
            <View style={styles.mainContent}>
              {/* Social Section */}
              <View style={styles.buttonContainer}>
                <LoginButton
                  icon="logo-google"
                  title="Google"
                  onPress={() => handleSocialSignIn(signInWithGoogle, 'Google')}
                  disabled={isLoading}
                />
                <LoginButton
                  icon="logo-facebook"
                  title="Facebook"
                  onPress={() => handleSocialSignIn(signInWithFacebook, 'Facebook')}
                  disabled={isLoading}
                />
                
                {Platform.OS === 'ios' && (
                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={4}
                    style={styles.appleButton}
                    onPress={() => handleSocialSignIn(signInWithApple, 'Apple')}
                  />
                )}

                <TouchableOpacity
                  style={styles.emailToggle}
                  onPress={() => setShowEmailForm(true)}
                  disabled={isLoading}
                >
                  <Ionicons name="mail-outline" size={18} color={NOUS_COLORS.blue} />
                  <ThemedText style={styles.emailToggleText}>Continuar con Email</ThemedText>
                </TouchableOpacity>
              </View>

                {/* */}

              {/* Benefits (Optimizado visualmente) */}
              <View style={styles.benefitsGrid}>
                <BenefitItem icon="leaf-outline" text="Reflexión" />
                <BenefitItem icon="shield-checkmark-outline" text="Control" />
                <BenefitItem icon="compass-outline" text="Propósito" />
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowEmailForm(false)}>
                <Ionicons name="chevron-back" size={28} color={NOUS_COLORS.gold} />
                <ThemedText style={styles.backText}>Volver</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.formTitle}>Credenciales</ThemedText>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>EMAIL</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="usuario@nous.com"
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

              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: NOUS_COLORS.gold }]}
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color={NOUS_COLORS.black} /> : 
                <ThemedText style={styles.primaryButtonText}>INICIAR SESIÓN</ThemedText>}
              </TouchableOpacity>
            </View>
          )}

          {/* Registro */}
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>¿Aún no eres parte?</ThemedText>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <ThemedText style={styles.footerLink}>CREAR UNA CUENTA</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* MODAL DE ALERTAS PERSONALIZADO (NOUS MODAL) */}
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="alert-circle-outline" size={32} color={NOUS_COLORS.gold} />
              <ThemedText style={styles.modalTitle}>{alertConfig.title}</ThemedText>
            </View>
            <ThemedText style={styles.modalMessage}>{alertConfig.message}</ThemedText>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setAlertConfig({ ...alertConfig, visible: false })}
            >
              <ThemedText style={styles.modalCloseButtonText}>ACEPTAR</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Sub-componentes
function BenefitItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.benefitBox}>
      <Ionicons name={icon} size={20} color={NOUS_COLORS.blue} />
      <ThemedText style={styles.benefitText}>{text}</ThemedText>
    </View>
  );
}

function LoginButton({ icon, title, onPress, disabled }: any) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        { opacity: pressed || disabled ? 0.6 : 1 }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={20} color={NOUS_COLORS.white} />
      <ThemedText style={styles.socialButtonText}>Continuar con {title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingBottom: 40 },
  
  // Logo
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 50 },
  logoImage: { width: 120, height: 120, marginBottom: 15 },
  brandName: { fontSize: 42, fontWeight: '200', color: NOUS_COLORS.gold, letterSpacing: 12 },
  divider: { width: 40, height: 1, backgroundColor: NOUS_COLORS.gold, marginVertical: 10 },
  tagline: { fontSize: 10, color: NOUS_COLORS.white, opacity: 0.5, letterSpacing: 3, textAlign: 'center' },

  // Main Content
  mainContent: { marginBottom: 30 },

  // Buttons
  buttonContainer: { gap: 15 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: NOUS_COLORS.border,
    gap: 12,
  },
  socialButtonText: { fontSize: 14, fontWeight: '500', color: NOUS_COLORS.white, letterSpacing: 1 },
  appleButton: { height: 55, marginTop: 0 },
  
  emailToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 8 },
  emailToggleText: { color: NOUS_COLORS.blue, fontSize: 13, fontWeight: '600' },

  // Benefits
  benefitsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 50 },
  benefitBox: { alignItems: 'center', gap: 5 },
  benefitText: { fontSize: 10, color: NOUS_COLORS.muted, letterSpacing: 1, textTransform: 'uppercase' },

  // Form
  formContainer: { animationDuration: '0.3s' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginLeft: -10 },
  backText: { color: NOUS_COLORS.gold, fontSize: 16 },
  formTitle: { fontSize: 24, fontWeight: '300', color: NOUS_COLORS.white, marginBottom: 30, letterSpacing: 2 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 10, color: NOUS_COLORS.gold, letterSpacing: 2, marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: NOUS_COLORS.border,
    color: NOUS_COLORS.white,
    paddingVertical: 10,
    fontSize: 16,
  },
  primaryButton: { height: 55, justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginTop: 20 },
  primaryButtonText: { color: NOUS_COLORS.black, fontWeight: '700', letterSpacing: 2 },

  // Footer
  footer: { marginTop: 50, alignItems: 'center', gap: 10 },
  footerText: { color: NOUS_COLORS.muted, fontSize: 14 },
  footerLink: { color: NOUS_COLORS.gold, fontWeight: '700', fontSize: 12, letterSpacing: 2 },

  // MODAL CUSTOM STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { 
    width: width * 0.85, 
    backgroundColor: NOUS_COLORS.card, 
    borderRadius: 8, 
    padding: 25, 
    borderWidth: 1, 
    borderColor: NOUS_COLORS.border,
    alignItems: 'center'
  },
  modalHeader: { alignItems: 'center', marginBottom: 15 },
  modalTitle: { color: NOUS_COLORS.gold, fontSize: 18, fontWeight: '700', marginTop: 10, letterSpacing: 1 },
  modalMessage: { color: NOUS_COLORS.white, textAlign: 'center', opacity: 0.8, lineHeight: 22, marginBottom: 25 },
  modalCloseButton: { 
    width: '100%', 
    paddingVertical: 15, 
    backgroundColor: NOUS_COLORS.gold, 
    alignItems: 'center', 
    borderRadius: 4 
  },
  modalCloseButtonText: { color: NOUS_COLORS.black, fontWeight: '800', letterSpacing: 2 }
});