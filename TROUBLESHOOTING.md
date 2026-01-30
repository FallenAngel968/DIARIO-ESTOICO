# 🔧 Guía de Troubleshooting - Si Aún Hay Problemas

## 1️⃣ "Metro error: Firebase App named '[DEFAULT]' already exists"

### Síntoma:
```
Metro error: Firebase: Firebase App named '[DEFAULT]' already 
exists with different options or config (app/duplicate-app).
```

### Solución Rápida:
```bash
# Detén el servidor (Ctrl+C)
# Luego ejecuta:
expo start --clear
```

### Solución Profunda:
```bash
# 1. Detén todo (Ctrl+C)
# 2. Limpia completamente
rm -r node_modules package-lock.json .expo .expo-cache

# 3. Reinstala
npm install

# 4. Inicia con limpieza
expo start --clear
```

### Si Aún No Funciona:
```bash
# Verifica que NO hay otros archivos de config compitiendo
# En tu proyecto, debería haber SOLO:
# - config/firebase-config.js (PRINCIPAL)
# - firebaseConfig.js (solo para compatibilidad)

# Busca archivos problemáticos:
find . -name "*firebase*" -type f

# Debería mostrar:
# ./config/firebase-config.js ✅
# ./firebaseConfig.js ✅
# ./firebaseConfig.simple.js ⚠️ (no se usa, ok)
# ... otros archivos .simple/.working
```

---

## 2️⃣ QR sin contenido o no escaneable

### Síntoma:
```
- QR aparece en terminal
- Lo escaneas con la cámara del iPhone
- Dice "No es un QR válido" o "Sin contenido"
```

### Causa:
Siempre es porque **Metro no compiló correctamente** (errores de Firebase)

### Solución:
1. **Primero**: Arregla el error de Firebase (ver punto 1)
2. **Espera**: A que Metro compile sin errores
3. **Nuevo QR**: Aparecerá uno nuevo en la terminal
4. **Escanea**: Este debería funcionar

```bash
# En la terminal verás:
✅ Firebase App ya existía, usando instancia existente
✅ Firebase Auth inicializado
Metro bundled 5432ms

# Entonces el QR será válido ✅
```

---

## 3️⃣ "useAuth is not a function"

### Síntoma:
```
Error: useAuth is not a function
  at LoginScreen (app/login.tsx:XX)
```

### Causa:
Estás importando de un lugar incorrecto

### Soluciones:

#### ❌ INCORRECTO:
```typescript
import { useAuth } from '@/contexts/AuthContext';
```

#### ✅ CORRECTO:
```typescript
import { useAuth } from '@/hooks/useAuth';
```

### Cómo Arreglarlo:
```bash
# Busca todos los imports incorrectos:
grep -r "from '@/contexts/AuthContext'" app/

# Reemplaza con:
grep -r "from '@/hooks/useAuth'" app/
```

---

## 4️⃣ "Cannot find module '@/hooks/useAuth'"

### Síntoma:
```
Cannot find module '@/hooks/useAuth'
```

### Causa:
El archivo `hooks/useAuth.js` no existe o está mal ubicado

### Solución:
```bash
# Verifica que existe:
ls hooks/useAuth.js

# Si no existe, debe ser un archivo como:
# hooks/useAuth.js (JavaScript)
# o
# hooks/useAuth.ts (TypeScript)

# Contenido debe tener:
export const useAuth = () => { ... }
```

---

## 5️⃣ App se detiene después de login

### Síntoma:
```
- Login exitoso
- App se congela o cierra
- Ves errores en la terminal
```

### Posibles Causas:

#### A) ProtectedRoute no funciona
```bash
# Verifica que ProtectedRoute existe
ls components/ProtectedRoute.tsx
```

#### B) AuthContext no se inicializa
```bash
# Verifica en app/_layout.tsx:
# Debe tener:
<AuthProvider>
  <ProtectedRoute>
    {/* ... */}
  </ProtectedRoute>
</AuthProvider>
```

#### C) Firebase Auth no configurado
```bash
# Verifica config/firebase-config.js
# Debe exportar:
export { app, auth, db, analytics };
```

### Solución:
```bash
# Revisa la consola para ver el error exacto
# y luego busca la sección relevante aquí
```

---

## 6️⃣ "app/explore.tsx" sigue generando errores

### Síntoma:
```
Error in app/(tabs)/explore.tsx
module not found, context issues
```

### Causa:
El archivo se actualizó pero Metro sigue cacheando la versión vieja

### Solución:
```bash
# Opción 1: Limpieza simple
expo start --clear

# Opción 2: Limpieza agresiva
rm -r .expo-cache
expo start --clear

# Opción 3: Limpieza total
rm -r node_modules .expo .expo-cache package-lock.json
npm install
expo start --clear
```

---

## 7️⃣ "Shadow props are deprecated" Warning

### Síntoma:
```
WARN "shadow*" style props are deprecated. Use "boxShadow"
```

### Severidad: 🟡 Baja (solo warning, app funciona)

### Solución Opcional:
```bash
# Reemplaza en StyleSheet:
// ❌ VIEJO
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 8,
elevation: 8,

// ✅ NUEVO (para web)
// Para React Native, los shadow props están bien
// Solo es un warning en web, puedes ignorarlo
```

---

## 8️⃣ El teléfono no se conecta a Expo

### Síntoma:
```
- El QR es válido
- Escaneas correctamente
- Pero la app no abre
- O aparece "Cannot connect to host"
```

### Posibles Causas:

#### A) Diferentes redes
```bash
# Tu laptop y iPhone deben estar en la MISMA red Wi-Fi
# Verifica:
# iPhone: Settings > Wi-Fi > Conectado a tu red
# Laptop: Conectado a la misma red
```

#### B) Firewall bloqueando
```bash
# Intenta con Android primero (por USB)
a  # en la terminal de expo

# O desactiva firewall temporalmente (Windows/Mac)
```

#### C) Puerto bloqueado
```bash
# Expo usa puerto 19000
# Intenta especificar otro puerto:
expo start --tunnel

# Usa el modo de túnel (más confiable)
```

---

## 9️⃣ "Scheme 'diarioestoico://'" not recognized

### Síntoma:
```
Error: URI scheme 'diarioestoico://' is not recognized
```

### Causa:
OAuth redirect URIs mal configurados en Firebase

### Solución:
```bash
# Verifica en Firebase Console:
# 1. Ve a Authentication > Sign-in method
# 2. Google > Authorized redirect URIs
# 3. Debe incluir: diarioestoico://
# 4. Y también: tu-app.firebaseapp.com/...

# O simplemente usa Expo Go primero (sin scheme)
```

---

## 🔟 "Blank screen" al abrir la app

### Síntoma:
```
- App abre
- Pantalla completamente en blanco
- Sin errores en la consola
```

### Posibles Causas:

#### A) AuthProvider no renderiza
```bash
# Verifica app/_layout.tsx
# Debe devolver JSX, no null
```

#### B) Fuentes no cargan
```bash
# En app/_layout.tsx:
const [loaded] = useFonts({...});
if (!loaded) return null;  // Espera fuentes
```

#### C) ProtectedRoute bloquea rendering
```bash
# Verifica components/ProtectedRoute.tsx
# Debe renderizar children correctamente
```

### Solución:
```bash
# 1. Revisa la consola para errores
# 2. Intenta con componente más simple
# 3. Usa console.log para debuggear
import { useEffect } from 'react';

export default function TestScreen() {
  useEffect(() => {
    console.log('Screen mounted');
  }, []);
  
  return <Text>Test</Text>;
}
```

---

## 🎯 Checklist de Debugging

Antes de pedir ayuda, verifica:

- [ ] Ejecutaste `expo start --clear`
- [ ] No ves "Firebase App already exists" en la terminal
- [ ] El QR es escaneable
- [ ] iPhone y laptop en la misma red
- [ ] `config/firebase-config.js` existe y exporta auth, db
- [ ] `contexts/AuthContext.tsx` importa de `@/config/firebase-config`
- [ ] `hooks/useAuth.js` existe
- [ ] No hay imports de `@/contexts/AuthContext` en componentes
- [ ] `app/_layout.tsx` tiene `<AuthProvider>`
- [ ] Firestore rules permiten lectura

---

## 📞 Si Nada Funciona

```bash
# Nuclear option - reconstruir todo
rm -rf .expo .expo-cache node_modules package-lock.json
npm install
expo doctor  # Chequea problemas
expo start --clear

# Si aún falla:
# 1. Borra tu cuenta de Expo local
rm ~/.expo

# 2. Login nuevamente
expo login

# 3. Prueba de nuevo
expo start --clear
```

---

**¡La mayoría de problemas se resuelven con `expo start --clear`!** 🚀
