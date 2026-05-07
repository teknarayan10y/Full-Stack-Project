// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: '1 0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          py: 4,
          px: { xs: 2, sm: 3 },
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        <Outlet />
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;