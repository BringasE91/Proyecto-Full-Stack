// src/context/AuthContext.jsx
// Provee el contexto de autenticación (login, logout y usuario actual) usando JWT y localStorage.

import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Esto es correcto


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('tokens') ? jwtDecode(localStorage.getItem('tokens')) : null
  );

  const loginUser = async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('tokens', JSON.stringify(data));
      return true;
    } else {
      alert(data.detail || 'Error al iniciar sesión');
      return false;
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('tokens');
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
