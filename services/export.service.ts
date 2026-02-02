// @ts-nocheck
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { DiaryEntry } from './diary.service';

/**
 * Generar HTML para PDF
 */
function generateHTML(entries: DiaryEntry[], userName: string): string {
  const sortedEntries = [...entries].sort((a, b) => b.createdAt - a.createdAt);

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mi Diario Estoico</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #8b5cf6;
      padding-bottom: 20px;
    }
    .header h1 {
      font-size: 32px;
      color: #8b5cf6;
      margin-bottom: 10px;
    }
    .header p {
      color: #999;
      font-size: 14px;
    }
    .meta {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
      font-size: 13px;
      color: #666;
    }
    .meta p {
      margin: 5px 0;
    }
    .entry {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .entry-date {
      font-size: 12px;
      color: #999;
    }
    .entry-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 5px 0;
    }
    .entry-mood {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .mood-excelente { background: #d1fae5; color: #065f46; }
    .mood-buena { background: #dbeafe; color: #0c3b7d; }
    .mood-normal { background: #fef3c7; color: #92400e; }
    .mood-difícil { background: #fee2e2; color: #7f1d1d; }
    .entry-content {
      font-size: 14px;
      line-height: 1.8;
      color: #555;
      margin-bottom: 15px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .entry-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tag {
      background: #f0f0f0;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body { background: white; }
      .entry { box-shadow: none; border: 1px solid #eee; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📖 Mi Diario Estoico</h1>
      <p>Reflexiones y pensamientos personales</p>
    </div>

    <div class="meta">
      <p><strong>Usuario:</strong> ${userName}</p>
      <p><strong>Exportado:</strong> ${new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}</p>
      <p><strong>Total de notas:</strong> ${entries.length}</p>
    </div>
  `;

  sortedEntries.forEach((entry) => {
    const moodEmoji =
      entry.mood === 'excelente'
        ? '😊'
        : entry.mood === 'buena'
        ? '🙂'
        : entry.mood === 'normal'
        ? '😐'
        : '😔';

    html += `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-date">${entry.date}</div>
          <div class="entry-title">${escapeHtml(entry.title)}</div>
        </div>
        <div style="text-align: right;">
          <span class="entry-mood mood-${entry.mood}">
            ${moodEmoji} ${entry.mood}
          </span>
        </div>
      </div>
      <div class="entry-content">${escapeHtml(entry.content)}</div>
      ${
        entry.tags.length > 0
          ? `
        <div class="entry-tags">
          ${entry.tags.map((tag) => `<span class="tag">#${tag}</span>`).join('')}
        </div>
      `
          : ''
      }
    </div>
    `;
  });

  html += `
    <div class="footer">
      <p>🌱 Crecimiento estoico a través de la reflexión 🌱</p>
      <p>Diario Estoico © 2026</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Escapar HTML para evitar inyección
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Exportar diario a PDF (como HTML)
 */
export const exportToPDF = async (
  entries: DiaryEntry[],
  userName: string
): Promise<boolean> => {
  try {
    if (entries.length === 0) {
      throw new Error('No hay notas para exportar');
    }

    const html = generateHTML(entries, userName);

    // En Expo, compartimos el contenido HTML directamente como texto
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(html, {
        mimeType: 'text/html',
        dialogTitle: 'Exportar Diario como HTML',
        filename: 'diario-estoico.html',
      });
      return true;
    } else {
      throw new Error('Compartir no disponible en este dispositivo');
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

/**
 * Exportar como JSON
 */
export const exportToJSON = async (
  entries: DiaryEntry[],
  userName: string
): Promise<boolean> => {
  try {
    if (entries.length === 0) {
      throw new Error('No hay notas para exportar');
    }

    const exportData = {
      usuario: userName,
      exportado: new Date().toISOString(),
      totalNotas: entries.length,
      notas: entries,
    };

    const json = JSON.stringify(exportData, null, 2);

    // Compartir JSON directamente
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(json, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar Diario',
        filename: 'diario-estoico.json',
      });
      return true;
    } else {
      throw new Error('Compartir no disponible en este dispositivo');
    }
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
};

/**
 * Exportar como texto plano
 */
export const exportToTXT = async (
  entries: DiaryEntry[],
  userName: string
): Promise<boolean> => {
  try {
    if (entries.length === 0) {
      throw new Error('No hay notas para exportar');
    }

    const sortedEntries = [...entries].sort((a, b) => b.createdAt - a.createdAt);

    let text = `DIARIO ESTOICO - EXPORTACIÓN\n`;
    text += `============================\n\n`;
    text += `Usuario: ${userName}\n`;
    text += `Exportado: ${new Date().toLocaleDateString('es-ES')}\n`;
    text += `Total de notas: ${entries.length}\n`;
    text += `\n${'='.repeat(50)}\n\n`;

    sortedEntries.forEach((entry) => {
      const moodEmoji =
        entry.mood === 'excelente'
          ? '😊'
          : entry.mood === 'buena'
          ? '🙂'
          : entry.mood === 'normal'
          ? '😐'
          : '😔';

      text += `📅 ${entry.date}\n`;
      text += `📌 ${entry.title}\n`;
      text += `${moodEmoji} ${entry.mood.toUpperCase()}\n`;
      text += `\n${entry.content}\n`;
      if (entry.tags.length > 0) {
        text += `\nEtiquetas: ${entry.tags.map((t) => `#${t}`).join(', ')}\n`;
      }
      text += `\n${'─'.repeat(50)}\n\n`;
    });

    text += `\n🌱 Crecimiento estoico a través de la reflexión 🌱\n`;

    // Compartir texto directamente
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(text, {
        mimeType: 'text/plain',
        dialogTitle: 'Exportar Diario',
      });
      return true;
    } else {
      throw new Error('Compartir no disponible en este dispositivo');
    }
  } catch (error) {
    console.error('Error exporting to TXT:', error);
    throw error;
  }
};
