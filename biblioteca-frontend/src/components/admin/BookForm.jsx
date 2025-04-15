import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid,
  Dialog, DialogContent, DialogActions, 
  Paper, Divider, IconButton, MenuItem, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SaveIcon from '@mui/icons-material/Save';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';

// Predefined genre options
const genreOptions = [
  'Romanzo', 'Fantasy', 'Giallo', 'Thriller', 'Storico', 
  'Biografia', 'Scienza', 'Informatica', 'Filosofia', 'Arte',
  'Poesia', 'Fumetto', 'Horror', 'Avventura', 'Altro'
];

const BookForm = ({ open, book, isEditing, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    titolo: '',
    autore: '',
    genere: '',
    annoDiPubblicazione: '',
    copieDisponibili: 1
  });
  
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (book && isEditing) {      
      let yearValue = book.annoDiPubblicazione;
      
      if (yearValue > 10000) {
        const date = new Date(yearValue);
        yearValue = date.getFullYear();
      }
      
      setFormData({
        titolo: book.titolo || '',
        autore: book.autore || '',
        genere: book.genere || '',
        annoDiPubblicazione: yearValue, 
        copieDisponibili: Number(book.copieDisponibili) || 1
      });
    } else {
      setFormData({
        titolo: '',
        autore: '',
        genere: '',
        annoDiPubblicazione: '',
        copieDisponibili: 1
      });
    }
    
    // Reset errors
    setFieldErrors({});
  }, [book, isEditing, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.titolo.trim()) {
      errors.titolo = 'Il titolo è obbligatorio';
    }
    
    if (!formData.autore.trim()) {
      errors.autore = 'L\'autore è obbligatorio';
    }
    
    if (!formData.genere) {
      errors.genere = 'Il genere è obbligatorio';
    }
    
    const year = Number(formData.annoDiPubblicazione);
    if (!year || year < 0 || year > new Date().getFullYear()) {
      errors.annoDiPubblicazione = 'Inserisci un anno valido';
    }
    
    if (!formData.copieDisponibili || formData.copieDisponibili < 1) {
      errors.copieDisponibili = 'Inserisci almeno una copia';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert year to number
    const formattedData = {
      ...formData,
      annoDiPubblicazione: Number(formData.annoDiPubblicazione),
      copieDisponibili: Number(formData.copieDisponibili)
    };
    
    onSave(formattedData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Blue accent bar */}
      <Box sx={{ bgcolor: '#1a237e', height: '8px' }} />
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 3, 
        pb: 2
      }}>
        <MenuBookIcon sx={{ color: '#1a237e', mr: 2, fontSize: 28 }} />
        <Typography variant="h5" component="h2" fontWeight={500} color="#1a237e">
          {isEditing ? 'Modifica Libro' : 'Aggiungi Nuovo Libro'}
        </Typography>
        <IconButton 
          onClick={handleCancel} 
          sx={{ 
            ml: 'auto',
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <DialogContent sx={{ py: 3 }}>
        {isEditing && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'rgba(26, 35, 126, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(26, 35, 126, 0.1)'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ID Libro: <strong style={{ color: '#1a237e' }}>{book?.id}</strong>
            </Typography>
          </Paper>
        )}
        
        <Box component="form" id="book-form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Titolo"
                name="titolo"
                value={formData.titolo}
                onChange={handleChange}
                error={!!fieldErrors.titolo}
                helperText={fieldErrors.titolo}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Autore"
                name="autore"
                value={formData.autore}
                onChange={handleChange}
                error={!!fieldErrors.autore}
                helperText={fieldErrors.autore}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                select
                fullWidth
                label="Genere"
                name="genere"
                value={formData.genere}
                onChange={handleChange}
                error={!!fieldErrors.genere}
                helperText={fieldErrors.genere}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              >
                {genreOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Anno di Pubblicazione"
                name="annoDiPubblicazione"  
                type="number"
                value={formData.annoDiPubblicazione || ''} 
                onChange={handleChange}
                error={!!fieldErrors.annoDiPubblicazione}
                helperText={fieldErrors.annoDiPubblicazione}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  inputProps: { 
                    min: 0, 
                    max: new Date().getFullYear() 
                  }
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Copie Disponibili"
                name="copieDisponibili"
                type="number"
                value={Number(formData.copieDisponibili)}
                onChange={handleChange}
                error={!!fieldErrors.copieDisponibili}
                helperText={fieldErrors.copieDisponibili}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1 }
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleCancel} 
          sx={{ 
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Annulla
        </Button>
        <Button 
          type="submit"
          form="book-form"
          variant="contained" 
          startIcon={<SaveIcon />}
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
          {isEditing ? 'Aggiorna' : 'Aggiungi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookForm;