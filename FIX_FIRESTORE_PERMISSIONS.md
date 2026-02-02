# 🔐 Solución: Actualizar Reglas de Firestore

## ⚠️ Problema
```
ERROR: Missing or insufficient permissions
```

Las reglas de seguridad de Firestore **han expirado** (vencieron el 29 de agosto 2025) y están bloqueando todas las operaciones.

---

## ✅ Solución: Aplicar nuevas reglas

He actualizado [firestore.rules](firestore.rules) con reglas seguras que permiten a usuarios autenticados acceder a sus propias notas.

### Opción 1: Usando Firebase CLI (Recomendado)

1. **Instala Firebase CLI** (si no lo tienes):
```bash
npm install -g firebase-tools
```

2. **Inicia sesión en Firebase**:
```bash
firebase login
```

3. **Desvuélcate a la carpeta del proyecto**:
```bash
cd a:\SSD_ANGEL\ANGELL\PERSONAL\DIARIO-ESTOICO
```

4. **Despliega las reglas actualizadas**:
```bash
firebase deploy --only firestore:rules
```

✅ **¡Listo!** Las reglas se han actualizado.

---

### Opción 2: Usando Firebase Console (Manual)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto: `diario-estoico-5225c`
3. Abre **Firestore Database** → **Rules**
4. Reemplaza el contenido con esto:

```javascript
rules_version='2'

service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para el diario - Solo usuarios autenticados pueden acceder a sus propias notas
    match /diarios/{userId}/entries/{document=**} {
      allow read, write, delete: if request.auth.uid == userId;
    }

    // Permitir lectura y escritura en la colección raíz para usuarios autenticados
    match /diarios/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Denegar acceso a todo lo demás por defecto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click en **Publish** (botón azul)

✅ **¡Listo!** Las reglas se han actualizado.

---

## 🔍 ¿Qué hacen estas reglas?

✅ **Usuarios autenticados** pueden leer, escribir y eliminar sus propias notas  
✅ **Cada usuario solo ve sus propias notas** (seguridad de privacidad)  
❌ **Usuarios no autenticados** no pueden acceder a nada  
❌ **Usuarios no pueden ver notas de otros usuarios**

---

## 🧪 Prueba después de actualizar

1. Cierra la app completamente
2. Recarga la app o presiona `R` en la terminal de Expo
3. Inicia sesión
4. Abre la sección "Diario"
5. Presiona el botón (+) para crear una nota
6. ✅ Debería guardar sin errores

---

## 📊 Estructura esperada en Firestore

```
diario-estoico-5225c
└── diarios/
    └── {uid-del-usuario}/
        └── entries/
            ├── nota1/ ✅ Solo el usuario puede acceder
            ├── nota2/ ✅ Solo el usuario puede acceder
            └── nota3/ ✅ Solo el usuario puede acceder
```

---

## ✅ Checklist

- [ ] He actualizado las reglas (Opción 1 o 2)
- [ ] Las reglas están publicadas en Firebase Console
- [ ] Cierro y recargo la app
- [ ] Inicio sesión
- [ ] Intento crear una nota nueva
- [ ] ✅ ¡La nota se guarda correctamente!

---

## ❓ Si sigue sin funcionar

**Verifica:**
1. Estés logueado (usuario autenticado)
2. Firebase Console muestre las nuevas reglas publicadas
3. La app esté recompilada después de cambiar las reglas
4. Tu proyecto sea: `diario-estoico-5225c`

**Si aún falla:**
- Abre la consola de Firebase: `firebaseConfig.js` línea donde dice `projectId`
- Verifica que sea correcto
- Prueba con reglas temporales (menos seguras pero para testear):

```javascript
rules_version='2'

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
