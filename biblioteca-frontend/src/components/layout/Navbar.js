import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BIBLIOTECA
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {currentUser && (
              <>
                <Button 
                  component={Link} 
                  to="/books" 
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Libri
                </Button>
                <Button 
                  component={Link} 
                  to="/my-loans" 
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  I Miei Prestiti
                </Button>
                {isAdmin() && (
                  <>
                    <Button 
                      component={Link} 
                      to="/admin/books" 
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Gestione Libri
                    </Button>
                    <Button 
                      component={Link} 
                      to="/admin/loans" 
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Tutti i Prestiti
                    </Button>
                    <Button 
                      component={Link} 
                      to="/admin/reports" 
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Report
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {currentUser.nome}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </Box>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;