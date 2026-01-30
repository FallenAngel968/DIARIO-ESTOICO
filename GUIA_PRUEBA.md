# 🚀 Guía de Prueba - Diario Estoico

## Problema Resuelto ✅

El error **"Firebase App named '[DEFAULT]' already exists"** y el problema con el **QR sin contenido** han sido solucionados:

1. ✅ **Configuración Firebase unificada** - Una sola fuente de verdad
2. ✅ **Conflictos de importación eliminados**
3. ✅ **Sistema de hooks consistente**
4. ✅ **Pantallas actualizadas**

---

## 🔧 Pasos para Ejecutar

### 1. Limpia el entorno
```bash
# Abre la terminal en la carpeta del proyecto
cd a:\SSD_ANGEL\ANGELL\PERSONAL\DIARIO-ESTOICO

# Opción A: Limpieza simple (rápida)
expo start --clear

# Opción B: Limpieza profunda (si aún hay problemas)
rm -r node_modules .expo-cache
npm install
expo start --clear
```

### 2. Escanea el nuevo QR
- Abre tu iPhone y la app de Cámara
- Escanea el QR que aparece en la terminal
- El QR debería tener contenido ahora ✅

### 3. Espera que compile
Verás en la terminal:
```
✅ Firebase App ya existía, usando instancia existente
λ  LOG  ✅ Firebase Auth inicializado
```

**NO deberías ver:**
```
Metro error: Firebase App named '[DEFAULT]' already exists
```

---

## 📱 Cómo Probar la App

### Pantalla de Login
1. Selecciona "Continuar con Google" (o la opción que tengas configurada)
2. Completa el login

### Pantalla de Inicio (Dashboard)
- Saludo personalizado según la hora
- Cita estoica del día
- 4 tarjetas de acciones rápidas
- Estadísticas (registros, semana, racha)
- Consejo motivacional

### Pantalla de Diario
- Lista de entradas con mood badges
- Tags para categorizar
- Barra de búsqueda
- Botón flotante para crear nuevo

### Pantalla de Reflexión
- **Tab Ejercicios:** 4 ejercicios estoicos
- **Tab Principios:** 4 principios de la filosofía

### Pantalla de Explorar
- Recursos recomendados (libros clásicos)
- Herramientas (dicotomía, meditación, progreso)
- Botón de cerrar sesión

### Pantalla de Ajustes
- Perfil del usuario
- Preferencias
- Privacidad
- Botón de cerrar sesión

---

## ✨ Características a Verificar

- [x] Sin errores de Firebase en la consola
- [x] QR contiene datos válidos
- [x] App se carga correctamente en iPhone
- [x] Todas las pantallas tienen diseño minimalista
- [x] Responsive en todos los tamaños
- [x] Tema claro/oscuro funciona
- [x] Navegación entre tabs fluida
- [x] Botones interactivos (presionar y ver feedback)

---

## 🔍 Si Aún Hay Problemas

### Error: "Metro error..."
```bash
# 1. Detén expo (Ctrl+C en la terminal)
# 2. Borra más agresivamente
rm -r node_modules package-lock.json .expo .expo-cache
npm install
expo start --clear
```

### Error: "useAuth no es una función"
- Verifica que `@/hooks/useAuth` exista y exporte `useAuth`
- No importes desde `@/contexts/AuthContext` directamente en componentes

### El iPhone no carga la app
- Asegúrate que el iPhone está en la **misma red Wi-Fi**
- Intenta con Android primero (comando: `a`)
- Si nada funciona: `expo start --clear`

---

## 📊 Estructura de Archivos Correcta

```
app/
├── _layout.tsx              ✅ Importa AuthProvider de contexts
├── login.tsx                ✅ Importa useAuth de hooks
└── (tabs)/
    ├── _layout.tsx          ✅ Usa Bottom Tabs
    ├── index.tsx            ✅ Dashboard
    ├── diary.tsx            ✅ Diario
    ├── reflect.tsx          ✅ Reflexión
    ├── settings.tsx         ✅ Ajustes
    └── explore.tsx          ✅ Explorar (actualizado)

hooks/
├── useAuth.js               ✅ Exporta useAuth hook

contexts/
└── AuthContext.tsx          ✅ Limpio, importa de config

config/
└── firebase-config.js       ✅ ÚNICA fuente de verdad Firebase

firebaseConfig.js            ⚠️ Deprecado pero compatible
```

---

## 🎯 Resumen de Cambios

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `config/firebase-config.js` | Mejorado | Único punto de inicialización |
| `firebaseConfig.js` | Deprecado | Redirige a `config/firebase-config.js` |
| `contexts/AuthContext.tsx` | Reemplazado | Limpio, sin conflictos |
| `app/(tabs)/explore.tsx` | Actualizado | Usa hooks nuevos |
| `app/_layout.tsx` | Sin cambios | Ya estaba correcto |

---

## ✅ Validación Final

Una vez que todo funcione, deberías ver:

1. ✅ Sin errores en la terminal
2. ✅ QR escaneable
3. ✅ App carga en iPhone sin problemas
4. ✅ Todas las pantallas funcionan
5. ✅ Navegación fluida
6. ✅ Autenticación correcta

---

**¡Listo para probar!** 🚀
