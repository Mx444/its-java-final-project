import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

// Simplify date handling without date pickers
const BookForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titolo: initialData?.titolo || '',
    autore: initialData?.autore || '',
    isbn: initialData?.isbn || '',
    anno: initialData?.anno || new Date().getFullYear(),
    genere: initialData?.genere || '',
    disponibile: initialData?.disponibile !== undefined ? initialData.disponibile : true,
    descrizione: initialData?.descrizione || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {initialData ? 'Modifica Libro' : 'Aggiungi Nuovo Libro'}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Titolo"
            name="titolo"
            value={formData.titolo}
            onChange={handleChange}
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
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Anno di Pubblicazione"
            name="anno"
            type="number"
            value={formData.anno}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 1000, max: new Date().getFullYear() } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Genere"
            name="genere"
            value={formData.genere}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Disponibilità</InputLabel>
            <Select
              name="disponibile"
              value={formData.disponibile}
              onChange={handleChange}
              label="Disponibilità"
            >
              <MenuItem value={true}>Disponibile</MenuItem>
              <MenuItem value={false}>Non Disponibile</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrizione"
            name="descrizione"
            value={formData.descrizione}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Annulla
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? 'Aggiorna' : 'Aggiungi'}
        </Button>
      </Box>
    </Box>
  );
};

export default BookForm;