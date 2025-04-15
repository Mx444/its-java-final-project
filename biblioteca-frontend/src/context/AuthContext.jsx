import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenStr = token.replace(/"/g, '');
      const decodedToken = parseJwt(tokenStr);
      
      if (decodedToken) {
        setCurrentUser({
          token: tokenStr,
          id: decodedToken.id,
          email: decodedToken.email,
          role: decodedToken.role
        });
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', JSON.stringify(userData.token));
    const decodedToken = parseJwt(userData.token);
    
    setCurrentUser({
      token: userData.token,
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === 'ROLE_ADMIN';
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};