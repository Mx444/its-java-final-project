// src/components/admin/ReportPage.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid,
  CircularProgress, Alert, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import adminService from '../../services/admin.service';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const chartData = {
    labels: bookStats.slice(0, 10).map(book => book.titolo),
    datasets: [
      {
        label: 'Numero di Prestiti',
        data: bookStats.slice(0, 10).map(book => book.numeroPrestiti),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'I Libri Più Letti',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
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
        Report - Libri Più Letti
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grafico Libri Più Letti
            </Typography>
            <Box height={400}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Posizione</TableCell>
                    <TableCell>Titolo</TableCell>
                    <TableCell>Autore</TableCell>
                    <TableCell>Numero Prestiti</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookStats.map((book, index) => (
                    <TableRow key={book.idLibro}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{book.titolo}</TableCell>
                      <TableCell>{book.autore}</TableCell>
                      <TableCell>{book.numeroPrestiti}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportPage;