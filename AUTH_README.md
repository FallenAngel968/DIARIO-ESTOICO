# Diario Estoico - Sistema de Autenticación

Este proyecto implementa un sistema completo de autenticación para una aplicación Expo usando Firebase Auth, con soporte para login con Google, Facebook y Apple.

## 🚀 Características

- ✅ **Login con Google** usando `expo-auth-session` y Firebase Auth
- ✅ **Login con Facebook** usando `expo-auth-session` y Firebase Auth  
- ✅ **Login con Apple** usando `expo-apple-authentication` (solo iOS)
- ✅ **Persistencia de sesión** con Firebase
- ✅ **Contexto global** (React Context) para AuthProvider
- ✅ **Función de logout** completa
- ✅ **Protección de rutas** automática
- ✅ **Navegación** con `expo-router`
- ✅ **Código limpio y reutilizable**

## 📁 Estructura del Proyecto

```
├── app/
│   ├── _layout.tsx              # Layout principal con AuthProvider
│   ├── login.tsx                # Pantalla de login
│   └── (tabs)/
│       ├── _layout.tsx          # Layout de tabs
│       ├── index.tsx            # Pantalla principal (protegida)
│       └── explore.tsx          # Pantalla con info del usuario y logout
├── components/
│   └── ProtectedRoute.tsx       # Componente de protección de rutas
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación
├── services/
│   └── auth.service.ts          # Servicios de autenticación
└── config/
    └── firebase-config.js       # Configuración de Firebase
```

## 🛠️ Configuración

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication y configura los proveedores:
   - **Google**: Habilita y configura
   - **Facebook**: Habilita y configura con App ID y App Secret
   - **Apple**: Habilita y configura (solo para iOS)

4. Actualiza `config/firebase-config.js` con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};
```

### 2. Configurar Google Sign-In

1. En Google Cloud Console, crea credenciales OAuth 2.0
2. Actualiza `services/auth.service.ts` con tus Client IDs:

```typescript
const clientId = Platform.select({
  ios: 'tu-ios-client-id.googleusercontent.com',
  android: 'tu-android-client-id.googleusercontent.com',
  web: 'tu-web-client-id.googleusercontent.com',
});
```

### 3. Configurar Facebook Login

1. En Facebook Developers, crea una app
2. Actualiza `services/auth.service.ts` con tu App ID:

```typescript
clientId: 'tu-facebook-app-id',
```

### 4. Configurar URL Scheme

Actualiza `app.json` con tu URL scheme personalizado:

```json
{
  "expo": {
    "scheme": "tu-app-scheme"
  }
}
```

Y actualiza `services/auth.service.ts`:

```typescript
scheme: 'tu-app-scheme',
```

## 📱 Uso

### AuthContext

El contexto de autenticación proporciona:

```typescript
const { 
  user,              // Usuario actual o null
  isLoading,         // Estado de carga
  signInWithGoogle,  // Función para login con Google
  signInWithFacebook,// Función para login con Facebook
  signInWithApple,   // Función para login con Apple
  logout            // Función para cerrar sesión
} = useAuth();
```

### Protección de Rutas

Las rutas se protegen automáticamente con `ProtectedRoute`:

- Si el usuario **NO** está autenticado → Redirige a `/login`
- Si el usuario **SÍ** está autenticado → Accede a las rutas protegidas

### Navegación

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navegar después del login
router.replace('/(tabs)');

// Navegar al logout
router.replace('/login');
```

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Ejecutar en iOS
npm run ios

# Ejecutar en Android
npm run android

# Ejecutar en Web
npm run web
```

## 📦 Dependencias Principales

- `firebase` - SDK de Firebase
- `expo-auth-session` - Autenticación OAuth
- `expo-apple-authentication` - Login con Apple
- `expo-crypto` - Utilidades criptográficas
- `expo-router` - Navegación basada en archivos

## 🔒 Seguridad

- Las credenciales de Firebase deben estar en variables de entorno en producción
- Los tokens se manejan automáticamente por Firebase Auth
- La persistencia de sesión es manejada por Firebase
- Se implementa logout seguro que limpia todas las sesiones

## 🚨 Notas Importantes

1. **Apple Sign-In** solo funciona en dispositivos iOS reales
2. **URL Schemes** deben estar configurados correctamente para deep linking
3. **Permisos** de Facebook y Google deben estar configurados en sus respectivas consolas
4. **Bundle ID** en iOS debe coincidir con el configurado en Firebase

## 🐛 Debugging

- Revisa la consola de Expo para errores de autenticación
- Verifica que los Client IDs estén correctos
- Asegúrate de que los proveedores estén habilitados en Firebase Console
- Comprueba que los URL schemes estén configurados correctamente

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles.
