import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  preview: string;
  mood: 'excelente' | 'buena' | 'normal' | 'difícil';
  tags: string[];
}

const MOCK_ENTRIES: DiaryEntry[] = [
  {
    id: '1',
    date: '29 de enero',
    title: 'Un día de aprendizaje',
    preview: 'Hoy aprendí que el dolor no es malo, es parte de la vida. Debo aceptarlo...',
    mood: 'buena',
    tags: ['aceptación', 'virtud'],
  },
  {
    id: '2',
    date: '28 de enero',
    title: 'Controlando lo que puedo controlar',
    preview: 'Reflexioné sobre las cosas fuera de mi control. Es importante enfocarse...',
    mood: 'excelente',
    tags: ['control', 'enfoque'],
  },
  {
    id: '3',
    date: '27 de enero',
    title: 'Un día desafiante',
    preview: 'Tuve un mal día, pero vi en ello una oportunidad de crecimiento...',
    mood: 'difícil',
    tags: ['resiliencia', 'crecimiento'],
  },
  {
    id: '4',
    date: '26 de enero',
    title: 'Práctica de la virtud',
    preview: 'Trabajé en ser más virtuoso hoy, buscando la excelencia en mis acciones...',
    mood: 'buena',
    tags: ['virtud', 'práctica'],
  },
];

function MoodBadge({ mood }: { mood: string }) {
  const moodConfig = {
    excelente: { color: '#10B981', icon: '😊' },
    buena: { color: '#3B82F6', icon: '🙂' },
    normal: { color: '#F59E0B', icon: '😐' },
    difícil: { color: '#EF4444', icon: '😔' },
  };

  const config = moodConfig[mood as keyof typeof moodConfig];

  return (
    <View style={[styles.moodBadge, { backgroundColor: config.color + '20' }]}>
      <ThemedText style={{ color: config.color, fontWeight: '600' }}>
        {config.icon} {mood.charAt(0).toUpperCase() + mood.slice(1)}
      </ThemedText>
    </View>
  );
}

function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.entryCard,
        {
          backgroundColor: colors.card,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.entryHeader}>
        <View>
          <ThemedText style={styles.entryDate}>{entry.date}</ThemedText>
          <ThemedText style={styles.entryTitle}>{entry.title}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
      </View>

      <ThemedText style={styles.entryPreview} numberOfLines={2}>
        {entry.preview}
      </ThemedText>

      <View style={styles.entryFooter}>
        <MoodBadge mood={entry.mood} />
        <View style={styles.tags}>
          {entry.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.tabIconDefault + '20' }]}>
              <ThemedText style={styles.tagText}>#{tag}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

export default function DiaryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [entries] = useState<DiaryEntry[]>(MOCK_ENTRIES);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 16, paddingVertical: 20 }]}>
        <ThemedText style={styles.headerTitle}>Mi Diario</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {entries.length} reflexiones registradas
        </ThemedText>
      </View>

      {/* Filter/Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={18} color={colors.tabIconDefault} />
        <ThemedText style={styles.searchPlaceholder}>Buscar en mis registros...</ThemedText>
      </View>

      {/* Entries List */}
      <FlatList
        data={entries}
        renderItem={({ item }) => <DiaryEntryCard entry={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.tint,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    opacity: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 100,
  },
  entryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  entryPreview: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    opacity: 0.7,
    marginBottom: 12,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
