import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  Share,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { DiaryEntry, getUserDiaryEntries } from '@/services/diary.service';
import { calculateDiaryStats, generateStatsText, DiaryStats } from '@/services/stats.service';
import { exportToPDF, exportToJSON, exportToTXT } from '@/services/export.service';
import { useAuth } from '@/contexts/AuthContext';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user } = useAuth();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [stats, setStats] = useState<DiaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  useEffect(() => {
    loadStatsData();
  }, [user]);

  const loadStatsData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userEntries = await getUserDiaryEntries();
      setEntries(userEntries);
      const calculatedStats = calculateDiaryStats(userEntries);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!stats) return;

    try {
      const statsText = generateStatsText(stats);
      await Share.share({
        message: statsText,
        title: 'Mis Estadísticas de Diario',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir');
    }
  };

  const handleExport = async (format: 'pdf' | 'json' | 'txt') => {
    if (entries.length === 0) {
      Alert.alert('Sin datos', 'No hay notas para exportar');
      return;
    }

    try {
      setIsExporting(true);
      const userName = user?.email?.split('@')[0] || 'Usuario';

      switch (format) {
        case 'pdf':
          await exportToPDF(entries, userName);
          break;
        case 'json':
          await exportToJSON(entries, userName);
          break;
        case 'txt':
          await exportToTXT(entries, userName);
          break;
      }

      setExportModalVisible(false);
      Alert.alert('Éxito', `Diario exportado como ${format.toUpperCase()}`);
    } catch (error) {
      Alert.alert('Error', `No se pudo exportar como ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </SafeAreaView>
    );
  }

  if (!stats || stats.totalEntries === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.tabIconDefault }]}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.tint} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Estadísticas</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <ThemedText style={styles.emptyMessage}>
            Aún no tienes notas para mostrar estadísticas
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excelente':
        return '😊';
      case 'buena':
        return '🙂';
      case 'normal':
        return '😐';
      case 'difícil':
        return '😔';
      default:
        return '❓';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excelente':
        return '#10B981';
      case 'buena':
        return '#3B82F6';
      case 'normal':
        return '#F59E0B';
      case 'difícil':
        return '#EF4444';
      default:
        return colors.tabIconDefault;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.tabIconDefault }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.tint} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Estadísticas</ThemedText>
        <View style={styles.headerActions}>
          <Pressable onPress={handleShare} style={{ marginRight: 16 }}>
            <Ionicons name="share-social" size={24} color={colors.tint} />
          </Pressable>
          <Pressable onPress={() => setExportModalVisible(true)}>
            <Ionicons name="download" size={24} color={colors.tint} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Resumen General */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>📊 General</ThemedText>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Total de notas</ThemedText>
            <ThemedText style={styles.statValue}>{stats.totalEntries}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Total de palabras</ThemedText>
            <ThemedText style={styles.statValue}>{stats.totalWords.toLocaleString()}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Días activos</ThemedText>
            <ThemedText style={styles.statValue}>{stats.daysActive}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Racha actual</ThemedText>
            <ThemedText style={[styles.statValue, { color: '#10B981' }]}>
              🔥 {stats.writingStreak} días
            </ThemedText>
          </View>
        </View>

        {/* Estados de Ánimo */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>😊 Estados de Ánimo</ThemedText>
          {(
            [
              { key: 'excelente', label: 'Excelente' },
              { key: 'buena', label: 'Buena' },
              { key: 'normal', label: 'Normal' },
              { key: 'difícil', label: 'Difícil' },
            ] as const
          ).map(({ key, label }) => (
            <View key={key} style={styles.moodRow}>
              <View style={styles.moodRowLeft}>
                <ThemedText style={styles.moodEmoji}>
                  {getMoodEmoji(key)}
                </ThemedText>
                <ThemedText style={styles.moodLabel}>{label}</ThemedText>
              </View>
              <View style={styles.moodRowRight}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        (stats.moodDistribution[key] / stats.totalEntries) * 100
                      }%`,
                      backgroundColor: getMoodColor(key),
                    },
                  ]}
                />
              </View>
              <ThemedText style={styles.moodCount}>
                {stats.moodDistribution[key]} ({stats.moodPercentage[key]})
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Contenido */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>📝 Contenido</ThemedText>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Promedio por nota</ThemedText>
            <ThemedText style={styles.statValue}>{stats.averageEntryLength} caracteres</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Nota más larga</ThemedText>
            <ThemedText style={styles.statValue}>{stats.longestEntry} caracteres</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Nota más corta</ThemedText>
            <ThemedText style={styles.statValue}>{stats.shortestEntry} caracteres</ThemedText>
          </View>
        </View>

        {/* Etiquetas Populares */}
        {stats.allTags.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.cardTitle}>🏷️ Etiquetas Populares</ThemedText>
            {stats.allTags.slice(0, 10).map((tag, index) => (
              <View key={tag.tag} style={styles.tagRow}>
                <View style={styles.tagRowLeft}>
                  <ThemedText style={styles.tagIndex}>{index + 1}.</ThemedText>
                  <ThemedText style={styles.tagName}>#{tag.tag}</ThemedText>
                </View>
                <View
                  style={[
                    styles.tagProgressBar,
                    {
                      width: `${(tag.count / stats.allTags[0].count) * 100}%`,
                      backgroundColor: colors.tint,
                    },
                  ]}
                />
                <ThemedText style={styles.tagCount}>{tag.count}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Actividad por Mes */}
        {stats.entriesByMonth.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.cardTitle}>📅 Actividad por Mes</ThemedText>
            <ThemedText style={styles.monthInfo}>
              Promedio: {stats.averageEntriesPerMonth} notas/mes
            </ThemedText>
            {stats.entriesByMonth.map((month) => (
              <View key={month.month} style={styles.monthRow}>
                <ThemedText style={styles.monthName}>{month.month}</ThemedText>
                <View
                  style={[
                    styles.monthBar,
                    {
                      width: `${
                        (month.count /
                          Math.max(
                            ...stats.entriesByMonth.map((m) => m.count),
                            1
                          )) *
                        100
                      }%`,
                      backgroundColor: colors.tint,
                    },
                  ]}
                />
                <ThemedText style={styles.monthCount}>{month.count}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Período */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>📍 Período</ThemedText>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Primera nota</ThemedText>
            <ThemedText style={styles.statValue}>
              {stats.firstEntryDate?.toLocaleDateString('es-ES')}
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Última nota</ThemedText>
            <ThemedText style={styles.statValue}>
              {stats.lastEntryDate?.toLocaleDateString('es-ES')}
            </ThemedText>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Export Modal */}
      <Modal
        visible={exportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
        >
          <View style={[styles.modalHeader, { borderBottomColor: colors.tabIconDefault }]}>
            <ThemedText style={styles.modalTitle}>Exportar Diario</ThemedText>
            <Pressable onPress={() => setExportModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.tint} />
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <ThemedText style={styles.modalDescription}>
              Elige el formato para descargar tu diario:
            </ThemedText>

            <Pressable
              onPress={() => handleExport('txt')}
              disabled={isExporting}
              style={({ pressed }) => [
                styles.exportButton,
                { backgroundColor: colors.card },
                pressed && styles.exportButtonPressed,
              ]}
            >
              <View style={styles.exportButtonContent}>
                <Ionicons name="document-text" size={32} color="#8B5CF6" />
                <View style={styles.exportButtonText}>
                  <ThemedText style={styles.exportButtonTitle}>Texto (.TXT)</ThemedText>
                  <ThemedText style={styles.exportButtonDesc}>
                    Formato de texto plano
                  </ThemedText>
                </View>
              </View>
              {isExporting && <ActivityIndicator color={colors.tint} />}
            </Pressable>

            <Pressable
              onPress={() => handleExport('json')}
              disabled={isExporting}
              style={({ pressed }) => [
                styles.exportButton,
                { backgroundColor: colors.card },
                pressed && styles.exportButtonPressed,
              ]}
            >
              <View style={styles.exportButtonContent}>
                <Ionicons name="code-slash" size={32} color="#3B82F6" />
                <View style={styles.exportButtonText}>
                  <ThemedText style={styles.exportButtonTitle}>JSON</ThemedText>
                  <ThemedText style={styles.exportButtonDesc}>
                    Formato JSON estructurado
                  </ThemedText>
                </View>
              </View>
              {isExporting && <ActivityIndicator color={colors.tint} />}
            </Pressable>

            <Pressable
              onPress={() => handleExport('pdf')}
              disabled={isExporting}
              style={({ pressed }) => [
                styles.exportButton,
                { backgroundColor: colors.card },
                pressed && styles.exportButtonPressed,
              ]}
            >
              <View style={styles.exportButtonContent}>
                <Ionicons name="document" size={32} color="#DC2626" />
                <View style={styles.exportButtonText}>
                  <ThemedText style={styles.exportButtonTitle}>PDF</ThemedText>
                  <ThemedText style={styles.exportButtonDesc}>
                    Documento PDF con formato
                  </ThemedText>
                </View>
              </View>
              {isExporting && <ActivityIndicator color={colors.tint} />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  moodRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  moodRowRight: {
    flex: 2,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  moodCount: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  tagRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  tagIndex: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  tagName: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e5e5',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  tagCount: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  monthInfo: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 12,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  monthName: {
    fontSize: 13,
    fontWeight: '500',
    minWidth: 80,
  },
  monthBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
  },
  monthCount: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.7,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  exportButtonPressed: {
    opacity: 0.7,
  },
  exportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  exportButtonText: {
    flex: 1,
  },
  exportButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exportButtonDesc: {
    fontSize: 12,
    opacity: 0.6,
  },
});
