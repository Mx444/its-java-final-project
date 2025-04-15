// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import BookList from './components/user/BookList';
import LoansList from './components/user/LoansList';
import AdminBookList from './components/admin/AdminBookList';
import AllLoans from './components/admin/AllLoans';
import ReportPage from './components/admin/ReportPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

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
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/books" />} />
            
            {/* User Routes */}
            <Route 
              path="/books" 
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-loans" 
              element={
                <ProtectedRoute>
                  <LoansList />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/books" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminBookList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/loans" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AllLoans />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <ReportPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;