import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import BookingConfirmation from './pages/BookingConfirmation';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import AdminHotels from './pages/admin/AdminHotels';
import AdminBookings from './pages/admin/AdminBookings';
import AddHotel from './pages/admin/AddHotel';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  console.log('PrivateRoute - Auth State:', { isAuthenticated, loading });

  if (loading) {
    console.log('PrivateRoute - Loading...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('PrivateRoute - Authenticated, rendering children');
  return children;
};

const InstructorRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'instructor') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/booking-confirmation"
              element={
                <PrivateRoute>
                  <BookingConfirmation />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/admin/*" element={<InstructorRoute><Dashboard /></InstructorRoute>} />
            <Route path="/admin/hotels" element={<InstructorRoute><AdminHotels /></InstructorRoute>} />
            <Route path="/admin/bookings" element={<InstructorRoute><AdminBookings /></InstructorRoute>} />
            <Route path="/admin/hotels/add" element={<InstructorRoute><AddHotel /></InstructorRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
