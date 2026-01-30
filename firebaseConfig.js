// ⚠️ DEPRECATED - Usa /config/firebase-config.js en su lugar
// Este archivo se mantiene solo para compatibilidad hacia atrás

import { analytics, app, auth, db } from './config/firebase-config';

console.warn('⚠️ firebaseConfig.js está deprecado. Por favor importa desde config/firebase-config.js');

export { analytics, app, auth, db };

export default app;
