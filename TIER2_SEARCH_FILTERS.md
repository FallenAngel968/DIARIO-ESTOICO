# 🔍 Tier 2 - Búsqueda y Filtros

## ✅ Implementado

He agregado tres funcionalidades principales de búsqueda y filtrado:

### 1. 🔍 **Búsqueda en tiempo real** ✅
- La barra de búsqueda ahora funciona
- Busca en título Y contenido de las notas
- Se actualiza mientras escribes
- Muestra el contador: "X de Y reflexiones"
- Botón X para limpiar la búsqueda rápidamente

**Uso:**
```
1. Escribe en la barra de búsqueda
2. Las notas se filtran automáticamente
3. Presiona X para limpiar
```

### 2. 😊 **Filtrar por estado de ánimo** ✅
- Fila de botones con emojis: 😊 🙂 😐 😔
- Botón "Todo" para ver todas las notas
- Presiona un mood para filtrar
- Presiona de nuevo para deseleccionar
- Los filtros se pueden combinar con búsqueda

**Uso:**
```
1. Presiona un emoji (😊 = excelente, 🙂 = buena, etc)
2. Solo se muestran notas con ese mood
3. Presiona "Todo" para resetear
```

### 3. 🏷️ **Filtrar por etiquetas** ✅
- Las etiquetas en las tarjetas ahora son clickeables
- Presiona una etiqueta para filtrar
- Muestra barra azul: "Filtrando por: #etiqueta"
- Presiona X en la barra para limpiar el filtro
- Los filtros de búsqueda y mood se mantienen aplicados

**Uso:**
```
1. En una tarjeta, presiona una etiqueta (#estoicismo)
2. Se muestra solo notas con esa etiqueta
3. Presiona X para quitar el filtro
```

---

## 🎨 Interfaz visual

### Búsqueda:
```
┌─ [🔍 Buscar en mis registros...] [✕] ─┐
```
- Escribe y filtra en tiempo real
- X para limpiar rápido

### Filtro de Mood:
```
┌─ [Todo] [😊] [🙂] [😐] [😔] ─┐
```
- Presiona uno para activar
- Se resalta cuando está activo
- Presiona nuevamente para desactivar

### Filtro de Etiqueta (cuando aplica):
```
┌─ Filtrando por: #estoicismo [✕] ─┐
```
- Solo aparece cuando hay filtro activo
- Presiona X para limpiar

---

## 🔗 Combinación de filtros

Puedes usar múltiples filtros a la vez:

```
✅ Búsqueda + Mood
   "dolor" + Mood "difícil" = notas sobre dolor en días difíciles

✅ Búsqueda + Etiqueta
   "reflexión" + Etiqueta #virtud = notas sobre reflexión en virtud

✅ Mood + Etiqueta
   Mood "excelente" + Etiqueta #crecimiento = buenos días de crecimiento

✅ Los tres juntos
   "aprendí" + Mood "buena" + #autoconocimiento = búsqueda específica
```

---

## 📊 Cambios principales

### En [app/(tabs)/diary.tsx](app/(tabs)/diary.tsx):

1. **Estados agregados:**
   - `allEntries` - Todas las notas (sin filtrar)
   - `filteredEntries` - Notas después de aplicar filtros
   - `searchText` - Texto de búsqueda
   - `selectedMood` - Mood filtrado
   - `selectedTag` - Etiqueta filtrada

2. **Nueva función:**
   - `applyFilters()` - Aplica todos los filtros y actualiza la lista

3. **DiaryEntryCard actualizado:**
   - Las etiquetas ahora reciben `onTagPress`
   - Al presionar etiqueta, llama `setSelectedTag(tag)`

4. **Nuevos estilos:**
   - `searchInput` - Campo de búsqueda funcional
   - `moodFilter` - Fila de botones mood
   - `moodFilterOption` - Estilos de botón individual
   - `tagFilterBar` - Barra que muestra filtro activo

---

## 🧪 Prueba ahora

```
1. ✅ Escribe en la barra de búsqueda
2. ✅ Presiona los emojis para filtrar por mood
3. ✅ Presiona una etiqueta en una nota
4. ✅ Combina filtros
5. ✅ Presiona X para limpiar
```

---

## 📈 Contador mejorado

Ahora muestra:
```
"5 de 20 reflexiones"
                 ↑ Total
          ↑ Después de filtros
```

Así ves cuántas notas coinciden con tus filtros.

---

## 🔍 Ejemplos de uso

**Escenario 1: Encontrar notas sobre estoicismo**
1. Presiona etiqueta #estoicismo
2. ✅ Solo ve notas con ese tag

**Escenario 2: Ver cómo te sentiste bien**
1. Presiona 😊 (excelente)
2. ✅ Solo ve notas de días excelentes

**Escenario 3: Buscar reflexiones específicas**
1. Escribe "dolor" o "aceptar"
2. ✅ Solo ve notas que mencionen eso

**Escenario 4: Análisis profundo**
1. Presiona 😔 (difícil)
2. Presiona #resiliencia
3. ✅ Ve tus momentos difíciles donde creciste

---

## ✅ Checklist

- [ ] Recargo la app
- [ ] Escribo en la búsqueda
- [ ] ✅ Se filtran las notas automáticamente
- [ ] Presiono un emoji de mood
- [ ] ✅ Se filtran por mood
- [ ] Presiono una etiqueta
- [ ] ✅ Se filtra por etiqueta
- [ ] Limpio los filtros
- [ ] ✅ Vuelven todos

---

## 💡 Nota técnica

Los filtros se aplican **cliente-lado** (en tu teléfono), no en Firestore. Esto significa:
- ✅ Súper rápido (sin viaje a servidor)
- ✅ Funciona sin internet (con notas cargadas)
- ✅ Sin costos de lectura en Firestore
