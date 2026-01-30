# 📦 DEPENDENCIAS NECESARIAS

## 🔧 Instalación de Paquetes

Para que el sistema de autenticación funcione completamente, necesitas instalar estos paquetes:

### 1. AsyncStorage (Para persistencia de sesión)
```bash
npm install @react-native-async-storage/async-storage
```

### 2. Auth Session (Para Google/Facebook OAuth)
```bash
npm install expo-auth-session expo-crypto
```

### 3. Proveedores específicos (Si usas Google/Facebook/Apple)
```bash
# Google
npm install expo-auth-session

# Facebook  
npm install expo-auth-session

# Apple (solo iOS)
npm install expo-apple-authentication
```

### 4. Dependencias de Firebase (probablemente ya instaladas)
```bash
npm install firebase
```

## 📋 INSTALACIÓN COMPLETA (Copia y pega)

```bash
# Instalar todas las dependencias de una vez
npm install @react-native-async-storage/async-storage expo-auth-session expo-crypto expo-apple-authentication firebase
```

## 🎯 DESPUÉS DE INSTALAR

1. **Reinicia el servidor de desarrollo**:
   ```bash
   npm start
   # o
   expo start
   ```

2. **Si usas AsyncStorage**, actualiza firebaseConfig.js:
   ```javascript
   // Descomenta estas líneas en firebaseConfig.js
   import { initializeAuth, getReactNativePersistence } from "firebase/auth";
   import AsyncStorage from '@react-native-async-storage/async-storage';
   ```

3. **Si NO quieres AsyncStorage por ahora**:
   - ✅ Ya está configurado (versión simplificada)
   - ⚠️ Tendrás el warning pero funcionará

## 🚀 OPCIÓN RÁPIDA (Sin AsyncStorage)

Si quieres probar el login AHORA sin instalar nada:

1. ✅ firebaseConfig.js ya está simplificado
2. 🔍 Navega a `/login.simple`
3. 🔐 Prueba el login con Google

El warning de AsyncStorage aparecerá pero el login debería funcionar.

## ⚠️ NOTA IMPORTANTE

- **Sin AsyncStorage**: La sesión no persiste entre reinicios de la app
- **Con AsyncStorage**: La sesión se mantiene automáticamente

¿Prefieres instalar AsyncStorage o probar sin él primero? 🤔