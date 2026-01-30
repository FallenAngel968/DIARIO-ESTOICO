import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

interface Exercise {
  id: string;
  title: string;
  description: string;
  time: string;
  difficulty: 'fácil' | 'moderado' | 'desafiante';
  icon: string;
  color: string;
}

const EXERCISES: Exercise[] = [
  {
    id: '1',
    title: 'Premeditar Adversidades',
    description: 'Imagina los desafíos del día y cómo responderías con virtud',
    time: '5 min',
    difficulty: 'fácil',
    icon: 'eye-outline',
    color: '#F97316',
  },
  {
    id: '2',
    title: 'Examinar el Día',
    description: 'Reflexiona sobre tus acciones y cómo viviste con virtud',
    time: '10 min',
    difficulty: 'moderado',
    icon: 'clipboard-outline',
    color: '#3B82F6',
  },
  {
    id: '3',
    title: 'Dicotomía del Control',
    description: 'Clasifica lo que puedes y no puedes controlar',
    time: '8 min',
    difficulty: 'moderado',
    icon: 'git-branch-outline',
    color: '#06B6D4',
  },
  {
    id: '4',
    title: 'Meditación Estoica',
    description: 'Práctica profunda de la impermanencia y aceptación',
    time: '15 min',
    difficulty: 'desafiante',
    icon: 'medkit-outline',
    color: '#7C3AED',
  },
];

const STOIC_PRINCIPLES = [
  {
    title: 'Virtud es el Bien Supremo',
    description: 'La única cosa verdaderamente buena es la virtud moral.',
    icon: '⭐',
  },
  {
    title: 'Dicotomía del Control',
    description: 'Enfócate solo en lo que está bajo tu control.',
    icon: '🎯',
  },
  {
    title: 'Aceptación del Destino',
    description: 'Acepta lo que sucede con serenidad y fortaleza.',
    icon: '🌊',
  },
  {
    title: 'Sabiduría a través de la Razón',
    description: 'Usa tu razón para vivir de acuerdo con la naturaleza.',
    icon: '🧠',
  },
];

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const difficultyColor = {
    fácil: '#10B981',
    moderado: '#F59E0B',
    desafiante: '#EF4444',
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.exerciseCard,
        {
          backgroundColor: colors.card,
          borderColor: exercise.color,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.exerciseIcon, { backgroundColor: exercise.color + '20' }]}>
        <Ionicons name={exercise.icon as any} size={28} color={exercise.color} />
      </View>

      <View style={styles.exerciseContent}>
        <ThemedText style={styles.exerciseTitle}>{exercise.title}</ThemedText>
        <ThemedText style={styles.exerciseDescription} numberOfLines={2}>
          {exercise.description}
        </ThemedText>
        <View style={styles.exerciseFooter}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color={colors.tabIconDefault} />
            <ThemedText style={styles.timeText}>{exercise.time}</ThemedText>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColor[exercise.difficulty] + '20' },
            ]}
          >
            <ThemedText style={{ color: difficultyColor[exercise.difficulty], fontSize: 11 }}>
              {exercise.difficulty}
            </ThemedText>
          </View>
        </View>
      </View>

      <Ionicons name="arrow-forward" size={20} color={exercise.color} />
    </Pressable>
  );
}

function PrincipleCard({ principle }: { principle: (typeof STOIC_PRINCIPLES)[0] }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.principleCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.tint + '40',
        },
      ]}
    >
      <ThemedText style={styles.principleIcon}>{principle.icon}</ThemedText>
      <ThemedText style={styles.principleTitle}>{principle.title}</ThemedText>
      <ThemedText style={styles.principleDescription}>{principle.description}</ThemedText>
    </View>
  );
}

export default function ReflectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedTab, setSelectedTab] = useState<'exercises' | 'principles'>('exercises');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Reflexión</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Cultiva la sabiduría estoica con ejercicios diarios
        </ThemedText>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.tabIconDefault + '20' }]}>
        <Pressable
          onPress={() => setSelectedTab('exercises')}
          style={[
            styles.tab,
            {
              borderBottomColor:
                selectedTab === 'exercises' ? colors.tint : 'transparent',
              borderBottomWidth: 2,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.tabLabel,
              {
                color: selectedTab === 'exercises' ? colors.tint : colors.tabIconDefault,
                fontWeight: selectedTab === 'exercises' ? '600' : '400',
              },
            ]}
          >
            Ejercicios
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setSelectedTab('principles')}
          style={[
            styles.tab,
            {
              borderBottomColor:
                selectedTab === 'principles' ? colors.tint : 'transparent',
              borderBottomWidth: 2,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.tabLabel,
              {
                color: selectedTab === 'principles' ? colors.tint : colors.tabIconDefault,
                fontWeight: selectedTab === 'principles' ? '600' : '400',
              },
            ]}
          >
            Principios
          </ThemedText>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === 'exercises' ? (
          <View>
            {EXERCISES.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </View>
        ) : (
          <View style={styles.principlesGrid}>
            {STOIC_PRINCIPLES.map((principle, index) => (
              <PrincipleCard key={index} principle={principle} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.6,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  tabLabel: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    gap: 12,
  },
  exerciseIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.6,
    lineHeight: 18,
    marginBottom: 8,
  },
  exerciseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.6,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  principlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  principleCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  principleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  principleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  principleDescription: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 16,
  },
});
