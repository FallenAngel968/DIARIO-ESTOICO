// @ts-nocheck
import { auth, db } from '@/config/firebase-config';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
// Type-safe auth reference
const typedAuth = auth as any;
export interface DiaryEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  preview: string;
  mood: 'excelente' | 'buena' | 'normal' | 'difícil';
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CreateDiaryEntryInput {
  title: string;
  content: string;
  mood: 'excelente' | 'buena' | 'normal' | 'difícil';
  tags: string[];
}

/**
 * Obtener todas las notas del usuario actual
 */
export const getUserDiaryEntries = async (): Promise<DiaryEntry[]> => {
  try {
    if (!auth.currentUser) {
      console.warn('No user authenticated');
      return [];
    }

    const entriesRef = collection(db, 'diarios', auth.currentUser.uid, 'entries');
    // Solo usar orderBy sin where para evitar requerir índice compuesto
    const q = query(entriesRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);

    const entries: DiaryEntry[] = [];
    snapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
      } as DiaryEntry);
    });

    return entries;
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    throw error;
  }
};

/**
 * Crear una nueva nota en el diario
 */
export const createDiaryEntry = async (
  input: CreateDiaryEntryInput
): Promise<DiaryEntry> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user authenticated');
    }

    const now = Date.now();
    const preview = input.content.substring(0, 150);

    const entriesRef = collection(db, 'diarios', auth.currentUser.uid, 'entries');

    const docRef = await addDoc(entriesRef, {
      userId: auth.currentUser.uid,
      title: input.title,
      content: input.content,
      preview,
      mood: input.mood,
      tags: input.tags,
      date: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: docRef.id,
      userId: auth.currentUser.uid,
      title: input.title,
      content: input.content,
      preview,
      mood: input.mood,
      tags: input.tags,
      date: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Error creating diary entry:', error);
    throw error;
  }
};

/**
 * Actualizar una nota existente
 */
export const updateDiaryEntry = async (
  entryId: string,
  input: Partial<CreateDiaryEntryInput>
): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user authenticated');
    }

    const entryRef = doc(
      db,
      'diarios',
      auth.currentUser.uid,
      'entries',
      entryId
    );

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (input.title) updateData.title = input.title;
    if (input.content) {
      updateData.content = input.content;
      updateData.preview = input.content.substring(0, 150);
    }
    if (input.mood) updateData.mood = input.mood;
    if (input.tags) updateData.tags = input.tags;

    await updateDoc(entryRef, updateData);
  } catch (error) {
    console.error('Error updating diary entry:', error);
    throw error;
  }
};

/**
 * Obtener una nota específica
 */
export const getDiaryEntry = async (entryId: string): Promise<DiaryEntry | null> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user authenticated');
    }

    const entryRef = doc(
      db,
      'diarios',
      auth.currentUser.uid,
      'entries',
      entryId
    );

    const snapshot = await getDocs(
      query(collection(db, 'diarios', auth.currentUser.uid, 'entries'), where('__name__', '==', entryId))
    );

    if (snapshot.empty) {
      return null;
    }

    const doc_data = snapshot.docs[0];
    return {
      id: doc_data.id,
      ...doc_data.data(),
    } as DiaryEntry;
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    throw error;
  }
};

/**
 * Eliminar una nota
 */
export const deleteDiaryEntry = async (entryId: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user authenticated');
    }

    const entryRef = doc(
      db,
      'diarios',
      auth.currentUser.uid,
      'entries',
      entryId
    );

    await deleteDoc(entryRef);
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    throw error;
  }
};

/**
 * Buscar notas por etiqueta
 */
export const searchDiaryEntriesByTag = async (tag: string): Promise<DiaryEntry[]> => {
  try {
    if (!auth.currentUser) {
      return [];
    }

    const entriesRef = collection(db, 'diarios', auth.currentUser.uid, 'entries');
    // Solo usar array-contains sin where(userId) para evitar índice compuesto
    const q = query(
      entriesRef,
      where('tags', 'array-contains', tag)
    );

    const snapshot = await getDocs(q);
    const entries: DiaryEntry[] = [];

    snapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
      } as DiaryEntry);
    });

    return entries;
  } catch (error) {
    console.error('Error searching diary entries by tag:', error);
    throw error;
  }
};

/**
 * Buscar notas por título o contenido
 */
export const searchDiaryEntries = async (searchText: string): Promise<DiaryEntry[]> => {
  try {
    if (!auth.currentUser) {
      return [];
    }

    // Nota: Firestore no tiene búsqueda full-text por defecto
    // Esta es una búsqueda simple cliente-lado
    // Para búsqueda más avanzada, considera usar Algolia o similar
    const entriesRef = collection(db, 'diarios', auth.currentUser.uid, 'entries');
    // No usar where(userId) ya que estamos en la colección del usuario
    const q = query(entriesRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    const searchLower = searchText.toLowerCase();
    const entries: DiaryEntry[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.title.toLowerCase().includes(searchLower) ||
        data.content.toLowerCase().includes(searchLower)
      ) {
        entries.push({
          id: doc.id,
          ...data,
        } as DiaryEntry);
      }
    });

    return entries;
  } catch (error) {
    console.error('Error searching diary entries:', error);
    throw error;
  }
};
