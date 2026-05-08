import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './styles/App.css';
import Header from './components/Header';
import HostelMenu from './components/HostelMenu';
import CollegeCalendar from './components/CollegeCalendar';
import LeaveForm from './components/LeaveForm';
import LostAndFound from './components/LostAndFound';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Router>
          <Header />
          <Container maxWidth="lg" className="main-content">
          <Routes>
   {/* 👈 Now the landing page */}
  <Route path="/calendar" element={<CollegeCalendar />} />
  <Route path="/leave" element={<LeaveForm />} />
  {/* <Route path="/register" element={<RegisterForm />} /> */} {/* Optional */}
  <Route path="/" element={<HostelMenu />} />
  <Route path="/lost" element={<LostAndFound />} />  {/* Optional: move HostelMenu here */}
</Routes>

          </Container>
        </Router>
      </div>
    </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
