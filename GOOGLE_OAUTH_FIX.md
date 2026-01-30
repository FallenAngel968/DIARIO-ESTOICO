# 🔐 Solución: Error Google OAuth 2.0

## ❌ **Error Actual**
```
Error 400: invalid_request
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy
```

## 🛠️ **Soluciones Paso a Paso**

### 1. 🔧 **Configurar Google Console**

#### Paso 1: Ir a Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto `diario-estoico-5225c`
3. Habilita las APIs necesarias

#### Paso 2: Habilitar APIs
```bash
# APIs requeridas:
- Google Identity Toolkit API
- Firebase Authentication API
```

#### Paso 3: Configurar OAuth 2.0
1. Ve a **"APIs y servicios" > "Credenciales"**
2. Clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"ID de cliente de OAuth 2.0"**

#### Paso 4: Configurar Cliente OAuth
```
Tipo de aplicación: Aplicación web
Nombre: Diario Estoico
Orígenes autorizados de JavaScript:
- http://localhost:3000
- http://localhost:19006
- https://tu-dominio.com (cuando tengas uno)

URIs de redirección autorizados:
- http://localhost:3000
- http://localhost:19006
- https://auth.expo.io/@tu-usuario/diario-estoico
```

### 2. 📱 **Para Expo/React Native**

#### Configurar en Firebase Console:
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication > Sign-in method**
4. Habilita **Google**
5. Añade estos dominios autorizados:
   - `localhost`
   - `expo.io`
   - `*.expo.io`

### 3. 🔑 **Actualizar Configuración del Proyecto**

#### Para Expo:
Añade a tu `app.json`:
```json
{
  "expo": {
    "scheme": "diario-estoico",
    "platforms": ["ios", "android", "web"],
    "web": {
      "bundler": "metro"
    }
  }
}
```

#### Para Web (si usas React):
Añade a tu dominio en Google Console:
- `http://localhost:3000`
- Tu dominio de producción

### 4. 🚀 **Método Alternativo: Usar Firebase Auth UI**

Si sigues teniendo problemas, puedes usar Firebase Auth UI que maneja automáticamente OAuth:

```bash
npm install firebaseui
```

### 5. ⚡ **Solución Rápida para Desarrollo**

Para desarrollo local, añade estos dominios en Firebase Console:
1. Ve a **Authentication > Settings > Authorized domains**
2. Añade:
   - `localhost`
   - `127.0.0.1`

### 6. 🔍 **Verificar Configuración**

Asegúrate de que en tu `firebaseConfig.js` tengas:
- `authDomain` correcto
- `apiKey` válida
- Proyecto correcto seleccionado

## ⚠️ **Notas Importantes**

1. **Desarrollo vs Producción**: Los dominios deben estar autorizados en ambos entornos
2. **HTTPS**: En producción, Google requiere HTTPS
3. **Dominios exactos**: Los dominios deben coincidir exactamente
4. **Expo**: Si usas Expo, usa el esquema correcto

## 🎯 **Pasos Inmediatos**

1. ✅ Ir a Google Cloud Console
2. ✅ Habilitar APIs necesarias  
3. ✅ Crear credenciales OAuth 2.0
4. ✅ Añadir dominios autorizados
5. ✅ Actualizar Firebase Console
6. ✅ Probar de nuevo

¿En qué plataforma estás desarrollando? (Web, Expo, React Native)