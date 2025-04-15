import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <SecurityIcon sx={{ fontSize: 80, color: '#d32f2f', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom color="#d32f2f">
          Accesso Non Autorizzato
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Non hai i permessi necessari per accedere a questa pagina.
          Questa funzionalità è riservata agli amministratori.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/books')}
          sx={{ mr: 2 }}
        >
          Torna al Catalogo
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;