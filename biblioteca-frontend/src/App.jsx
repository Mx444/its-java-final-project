import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import BookList from './components/user/BookList';
import LoansList from './components/user/LoansList';
import AdminBookList from './components/admin/AdminBookList';
import AllLoans from './components/admin/AllLoans';
import RegisterUser from './components/admin/RegisterUser';
import ReportPage from './components/admin/ReportPage';
import Unauthorized from './components/auth/Unauthorized';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Routes>
            {/* Rotte pubbliche */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rotte utente */}
            <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
            <Route path="/my-loans" element={<ProtectedRoute><LoansList /></ProtectedRoute>} />
            
            {/* Rotte amministrative */}
            <Route 
              path="/admin/books" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBookList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/loans" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AllLoans />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/register" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <RegisterUser />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ReportPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Reindirizzamenti default */}
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="*" element={<Navigate to="/books" replace />} />
          </Routes>
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;