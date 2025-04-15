import React, { useState, useEffect } from "react";
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  CircularProgress, Alert, Chip, Tooltip, Divider, IconButton
} from "@mui/material";
import userService from "../../services/user.service";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [returningLoan, setReturningLoan] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyLoans();
      setLoans(response.data);
      setError("");
    } catch (err) {
      setError("Errore durante il caricamento dei prestiti");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      setReturningLoan(loanId);
      const response = await userService.returnBook(loanId);
      if (response.data.success) {
        setSuccess("Libro restituito con successo");
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
        fetchLoans();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Errore durante la restituzione del libro");
    } finally {
      setReturningLoan(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = (loan) => {
    if (loan.restituito) return false;
    const today = new Date();
    const dueDate = new Date(loan.dataFine);
    return today > dueDate;
  };

  const getDaysStatus = (loan) => {
    if (loan.restituito) return { days: 0, status: 'returned' };
    
    const today = new Date();
    const dueDate = new Date(loan.dataFine);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { days: Math.abs(diffDays), status: 'overdue' };
    } else {
      return { days: diffDays, status: 'remaining' };
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh">
        <CircularProgress size={60} thickness={4} sx={{ color: '#1a237e', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Caricamento prestiti...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4
      }}>
        <LibraryBooksIcon sx={{ fontSize: 32, color: '#1a237e', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight={500} color="#1a237e">
            I Miei Prestiti
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Storico dei libri presi in prestito
          </Typography>
        </Box>
      </Box>

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
          sx={{ mb: 3, borderRadius: '8px', animation: 'fadeIn 0.5s' }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {loans.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box 
              sx={{ 
                bgcolor: 'rgba(26, 35, 126, 0.1)', 
                borderRadius: '50%', 
                p: 2,
                mb: 2
              }}
            >
              <LibraryBooksIcon sx={{ fontSize: 40, color: '#1a237e' }} />
            </Box>
            <Typography variant="h6" gutterBottom color="#1a237e">
              Nessun prestito attivo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '500px' }}>
              Non hai prestiti attivi al momento. Visita il nostro catalogo per scoprire i libri disponibili.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#1a237e',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                '&:hover': {
                  bgcolor: '#303f9f'
                }
              }}
              startIcon={<ArrowCircleLeftIcon />}
              href="/books"
            >
              Sfoglia il Catalogo
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ bgcolor: '#1a237e', height: '8px' }} />
          
          <TableContainer component={Box}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(26, 35, 126, 0.03)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Titolo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Autore</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data Inizio</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data Fine</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Stato</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data Restituzione</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map((loan) => {
                  const daysStatus = getDaysStatus(loan);
                  
                  return (
                    <TableRow 
                      key={loan.id}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        transition: 'background-color 0.2s',
                        bgcolor: isOverdue(loan) ? 'rgba(211, 47, 47, 0.04)' : 'inherit'
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {loan.libro.titolo}
                      </TableCell>
                      <TableCell>{loan.libro.autore}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                          {formatDate(loan.dataInizio)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: isOverdue(loan) ? '#d32f2f' : 'text.secondary', mr: 0.5 }} />
                          {formatDate(loan.dataFine)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {loan.restituito ? (
                          <Chip 
                            icon={<CheckCircleIcon />}
                            label="Restituito" 
                            size="small"
                            color="success"
                            sx={{ fontWeight: 500 }}
                          />
                        ) : isOverdue(loan) ? (
                          <Tooltip title={`In ritardo di ${daysStatus.days} ${daysStatus.days === 1 ? 'giorno' : 'giorni'}`}>
                            <Chip 
                              icon={<ErrorIcon />}
                              label="In ritardo" 
                              size="small"
                              color="error"
                              sx={{ fontWeight: 500 }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title={`${daysStatus.days} ${daysStatus.days === 1 ? 'giorno' : 'giorni'} rimanenti`}>
                            <Chip 
                              label="In prestito" 
                              size="small"
                              color="warning"
                              sx={{ fontWeight: 500 }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {loan.restituito && loan.dataRestituzione ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventAvailableIcon sx={{ fontSize: 16, color: '#2e7d32', mr: 0.5 }} />
                            {formatDate(loan.dataRestituzione)}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            ---
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {!loan.restituito && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleReturnBook(loan.id)}
                            disabled={returningLoan === loan.id}
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: '8px',
                              bgcolor: '#1a237e',
                              '&:hover': {
                                bgcolor: '#303f9f'
                              }
                            }}
                            startIcon={returningLoan === loan.id ? <AutorenewIcon className="rotating" /> : <ArrowCircleLeftIcon />}
                          >
                            {returningLoan === loan.id ? 'Restituzione...' : 'Restituisci'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Typography variant="body2" color="text.secondary">
              {loans.length} {loans.length === 1 ? 'prestito' : 'prestiti'} totali
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loans.filter(loan => !loan.restituito).length} {loans.filter(loan => !loan.restituito).length === 1 ? 'prestito attivo' : 'prestiti attivi'}
            </Typography>
          </Box>
        </Box>
      )}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .rotating {
          animation: rotate 1s linear infinite;
        }
      `}</style>
    </Container>
  );
};

export default LoansList;