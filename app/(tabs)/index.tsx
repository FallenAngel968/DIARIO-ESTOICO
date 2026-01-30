import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const DAILY_QUOTE = `"Eres responsable no de lo que sucede,\nsino de cómo reaccionas ante ello."`;
const DAILY_AUTHOR = '— Marco Aurelio';

interface CardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

function Card({ title, subtitle, icon, color, onPress }: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const greeting = getGreeting();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>{greeting}</ThemedText>
          <ThemedText style={styles.userName}>{user?.displayName || 'Usuario'}</ThemedText>
        </View>

        {/* Daily Quote */}
        <View
          style={[
            styles.quoteContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.tint,
            },
          ]}
        >
          <ThemedText style={styles.quoteText}>{DAILY_QUOTE}</ThemedText>
          <ThemedText style={styles.quoteAuthor}>{DAILY_AUTHOR}</ThemedText>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>

          <Card
            title="Nuevo Registro"
            subtitle="Reflexiona sobre el día"
            icon="pencil-outline"
            color="#4F46E5"
            onPress={() => {}}
          />

          <Card
            title="Mis Registros"
            subtitle="Lee tus reflexiones pasadas"
            icon="library-outline"
            color="#7C3AED"
            onPress={() => {}}
          />

          <Card
            title="Ejercicio del Día"
            subtitle="Practica estoicismo hoy"
            icon="school-outline"
            color="#EC4899"
            onPress={() => {}}
          />

          <Card
            title="Reflexiones"
            subtitle="Profundiza en tus pensamientos"
            icon="bulb-outline"
            color="#06B6D4"
            onPress={() => {}}
          />
        </View>

        {/* Stats Preview */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>12</ThemedText>
            <ThemedText style={styles.statLabel}>Registros</ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.tabIconDefault }]} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>7</ThemedText>
            <ThemedText style={styles.statLabel}>Esta semana</ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.tabIconDefault }]} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>3</ThemedText>
            <ThemedText style={styles.statLabel}>Días seguidos</ThemedText>
          </View>
        </View>

        {/* Footer Tip */}
        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={16} color={colors.tint} />
          <ThemedText style={styles.tipText}>
            La consistencia es el camino hacia la sabiduría estoica.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  quoteContainer: {
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 32,
    paddingVertical: 24,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  quoteAuthor: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.6,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    gap: 12,
  },
  iconContainer: {
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
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  divider: {
    width: 1,
    height: 40,
    opacity: 0.3,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.7,
    flex: 1,
  },
});
