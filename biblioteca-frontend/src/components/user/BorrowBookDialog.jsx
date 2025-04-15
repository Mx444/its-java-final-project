import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Divider, Chip, Paper
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CategoryIcon from '@mui/icons-material/Category';

const BorrowBookDialog = ({ open, book, onClose, onConfirm }) => {
  if (!book) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ bgcolor: '#1a237e', height: '8px' }} />
      
      <DialogTitle sx={{ 
        pb: 1, 
        fontWeight: 500,
        color: '#1a237e'
      }}>
        Conferma Prestito
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ minWidth: 320 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {book.titolo}
          </Typography>
          
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
            <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
              {book.autore}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              size="small"
              icon={<CategoryIcon sx={{ fontSize: '16px !important' }} />}
              label={book.genere} 
              sx={{ 
                bgcolor: 'rgba(26, 35, 126, 0.1)', 
                color: '#1a237e',
                fontWeight: 500
              }} 
            />
            
            <Chip 
              size="small"
              icon={<DateRangeIcon sx={{ fontSize: '16px !important' }} />}
              label={book.annoDiPubblicazione > 10000 
                ? new Date(book.annoDiPubblicazione).getFullYear() 
                : book.annoDiPubblicazione} 
              sx={{ 
                bgcolor: 'rgba(26, 35, 126, 0.1)', 
                color: '#1a237e',
                fontWeight: 500
              }} 
            />
          </Box>
          
          <Paper elevation={0} sx={{ 
            bgcolor: 'rgba(26, 35, 126, 0.05)', 
            p: 2, 
            borderRadius: '8px',
            mt: 2
          }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Sei sicuro di voler prendere in prestito questo libro?
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Il prestito avrà una durata di 30 giorni.
            </Typography>
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Annulla
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          startIcon={<BookIcon />}
          sx={{ 
            bgcolor: '#1a237e', 
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#303f9f'
            }
          }}
        >
          Conferma Prestito
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BorrowBookDialog;