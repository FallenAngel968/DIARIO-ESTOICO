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
} from 'firebase/firestore';

export interface Reflection {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseTitle: string;
  notes: string;
  duration: number; // en segundos
  completed: boolean;
  difficulty: 'fácil' | 'moderado' | 'desafiante';
  insights: string[];
  createdAt: number;
  date: string;
  mood?: 'excelente' | 'buena' | 'normal' | 'difícil';
}

/**
 * Obtener todas las reflexiones del usuario
 */
export const getUserReflections = async (): Promise<Reflection[]> => {
  try {
    if (!auth.currentUser) {
      console.warn('No user authenticated');
      return [];
    }

    const reflectionsRef = collection(db, 'usuarios', auth.currentUser.uid, 'reflexiones');
    const q = query(reflectionsRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);

    const reflections: Reflection[] = [];
    snapshot.forEach((doc) => {
      reflections.push({
        id: doc.id,
        ...doc.data(),
      } as Reflection);
    });

    return reflections;
  } catch (error) {
    console.error('Error fetching reflections:', error);
    throw error;
  }
};

/**
 * Obtener reflexiones de un día específico
 */
export const getReflectionsByDate = async (date: string): Promise<Reflection[]> => {
  try {
    if (!auth.currentUser) return [];

    const allReflections = await getUserReflections();
    return allReflections.filter((r) => r.date === date);
  } catch (error) {
    console.error('Error fetching reflections by date:', error);
    throw error;
  }
};

/**
 * Crear una nueva reflexión
 */
export const createReflection = async (reflection: Omit<Reflection, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const reflectionsRef = collection(db, 'usuarios', auth.currentUser.uid, 'reflexiones');
    
    const today = new Date().toISOString().split('T')[0];

    const docRef = await addDoc(reflectionsRef, {
      userId: auth.currentUser.uid,
      date: reflection.date || today,
      createdAt: Date.now(),
      ...reflection,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating reflection:', error);
    throw error;
  }
};

/**
 * Actualizar una reflexión
 */
export const updateReflection = async (
  reflectionId: string,
  updates: Partial<Reflection>
): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const reflectionRef = doc(db, 'usuarios', auth.currentUser.uid, 'reflexiones', reflectionId);
    await updateDoc(reflectionRef, updates);
  } catch (error) {
    console.error('Error updating reflection:', error);
    throw error;
  }
};

/**
 * Eliminar una reflexión
 */
export const deleteReflection = async (reflectionId: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const reflectionRef = doc(db, 'usuarios', auth.currentUser.uid, 'reflexiones', reflectionId);
    await deleteDoc(reflectionRef);
  } catch (error) {
    console.error('Error deleting reflection:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de reflexiones
 */
export const getReflectionStats = async () => {
  try {
    if (!auth.currentUser) return null;

    const reflections = await getUserReflections();

    const stats = {
      totalReflections: reflections.length,
      totalTime: reflections.reduce((sum, r) => sum + (r.duration || 0), 0),
      completedReflections: reflections.filter((r) => r.completed).length,
      averageTime: reflections.length > 0 
        ? Math.round(reflections.reduce((sum, r) => sum + (r.duration || 0), 0) / reflections.length)
        : 0,
      byDifficulty: {
        fácil: reflections.filter((r) => r.difficulty === 'fácil').length,
        moderado: reflections.filter((r) => r.difficulty === 'moderado').length,
        desafiante: reflections.filter((r) => r.difficulty === 'desafiante').length,
      },
      streak: calculateStreak(reflections),
      lastReflection: reflections[0] || null,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching reflection stats:', error);
    throw error;
  }
};

/**
 * Calcular racha de reflexiones
 */
function calculateStreak(reflections: Reflection[]): number {
  if (reflections.length === 0) return 0;

  // Agrupar por fecha y contar reflexiones por día
  const reflectionsByDate = new Map<string, number>();
  reflections.forEach((r) => {
    reflectionsByDate.set(r.date, (reflectionsByDate.get(r.date) || 0) + 1);
  });

  // Ordenar fechas de más reciente a más antigua
  const sortedDates = Array.from(reflectionsByDate.keys()).sort().reverse();

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    const currentDateStr = currentDate.toISOString().split('T')[0];
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (currentDateStr === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Obtener reflexiones de ejercicio específico
 */
export const getReflectionsByExercise = async (exerciseId: string): Promise<Reflection[]> => {
  try {
    const allReflections = await getUserReflections();
    return allReflections.filter((r) => r.exerciseId === exerciseId);
  } catch (error) {
    console.error('Error fetching reflections by exercise:', error);
    throw error;
  }
};

/**
 * Exportar reflexiones a texto
 */
export const exportReflectionsToText = async (): Promise<string> => {
  try {
    const reflections = await getUserReflections();
    
    let text = '='.repeat(50) + '\n';
    text += '📝 MIS REFLEXIONES ESTOICAS\n';
    text += '='.repeat(50) + '\n\n';

    reflections.forEach((reflection) => {
      text += `📅 ${reflection.date}\n`;
      text += `📌 ${reflection.exerciseTitle}\n`;
      text += `⏱️  Duración: ${Math.floor(reflection.duration / 60)} minutos\n`;
      text += `Dificultad: ${reflection.difficulty}\n`;
      text += `Estado: ${reflection.completed ? '✓ Completada' : '⏸ Incompleta'}\n`;
      if (reflection.mood) {
        text += `Emoción: ${reflection.mood}\n`;
      }
      text += `\nNotas:\n${reflection.notes}\n`;
      if (reflection.insights.length > 0) {
        text += `\nInsights:\n${reflection.insights.map((i) => `• ${i}`).join('\n')}\n`;
      }
      text += '\n' + '-'.repeat(50) + '\n\n';
    });

    return text;
  } catch (error) {
    console.error('Error exporting reflections:', error);
    throw error;
  }
};
