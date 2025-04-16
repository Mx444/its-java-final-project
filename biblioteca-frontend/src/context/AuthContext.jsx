import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(window.atob(base64));
      console.log("Token decodificato:", decodedToken); // Debug
      return decodedToken;
    } catch (e) {
      console.error("Errore nella decodifica del token:", e);
      return null;
    }
  };
  
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    const decodedToken = parseJwt(token);
    if (!decodedToken) return true;
    
    if (!decodedToken.exp) return false;
    
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime > expirationTime;
  };

  const validateToken = useCallback(() => {
    const token = localStorage.getItem('token');
    
    if (!token || isTokenExpired(token.replace(/"/g, ''))) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/login');
      return false;
    }
    
    return true;
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const tokenStr = token.replace(/"/g, '');
      
      if (isTokenExpired(tokenStr)) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        navigate('/login');
      } else {
        const decodedToken = parseJwt(tokenStr);
        
        if (decodedToken) {
          setCurrentUser({
            token: tokenStr,
            id: decodedToken.id,
            name:decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role
          });
        }
      }
    }
    
    setLoading(false);
  }, [navigate]);

  const login = (userData) => {
    localStorage.setItem('token', JSON.stringify(userData.token));
    const decodedToken = parseJwt(userData.token);
    
    setCurrentUser({
      token: userData.token,
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role
    });
    
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } else {
      navigate('/books');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  const isAdmin = () => {
    const hasAdminRole = currentUser && 
      (currentUser.role === 'ROLE_ADMIN' || 
       (Array.isArray(currentUser.roles) && currentUser.roles.includes('ROLE_ADMIN')));
    
    console.log("Verifica ruolo admin:", hasAdminRole, currentUser); // Debug
    return hasAdminRole;
  };
  
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isAdmin, 
      loading,
      validateToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};