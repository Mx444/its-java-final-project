import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  CircularProgress, Alert
} from '@mui/material';
import userService from '../../services/user.service';

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyLoans();
      setLoans(response.data);
      setError('');
    } catch (err) {
      setError('Errore durante il caricamento dei prestiti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      const response = await userService.returnBook(loanId);
      if (response.data.success) {
        setSuccess('Libro restituito con successo');
        fetchLoans();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la restituzione del libro');
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
        I Miei Prestiti
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      {loans.length === 0 ? (
        <Alert severity="info">Non hai prestiti attivi al momento.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titolo</TableCell>
                <TableCell>Autore</TableCell>
                <TableCell>Data Inizio</TableCell>
                <TableCell>Data Fine</TableCell>
                <TableCell>Stato</TableCell>
                <TableCell>Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.libro.titolo}</TableCell>
                  <TableCell>{loan.libro.autore}</TableCell>
                  <TableCell>{formatDate(loan.dataInizio)}</TableCell>
                  <TableCell>{formatDate(loan.dataFine)}</TableCell>
                  <TableCell>
                    {loan.restituito ? 'Restituito' : 'In prestito'}
                  </TableCell>
                  <TableCell>
                    {!loan.restituito && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        onClick={() => handleReturnBook(loan.id)}
                      >
                        Restituisci
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default LoansList;