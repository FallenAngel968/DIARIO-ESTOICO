import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  DiaryEntry,
  deleteDiaryEntry,
  updateDiaryEntry,
  getUserDiaryEntries,
} from '@/services/diary.service';
import { useAuth } from '@/contexts/AuthContext';

export default function DiaryDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedMood, setEditedMood] = useState<'excelente' | 'buena' | 'normal' | 'difícil'>('buena');
  const [editedTags, setEditedTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Cargar la nota
  useEffect(() => {
    loadEntry();
  }, [id, user]);

  const loadEntry = async () => {
    if (!user || !id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const entries = await getUserDiaryEntries();
      const foundEntry = entries.find((e) => e.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
        setEditedTitle(foundEntry.title);
        setEditedContent(foundEntry.content);
        setEditedMood(foundEntry.mood);
        setEditedTags(foundEntry.tags.join(', '));
      }
    } catch (error) {
      console.error('Error loading entry:', error);
      Alert.alert('Error', 'No se pudo cargar la nota');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTitle.trim() || !editedContent.trim() || !entry) {
      Alert.alert('Error', 'Por favor completa título y contenido');
      return;
    }

    try {
      setIsSaving(true);
      const tagArray = editedTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updateDiaryEntry(entry.id, {
        title: editedTitle.trim(),
        content: editedContent.trim(),
        mood: editedMood,
        tags: tagArray,
      });

      // Recargar la nota actualizada
      await loadEntry();
      setIsEditing(false);
      Alert.alert('Éxito', 'Nota actualizada correctamente');
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'No se pudo actualizar la nota');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (!entry) return;

    try {
      setIsSaving(true);
      await deleteDiaryEntry(entry.id);
      Alert.alert('Éxito', 'Nota eliminada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setDeleteModalVisible(false);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting entry:', error);
      Alert.alert('Error', 'No se pudo eliminar la nota');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      '⚠️ Eliminar nota',
      '¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: handleDeleteEntry },
      ]
    );
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

  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.tabIconDefault }]}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.tint} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Nota no encontrada</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <ThemedText>La nota no existe</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.tabIconDefault }]}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.tint} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>
            {isEditing ? 'Editar nota' : 'Detalles'}
          </ThemedText>
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Ionicons
              name={isEditing ? 'close' : 'pencil'}
              size={24}
              color={colors.tint}
            />
          </Pressable>
        </View>

        {/* Content */}
        {isEditing ? (
          // Edit Mode
          <ScrollView style={[styles.content, { paddingHorizontal: 16 }]}>
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
                value={editedTitle}
                onChangeText={setEditedTitle}
                editable={!isSaving}
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
                value={editedContent}
                onChangeText={setEditedContent}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                editable={!isSaving}
              />
            </View>

            {/* Mood Selection */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Estado de ánimo</ThemedText>
              <View style={styles.moodSelector}>
                {(['excelente', 'buena', 'normal', 'difícil'] as const).map((m) => (
                  <Pressable
                    key={m}
                    style={[
                      styles.moodOption,
                      {
                        backgroundColor:
                          editedMood === m ? colors.tint + '20' : colors.card,
                        borderColor: editedMood === m ? colors.tint : colors.tabIconDefault,
                      },
                    ]}
                    onPress={() => setEditedMood(m)}
                    disabled={isSaving}
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
              <ThemedText style={styles.label}>Etiquetas</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.tabIconDefault,
                    color: colors.text,
                    backgroundColor: colors.card,
                  },
                ]}
                value={editedTags}
                onChangeText={setEditedTags}
                placeholder="Separadas por comas"
                editable={!isSaving}
              />
            </View>

            {/* Save/Delete Buttons */}
            <View style={styles.buttonGroup}>
              <Pressable
                style={[styles.button, { backgroundColor: colors.tint }]}
                onPress={handleSaveEdit}
                disabled={isSaving}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </ThemedText>
              </Pressable>

              <Pressable
                style={[styles.button, { backgroundColor: '#EF4444' }]}
                onPress={confirmDelete}
                disabled={isSaving}
              >
                <Ionicons name="trash" size={20} color="#fff" />
                <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
                  Eliminar
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        ) : (
          // View Mode
          <ScrollView style={[styles.content, { paddingHorizontal: 16 }]}>
            {/* Date */}
            <ThemedText style={styles.date}>{entry.date}</ThemedText>

            {/* Title */}
            <ThemedText style={styles.title}>{entry.title}</ThemedText>

            {/* Mood Badge */}
            <View style={styles.moodContainer}>
              <View
                style={[
                  styles.moodBadge,
                  {
                    backgroundColor:
                      entry.mood === 'excelente'
                        ? '#10B981' + '20'
                        : entry.mood === 'buena'
                        ? '#3B82F6' + '20'
                        : entry.mood === 'normal'
                        ? '#F59E0B' + '20'
                        : '#EF4444' + '20',
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color:
                      entry.mood === 'excelente'
                        ? '#10B981'
                        : entry.mood === 'buena'
                        ? '#3B82F6'
                        : entry.mood === 'normal'
                        ? '#F59E0B'
                        : '#EF4444',
                    fontWeight: '600',
                  }}
                >
                  {entry.mood === 'excelente' ? '😊' : entry.mood === 'buena' ? '🙂' : entry.mood === 'normal' ? '😐' : '😔'}{' '}
                  {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                </ThemedText>
              </View>
            </View>

            {/* Content */}
            <ThemedText style={styles.content}>{entry.content}</ThemedText>

            {/* Tags */}
            {entry.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <ThemedText style={styles.tagsLabel}>Etiquetas:</ThemedText>
                <View style={styles.tagsList}>
                  {entry.tags.map((tag) => (
                    <View
                      key={tag}
                      style={[
                        styles.tag,
                        { backgroundColor: colors.tabIconDefault + '20' },
                      ]}
                    >
                      <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Metadata */}
            <View style={styles.metadata}>
              <ThemedText style={styles.metadataText}>
                📝 {new Date(entry.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </ThemedText>
              {entry.updatedAt !== entry.createdAt && (
                <ThemedText style={styles.metadataText}>
                  ✏️ Editado: {new Date(entry.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </ThemedText>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.deleteModal, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.deleteTitle}>⚠️ Eliminar nota</ThemedText>
            <ThemedText style={styles.deleteMessage}>
              ¿Estás seguro? Esta acción no se puede deshacer.
            </ThemedText>
            <View style={styles.deleteButtons}>
              <Pressable
                style={[styles.deleteButton, { backgroundColor: colors.tabIconDefault + '20' }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <ThemedText style={{ fontWeight: '600' }}>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.deleteButton, { backgroundColor: '#EF4444' }]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  handleDeleteEntry();
                }}
              >
                <ThemedText style={{ fontWeight: '600', color: '#fff' }}>
                  Eliminar
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    paddingVertical: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  moodContainer: {
    marginBottom: 16,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bodyContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  tagsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metadata: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#e5e5e5',
  },
  metadataText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 16,
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
    height: 200,
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
  buttonGroup: {
    gap: 12,
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModal: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minWidth: 280,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  deleteMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  deleteButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
