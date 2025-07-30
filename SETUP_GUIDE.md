# 🚀 Guía de Configuración Rápida - Sistema de Autenticación

## ✅ ¿Qué se ha implementado?

Tienes un sistema completo de autenticación con:

- **Login con Google, Facebook y Apple**
- **Protección automática de rutas**
- **Persistencia de sesión**
- **Contexto global de autenticación**
- **Logout seguro**
- **Navegación con expo-router**

## 🛠️ Pasos para Completar la Configuración

### 1. 📋 Configurar Firebase (OBLIGATORIO)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Habilita **Authentication** y configura estos proveedores:
   - ✅ Google
   - ✅ Facebook  
   - ✅ Apple (solo iOS)

4. **Actualiza `config/firebase-config.js`** con tus credenciales reales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com", 
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 2. 🔑 Configurar Google Sign-In

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea credenciales OAuth 2.0 para:
   - **iOS** (Bundle ID: `com.tu-empresa.diario-estoico`)
   - **Android** (Package name y SHA-1)
   - **Web** (para desarrollo)

3. **Actualiza `services/auth.service.ts`** línea ~15:

```typescript
const clientId = Platform.select({
  ios: 'TU-IOS-CLIENT-ID.googleusercontent.com',
  android: 'TU-ANDROID-CLIENT-ID.googleusercontent.com',
  web: 'TU-WEB-CLIENT-ID.googleusercontent.com',
});
```

### 3. 📘 Configurar Facebook Login

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una app nueva o usa una existente
3. Obtén tu **App ID**

4. **Actualiza `services/auth.service.ts`** línea ~75:

```typescript
clientId: 'TU-FACEBOOK-APP-ID',
```

### 4. 🍎 Configurar Apple Sign-In (Solo iOS)

Apple Sign-In ya está configurado y funcionará automáticamente en dispositivos iOS reales cuando tengas:
- Apple Developer Account activo
- App registrada en App Store Connect
- Bundle ID correcto

## 🧪 Cómo Probar

### Opción 1: Desarrollo Rápido
```bash
npm start
# Presiona 'w' para web y prueba con Google/Facebook
```

### Opción 2: Dispositivo iOS/Android
```bash
npm run ios    # o npm run android
```

### Opción 3: Ver Estado de Auth
Navega a `/auth-test` para ver el estado actual de autenticación.

## 📱 Flujo de la App

```
Usuario no autenticado → /login 
                          ↓
              [Selecciona proveedor]
                          ↓
               [Autenticación exitosa]
                          ↓
                     /(tabs) → Pantalla principal
```

## 🔧 URLs y Navegación

- **`/login`** - Pantalla de autenticación
- **`/(tabs)`** - Pantallas principales (protegidas)
- **`/(tabs)/explore`** - Info del usuario + Logout
- **`/auth-test`** - Test del estado de auth

## ⚠️ Errores Comunes

### "Auth domain is not authorized"
→ Configura domínios autorizados en Firebase Console

### "Invalid client ID"  
→ Verifica que los Client IDs estén correctos en `auth.service.ts`

### "App not found"
→ Verifica el Facebook App ID

### Redirección infinita
→ Revisa que el URL scheme coincida entre `app.json` y `auth.service.ts`

## 📄 Archivos Clave

```
📁 config/
  └── firebase-config.js       ← ACTUALIZAR con tus credenciales

📁 services/ 
  └── auth.service.ts          ← ACTUALIZAR Client IDs

📁 app/
  ├── _layout.tsx              ← Layout principal con AuthProvider
  └── login.tsx                ← Pantalla de login

📁 contexts/
  └── AuthContext.tsx          ← Lógica de autenticación

📁 components/
  └── ProtectedRoute.tsx       ← Protección de rutas
```

## 🎉 ¡Listo!

Una vez configurado Firebase y los Client IDs, tu app tendrá:

- ✅ Login social completo
- ✅ Protección automática de rutas  
- ✅ Persistencia de sesión
- ✅ Logout seguro
- ✅ Navegación fluida

**Siguiente paso:** Configura tus credenciales en `firebase-config.js` y `auth.service.ts`
