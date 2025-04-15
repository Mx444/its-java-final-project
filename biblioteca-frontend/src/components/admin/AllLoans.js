// src/components/admin/AllLoans.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, Alert
} from '@mui/material';
import adminService from '../../services/admin.service';

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllLoans();
  }, []);

  const fetchAllLoans = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllLoans();
      setLoans(response.data);
      setError('');
    } catch (err) {
      setError('Errore durante il caricamento dei prestiti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tutti i Prestiti
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Utente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Libro</TableCell>
              <TableCell>Data Inizio</TableCell>
              <TableCell>Data Fine</TableCell>
              <TableCell>Stato</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.utente.nome}</TableCell>
                <TableCell>{loan.utente.email}</TableCell>
                <TableCell>{loan.libro.titolo}</TableCell>
                <TableCell>{formatDate(loan.dataInizio)}</TableCell>
                <TableCell>{formatDate(loan.dataFine)}</TableCell>
                <TableCell>
                  <Chip 
                    label={loan.restituito ? 'Restituito' : 'In prestito'} 
                    color={loan.restituito ? 'success' : 'warning'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllLoans;