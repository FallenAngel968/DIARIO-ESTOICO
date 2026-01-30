// App.js - Ejemplo de integración
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { AuthProvider } from './contexts/AuthProvider';
import { AuthExample } from './components/AuthExample';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <AuthExample />
      </AuthProvider>
    </SafeAreaView>
  );
}

// Si estás usando React (web), puedes usar este ejemplo:
/*
import React from 'react';
import { AuthProvider } from './contexts/AuthProvider';
import { AuthExample } from './components/AuthExample';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AuthExample />
      </AuthProvider>
    </div>
  );
}

export default App;
*/