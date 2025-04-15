import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  CardActions, Button, Chip, CircularProgress, Alert
} from '@mui/material';
import userService from '../../services/user.service';
import BorrowBookDialog from './BorrowBookDialog';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await userService.getBooks();
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError('Errore durante il caricamento dei libri');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Catalogo Libri
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {book.titolo}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {book.autore}
                </Typography>
                <Chip 
                  label={book.genere} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2">
                  Copie disponibili: {book.copieDisponibili}
                </Typography>
                <Typography variant="body2">
                  Anno: {new Date(book.annoDiPubblicazione).getFullYear()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleBorrowClick(book)}
                  disabled={book.copieDisponibili < 1}
                >
                  {book.copieDisponibili > 0 ? 'Prendi in prestito' : 'Non disponibile'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <BorrowBookDialog
        open={openDialog}
        book={selectedBook}
        onClose={handleCloseDialog}
        onConfirm={handleBorrowConfirm}
      />
    </Container>
  );
};

export default BookList;