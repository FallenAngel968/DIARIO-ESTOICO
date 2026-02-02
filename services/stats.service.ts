import { DiaryEntry } from './diary.service';

export interface DiaryStats {
  totalEntries: number;
  totalWords: number;
  totalCharacters: number;
  moodDistribution: {
    excelente: number;
    buena: number;
    normal: number;
    difícil: number;
  };
  moodPercentage: {
    excelente: string;
    buena: string;
    normal: string;
    difícil: string;
  };
  mostUsedTag: string | null;
  allTags: Array<{ tag: string; count: number }>;
  writingStreak: number;
  averageEntriesPerMonth: number;
  entriesByMonth: Array<{ month: string; count: number }>;
  longestEntry: number;
  shortestEntry: number;
  averageEntryLength: number;
  firstEntryDate: Date | null;
  lastEntryDate: Date | null;
  daysActive: number;
}

/**
 * Calcular estadísticas del diario
 */
export const calculateDiaryStats = (entries: DiaryEntry[]): DiaryStats => {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      totalWords: 0,
      totalCharacters: 0,
      moodDistribution: { excelente: 0, buena: 0, normal: 0, difícil: 0 },
      moodPercentage: { excelente: '0%', buena: '0%', normal: '0%', difícil: '0%' },
      mostUsedTag: null,
      allTags: [],
      writingStreak: 0,
      averageEntriesPerMonth: 0,
      entriesByMonth: [],
      longestEntry: 0,
      shortestEntry: 0,
      averageEntryLength: 0,
      firstEntryDate: null,
      lastEntryDate: null,
      daysActive: 0,
    };
  }

  // Estadísticas básicas
  const totalWords = entries.reduce((sum, e) => sum + countWords(e.content), 0);
  const totalCharacters = entries.reduce((sum, e) => sum + e.content.length, 0);

  // Distribución de moods
  const moodDistribution = {
    excelente: entries.filter((e) => e.mood === 'excelente').length,
    buena: entries.filter((e) => e.mood === 'buena').length,
    normal: entries.filter((e) => e.mood === 'normal').length,
    difícil: entries.filter((e) => e.mood === 'difícil').length,
  };

  const moodPercentage = {
    excelente: `${Math.round((moodDistribution.excelente / entries.length) * 100)}%`,
    buena: `${Math.round((moodDistribution.buena / entries.length) * 100)}%`,
    normal: `${Math.round((moodDistribution.normal / entries.length) * 100)}%`,
    difícil: `${Math.round((moodDistribution.difícil / entries.length) * 100)}%`,
  };

  // Tags
  const tagCounts: { [key: string]: number } = {};
  entries.forEach((e) => {
    e.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const allTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const mostUsedTag = allTags.length > 0 ? allTags[0].tag : null;

  // Racha de escritura
  const sortedByDate = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  const writingStreak = calculateWritingStreak(sortedByDate);

  // Estadísticas por mes
  const entriesByMonth = calculateEntriesByMonth(entries);
  const averageEntriesPerMonth = Math.round(entries.length / (entriesByMonth.length || 1));

  // Longitud de entradas
  const contentLengths = entries.map((e) => e.content.length);
  const longestEntry = Math.max(...contentLengths);
  const shortestEntry = Math.min(...contentLengths);
  const averageEntryLength = Math.round(totalCharacters / entries.length);

  // Fechas
  const dates = entries.map((e) => new Date(e.createdAt));
  const firstEntryDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const lastEntryDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Días activos
  const uniqueDates = new Set(
    entries.map((e) => new Date(e.createdAt).toDateString())
  );
  const daysActive = uniqueDates.size;

  return {
    totalEntries: entries.length,
    totalWords,
    totalCharacters,
    moodDistribution,
    moodPercentage,
    mostUsedTag,
    allTags,
    writingStreak,
    averageEntriesPerMonth,
    entriesByMonth,
    longestEntry,
    shortestEntry,
    averageEntryLength,
    firstEntryDate,
    lastEntryDate,
    daysActive,
  };
};

/**
 * Contar palabras en un texto
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Calcular racha de escritura (días consecutivos)
 */
function calculateWritingStreak(sortedEntries: DiaryEntry[]): number {
  if (sortedEntries.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(sortedEntries[0].createdAt);

  for (let i = 1; i < sortedEntries.length; i++) {
    const nextDate = new Date(sortedEntries[i].createdAt);
    const daysDiff = Math.floor(
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      streak++;
      currentDate = nextDate;
    } else if (daysDiff > 1) {
      break;
    }
  }

  return streak;
}

/**
 * Calcular entradas por mes
 */
function calculateEntriesByMonth(entries: DiaryEntry[]): Array<{ month: string; count: number }> {
  const monthCounts: { [key: string]: number } = {};

  entries.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthCounts)
    .map(([month, count]) => ({
      month: formatMonthKey(month),
      count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Formatear clave de mes
 */
function formatMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
}

/**
 * Generar resumen en texto para compartir
 */
export const generateStatsText = (stats: DiaryStats): string => {
  return `
📊 ESTADÍSTICAS DE MI DIARIO

📈 General:
• Total de notas: ${stats.totalEntries}
• Total de palabras: ${stats.totalWords.toLocaleString()}
• Total de caracteres: ${stats.totalCharacters.toLocaleString()}
• Días activos: ${stats.daysActive}
• Racha actual: ${stats.writingStreak} días

😊 Estados de ánimo:
• Excelente: ${stats.moodDistribution.excelente} (${stats.moodPercentage.excelente})
• Buena: ${stats.moodDistribution.buena} (${stats.moodPercentage.buena})
• Normal: ${stats.moodDistribution.normal} (${stats.moodPercentage.normal})
• Difícil: ${stats.moodDistribution.difícil} (${stats.moodPercentage.difícil})

📝 Contenido:
• Nota más larga: ${stats.longestEntry} caracteres
• Nota más corta: ${stats.shortestEntry} caracteres
• Promedio por nota: ${stats.averageEntryLength} caracteres
• Promedio por mes: ${stats.averageEntriesPerMonth} notas

🏷️ Etiquetas:
• Más usada: ${stats.mostUsedTag || 'N/A'}
• Total de etiquetas únicas: ${stats.allTags.length}
${stats.allTags.slice(0, 5).map((t) => `  • #${t.tag}: ${t.count}`).join('\n')}

📅 Período:
• Desde: ${stats.firstEntryDate?.toLocaleDateString('es-ES') || 'N/A'}
• Hasta: ${stats.lastEntryDate?.toLocaleDateString('es-ES') || 'N/A'}
  `.trim();
};
