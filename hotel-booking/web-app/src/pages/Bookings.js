import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const newBooking = location.state;

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getUserBookings();
      setBookings(response);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { hotel, room, dates } = newBooking;
      
      // Create new booking
      await bookingService.createBooking({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        guests: dates.guests,
        paymentMethod: dates.paymentMethod
      });

      // Show success message
      alert('Booking created successfully!');

      // Refresh bookings list
      await fetchBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  }, [newBooking, fetchBookings]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (newBooking) {
      handleNewBooking();
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, navigate, newBooking, handleNewBooking, fetchBookings]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-page">
        <div className="bookings-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchBookings} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <h1>My Bookings</h1>
        <div className="bookings-header">
          <h2>Your Reservations</h2>
          <button onClick={() => navigate('/hotels')} className="browse-hotels-btn">
            Book New Hotel
          </button>
        </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet. Start by browsing our hotels!</p>
          <button onClick={() => navigate('/hotels')} className="browse-hotels-btn">
            Browse Hotels
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <div className="booking-hotel-info">
                  <h3>{booking.hotel?.name || 'Hotel Name Unavailable'}</h3>
                  <p className="booking-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {booking.hotel?.location?.city ? `${booking.hotel.location.city}, ${booking.hotel.location.country || ''}` : 'Location Unavailable'}
                  </p>
                  <p className="booking-dates">
                    <i className="fas fa-calendar"></i>
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <span className={`booking-status ${getStatusClass(booking.status)}`}>
                  {booking.status || 'Status Unavailable'}
                </span>
              </div>
              <div className="booking-details">
                <div className="booking-detail-group">
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">
                    {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="booking-detail-group">
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">
                    {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="booking-detail-group">
                  <span className="detail-label">Guests</span>
                  <span className="detail-value">
                    {booking.guests ? 
                      `${booking.guests.adults || 0} Adults${booking.guests.children ? `, ${booking.guests.children} Children` : ''}` 
                      : 'N/A'}
                  </span>
                </div>
                <div className="booking-detail-group">
                  <span className="detail-label">Total Price</span>
                  <span className="detail-value booking-price">
                    ${booking.totalPrice || 0}
                  </span>
                </div>
              </div>
              <div className="booking-actions">
                <button
                  onClick={() => navigate(`/hotels/${booking.hotel._id}`)}
                  className="action-button view-hotel-btn"
                >
                  View Hotel
                </button>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => {/* Handle cancellation */}}
                    className="action-button cancel-booking-btn"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Bookings;
