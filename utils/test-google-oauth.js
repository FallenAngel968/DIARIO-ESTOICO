// utils/test-google-oauth.js
// 🧪 SCRIPT PARA PROBAR CONFIGURACIÓN GOOGLE OAUTH

/*
INSTRUCCIONES:
1. Configura tu Client ID en config/google-oauth.config.js
2. Ejecuta este script para verificar
3. Si todo está bien, el login de Google debería funcionar
*/

import { GOOGLE_OAUTH_CONFIG } from '../config/google-oauth.config.js';

export const testGoogleOAuthConfig = () => {
  console.log('🧪 PROBANDO CONFIGURACIÓN GOOGLE OAUTH\n');
  
  // Verificar Client ID
  const clientId = GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID;
  
  console.log('📋 CONFIGURACIÓN ACTUAL:');
  console.log(`Client ID: ${clientId}`);
  console.log('');
  
  // Validaciones
  const validations = [];
  
  if (clientId === 'TU_GOOGLE_CLIENT_ID_WEB.apps.googleusercontent.com') {
    validations.push('❌ Client ID no configurado');
    console.log('🚨 ERROR: Aún no has configurado tu Client ID');
    console.log('');
    console.log('📋 PASOS PARA CONFIGURAR:');
    console.log('1. Ve a: https://console.cloud.google.com/apis/credentials');
    console.log('2. Proyecto: diario-estoico-5225c');
    console.log('3. Crea "ID de cliente OAuth 2.0"');
    console.log('4. Copia el Client ID');
    console.log('5. Pégalo en config/google-oauth.config.js');
    console.log('');
    return false;
  }
  
  if (!clientId.endsWith('.apps.googleusercontent.com')) {
    validations.push('❌ Formato de Client ID incorrecto');
    console.log('🚨 ERROR: El Client ID debe terminar en .apps.googleusercontent.com');
    console.log('');
    console.log('✅ FORMATO CORRECTO:');
    console.log('123456789012-abc123def456ghi789jkl012mno345pqr.apps.googleusercontent.com');
    console.log('');
    return false;
  }
  
  if (clientId.length < 50) {
    validations.push('⚠️ Client ID parece muy corto');
    console.log('⚠️ ADVERTENCIA: El Client ID parece muy corto');
    console.log('Verifica que hayas copiado el ID completo');
    console.log('');
  }
  
  if (validations.length === 0) {
    console.log('✅ CONFIGURACIÓN CORRECTA!');
    console.log('');
    console.log('🎯 PRÓXIMOS PASOS:');
    console.log('1. Asegúrate de que en Google Cloud Console tengas:');
    console.log('   - Orígenes JavaScript: http://localhost:3000, http://localhost:19006');
    console.log('   - URIs de redirección: http://localhost:3000, http://localhost:19006');
    console.log('');
    console.log('2. En Firebase Console:');
    console.log('   - Authentication > Sign-in method > Google (habilitado)');
    console.log('');
    console.log('3. Prueba el login en tu app');
    console.log('');
    return true;
  }
  
  return false;
};

// Función para mostrar el Client ID de forma segura (ocultando partes)
export const showClientIdSafely = () => {
  const clientId = GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID;
  
  if (clientId === 'TU_GOOGLE_CLIENT_ID_WEB.apps.googleusercontent.com') {
    return 'No configurado';
  }
  
  // Mostrar solo los primeros y últimos caracteres
  if (clientId.length > 20) {
    const start = clientId.substring(0, 10);
    const end = clientId.substring(clientId.length - 15);
    return `${start}...${end}`;
  }
  
  return clientId;
};

// Para usar en desarrollo
if (typeof window !== 'undefined') {
  window.testGoogleOAuth = testGoogleOAuthConfig;
  window.showClientId = showClientIdSafely;
  console.log('🔧 Funciones disponibles en consola:');
  console.log('- testGoogleOAuth() - Verificar configuración');
  console.log('- showClientId() - Mostrar Client ID de forma segura');
}