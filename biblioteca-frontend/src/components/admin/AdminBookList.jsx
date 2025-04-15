import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  CircularProgress, Alert, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment,
  Tooltip, Chip, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import adminService from '../../services/admin.service';
import BookForm from './BookForm';

const AdminBookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
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
      const response = await adminService.getAllBooks();
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

  const handleAddBook = () => {
    setCurrentBook(null);
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEditBook = (book) => {
    setCurrentBook(book);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleDeleteClick = (book) => {
    setCurrentBook(book);
    setOpenDeleteDialog(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleSaveBook = async (bookData) => {
    try {
      let response;
      
      if (isEditing) {
        response = await adminService.updateBook(currentBook.id, bookData);
      } else {
        response = await adminService.addBook(bookData);
      }
      
      if (response.data.success) {
        setSuccess(isEditing ? 'Libro aggiornato con successo' : 'Libro aggiunto con successo');
        fetchBooks();
        
        setIsEditing(false);
        setCurrentBook(null);
        
        handleCloseForm();
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il salvataggio del libro');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await adminService.deleteBook(currentBook.id);
      
      if (response.data.success) {
        setSuccess('Libro eliminato con successo');
        fetchBooks();
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante l\'eliminazione del libro');
    } finally {
      setOpenDeleteDialog(false);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4
      }}>
        <MenuBookIcon sx={{ fontSize: 32, color: '#1a237e', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight={500} color="#1a237e">
            Gestione Libri
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aggiungi, modifica o rimuovi libri dal catalogo
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
          sx={{ mb: 3, borderRadius: '8px' }}
          onClose={() => setSuccess('')}
        >
          {success}
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
            placeholder="Cerca per titolo, autore o genere..."
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

          {/* Add Book Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBook}
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
          >
            Aggiungi Libro
          </Button>
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
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(26, 35, 126, 0.03)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
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
                    <TableCell sx={{ color: '#1a237e', fontWeight: 500 }}>{book.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{book.titolo}</TableCell>
                    <TableCell>{book.autore}</TableCell>
                    <TableCell>
                      <Chip 
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
                      {book.annoDiPubblicazione > 10000 
                        ? new Date(book.annoDiPubblicazione).getFullYear() 
                        : book.annoDiPubblicazione}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${book.copieDisponibili} ${book.copieDisponibili === 1 ? 'copia' : 'copie'}`} 
                        size="small"
                        color={book.copieDisponibili > 0 ? "success" : "error"}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Modifica libro">
                          <IconButton 
                            sx={{ 
                              color: '#1a237e',
                              bgcolor: 'rgba(26, 35, 126, 0.08)',
                              '&:hover': { bgcolor: 'rgba(26, 35, 126, 0.12)' }
                            }}
                            onClick={() => handleEditBook(book)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Elimina libro">
                          <IconButton 
                            sx={{ 
                              color: '#d32f2f',
                              bgcolor: 'rgba(211, 47, 47, 0.08)',
                              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.12)' }
                            }}
                            onClick={() => handleDeleteClick(book)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Nessun libro trovato
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Prova a modificare i criteri di ricerca o aggiungi un nuovo libro
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
        </Box>
      </Box>
      
      <BookForm
        open={openForm}
        book={currentBook}
        isEditing={isEditing}
        onClose={handleCloseForm}
        onSave={handleSaveBook}
      />
      
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}  
      >
        <Box sx={{ bgcolor: '#d32f2f', height: '8px' }} />
        <DialogTitle sx={{ pt: 3 }}>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Sei sicuro di voler eliminare questo libro?
          </Typography>
          
          {currentBook && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.02)' }}>
              <Typography variant="subtitle1" fontWeight={500}>{currentBook.titolo}</Typography>
              <Typography variant="body2" color="text.secondary">
                Autore: {currentBook.autore}
              </Typography>
            </Paper>
          )}
          
          <Typography variant="body2" color="error" sx={{ mt: 3, fontWeight: 500 }}>
            Questa azione non può essere annullata.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            sx={{ 
              textTransform: 'none',
              borderRadius: '8px'
            }}
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBookList;