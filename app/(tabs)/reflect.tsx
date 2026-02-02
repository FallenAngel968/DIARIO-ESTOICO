import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { createReflection, getReflectionStats, getUserReflections } from '@/services/reflection.service';

interface Exercise {
  id: string;
  title: string;
  description: string;
  time: string;
  timeSeconds: number;
  difficulty: 'fácil' | 'moderado' | 'desafiante';
  icon: string;
  color: string;
  prompts: string[];
}

const EXERCISES: Exercise[] = [
  {
    id: '1',
    title: 'Premeditar Adversidades',
    description: 'Imagina los desafíos del día y cómo responderías con virtud',
    time: '5 min',
    timeSeconds: 300,
    difficulty: 'fácil',
    icon: 'eye-outline',
    color: '#F97316',
    prompts: [
      '¿Qué desafíos podría enfrentar hoy?',
      '¿Cómo puedo responder con virtud?',
      '¿Qué está fuera de mi control?',
    ],
  },
  {
    id: '2',
    title: 'Examinar el Día',
    description: 'Reflexiona sobre tus acciones y cómo viviste con virtud',
    time: '10 min',
    timeSeconds: 600,
    difficulty: 'moderado',
    icon: 'clipboard-outline',
    color: '#3B82F6',
    prompts: [
      '¿Actué con virtud hoy?',
      '¿Dónde puedo mejorar?',
      '¿Qué aprendí de mis errores?',
    ],
  },
  {
    id: '3',
    title: 'Dicotomía del Control',
    description: 'Clasifica lo que puedes y no puedes controlar',
    time: '8 min',
    timeSeconds: 480,
    difficulty: 'moderado',
    icon: 'git-branch-outline',
    color: '#06B6D4',
    prompts: [
      '¿Qué está bajo mi control?',
      '¿Qué está fuera de mi control?',
      '¿Cómo puedo aceptar lo inevitable?',
    ],
  },
  {
    id: '4',
    title: 'Meditación Estoica',
    description: 'Práctica profunda de la impermanencia y aceptación',
    time: '15 min',
    timeSeconds: 900,
    difficulty: 'desafiante',
    icon: 'medkit-outline',
    color: '#7C3AED',
    prompts: [
      '¿Cuál es mi propósito verdadero?',
      '¿Cómo puedo aceptar la impermanencia?',
      '¿Qué significa vivir en armonía con la naturaleza?',
    ],
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

export default function ReflectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? 'light') as keyof typeof Colors];
  const { user } = useAuth();

  const [selectedTab, setSelectedTab] = useState<'exercises' | 'principles'>('exercises');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            Alert.alert('Tiempo completado', '¡Excelente trabajo en tu reflexión!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const loadStats = async () => {
    try {
      if (!user) return;
      const reflectionStats = await getReflectionStats();
      setStats(reflectionStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.timeSeconds);
    setReflectionNotes('');
    setIsModalVisible(true);
    setIsTimerRunning(false);
  };

  const handleCompleteExercise = async () => {
    if (!selectedExercise || !user) return;

    try {
      setIsLoading(true);
      await createReflection({
        exerciseId: selectedExercise.id,
        exerciseTitle: selectedExercise.title,
        notes: reflectionNotes,
        duration: selectedExercise.timeSeconds - timeLeft,
        completed: timeLeft <= 0,
        difficulty: selectedExercise.difficulty,
        insights: reflectionNotes
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .slice(0, 3),
        date: new Date().toISOString().split('T')[0],
      });

      Alert.alert('¡Éxito!', 'Reflexión guardada correctamente');
      setIsModalVisible(false);
      loadStats();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la reflexión');
    } finally {
      setIsLoading(false);
    }
  };

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
            {/* Stats */}
            {stats && (
              <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>Total</ThemedText>
                  <ThemedText style={styles.statValue}>{stats.totalReflections}</ThemedText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>Racha</ThemedText>
                  <ThemedText style={styles.statValue}>{stats.streak}🔥</ThemedText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>Tiempo</ThemedText>
                  <ThemedText style={styles.statValue}>{Math.round(stats.totalTime / 60)}m</ThemedText>
                </View>
              </View>
            )}
            {EXERCISES.map((exercise) => (
              <Pressable
                key={exercise.id}
                onPress={() => handleStartExercise(exercise)}
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
                        {
                          backgroundColor:
                            exercise.difficulty === 'fácil'
                              ? '#10B981' + '20'
                              : exercise.difficulty === 'moderado'
                              ? '#F59E0B' + '20'
                              : '#EF4444' + '20',
                        },
                      ]}
                    >
                      <ThemedText
                        style={{
                          color:
                            exercise.difficulty === 'fácil'
                              ? '#10B981'
                              : exercise.difficulty === 'moderado'
                              ? '#F59E0B'
                              : '#EF4444',
                          fontSize: 11,
                        }}
                      >
                        {exercise.difficulty}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <Ionicons name="arrow-forward" size={20} color={exercise.color} />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.principlesGrid}>
            {STOIC_PRINCIPLES.map((principle, index) => (
              <View key={index} style={[styles.principleCard, { backgroundColor: colors.card }]}>
                <ThemedText style={styles.principleIcon}>{principle.icon}</ThemedText>
                <ThemedText style={styles.principleTitle}>{principle.title}</ThemedText>
                <ThemedText style={styles.principleDescription}>{principle.description}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Exercise Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.tabIconDefault + '20' }]}>
            <Pressable onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.tint} />
            </Pressable>
            <ThemedText style={styles.modalTitle}>{selectedExercise?.title}</ThemedText>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Timer */}
            <View
              style={[
                styles.timerCard,
                { backgroundColor: (selectedExercise?.color || colors.tint) + '15' },
              ]}
            >
              <ThemedText style={styles.timerLabel}>Tiempo restante</ThemedText>
              <ThemedText style={styles.timerDisplay}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </ThemedText>
              <View style={styles.timerControls}>
                <Pressable
                  onPress={() => setIsTimerRunning(!isTimerRunning)}
                  style={({ pressed }) => [
                    styles.timerButton,
                    { backgroundColor: selectedExercise?.color, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Ionicons
                    name={isTimerRunning ? 'pause' : 'play'}
                    size={24}
                    color="white"
                  />
                </Pressable>
                <Pressable
                  onPress={() => setTimeLeft(selectedExercise?.timeSeconds || 0)}
                  style={({ pressed }) => [styles.timerButton, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <Ionicons name="refresh" size={24} color={selectedExercise?.color} />
                </Pressable>
              </View>
            </View>

            {/* Prompts */}
            <View style={styles.promptsSection}>
              <ThemedText style={styles.promptsTitle}>Preguntas para reflexionar:</ThemedText>
              {selectedExercise?.prompts.map((prompt, index) => (
                <View key={index} style={styles.promptItem}>
                  <ThemedText style={styles.promptNumber}>{index + 1}</ThemedText>
                  <ThemedText style={styles.promptText}>{prompt}</ThemedText>
                </View>
              ))}
            </View>

            {/* Notes */}
            <View style={styles.notesSection}>
              <ThemedText style={styles.notesLabel}>Mis reflexiones:</ThemedText>
              <TextInput
                style={[
                  styles.notesInput,
                  { color: colors.text, borderColor: colors.tabIconDefault },
                ]}
                placeholder="Escribe tus pensamientos e insights aquí..."
                placeholderTextColor={colors.tabIconDefault}
                multiline
                numberOfLines={6}
                value={reflectionNotes}
                onChangeText={setReflectionNotes}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View
            style={[
              styles.modalFooter,
              { borderTopColor: colors.tabIconDefault + '20' },
            ]}
          >
            <Pressable
              onPress={() => setIsModalVisible(false)}
              style={({ pressed }) => [
                styles.modalButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText style={styles.modalButtonText}>Cancelar</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleCompleteExercise}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.modalButtonPrimary,
                {
                  backgroundColor: selectedExercise?.color,
                  opacity: pressed || isLoading ? 0.7 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={{ color: 'white', fontWeight: '600' }}>
                  Guardar Reflexión
                </ThemedText>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
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
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 30,
    opacity: 0.2,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  timerCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Courier New',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  promptsSection: {
    marginBottom: 24,
  },
  promptsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  promptItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  promptNumber: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
  },
  promptText: {
    flex: 1,
    fontSize: 13,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
