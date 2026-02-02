# 🔥 Sistema de Notas de Diario - Firebase Firestore

## 📋 Resumen de la implementación

Tu aplicación ahora guarda todas las notas del diario en **Firebase Firestore**, una base de datos NoSQL en tiempo real alojada en la nube.

---

## 🗂️ Estructura de datos en Firestore

```
diario-estoico-5225c (Base de datos)
└── diarios/ (Colección raíz)
    └── {userId}/ (Documento por usuario)
        └── entries/ (Subcol
        ├── {entryId1}/
        │   ├── title: "Un día de aprendizaje"
        │   ├── content: "Hoy aprendí..."
        │   ├── preview: "Hoy aprendí que..." (primeros 150 caracteres)
        │   ├── mood: "buena"
        │   ├── tags: ["aceptación", "virtud"]
        │   ├── date: "29 de enero de 2026"
        │   ├── createdAt: 1706524800000 (timestamp)
        │   └── updatedAt: 1706524800000
        │
        └── {entryId2}/
            └── ...
```

---

## 📁 Archivos modificados y creados

### ✅ Nuevos archivos:
- **[services/diary.service.ts](services/diary.service.ts)** - Servicio completo para CRUD de notas

### ✅ Archivos modificados:
- **[app/(tabs)/diary.tsx](app/(tabs)/diary.tsx)** - Pantalla de diario con Firebase integrado

---

## 🔧 Funciones disponibles en `diary.service.ts`

### 📖 Lectura
```typescript
// Obtener todas las notas del usuario
await getUserDiaryEntries(): Promise<DiaryEntry[]>

// Obtener una nota específica
await getDiaryEntry(entryId): Promise<DiaryEntry | null>

// Buscar notas por etiqueta
await searchDiaryEntriesByTag(tag): Promise<DiaryEntry[]>

// Buscar notas por título o contenido
await searchDiaryEntries(searchText): Promise<DiaryEntry[]>
```

### ✍️ Escritura
```typescript
// Crear nueva nota
await createDiaryEntry({
  title: string
  content: string
  mood: 'excelente' | 'buena' | 'normal' | 'difícil'
  tags: string[]
}): Promise<DiaryEntry>

// Actualizar nota existente
await updateDiaryEntry(entryId, updates): Promise<void>

// Eliminar nota
await deleteDiaryEntry(entryId): Promise<void>
```

---

## 🚀 Cómo funciona ahora

### 1️⃣ Al abrir la pantalla de Diario:
- Se verifica si el usuario está autenticado (usando `useAuth()`)
- Se cargan automáticamente todas sus notas desde Firestore
- Si no hay notas, muestra un mensaje vacío

### 2️⃣ Para crear una nueva nota:
- **Presiona el botón flotante (+)**
- Se abre un modal con un formulario
- Completa: Título, Contenido, Estado de ánimo, Etiquetas
- **Presiona "Guardar"**
- La nota se guarda en Firestore y aparece en la lista

### 3️⃣ Estructura del formulario:
```
┌─────────────────────────────────┐
│  Modal: Nueva Nota              │
├─────────────────────────────────┤
│ Título:                         │
│ [Ej: Un día de reflexión...]   │
│                                 │
│ Contenido:                      │
│ [Escribe tu reflexión aquí...] │
│ [                             ] │
│                                 │
│ Mi estado de ánimo:             │
│ [😊 excelente] [🙂 buena]      │
│ [😐 normal]  [😔 difícil]      │
│                                 │
│ Etiquetas:                      │
│ [estoicismo, reflexión, ...]   │
├─────────────────────────────────┤
│ Cancelar              Guardar    │
└─────────────────────────────────┘
```

---

## 🔐 Seguridad (Firestore Rules)

Las reglas actuales en [firestore.rules](firestore.rules) son **temporales** (vencen el 29 de agosto 2025).

Para producción, deberías actualizar a:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Solo el propietario puede acceder a sus notas
    match /diarios/{userId}/entries/{entryId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Otros usuarios no pueden ver notas ajenas
    match /diarios/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 🎯 Próximos pasos (opcional)

1. **Editar notas** - Presionar en una nota para abrirla y editarla
2. **Eliminar notas** - Agregar botón de delete (deslizar o menú)
3. **Buscar** - Implementar búsqueda en tiempo real
4. **Filtros** - Filtrar por estado de ánimo o etiquetas
5. **Exportar** - Descargar notas como PDF
6. **Respaldos** - Implementar auto-backup

---

## ⚠️ Requisitos

✅ Usuario debe estar autenticado (login obligatorio)  
✅ Conexión a internet  
✅ Firebase Firestore debe estar habilitado en tu proyecto  

---

## 📊 Ejemplo de uso

```typescript
import { createDiaryEntry, getUserDiaryEntries } from '@/services/diary.service';

// Crear nota
const newEntry = await createDiaryEntry({
  title: "Mi reflexión del día",
  content: "Hoy aprendí que...",
  mood: "buena",
  tags: ["estoicismo", "reflexión"]
});

// Cargar todas las notas
const allEntries = await getUserDiaryEntries();
console.log(allEntries); // Array de DiaryEntry
```

---

## 🐛 Troubleshooting

**"Error: No user authenticated"**
→ Asegúrate de iniciar sesión primero

**"Error creating diary entry"**
→ Verifica que title y content no estén vacíos

**Las notas no se guardan**
→ Verifica que Firestore esté habilitado en Firebase Console

**Notas desaparecen al cerrar la app**
→ Esto es normal si cambian los usuarios - cada usuario ve solo sus notas
