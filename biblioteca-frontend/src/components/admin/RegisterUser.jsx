import React, { useState } from 'react';
import { 
  Container, TextField, Button, Typography, Box, Paper,
  Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem,
  Avatar, Divider, InputAdornment, Chip, IconButton, Tooltip
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import authHeader from '../../services/auth-header';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    ruolo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ruolo) {
      setError('Seleziona un ruolo per l\'utente');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await axios.post(
        'http://localhost:8080/api/auth/register', 
        formData,
        { headers: authHeader() }
      );
      setSuccess('Utente registrato con successo');
      setFormData({
        nome: '',
        email: '',
        password: '',
        ruolo: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 6 }}>
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
          
          <Box sx={{ py: 4, px: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#1a237e', 
                  color: 'white',
                  mr: 2,
                }}
              >
                <PersonAddIcon />
              </Avatar>
              <Box>
                <Typography component="h1" variant="h5" fontWeight={500} color="#1a237e">
                  Registra Nuovo Utente
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Crea un account per permettere l'accesso alla biblioteca
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: '8px' }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ mb: 3, borderRadius: '8px' }}
                onClose={() => setSuccess('')}
              >
                {success}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nome"
                label="Nome Completo"
                name="nome"
                autoFocus
                value={formData.nome}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
              
              <FormControl 
                fullWidth 
                margin="normal" 
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              >
                <InputLabel id="role-label">Ruolo</InputLabel>
                <Select
                  labelId="role-label"
                  id="ruolo"
                  name="ruolo"
                  value={formData.ruolo}
                  label="Ruolo"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="ROLE_USER" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                    <Typography>Utente</Typography>
                    <Chip 
                      label="Standard" 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        fontSize: '0.7rem', 
                        bgcolor: 'rgba(26, 35, 126, 0.08)',
                        color: '#1a237e'
                      }} 
                    />
                  </MenuItem>
                  <MenuItem value="ROLE_ADMIN" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                    <Typography>Amministratore</Typography>
                    <Chip 
                      label="Privilegi elevati" 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        fontSize: '0.7rem', 
                        bgcolor: 'rgba(211, 47, 47, 0.08)', 
                        color: '#d32f2f'
                      }} 
                    />
                    <Tooltip title="Gli amministratori hanno pieno accesso a tutte le funzionalità della biblioteca" arrow>
                      <IconButton size="small" sx={{ ml: 'auto' }}>
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </MenuItem>
                </Select>
              </FormControl>
              
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
                  boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
                  '&:hover': {
                    bgcolor: '#303f9f',
                    boxShadow: '0 6px 16px rgba(26, 35, 126, 0.3)',
                  }
                }}
                disabled={loading}
                startIcon={loading ? undefined : <PersonAddIcon />}
              >
                {loading ? <CircularProgress size={24} /> : 'Registra Utente'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterUser;