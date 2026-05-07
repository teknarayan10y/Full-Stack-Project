import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, GlobalStyles } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import theme from './theme';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateEvent from './pages/events/CreateEvent';
import TeamsList from './pages/teams/TeamsList';
import CreateTeam from './pages/teams/CreateTeam';
import TeamDetail from './pages/teams/TeamDetail';
import EditTeam from './pages/teams/EditTeam';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { WebSocketProvider } from './contexts/WebSocketContext';

// Global styles
const globalStyles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    lineHeight: '1.5',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  a: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  'h1, h2, h3, h4, h5, h6': {
    margin: 0,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: 1.2,
  },
  'p': {
    margin: '0 0 1rem',
  },
  'button, input, optgroup, select, textarea': {
    fontFamily: 'inherit',
  },
};

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <WebSocketProvider>
        <AnimatePresence mode="wait">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Routes location={location} key={location.pathname}>
              {/* Public routes without layout */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Routes with layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="events">
                    <Route index element={<div>Events Management</div>} />
                    <Route path="create" element={<CreateEvent />} />
                  </Route>
                  <Route path="teams">
                    <Route index element={<TeamsList />} />
                    <Route path="new" element={<CreateTeam />} />
                    <Route path=":id">
                      <Route index element={<TeamDetail />} />
                      <Route path="edit" element={<EditTeam />} />
                    </Route>
                  </Route>
                </Route>

                {/* Catch all - replace with 404 component */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: theme.shape.borderRadius,
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: theme.shadows[3],
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                },
                success: {
                  iconTheme: {
                    primary: theme.palette.success.main,
                    secondary: theme.palette.success.contrastText,
                  },
                },
                error: {
                  iconTheme: {
                    primary: theme.palette.error.main,
                    secondary: theme.palette.error.contrastText,
                  },
                },
              }}
            />
          </Box>
        </AnimatePresence>
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;