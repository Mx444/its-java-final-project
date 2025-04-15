import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, Alert, TextField, InputAdornment,
  Tabs, Tab, IconButton, Divider, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import adminService from '../../services/admin.service';

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortField, setSortField] = useState('dataInizio');

  useEffect(() => {
    fetchAllLoans();
  }, []);

  useEffect(() => {
    filterAndSortLoans();
  }, [loans, searchTerm, statusFilter, sortDirection, sortField]);

  const fetchAllLoans = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllLoans();
      setLoans(response.data);
      setFilteredLoans(response.data);
      setError('');
    } catch (err) {
      setError('Errore durante il caricamento dei prestiti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLoans = () => {
    // Filter by search term and status
    let filtered = loans.filter((loan) => {
      const matchesSearch = 
        loan.utente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.utente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.libro.titolo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && !loan.restituito) ||
        (statusFilter === 'returned' && loan.restituito);
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered = filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'utente':
          aValue = a.utente.nome;
          bValue = b.utente.nome;
          break;
        case 'libro':
          aValue = a.libro.titolo;
          bValue = b.libro.titolo;
          break;
        case 'dataInizio':
          aValue = new Date(a.dataInizio);
          bValue = new Date(b.dataInizio);
          break;
        case 'dataFine':
          aValue = new Date(a.dataFine);
          bValue = new Date(b.dataFine);
          break;
        default:
          aValue = new Date(a.dataInizio);
          bValue = new Date(b.dataInizio);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredLoans(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (loan) => {
    if (loan.restituito) {
      return 'success';
    } else {
      // Check if overdue
      const today = new Date();
      const endDate = new Date(loan.dataFine);
      return today > endDate ? 'error' : 'warning';
    }
  };

  const getStatusLabel = (loan) => {
    if (loan.restituito) {
      return 'Restituito';
    } else {
      // Check if overdue
      const today = new Date();
      const endDate = new Date(loan.dataFine);
      return today > endDate ? 'In ritardo' : 'In prestito';
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
            Gestione Prestiti
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualizza e gestisci tutti i prestiti della biblioteca
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={0} sx={{ mb: 4, p: 2, borderRadius: '12px', boxShadow: '0 3px 10px rgba(0,0,0,0.08)' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}>
          {/* Search */}
          <TextField
            placeholder="Cerca per utente, email o libro..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '8px' }
            }}
            sx={{ maxWidth: { sm: '50%' } }}
          />

          {/* Status filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Stato</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Stato"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="all">Tutti</MenuItem>
              <MenuItem value="active">In prestito</MenuItem>
              <MenuItem value="returned">Restituiti</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      <Box sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ bgcolor: '#1a237e', height: '8px' }} />
        
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(26, 35, 126, 0.03)' }}>
              <TableRow>
                <TableCell 
                  onClick={() => handleSort('id')}
                  sx={{ 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    ID
                    {sortField === 'id' && (
                      <SortIcon fontSize="small" sx={{ ml: 0.5, transform: sortDirection === 'desc' ? 'none' : 'rotate(180deg)' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('utente')}
                  sx={{ 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Utente
                    {sortField === 'utente' && (
                      <SortIcon fontSize="small" sx={{ ml: 0.5, transform: sortDirection === 'desc' ? 'none' : 'rotate(180deg)' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell 
                  onClick={() => handleSort('libro')}
                  sx={{ 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Libro
                    {sortField === 'libro' && (
                      <SortIcon fontSize="small" sx={{ ml: 0.5, transform: sortDirection === 'desc' ? 'none' : 'rotate(180deg)' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('dataInizio')}
                  sx={{ 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Data Inizio
                    {sortField === 'dataInizio' && (
                      <SortIcon fontSize="small" sx={{ ml: 0.5, transform: sortDirection === 'desc' ? 'none' : 'rotate(180deg)' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('dataFine')}
                  sx={{ 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Data Fine
                    {sortField === 'dataFine' && (
                      <SortIcon fontSize="small" sx={{ ml: 0.5, transform: sortDirection === 'desc' ? 'none' : 'rotate(180deg)' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Stato</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <TableRow 
                    key={loan.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ color: '#1a237e', fontWeight: 500 }}>{loan.id}</TableCell>
                    <TableCell>{loan.utente.nome}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{loan.utente.email}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{loan.libro.titolo}</TableCell>
                    <TableCell>{formatDate(loan.dataInizio)}</TableCell>
                    <TableCell>{formatDate(loan.dataFine)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(loan)} 
                        color={getStatusColor(loan)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Nessun prestito trovato
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Prova a modificare i filtri di ricerca
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredLoans.length} prestiti trovati
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AllLoans;