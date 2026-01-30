// config/google-oauth.config.js
// 🔧 CONFIGURACIÓN GOOGLE OAUTH

/*
🚨 ANTES DE USAR:

1. Ve a Google Cloud Console: https://console.cloud.google.com/
2. Selecciona tu proyecto: diario-estoico-5225c
3. Ve a "APIs y servicios" > "Credenciales"
4. Crea "ID de cliente OAuth 2.0"
5. Configura:
   - Tipo: Aplicación web
   - Orígenes JavaScript autorizados:
     * http://localhost:3000
     * http://localhost:19006
     * https://localhost:3000
   - URIs de redirección:
     * http://localhost:3000
     * http://localhost:19006

6. Copia el Client ID y pégalo abajo
*/

export const GOOGLE_OAUTH_CONFIG = {
  // 🔑 REEMPLAZA CON TU CLIENT ID REAL DE GOOGLE CONSOLE
  // Ejemplo: '123456789012-abc123def456ghi789jkl012mno345pqr.apps.googleusercontent.com'
  // ⬇️ PEGA TU CLIENT ID AQUÍ (debe terminar en .apps.googleusercontent.com)
  WEB_CLIENT_ID: '999144177603-4kv7o6rkr6iqcvmea3mpf4jmr86d1qj0.apps.googleusercontent.com',
  
  // 📱 Para móvil (opcional - solo si desarrollas para móvil)
  IOS_CLIENT_ID: 'TU_GOOGLE_CLIENT_ID_IOS.apps.googleusercontent.com',
  ANDROID_CLIENT_ID: 'TU_GOOGLE_CLIENT_ID_ANDROID.apps.googleusercontent.com',
  
  // ⚙️ Configuración
  SCOPES: ['profile', 'email', 'openid'],
  
  // 🌐 Para desarrollo local
  REDIRECT_URI: 'http://localhost:3000',
  
  // 🔗 Para Expo
  EXPO_REDIRECT_URI: 'exp://localhost:19000/--/',
};

// 📋 INSTRUCCIONES DETALLADAS:
/*
1. 🔧 GOOGLE CLOUD CONSOLE:
   - Proyecto: diario-estoico-5225c
   - APIs habilitadas:
     * Google Identity Toolkit API
     * Firebase Authentication API

2. 🔥 FIREBASE CONSOLE:
   - Authentication > Sign-in method
   - Habilitar "Google"
   - Dominios autorizados: localhost, 127.0.0.1

3. 🎯 TESTING:
   - Web: http://localhost:3000
   - Expo: http://localhost:19006
   - Producción: Tu dominio HTTPS

4. ⚠️ NOTAS:
   - Usa HTTPS en producción
   - Los dominios deben coincidir exactamente
   - Guarda este archivo como .env para seguridad
*/