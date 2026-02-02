import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, View } from 'react-native';

interface Setting {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  type: 'switch' | 'button';
  value?: boolean;
  onPress?: () => void;
}

function SettingItem({ setting }: { setting: Setting }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [value, setValue] = useState(setting.value ?? false);

  return (
    <Pressable
      onPress={setting.type === 'button' ? setting.onPress : undefined}
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.tabIconDefault + '20',
        },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: setting.color + '20' }]}>
        <Ionicons name={setting.icon as any} size={20} color={setting.color} />
      </View>

      <View style={styles.settingContent}>
        <ThemedText style={styles.settingTitle}>{setting.title}</ThemedText>
        {setting.subtitle && (
          <ThemedText style={styles.settingSubtitle}>{setting.subtitle}</ThemedText>
        )}
      </View>

      {setting.type === 'switch' ? (
        <Switch value={value} onValueChange={setValue} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
      )}
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </View>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Cerrar sesión',
        onPress: () => logout(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Ajustes</ThemedText>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: colors.tint + '20' }]}>
            <Ionicons name="person-circle" size={56} color={colors.tint} />
          </View>
          <View>
            <ThemedText style={styles.profileName}>{user?.displayName || 'Usuario'}</ThemedText>
            <ThemedText style={styles.profileEmail}>{user?.email}</ThemedText>
          </View>
        </View>

        {/* Statistics */}
        <SectionHeader title="Análisis" />
        <SettingItem
          setting={{
            id: '0',
            title: 'Estadísticas del diario',
            subtitle: 'Ver tus análisis y métricas',
            icon: 'bar-chart-outline',
            color: '#8B5CF6',
            type: 'button',
            onPress: () => router.push('/diary-stats'),
          }}
        />

        {/* Preferences */}
        <SectionHeader title="Preferencias" />
        <SettingItem
          setting={{
            id: '1',
            title: 'Notificaciones',
            subtitle: 'Recordatorio diario de reflexión',
            icon: 'notifications-outline',
            color: '#F59E0B',
            type: 'switch',
            value: true,
          }}
        />
        <SettingItem
          setting={{
            id: '2',
            title: 'Tema oscuro',
            subtitle: 'Usar tema oscuro automáticamente',
            icon: 'moon-outline',
            color: '#06B6D4',
            type: 'switch',
            value: colorScheme === 'dark',
          }}
        />
        <SettingItem
          setting={{
            id: '3',
            title: 'Exportar datos',
            subtitle: 'Descarga tu diario en PDF',
            icon: 'download-outline',
            color: '#3B82F6',
            type: 'button',
          }}
        />

        {/* Datos */}
        <SectionHeader title="Datos y Privacidad" />
        <SettingItem
          setting={{
            id: '4',
            title: 'Respaldar datos',
            subtitle: 'Cloud Firestore',
            icon: 'cloud-upload-outline',
            color: '#7C3AED',
            type: 'button',
          }}
        />
        <SettingItem
          setting={{
            id: '5',
            title: 'Política de privacidad',
            subtitle: 'Ver términos y condiciones',
            icon: 'document-text-outline',
            color: '#EC4899',
            type: 'button',
          }}
        />

        {/* About */}
        <SectionHeader title="Acerca de" />
        <View style={[styles.aboutSection, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.aboutTitle}>Diario Estoico</ThemedText>
          <ThemedText style={styles.aboutVersion}>Versión 1.0.0</ThemedText>
          <ThemedText style={styles.aboutDescription}>
            Una aplicación para practicar la filosofía estoica a través de la reflexión diaria.
          </ThemedText>
          <View style={styles.aboutLinks}>
            <Pressable>
              <ThemedText style={styles.aboutLink}>Sitio web</ThemedText>
            </Pressable>
            <ThemedText style={styles.separator}>•</ThemedText>
            <Pressable>
              <ThemedText style={styles.aboutLink}>Contacto</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: colors.tint,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <ThemedText style={styles.logoutButtonText}>Cerrar sesión</ThemedText>
        </Pressable>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    opacity: 0.6,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  aboutSection: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  aboutLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aboutLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3B82F6',
  },
  separator: {
    opacity: 0.3,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    height: 20,
  },
});
