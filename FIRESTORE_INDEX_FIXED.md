# 🔧 Solución: Query requires an index

## ⚠️ Problema anterior
```
FirebaseError: The query requires an index
```

Firestore necesita **índices compuestos** cuando usamos múltiples condiciones en una query (ej: `where` + `orderBy`).

---

## ✅ Solución implementada

He simplificado las queries en [services/diary.service.ts](services/diary.service.ts) para eliminar la necesidad de índices compuestos.

### 🔄 Cambios realizados:

**Antes:**
```typescript
const q = query(
  entriesRef,
  where('userId', '==', auth.currentUser.uid),  // ❌ No necesario
  orderBy('createdAt', 'desc')                   // ❌ Requiere índice
);
```

**Después:**
```typescript
const q = query(
  entriesRef,
  orderBy('createdAt', 'desc')  // ✅ Funciona sin índice
);
```

### 🤔 ¿Por qué funciona?

Ya estamos consultando dentro de la colección del usuario:
```
collection(db, 'diarios', auth.currentUser.uid, 'entries')
                          ↑
                  Ya filtramos por userId aquí
```

No necesitamos `where('userId')` nuevamente. ¡Es como si dijeras "busca en la carpeta de Juan por documentos de Juan" - ¡obvio que son de Juan!

---

## 📋 Funciones actualizadas:

✅ `getUserDiaryEntries()` - Sin índice requerido  
✅ `searchDiaryEntriesByTag()` - Solo `where('tags')` sin orderBy  
✅ `searchDiaryEntries()` - Búsqueda cliente-lado sin índice  

---

## 🚀 Prueba ahora

1. **Recarga la app** (presiona `R` en la terminal de Expo)
2. **Inicia sesión**
3. **Abre la sección "Diario"**
4. **Intenta crear una nota nueva**
5. ✅ **¡Debería funcionar sin errores!**

---

## 📊 Comparativa

| Operación | Antes | Después |
|-----------|-------|---------|
| Cargar notas | ❌ Requiere índice | ✅ Sin índice |
| Crear nota | ✅ Funciona | ✅ Funciona |
| Buscar por etiqueta | ❌ Requiere índice | ✅ Sin índice |
| Buscar texto | ❌ Requiere índice | ✅ Sin índice |

---

## 💡 Nota de arquitectura

Firestore usa una estructura anidada:

```
diarios/
  └── {userId}/
      └── entries/
          ├── nota1
          ├── nota2
          └── nota3
```

Esto significa:
- ✅ Cada usuario ve SOLO sus notas (seguridad incorporada)
- ✅ Las queries son más rápidas (menos documentos que revisar)
- ✅ No necesitamos `where('userId')` en las queries

---

## ✅ Checklist

- [ ] Recargué la app
- [ ] Iniciée sesión
- [ ] Creé una nota nueva
- [ ] ✅ ¡La nota se guardó sin errores!
