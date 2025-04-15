import React, { useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container,
  Avatar, Divider, useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#1a237e', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuBookIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
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

          {/* Menu links */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px'
          }}>
            {currentUser && (
              <>
                <Button 
                  component={Link} 
                  to="/books" 
                  sx={{ 
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  Libri
                </Button>
                <Button 
                  component={Link} 
                  to="/my-loans" 
                  sx={{ 
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  I Miei Prestiti
                </Button>
                {isAdmin() && (
                  <>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mx: 1 }} />
                    <Button 
                      component={Link} 
                      to="/admin/books" 
                      sx={{ 
                        color: 'white',
                        textTransform: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      Gestione Libri
                    </Button>
                    <Button 
                      component={Link} 
                      to="/admin/loans" 
                      sx={{ 
                        color: 'white',
                        textTransform: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      Prestiti
                    </Button>
                    <Button 
                      component={Link} 
                      to="/admin/reports" 
                      sx={{ 
                        color: 'white',
                        textTransform: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      Report
                    </Button>
                    <Button 
                      component={Link} 
                      to="/admin/register-user"
                      sx={{ 
                        color: 'white',
                        textTransform: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      Registra
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>

          {/* User section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                py: 0.5,
                px: 2
              }}>
                <AccountCircleIcon sx={{ fontSize: 24, mr: 1, color: '#e8eaf6' }} />
                <Typography variant="body2" sx={{ 
                  color: 'white',
                  fontWeight: 500,
                  mr: 2
                }}>
                  {/* email e ruolo  */}
                  {currentUser.email && currentUser.email.split('@')[0]} -{' '}
                  { currentUser.role === 'ROLE_ADMIN' ? 'Admin' : 'Utente'}

                  
 
                </Typography>
                <Button
                  size="small"
                  onClick={handleLogout}
                  sx={{ 
                    minWidth: '36px',
                    color: '#e8eaf6',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </Button>
              </Box>
            ) : (
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  px: 2,
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