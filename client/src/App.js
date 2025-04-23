// 🚀 Componente principal de la aplicación
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import { AuthProvider } from './context/AuthContext';

/**
 * Componente principal de la aplicación
 * @returns {JSX.Element} - Componente App
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;