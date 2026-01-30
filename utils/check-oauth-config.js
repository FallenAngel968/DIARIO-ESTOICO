// utils/check-oauth-config.js
// 🔍 VERIFICADOR DE CONFIGURACIÓN GOOGLE OAUTH

import { GOOGLE_OAUTH_CONFIG } from '../config/google-oauth.config.js';

export const checkGoogleOAuthConfig = () => {
  console.log('🔍 VERIFICANDO CONFIGURACIÓN GOOGLE OAUTH...\n');
  
  const issues = [];
  const warnings = [];
  
  // Verificar Client ID
  if (GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID === 'TU_GOOGLE_CLIENT_ID_WEB.apps.googleusercontent.com') {
    issues.push('❌ Client ID no configurado - Actualiza WEB_CLIENT_ID en google-oauth.config.js');
  } else if (!GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID.includes('.apps.googleusercontent.com')) {
    issues.push('❌ Client ID format incorrecto - Debe terminar en .apps.googleusercontent.com');
  } else {
    console.log('✅ Client ID configurado correctamente');
  }
  
  // Verificar configuración Firebase
  console.log('📋 VERIFICACIONES PENDIENTES (manual):');
  console.log('1. Google Cloud Console:');
  console.log('   - Proyecto: diario-estoico-5225c');
  console.log('   - APIs habilitadas: Google Identity Toolkit API');
  console.log('   - OAuth 2.0 Client creado');
  console.log('');
  
  console.log('2. Firebase Console:');
  console.log('   - Authentication > Sign-in method > Google (habilitado)');
  console.log('   - Dominios autorizados: localhost, 127.0.0.1');
  console.log('');
  
  console.log('3. Configuración OAuth en Google Console:');
  console.log('   - Orígenes JavaScript autorizados:');
  console.log('     * http://localhost:3000');
  console.log('     * http://localhost:19006');
  console.log('   - URIs de redirección:');
  console.log('     * http://localhost:3000');
  console.log('     * http://localhost:19006');
  console.log('');
  
  // Mostrar issues
  if (issues.length > 0) {
    console.log('🚨 PROBLEMAS ENCONTRADOS:');
    issues.forEach(issue => console.log(issue));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️ ADVERTENCIAS:');
    warnings.forEach(warning => console.log(warning));
    console.log('');
  }
  
  if (issues.length === 0) {
    console.log('🎉 CONFIGURACIÓN BÁSICA COMPLETA');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Verifica manualmente Google Cloud Console');
    console.log('2. Verifica Firebase Console');
    console.log('3. Prueba el login');
    console.log('');
    console.log('🔗 ENLACES ÚTILES:');
    console.log('- Google Cloud: https://console.cloud.google.com/');
    console.log('- Firebase: https://console.firebase.google.com/');
  } else {
    console.log('⚠️ COMPLETA LA CONFIGURACIÓN ANTES DE CONTINUAR');
  }
  
  return {
    hasIssues: issues.length > 0,
    issues,
    warnings
  };
};

// Función para usar en desarrollo
export const debugOAuth = () => {
  console.log('🐛 DEBUG OAUTH CONFIGURATION:');
  console.log('WEB_CLIENT_ID:', GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID);
  console.log('REDIRECT_URI:', GOOGLE_OAUTH_CONFIG.REDIRECT_URI);
  console.log('SCOPES:', GOOGLE_OAUTH_CONFIG.SCOPES);
  console.log('Current URL:', window?.location?.href || 'Not in browser');
  console.log('Current domain:', window?.location?.hostname || 'Not in browser');
};