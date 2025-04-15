import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, TextField, Button, Typography, Box, Paper,
  Alert, CircularProgress, Avatar, Divider
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/auth.service';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await authService.login(email, password);
      login(data);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login. Controlla le credenziali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 0, 
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          {/* Blue accent bar */}
          <Box sx={{ bgcolor: '#1a237e', height: '8px' }} />
          
          <Box sx={{ py: 4, px: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(26, 35, 126, 0.1)', 
                  color: '#1a237e',
                  mb: 2
                }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" fontWeight={500} color="#1a237e">
                Biblioteca Digitale
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Accedi al tuo account
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: '8px' }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  bgcolor: '#1a237e',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#303f9f'
                  }
                }}
                disabled={loading}
                startIcon={loading ? undefined : <LoginIcon />}
              >
                {loading ? <CircularProgress size={24} /> : 'Accedi'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;