import React, { useState, useEffect} from 'react';
import { 
  Container, Typography, Box, Paper, InputBase, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Button, Chip, CircularProgress, Alert, 

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import userService from '../../services/user.service';
import BorrowBookDialog from './BorrowBookDialog';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userBorrowedBooks, setUserBorrowedBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchUserLoans();
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      setFilteredBooks(
        books.filter(book => 
          book.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.autore.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genere.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await userService.getBooks();
      setBooks(response.data);
      setFilteredBooks(response.data);
      setError('');
    } catch (err) {
      setError('Errore durante il caricamento dei libri');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLoans = async () => {
    try {
      const response = await userService.getUserLoans();
      const borrowedBookIds = response.data.map(loan => loan.libro.id);
      setUserBorrowedBooks(borrowedBookIds);
    } catch (err) {
      console.error("Error fetching user loans:", err);
    }
  };

  const isBookBorrowed = (bookId) => {
    return userBorrowedBooks.includes(bookId);
  };

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBorrowConfirm = async () => {
    try {
      const response = await userService.borrowBook(selectedBook.id);
      if (response.data.success) {
        setSuccessMessage(`Prestito registrato con successo: ${selectedBook.titolo}`);
        fetchBooks();
        fetchUserLoans();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la richiesta del prestito');
    } finally {
      setOpenDialog(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh">
        <CircularProgress size={60} thickness={4} sx={{ color: '#1a237e', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Caricamento libri...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4
      }}>
        <MenuBookIcon sx={{ fontSize: 32, color: '#1a237e', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight={500} color="#1a237e">
            Catalogo Libri
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sfoglia e prendi in prestito i libri disponibili
          </Typography>
        </Box>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', onClose: () => setError('') }}>{error}</Alert>}
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: '8px', animation: 'fadeIn 0.5s' }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}
      
      {/* Barra di ricerca */}
      <Paper elevation={0} sx={{ mb: 4, p: 2, borderRadius: '12px', boxShadow: '0 3px 10px rgba(0,0,0,0.08)' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}>
          <Paper
            component="form"
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: '8px'
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Cerca per titolo, autore o genere..."
              inputProps={{ 'aria-label': 'cerca libri' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      </Paper>

      {/* Tabella dei libri */}
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
                <TableCell sx={{ fontWeight: 'bold' }}>Genere</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Anno</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Disponibilità</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <TableRow 
                    key={book.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        <BookIcon 
                          fontSize="small" 
                          sx={{ color: '#1a237e', mt: 0.5, flexShrink: 0 }} 
                        />
                        <Typography variant="body1">{book.titolo}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {book.autore}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={<CategoryIcon sx={{ fontSize: '16px !important' }} />}
                        label={book.genere} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(26, 35, 126, 0.1)',
                          color: '#1a237e',
                          fontWeight: 500
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateRangeIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2">
                          {book.annoDiPubblicazione > 10000 
                            ? new Date(book.annoDiPubblicazione).getFullYear() 
                            : book.annoDiPubblicazione}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={book.copieDisponibili > 0 
                          ? `${book.copieDisponibili} ${book.copieDisponibili === 1 ? 'copia' : 'copie'}`
                          : 'Non disponibile'
                        }
                        size="small"
                        color={book.copieDisponibili > 0 ? "success" : "error"}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      {isBookBorrowed(book.id) ? (
                        <Button 
                          variant="outlined"
                          startIcon={<CheckCircleIcon />}
                          disabled
                          sx={{ 
                            textTransform: 'none',
                            borderRadius: '8px',
                            color: '#2e7d32',
                            borderColor: '#2e7d32',
                            '&.Mui-disabled': {
                              color: '#2e7d32',
                              borderColor: '#2e7d32',
                              opacity: 0.7
                            }
                          }}
                        >
                          Già in prestito
                        </Button>
                      ) : (
                        <Button 
                          variant={book.copieDisponibili > 0 ? "contained" : "outlined"}
                          startIcon={<BookIcon />}
                          onClick={() => book.copieDisponibili > 0 && handleBorrowClick(book)}
                          disabled={book.copieDisponibili < 1}
                          sx={{ 
                            textTransform: 'none',
                            borderRadius: '8px',
                            bgcolor: book.copieDisponibili > 0 ? '#1a237e' : 'transparent',
                            color: book.copieDisponibili > 0 ? 'white' : '#d32f2f',
                            borderColor: book.copieDisponibili > 0 ? '#1a237e' : '#d32f2f',
                            '&:hover': {
                              bgcolor: book.copieDisponibili > 0 ? '#303f9f' : 'rgba(211, 47, 47, 0.04)'
                            },
                            '&.Mui-disabled': {
                              color: '#d32f2f',
                              borderColor: '#d32f2f',
                              opacity: 0.7
                            }
                          }}
                        >
                          {book.copieDisponibili > 0 ? 'Prendi in prestito' : 'Non disponibile'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Nessun libro trovato
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Prova con un'altra ricerca
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredBooks.length} libri trovati
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userBorrowedBooks.length} {userBorrowedBooks.length === 1 ? 'libro' : 'libri'} in prestito
          </Typography>
        </Box>
      </Box>
      
      <BorrowBookDialog
        open={openDialog}
        book={selectedBook}
        onClose={handleCloseDialog}
        onConfirm={handleBorrowConfirm}
      />
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Container>
  );
};

export default BookList;