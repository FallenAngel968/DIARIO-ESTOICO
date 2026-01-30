import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signInWithGoogle, signInWithFacebook, signInWithApple, login } = useAuth();

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      const result = await login(email, password);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', result.error || 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithFacebook();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión con Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión con Apple');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={[styles.logoBox, { backgroundColor: colors.tint + '20' }]}>
            <Ionicons name="book-outline" size={48} color={colors.tint} />
          </View>
          <ThemedText style={styles.title}>Diario Estoico</ThemedText>
          <ThemedText style={styles.subtitle}>
            Cultiva la sabiduría a través de la reflexión diaria
          </ThemedText>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <BenefitItem
            icon="checkmark-circle-outline"
            title="Reflexiona"
            description="Sobre tus acciones y pensamientos"
            color={colors.tint}
          />
          <BenefitItem
            icon="bulb-outline"
            title="Aprende"
            description="Principios de la filosofía estoica"
            color={colors.tint}
          />
          <BenefitItem
            icon="trending-up-outline"
            title="Crece"
            description="Como persona virtud y sabiduría"
            color={colors.tint}
          />
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <ThemedText style={styles.loginTitle}>Inicia sesión</ThemedText>

          {!showEmailForm ? (
            <>
              <View style={styles.buttonContainer}>
                <LoginButton
                  icon="logo-google"
                  title="Google"
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                  colors={colors}
                />

                <LoginButton
                  icon="logo-facebook"
                  title="Facebook"
                  onPress={handleFacebookSignIn}
                  disabled={isLoading}
                  colors={colors}
                />

                {Platform.OS === 'ios' && (
                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={10}
                    style={styles.appleButton}
                    onPress={handleAppleSignIn}
                  />
                )}

                <TouchableOpacity
                  style={[styles.emailButton, { backgroundColor: colors.card, borderColor: colors.tabIconDefault + '20' }]}
                  onPress={() => setShowEmailForm(true)}
                  disabled={isLoading}
                >
                  <Ionicons name="mail-outline" size={20} color={colors.tint} />
                  <ThemedText style={styles.loginButtonText}>Continuar con Email</ThemedText>
                </TouchableOpacity>
              </View>

              {/* New Account Link */}
              <View style={styles.newAccountContainer}>
                <ThemedText style={styles.newAccountText}>¿No tienes cuenta? </ThemedText>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <ThemedText style={[styles.newAccountText, { color: colors.tint, fontWeight: '600' }]}>
                    Crear una
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emailForm}>
              <TouchableOpacity
                style={styles.backEmailButton}
                onPress={() => setShowEmailForm(false)}
              >
                <Ionicons name="arrow-back" size={24} color={colors.tint} />
              </TouchableOpacity>

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

              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: colors.tint }]}
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.loginButtonTextWhite}>Iniciar Sesión</ThemedText>
                )}
              </TouchableOpacity>

              <View style={styles.newAccountContainer}>
                <ThemedText style={styles.newAccountText}>¿No tienes cuenta? </ThemedText>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <ThemedText style={[styles.newAccountText, { color: colors.tint, fontWeight: '600' }]}>
                    Crear una
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isLoading && showEmailForm && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.tint} />
              <ThemedText style={styles.loadingText}>Iniciando sesión...</ThemedText>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface BenefitItemProps {
  icon: string;
  title: string;
  description: string;
  color: string;
}

function BenefitItem({ icon, title, description, color }: BenefitItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.benefitItem}>
      <View style={[styles.benefitIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View>
        <ThemedText style={styles.benefitTitle}>{title}</ThemedText>
        <ThemedText style={styles.benefitDescription}>{description}</ThemedText>
      </View>
    </View>
  );
}

interface LoginButtonProps {
  icon: string;
  title: string;
  onPress: () => void;
  disabled: boolean;
  colors: typeof Colors.light;
}

function LoginButton({ icon, title, onPress, disabled, colors }: LoginButtonProps) {
  return (
    <TouchableOpacity
      style={({ pressed }) => [
        styles.loginButton,
        {
          backgroundColor: colors.card,
          opacity: pressed || disabled ? 0.7 : 1,
          borderColor: colors.tabIconDefault + '20',
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon as any} size={20} color={colors.tint} />
      <ThemedText style={styles.loginButtonText}>Continuar con {title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  benefitsSection: {
    marginBottom: 48,
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  loginSection: {
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 0.5,
    gap: 10,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  appleButton: {
    height: 48,
    borderRadius: 10,
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 11,
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 16,
  },
  emailForm: {
    gap: 16,
  },
  backEmailButton: {
    marginBottom: 8,
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
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  loginButtonTextWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  newAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  newAccountText: {
    fontSize: 14,
  },
});
