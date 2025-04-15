import React, { useState } from 'react';
import { 
  Container, TextField, Button, Typography, Box, Paper,
  Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
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
      <Box sx={{ my: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Registra Nuovo Utente
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            />
            <FormControl fullWidth margin="normal">
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
                <MenuItem value="ROLE_USER">Utente</MenuItem>
                <MenuItem value="ROLE_ADMIN">Amministratore</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Registra'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterUser;