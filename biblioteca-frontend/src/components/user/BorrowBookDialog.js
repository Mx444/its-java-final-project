import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box
} from '@mui/material';

const BorrowBookDialog = ({ open, book, onClose, onConfirm }) => {
  if (!book) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Conferma Prestito</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            {book.titolo}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Autore: {book.autore}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Sei sicuro di voler prendere in prestito questo libro?
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Annulla</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Conferma Prestito
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BorrowBookDialog;