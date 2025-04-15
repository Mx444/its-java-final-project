import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading, validateToken, isAdmin } = useContext(AuthContext);
  const location = useLocation();
  
  console.log("ProtectedRoute:", { 
    path: location.pathname, 
    requireAdmin, 
    isUserAdmin: isAdmin(), 
    currentUser 
  });

  useEffect(() => {
    validateToken();
  }, [location.pathname, validateToken]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#1a237e', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Caricamento...</Typography>
      </Box>
    );
  }

  if (!currentUser) {
    console.log("Reindirizzamento al login: utente non autenticato");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    console.log("Accesso negato: ruolo admin richiesto");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;