# 🔐 Hook de Autenticación Firebase

Este sistema proporciona un hook personalizado para manejar autenticación con Firebase usando email y password.

## 📁 Estructura de Archivos

```
📦 Tu Proyecto
├── 🔧 firebaseConfig.js          # Ya existente - Configuración Firebase
├── 🪝 hooks/useAuth.js           # Hook de autenticación personalizado
├── 🌐 contexts/AuthProvider.js   # Contexto de autenticación
├── 🧩 components/AuthExample.js  # Componente de ejemplo
└── 📖 examples/App.example.js    # Ejemplo de integración
```

## 🚀 Cómo Usar

### 1. Envolver tu app con AuthProvider

```javascript
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <AuthProvider>
      {/* Tu aplicación aquí */}
    </AuthProvider>
  );
}
```

### 2. Usar el hook en cualquier componente

```javascript
import { useAuthContext } from '../contexts/AuthProvider';

function MiComponente() {
  const { user, login, logout, isAuthenticated } = useAuthContext();

  // Tu lógica aquí
}
```

## 🛠️ Funciones Disponibles

### `useAuthContext()` retorna:

- **`user`** - Objeto del usuario actual (null si no está autenticado)
- **`loading`** - Boolean indicando si hay una operación en progreso
- **`error`** - String con el último error (null si no hay errores)
- **`isAuthenticated`** - Boolean indicando si el usuario está autenticado

### Métodos disponibles:

- **`login(email, password)`** - Iniciar sesión
- **`register(email, password, displayName)`** - Crear cuenta nueva
- **`logout()`** - Cerrar sesión
- **`getCurrentUser()`** - Obtener usuario actual

## 📝 Ejemplos de Uso

### Login
```javascript
const { login } = useAuthContext();

const handleLogin = async () => {
  const result = await login('user@example.com', 'password');
  if (result.success) {
    console.log('Login exitoso!');
  } else {
    console.error('Error:', result.error);
  }
};
```

### Registro
```javascript
const { register } = useAuthContext();

const handleRegister = async () => {
  const result = await register('user@example.com', 'password', 'Juan Pérez');
  if (result.success) {
    console.log('Cuenta creada!');
  }
};
```

### Logout
```javascript
const { logout } = useAuthContext();

const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    console.log('Sesión cerrada!');
  }
};
```

### Verificar estado de autenticación
```javascript
const { user, isAuthenticated } = useAuthContext();

if (isAuthenticated) {
  return <PantallaPrincipal />;
} else {
  return <PantallaLogin />;
}
```

## 🔑 Propiedades del Usuario

Cuando el usuario está autenticado, el objeto `user` contiene:

```javascript
{
  uid: "string",           // ID único del usuario
  email: "string",         // Email del usuario
  displayName: "string",   // Nombre del usuario (puede ser null)
  emailVerified: boolean,  // Si el email está verificado
  // ... otras propiedades de Firebase
}
```

## ⚠️ Notas Importantes

1. **Persistencia**: Firebase maneja automáticamente la persistencia de sesión
2. **Escucha de cambios**: El hook escucha automáticamente cambios en el estado de autenticación
3. **Manejo de errores**: Todos los métodos retornan `{ success: boolean, error?: string }`
4. **Cleanup**: El hook se limpia automáticamente cuando el componente se desmonta

## 🎯 Próximos Pasos

### 🚨 **SOLUCIÓN ERROR GOOGLE OAUTH** 
Si ves "Error 400: invalid_request", sigue estos pasos:

1. **📋 Google Cloud Console** (OBLIGATORIO):
   - Ve a: https://console.cloud.google.com/
   - Proyecto: `diario-estoico-5225c`
   - "APIs y servicios" > "Credenciales"
   - Crear "ID de cliente OAuth 2.0"
   - **Orígenes JavaScript**: `http://localhost:3000`, `http://localhost:19006`
   - **URIs redirección**: `http://localhost:3000`, `http://localhost:19006`

2. **🔥 Firebase Console** (OBLIGATORIO):
   - Ve a: https://console.firebase.google.com/
   - Proyecto: `diario-estoico-5225c`
   - "Authentication" > "Sign-in method" > Habilitar "Google"
   - "Authentication" > "Settings" > "Authorized domains" > Añadir: `localhost`

3. **🔧 Actualizar Configuración**:
   - Edita: `config/google-oauth.config.js`
   - Reemplaza `TU_GOOGLE_CLIENT_ID_WEB` con tu Client ID real

4. **✅ Verificar**:
   ```javascript
   import { checkGoogleOAuthConfig } from './utils/check-oauth-config.js';
   checkGoogleOAuthConfig(); // Ejecuta esto para verificar
   ```

### Para usar este sistema:

1. ✅ Tu `firebaseConfig.js` ya está configurado
2. 🔗 Integra el `AuthProvider` en tu app principal
3. 🪝 Usa `useAuthContext()` en tus componentes
4. 🎨 Personaliza la UI según tus necesidades

¡Ya tienes todo listo para manejar autenticación en tu app! 🚀