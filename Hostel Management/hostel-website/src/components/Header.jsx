import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <RestaurantMenuIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Hostel Menu & College 
            </Typography>
          </Box>

          <Box>
            <Button
              color="inherit"
              component={Link}
              to="/calendar"
              startIcon={<CalendarMonthIcon />}
              sx={{ mr: 1 }}
            >
              Calendar
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/leave"
              startIcon={<AssignmentIcon />}
            >
              Leave Form
            
              
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/lost"
              startIcon={<AssignmentIcon />}
            >
              lost and found
            
              
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="https://codinginpublic.dev/projects/react-router-budget-app/"
              startIcon={<AssignmentIcon />}
            >
              Budget Manage
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;

