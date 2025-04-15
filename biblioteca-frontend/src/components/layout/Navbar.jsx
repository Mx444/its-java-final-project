import React, { useState, useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Menu, MenuItem, Divider, useMediaQuery, useTheme
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navButtonStyle = {
    color: 'white',
    textTransform: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    px: 2,
    py: 1,
    mx: 0.5,
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)'
    }
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#1a237e', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          py: 1
        }}>
          {/* Logo section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuBookIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              BIBLIOTECA
            </Typography>
          </Box>

          {/* Menu Hamburger per mobile */}
          {isMobile && currentUser && (
            <Box>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { width: 200, mt: 1 }
                }}
              >
                <MenuItem component={RouterLink} to="/books" onClick={handleMenuClose}>
                  Catalogo
                </MenuItem>
                <MenuItem component={RouterLink} to="/my-loans" onClick={handleMenuClose}>
                  I Miei Prestiti
                </MenuItem>
                
                {isAdmin() && (
                  <>
                    <Divider />
                    <MenuItem component={RouterLink} to="/admin/books" onClick={handleMenuClose}>
                      Gestione Libri
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/admin/loans" onClick={handleMenuClose}>
                      Tutti i Prestiti
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/admin/reports" onClick={handleMenuClose}>
                      Report
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/admin/register" onClick={handleMenuClose}>
                      Registra Utente
                    </MenuItem>
                  </>
                )}
                
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Menu links - Desktop */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center', 
              alignItems: 'center'
            }}>
              {currentUser && (
                <>
                  <Button 
                    component={RouterLink} 
                    to="/books" 
                    sx={navButtonStyle}
                  >
                    Catalogo
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/my-loans" 
                    sx={navButtonStyle}
                  >
                    I Miei Prestiti
                  </Button>
                  
                  {isAdmin() && (
                    <>
                      <Divider orientation="vertical" flexItem 
                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mx: 1.5, height: '24px' }} 
                      />
                      <Button 
                        component={RouterLink} 
                        to="/admin/books" 
                        sx={navButtonStyle}
                      >
                        Gestione Libri
                      </Button>
                      <Button 
                        component={RouterLink} 
                        to="/admin/loans" 
                        sx={navButtonStyle}
                      >
                        Tutti i Prestiti
                      </Button>
                      <Button 
                        component={RouterLink} 
                        to="/admin/reports" 
                        sx={navButtonStyle}
                      >
                        Report
                      </Button>
                      <Button 
                        component={RouterLink} 
                        to="/admin/register" 
                        sx={navButtonStyle}
                      >
                        Registra Utente
                      </Button>
                    </>
                  )}
                </>
              )}
            </Box>
          )}

          {/* User section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser ? (
              !isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  py: 0.5,
                  px: 2,
                  height: '40px'
                }}>
                  <AccountCircleIcon sx={{ fontSize: 20, mr: 1, color: '#e8eaf6' }} />
                  <Typography variant="body2" sx={{ 
                    color: 'white',
                    fontWeight: 500,
                    mr: 1.5
                  }}>
                    {currentUser.email && currentUser.email.split('@')[0]} -{' '}
                    {currentUser.role === 'ROLE_ADMIN' ? 'Admin' : 'Utente'}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleLogout}
                    sx={{ 
                      p: 0.5,
                      color: '#e8eaf6',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Box>
              )
            ) : (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  px: 2.5,
                  py: 0.8,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;