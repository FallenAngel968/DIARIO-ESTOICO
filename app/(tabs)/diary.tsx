import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createDiaryEntry, DiaryEntry, getUserDiaryEntries } from '@/services/diary.service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

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

function DiaryEntryCard({ entry, onTagPress }: { entry: DiaryEntry; onTagPress?: (tag: string) => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? 'light') as keyof typeof Colors];
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/diary-detail?id=${entry.id}`)}
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
            <Pressable
              key={tag}
              onPress={() => {
                onTagPress?.(tag);
              }}
              style={[styles.tag, { backgroundColor: colors.tabIconDefault + '20' }]}
            >
              <ThemedText style={styles.tagText}>#{tag}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

function CreateEntryModal({
  visible,
  onClose,
  onSave,
  colorScheme,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: any) => Promise<void>;
  colorScheme: string;
}) {
  const colors = Colors[(colorScheme ?? 'light') as keyof typeof Colors];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'excelente' | 'buena' | 'normal' | 'difícil'>('buena');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Por favor completa título y contenido');
      return;
    }

    try {
      setIsLoading(true);
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await onSave({
        title: title.trim(),
        content: content.trim(),
        mood,
        tags: tagArray,
      });

      setTitle('');
      setContent('');
      setMood('buena');
      setTags('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la nota');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        {/* Modal Header */}
        <View style={[styles.modalHeader, { borderBottomColor: colors.tabIconDefault }]}>
          <Pressable onPress={onClose}>
            <ThemedText style={{ color: colors.tint }}>Cancelar</ThemedText>
          </Pressable>
          <ThemedText style={styles.modalTitle}>Nueva Nota</ThemedText>
          <Pressable onPress={handleSave} disabled={isLoading}>
            <ThemedText style={{ color: colors.tint, fontWeight: '600' }}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </ThemedText>
          </Pressable>
        </View>

        {/* Modal Content */}
        <ScrollView style={styles.modalContent}>
          {/* Title Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Título</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.tabIconDefault,
                  color: colors.text,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Ej: Un día de reflexión..."
              placeholderTextColor={colors.tabIconDefault + '80'}
              value={title}
              onChangeText={setTitle}
              editable={!isLoading}
            />
          </View>

          {/* Content Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Contenido</ThemedText>
            <TextInput
              style={[
                styles.inputLarge,
                {
                  borderColor: colors.tabIconDefault,
                  color: colors.text,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Escribe tu reflexión aquí..."
              placeholderTextColor={colors.tabIconDefault + '80'}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>

          {/* Mood Selection */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Mi estado de ánimo</ThemedText>
            <View style={styles.moodSelector}>
              {(['excelente', 'buena', 'normal', 'difícil'] as const).map((m) => (
                <Pressable
                  key={m}
                  style={[
                    styles.moodOption,
                    {
                      backgroundColor: mood === m ? Colors[(colorScheme ?? 'light') as keyof typeof Colors].tint + '20' : colors.card,
                      borderColor: mood === m ? Colors[(colorScheme ?? 'light') as keyof typeof Colors].tint : colors.tabIconDefault,
                    },
                  ]}
                  onPress={() => setMood(m)}
                  disabled={isLoading}
                >
                  <ThemedText style={styles.moodLabel}>
                    {m === 'excelente' ? '😊' : m === 'buena' ? '🙂' : m === 'normal' ? '😐' : '😔'} {m}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Tags Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Etiquetas (separadas por comas)</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.tabIconDefault,
                  color: colors.text,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Ej: estoicismo, reflexión, crecimiento"
              placeholderTextColor={colors.tabIconDefault + '80'}
              value={tags}
              onChangeText={setTags}
              editable={!isLoading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function DiaryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? 'light') as keyof typeof Colors];
  const { user } = useAuth();
  const [allEntries, setAllEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedMood, setSelectedMood] = useState<'excelente' | 'buena' | 'normal' | 'difícil' | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Cargar notas del usuario
  useEffect(() => {
    loadEntries();
  }, [user]);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    applyFilters();
  }, [allEntries, searchText, selectedMood, selectedTag]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userEntries = await getUserDiaryEntries();
      setAllEntries(userEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      Alert.alert('Error', 'No se pudieron cargar las notas');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allEntries];

    // Filtrar por búsqueda (título o contenido)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchLower) ||
          entry.content.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por mood
    if (selectedMood) {
      filtered = filtered.filter((entry) => entry.mood === selectedMood);
    }

    // Filtrar por etiqueta
    if (selectedTag) {
      filtered = filtered.filter((entry) => entry.tags.includes(selectedTag));
    }

    setFilteredEntries(filtered);
  };

  const handleCreateEntry = async (newEntry: any) => {
    try {
      await createDiaryEntry(newEntry);
      await loadEntries();
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: 16, paddingVertical: 20 }]}>
          <ThemedText style={styles.headerTitle}>Mi Diario</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {filteredEntries.length} de {allEntries.length} reflexiones
          </ThemedText>
        </View>

        {/* Filter/Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={18} color={colors.tabIconDefault} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en mis registros..."
            placeholderTextColor={colors.tabIconDefault + '80'}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')}>
              <Ionicons name="close" size={18} color={colors.tabIconDefault} />
            </Pressable>
          )}
        </View>

        {/* Mood Filter */}
        <View style={[styles.moodFilter, { backgroundColor: colors.card, borderBottomColor: colors.tabIconDefault }]}>
          <Pressable
            onPress={() => setSelectedMood(null)}
            style={[
              styles.moodFilterOption,
              { backgroundColor: selectedMood === null ? colors.tint + '20' : 'transparent' },
            ]}
          >
            <ThemedText style={{ fontWeight: selectedMood === null ? '600' : '400', fontSize: 12 }}>
              Todo
            </ThemedText>
          </Pressable>
          {(['excelente', 'buena', 'normal', 'difícil'] as const).map((mood) => (
            <Pressable
              key={mood}
              onPress={() => setSelectedMood(selectedMood === mood ? null : mood)}
              style={[
                styles.moodFilterOption,
                { backgroundColor: selectedMood === mood ? colors.tint + '20' : 'transparent' },
              ]}
            >
              <ThemedText style={{ fontWeight: selectedMood === mood ? '600' : '400', fontSize: 12 }}>
                {mood === 'excelente' ? '😊' : mood === 'buena' ? '🙂' : mood === 'normal' ? '😐' : '😔'}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Tag Filter - mostrar si hay tag seleccionado */}
        {selectedTag && (
          <View style={[styles.tagFilterBar, { backgroundColor: colors.tint + '20', borderBottomColor: colors.tint }]}>
            <ThemedText style={{ fontWeight: '500', fontSize: 12 }}>
              Filtrando por: <ThemedText style={{ fontWeight: '700' }}>#{selectedTag}</ThemedText>
            </ThemedText>
            <Pressable onPress={() => setSelectedTag(null)}>
              <Ionicons name="close" size={16} color={colors.tint} />
            </Pressable>
          </View>
        )}

        {/* Entries List */}
        {isLoading && allEntries.length === 0 ? (
          <View style={styles.centerContent}>
            <ThemedText>Cargando tus notas...</ThemedText>
          </View>
        ) : filteredEntries.length === 0 && allEntries.length === 0 ? (
          <View style={styles.centerContent}>
            <ThemedText style={styles.emptyMessage}>
              No tienes notas aún. ¡Crea tu primera reflexión!
            </ThemedText>
          </View>
        ) : filteredEntries.length === 0 ? (
          <View style={styles.centerContent}>
            <ThemedText style={styles.emptyMessage}>
              No se encontraron notas con estos filtros
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            renderItem={({ item }) => <DiaryEntryCard entry={item} onTagPress={setSelectedTag} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Floating Action Button */}
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: colors.tint,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </SafeAreaView>

      {/* Create Entry Modal */}
      <CreateEntryModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleCreateEntry}
        colorScheme={colorScheme ?? 'light'}
      />
    </>
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputLarge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    height: 150,
  },
  moodSelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  moodOption: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
  },
  moodFilter: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  moodFilterOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  tagFilterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});
