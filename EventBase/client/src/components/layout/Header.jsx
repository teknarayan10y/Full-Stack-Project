// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Tooltip,
  useTheme,
  useMediaQuery,
  Badge,
  Stack,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
    handleMenuClose();
  };

  // Debug log to check user object and role
  console.log('Current User:', currentUser);
  console.log('User Data:', currentUser?.data);
  
  // Check if user can create events (teacher or coordinator role, case-insensitive)
  const userRole = currentUser?.data?.role?.toString().toLowerCase();
  const canCreateEvents = userRole === 'coordinator' || userRole === 'teacher';
  
  console.log('Role after conversion:', userRole);
  console.log('Can create events:', canCreateEvents);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        navigate('/profile');
        handleMenuClose();
      }}>
        <AccountCircleIcon sx={{ mr: 1 }} /> Profile
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {currentUser ? [
        canCreateEvents && [
          <MenuItem 
            key="create-event" 
            component={RouterLink} 
            to="/events/create"
            onClick={handleMobileMenuClose}
          >
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <Typography>Create Event</Typography>
          </MenuItem>,
          <Divider key="divider" />,
        ],
        <MenuItem key="dashboard" onClick={() => {
          navigate('/dashboard');
          handleMobileMenuClose();
        }}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Dashboard</Typography>
        </MenuItem>,
        <MenuItem key="events" onClick={() => {
          navigate('/events');
          handleMobileMenuClose();
        }}>
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Events</Typography>
        </MenuItem>,
        <MenuItem key="teams" onClick={() => {
          navigate('/teams');
          handleMobileMenuClose();
        }}>
          <ListItemIcon>
            <GroupIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Teams</Typography>
        </MenuItem>
      ] : [
        <MenuItem key="login" onClick={() => {
          navigate('/login');
          handleMobileMenuClose();
        }}>
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Login</Typography>
        </MenuItem>,
        <MenuItem key="register" onClick={() => {
          navigate('/register');
          handleMobileMenuClose();
        }}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Register</Typography>
        </MenuItem>
      ]}
    </Menu>
  );

  return (
    <AppBar 
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* Logo / Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 2,
            }}
          >
            <EventIcon color="primary" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'primary.main',
              }}
            >
              EventEase
            </Typography>
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 3, gap: 1 }}>
            {currentUser && (
              <>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  sx={{
                    my: 2,
                    color: location.pathname === '/dashboard' ? 'primary.main' : 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    },
                  }}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                <Button
                  component={RouterLink}
                  to="/events"
                  sx={{
                    my: 2,
                    color: location.pathname.startsWith('/events') ? 'primary.main' : 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    },
                  }}
                  startIcon={<EventIcon />}
                >
                  Events
                </Button>
                {canCreateEvents && (
                  <Button
                    component={RouterLink}
                    to="/events/create"
                    sx={{
                      my: 2,
                      color: location.pathname === '/events/create' ? 'primary.main' : 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                      },
                    }}
                    startIcon={<AddIcon />}
                  >
                    Create Event
                  </Button>
                )}
                <Button
                  component={RouterLink}
                  to="/teams"
                  sx={{
                    my: 2,
                    color: location.pathname.startsWith('/teams') ? 'primary.main' : 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    },
                  }}
                  startIcon={<GroupIcon />}
                >
                  Teams
                </Button>
              </>
            )}
          </Box>

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser ? (
              <>
                <Tooltip title="Notifications">
                  <IconButton size="large" color="inherit">
                    <Badge badgeContent={4} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={isMenuOpen ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen ? 'true' : undefined}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText'
                        }}
                      >
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
};

export default Header;