# Diario Estoico - Tier 3 User Guide

## 🎯 Quick Start: Analytics & Export

### Access Analytics Dashboard
```
Home Screen
    ↓
Tap "Settings" (⚙️ tab)
    ↓
Scroll down to "📊 Análisis"
    ↓
Tap "Estadísticas del diario"
    ↓
📊 Analytics Dashboard
```

---

## 📊 Analytics Dashboard Explained

### What You'll See:

#### 1️⃣ **📊 General Section**
Shows overview statistics about your writing:
- **Total de notas**: How many diary entries you've written
- **Total de palabras**: Total word count across all entries
- **Promedio por nota**: Average characters per entry

#### 2️⃣ **😊 Distribución de Emociones** (Mood Distribution)
Visual breakdown of your moods:
- Shows a progress bar for each mood
- **Excelente** 😊 (Green) - Excellent days
- **Buena** 🙂 (Blue) - Good days
- **Normal** 😐 (Amber) - Regular days
- **Difícil** 😔 (Red) - Difficult days
- Each shows count and percentage

**Example:**
```
😊 Excelente  ████████░░░░░░░░░ 12 (28.6%)
🙂 Buena      ███████░░░░░░░░░░░ 15 (35.7%)
😐 Normal     █████░░░░░░░░░░░░░  8 (19.0%)
😔 Difícil    ███░░░░░░░░░░░░░░░  7 (16.7%)
```

#### 3️⃣ **📝 Contenido** (Content Analysis)
Insights about your writing:
- **Promedio por nota**: Average length of an entry
- **Nota más larga**: Your longest entry
- **Nota más corta**: Your shortest entry

#### 4️⃣ **🏷️ Etiquetas Populares** (Popular Tags)
Top 10 most-used tags ranked:
```
1. #personal    ████████████░░░ 24
2. #reflexión   ███████░░░░░░░░  14
3. #gratitud    ██████░░░░░░░░░░ 12
4. #desarrollo  ████░░░░░░░░░░░░  8
5. #amor        ███░░░░░░░░░░░░░  6
...
```

#### 5️⃣ **📅 Actividad por Mes** (Monthly Activity)
Your writing activity by month:
```
Enero       ████████████░░░░░░░  12 entries
Febrero     ████████████████░░░  18 entries
Marzo       ██████░░░░░░░░░░░░░   6 entries
...
```

#### 6️⃣ **📍 Período** (Date Range)
- **Primera nota**: When you wrote your first entry
- **Última nota**: Your most recent entry

---

## 📤 Share Statistics

### To Share Your Stats:
1. In the Analytics Dashboard, tap the **📤 Share** button (top right)
2. Choose how to send:
   - 📧 Email to yourself
   - 💬 Message to friend
   - 📱 Post to social media
   - 💾 Save to Notes app

**What Gets Shared:**
A text summary with:
- Mood distribution percentages
- Top tags
- Writing metrics
- Most active month
- Date range

---

## 📥 Export Your Diary

### Three Export Options:

#### **1. 📃 Texto (.TXT)**
Plain text format - simplest, most universal
- Best for: Note-taking apps, email, backup
- File size: Smallest
- Compatibility: Everything
- Format: Plain text with clear separators

**Example:**
```
=== Diario Estoico ===
Exportado: 2026-02-02 10:30

ENTRADA #1
Fecha: 2026-01-15
Título: Mi primer día
Emoción: excelente
Contenido: Hoy fue un gran día...
Etiquetas: #personal #reflexión

---

ENTRADA #2
...
```

#### **2. 📋 JSON**
Structured data format - best for data backup
- Best for: Data backup, importing to other apps
- File size: Medium
- Compatibility: Any app that reads JSON
- Format: Structured data with metadata

**Example:**
```json
{
  "usuario": "angel",
  "exportado": "2026-02-02T10:30:00.000Z",
  "totalNotas": 42,
  "notas": [
    {
      "id": "entry123",
      "title": "Mi primer día",
      "content": "Hoy fue un gran día...",
      "mood": "excelente",
      "tags": ["personal", "reflexión"],
      "createdAt": 1705267200000,
      "date": "2026-01-15"
    },
    ...
  ]
}
```

#### **3. 📄 PDF**
Beautiful formatted document - best for printing
- Best for: Printing, sharing as document, archiving
- File size: Larger (includes styling)
- Compatibility: Any device with PDF reader
- Format: Professional styled document

**Features:**
- Header with your name and export date
- Entries chronologically sorted (newest first)
- Each entry with title, date, mood emoji, content
- Tags listed for each entry
- Pretty colors and formatting
- Footer with motivational message

---

## 🎬 Step-by-Step Export Guide

### How to Export:

1. **Go to Analytics**
   ```
   Settings → Estadísticas del diario
   ```

2. **Tap Export Button**
   - Click the ⬇️ download icon in the top-right corner
   - An export modal will appear

3. **Choose Format**
   ```
   📃 Texto (.TXT)     Plain text
   📋 JSON             Structured data
   📄 PDF              Beautiful document
   ```

4. **File Gets Created**
   - App creates file with timestamp
   - Example: `diario-estoico-1738516200000.json`

5. **Share/Save**
   - System opens share dialog
   - Choose destination:
     - 📧 Email
     - 💾 Files / Cloud storage
     - 📱 Google Drive, Dropbox, OneDrive
     - 💬 WhatsApp, Telegram
     - 📱 Any app that supports file sharing

6. **Success Alert**
   - App confirms export completed
   - File ready to access

---

## 💡 Use Cases

### **Regular Backup** 🔄
- Export to JSON weekly
- Store in cloud (Google Drive, OneDrive)
- Keeps data safe

### **Print Journal** 🖨️
- Export to PDF
- Print at home or local shop
- Create physical copy

### **Share with Therapist** 👨‍⚕️
- Export to TXT or PDF
- Email to your therapist
- Easy to review together

### **Data Analysis** 📊
- Export to JSON
- Use Python/Excel to analyze
- Create your own visualizations

### **Social Sharing** 📱
- Share stats button
- Send mood breakdown to friend
- Show your progress

### **Content Backup** 💿
- JSON format preserves everything
- Easy to restore/import later
- Universal compatibility

---

## 📱 Mobile File Management

### Where Files Go:
- **Files App** (iOS): Automatically saved to "Files"
- **Files App** (Android): Downloads folder or cloud app
- **Cloud Apps**: Drive, OneDrive, Dropbox, iCloud
- **Email**: Attached and ready to send

### File Naming:
All exports include timestamp:
```
diario-estoico-1738516200000.txt
diario-estoico-1738516200000.json
diario-estoico-1738516200000.html
```

This ensures you never overwrite previous backups!

---

## 🎨 Analytics Color Guide

### Mood Colors:
- 🟢 **Excelente** = Green (#10B981)
- 🔵 **Buena** = Blue (#3B82F6)
- 🟡 **Normal** = Amber (#F59E0B)
- 🔴 **Difícil** = Red (#EF4444)

### Progress Bars:
- Filled portion = Relative amount
- Length represents percentage
- Helps visualize mood trends

---

## 🚀 Pro Tips

### ✨ Best Practices:
1. **Weekly Review**: Check analytics every week to see trends
2. **Monthly Backup**: Export to JSON monthly for safety
3. **Mood Tracking**: Use mood filter to understand patterns
4. **Tag Management**: Review popular tags to identify themes
5. **Regular Export**: Don't wait - backup often!

### 🎯 What the Stats Tell You:
- **High "Difícil"**: Consider stress management
- **Tag Patterns**: Identify important life themes
- **Writing Streak**: Celebrate consistency
- **Content Length**: Track if you're writing more deeply
- **Monthly Trends**: See seasonal patterns

---

## ❓ FAQ

**Q: Will exporting delete my entries?**
A: No! Export just makes a copy. Your entries stay in the app.

**Q: Where does the file go?**
A: You choose during the share dialog - email, cloud, local storage, etc.

**Q: Can I import the JSON back later?**
A: Not yet, but the format preserves all data for future use.

**Q: How often should I export?**
A: Weekly or monthly is good. At minimum, before major phone changes.

**Q: What's the biggest file?**
A: A 1000-entry diary is typically 1-2 MB as JSON.

**Q: Can I edit the exported file?**
A: Yes! TXT files are fully editable. JSON and PDF are also editable in their respective apps.

**Q: How are files named?**
A: `diario-estoico-[timestamp].[format]` - ensures no overwrites.

---

## 🎊 Summary

You now have:
- 📊 Detailed analytics dashboard
- 📤 Easy sharing of statistics
- 📥 Three export formats (TXT, JSON, PDF)
- 🔒 Complete data backup capability
- 📈 Insights into your writing habits
- 🎯 Understanding of your emotional patterns

**Enjoy your Stoic journaling journey!** 🌱✨
