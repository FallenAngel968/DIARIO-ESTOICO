import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Cerrar sesión',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Explorar</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Recursos y herramientas estoicas</ThemedText>
        </View>

        {/* Recursos */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recursos Recomendados</ThemedText>

          <ResourceCard
            icon="book-outline"
            title="Meditaciones"
            description="Marco Aurelio - La obra maestra del estoicismo"
            colors={colors}
            onPress={() => {}}
          />

          <ResourceCard
            icon="document-text-outline"
            title="Enchiridión"
            description="Epicteto - Manual práctico de estoicismo"
            colors={colors}
            onPress={() => {}}
          />

          <ResourceCard
            icon="quotes-outline"
            title="Cartas"
            description="Séneca - Reflexiones sobre la vida y la virtud"
            colors={colors}
            onPress={() => {}}
          />
        </View>

        {/* Útiles */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Herramientas</ThemedText>

          <ToolCard
            icon="calculator-outline"
            title="Dicotomía del Control"
            description="Clasifica lo que puedes controlar"
            color="#06B6D4"
            colors={colors}
            onPress={() => {}}
          />

          <ToolCard
            icon="timer-outline"
            title="Meditación Guiada"
            description="Sesiones de 5-15 minutos"
            color="#EC4899"
            colors={colors}
            onPress={() => {}}
          />

          <ToolCard
            icon="trending-up-outline"
            title="Mi Progreso"
            description="Estadísticas de tu práctica"
            color="#10B981"
            colors={colors}
            onPress={() => {}}
          />
        </View>

        {/* About */}
        <View style={[styles.aboutSection, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.aboutTitle}>Sobre Diario Estoico</ThemedText>
          <ThemedText style={styles.aboutText}>
            Una aplicación dedicada a la práctica diaria de la filosofía estoica. 
            Inspirada en los grandes maestros: Marco Aurelio, Epicteto y Séneca.
          </ThemedText>
        </View>

        {/* Logout */}
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

interface ResourceCardProps {
  icon: string;
  title: string;
  description: string;
  colors: typeof Colors.light;
  onPress: () => void;
}

function ResourceCard({ icon, title, description, colors, onPress }: ResourceCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.tint + '20' }]}>
        <Ionicons name={icon as any} size={24} color={colors.tint} />
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardDescription}>{description}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
    </Pressable>
  );
}

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  colors: typeof Colors.light;
  onPress: () => void;
}

function ToolCard({ icon, title, description, color, colors, onPress }: ToolCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: color,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardDescription}>{description}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 28,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.6,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  aboutSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
    lineHeight: 19,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

function TabTwoScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Cerrar Sesión',
            style: 'destructive',
            onPress: async () => {
              await logout();
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Mi Perfil</ThemedText>
      </ThemedView>
      
      {/* User Info and Logout Section */}
      <ThemedView style={styles.userSection}>
        <ThemedText type="subtitle">Información del Usuario</ThemedText>
        
        <View style={styles.userInfoRow}>
          <ThemedText style={styles.userLabel}>Nombre:</ThemedText>
          <ThemedText>{user?.displayName || 'No disponible'}</ThemedText>
        </View>
        
        <View style={styles.userInfoRow}>
          <ThemedText style={styles.userLabel}>Email:</ThemedText>
          <ThemedText>{user?.email || 'No disponible'}</ThemedText>
        </View>
        
        <View style={styles.userInfoRow}>
          <ThemedText style={styles.userLabel}>Proveedor:</ThemedText>
          <ThemedText>{user?.providerData[0]?.providerId || 'No disponible'}</ThemedText>
        </View>
        
        <View style={styles.userInfoRow}>
          <ThemedText style={styles.userLabel}>Último acceso:</ThemedText>
          <ThemedText>{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('es-ES') : 'No disponible'}</ThemedText>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutButtonText}>Cerrar Sesión</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const settingsStyles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  userSection: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  userLabel: {
    fontWeight: '600',
    minWidth: 100,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
