// src/components/admin/AdminBookList.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  CircularProgress, Alert, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import adminService from '../../services/admin.service';
import BookForm from './BookForm';

const AdminBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllBooks();
      setBooks(response.data);
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
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il salvataggio del libro');
    } finally {
      setOpenForm(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await adminService.deleteBook(currentBook.id);
      
      if (response.data.success) {
        setSuccess('Libro eliminato con successo');
        fetchBooks();
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
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestione Libri
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddBook}
        >
          Aggiungi Libro
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titolo</TableCell>
              <TableCell>Autore</TableCell>
              <TableCell>Genere</TableCell>
              <TableCell>Anno</TableCell>
              <TableCell>Copie Disponibili</TableCell>
              <TableCell>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.titolo}</TableCell>
                <TableCell>{book.autore}</TableCell>
                <TableCell>{book.genere}</TableCell>
                <TableCell>{new Date(book.annoDiPubblicazione).getFullYear()}</TableCell>
                <TableCell>{book.copieDisponibili}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditBook(book)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(book)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <BookForm
        open={openForm}
        book={currentBook}
        isEditing={isEditing}
        onClose={handleCloseForm}
        onSave={handleSaveBook}
      />
      
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare il libro "{currentBook?.titolo}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annulla</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBookList;