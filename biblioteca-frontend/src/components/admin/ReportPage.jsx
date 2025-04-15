import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid,
  CircularProgress, Alert, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody, Divider,
  Chip, Tooltip
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import adminService from '../../services/admin.service';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const ReportPage = () => {
  const [bookStats, setBookStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBookReports();
      setBookStats(response.data);
      setError('');
    } catch (err) {
      setError('Errore durante il caricamento dei report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Total number of loans
  const totalLoans = bookStats.reduce((sum, book) => sum + book.numeroPrestiti, 0);

  // Chart configuration
  const chartData = {
    labels: bookStats.slice(0, 10).map(book => {
      // Truncate titles that are too long
      return book.titolo.length > 25 ? book.titolo.substring(0, 22) + '...' : book.titolo;
    }),
    datasets: [
      {
        label: 'Numero di Prestiti',
        data: bookStats.slice(0, 10).map(book => book.numeroPrestiti),
        backgroundColor: 'rgba(26, 35, 126, 0.7)',
        borderColor: '#1a237e',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 30,
        maxBarThickness: 40
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Top 10 Libri Più Richiesti',
        font: {
          family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        },
        color: '#1a237e'
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const originalIndex = bookStats.findIndex(book => 
              book.titolo.startsWith(context[0].label.replace('...', '')));
            return bookStats[originalIndex]?.titolo || context[0].label;
          },
          label: function(context) {
            return `Prestiti: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh">
        <CircularProgress size={60} thickness={4} sx={{ color: '#1a237e', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Analisi dei dati in corso...</Typography>
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
        <AssessmentIcon sx={{ fontSize: 32, color: '#1a237e', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight={500} color="#1a237e">
            Report Statistici
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analisi dei prestiti e dei libri più popolari
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
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '12px', 
              boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  bgcolor: 'rgba(26, 35, 126, 0.1)', 
                  borderRadius: '50%', 
                  p: 1,
                  mr: 2
                }}
              >
                <MenuBookIcon sx={{ color: '#1a237e' }} />
              </Box>
              <Typography variant="h6" fontWeight={500}>
                Libri Analizzati
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight={700} color="#1a237e" sx={{ mb: 1 }}>
              {bookStats.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Titoli presenti nel report
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '12px', 
              boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  bgcolor: 'rgba(46, 125, 50, 0.1)', 
                  borderRadius: '50%', 
                  p: 1,
                  mr: 2
                }}
              >
                <TrendingUpIcon sx={{ color: '#2e7d32' }} />
              </Box>
              <Typography variant="h6" fontWeight={500}>
                Prestiti Totali
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight={700} color="#2e7d32" sx={{ mb: 1 }}>
              {totalLoans}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Numero totale di prestiti registrati
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '12px', 
              boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  bgcolor: 'rgba(211, 47, 47, 0.1)', 
                  borderRadius: '50%', 
                  p: 1,
                  mr: 2
                }}
              >
                <PersonIcon sx={{ color: '#d32f2f' }} />
              </Box>
              <Typography variant="h6" fontWeight={500}>
                Libro Più Letto
              </Typography>
            </Box>
            {bookStats.length > 0 && (
              <>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                  {bookStats[0].titolo}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" fontWeight={500} color="#d32f2f">
                    {bookStats[0].numeroPrestiti} prestiti
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({bookStats[0].autore})
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Chart */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 0, 
          mb: 4, 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ bgcolor: '#1a237e', height: '8px' }} />
        
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Grafico Prestiti per Libro
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            I 10 libri più richiesti dagli utenti della biblioteca
          </Typography>
          
          <Box height={400} sx={{ pt: 2 }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
        </Box>
      </Paper>
      
      {/* Table */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ bgcolor: '#1a237e', height: '8px' }} />
        
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={500}>
            Classifica Completa
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Tutti i libri ordinati per numero di prestiti
          </Typography>
        </Box>
        
        <Divider />
        
        <TableContainer component={Box}>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(26, 35, 126, 0.03)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Posizione</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Titolo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Autore</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Prestiti</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookStats.map((book, index) => (
                <TableRow 
                  key={book.idLibro}
                  sx={{ 
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                    transition: 'background-color 0.2s',
                    bgcolor: index < 3 ? 'rgba(26, 35, 126, 0.02)' : 'inherit'
                  }}
                >
                  <TableCell>
                    {index < 3 ? (
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small"
                        sx={{ 
                          bgcolor: index === 0 ? 'rgba(255, 193, 7, 0.1)' : 
                                  index === 1 ? 'rgba(158, 158, 158, 0.1)' : 
                                  'rgba(176, 141, 87, 0.1)',
                          color: index === 0 ? '#ff9800' : 
                                index === 1 ? '#757575' : 
                                '#b08d57',
                          fontWeight: 'bold',
                          minWidth: '40px'
                        }}
                      />
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: index < 3 ? 500 : 'inherit' }}>
                    {book.titolo}
                  </TableCell>
                  <TableCell>{book.autore}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={book.numeroPrestiti} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(26, 35, 126, 0.1)',
                        color: '#1a237e',
                        fontWeight: 'bold',
                        minWidth: '40px'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              
              {bookStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Nessun dato disponibile
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Non ci sono ancora prestiti registrati nel sistema
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ReportPage;