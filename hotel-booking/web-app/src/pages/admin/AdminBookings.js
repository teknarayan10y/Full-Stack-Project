import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/api';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
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
      <div className="admin-bookings-page">
        <div className="admin-bookings-container">
          <div className="loading">
            Loading booking information...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-bookings-page">
        <div className="admin-bookings-container">
          <div className="error">
            <span role="img" aria-label="error">⚠️</span> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-bookings-page">
      <div className="admin-bookings-container">
        <div className="page-header">
          <h1 className="page-title">Manage Bookings</h1>
          <p className="page-subtitle">View and manage all hotel bookings from your customers</p>
        </div>
        
        <div className="booking-stats-container">
          <div className="booking-stats">
            <div className="stat-item">
              <span className="stat-label">Total Bookings</span>
              <span className="stat-value">{bookings.length}</span>
            </div>
            <div className="stat-item confirmed">
              <span className="stat-label">Confirmed</span>
              <span className="stat-value">
                {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
              </span>
            </div>
            <div className="stat-item pending">
              <span className="stat-label">Pending</span>
              <span className="stat-value">
                {bookings.filter(b => b.status.toLowerCase() === 'pending').length}
              </span>
            </div>
            <div className="stat-item cancelled">
              <span className="stat-label">Cancelled</span>
              <span className="stat-value">
                {bookings.filter(b => b.status.toLowerCase() === 'cancelled').length}
              </span>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Hotel</th>
                <th>Guest</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id.slice(-6).toUpperCase()}</td>
                <td>
                  <div className="hotel-info">
                    <span className="hotel-name">{booking.hotel.name}</span>
                    <span className="hotel-location">{booking.hotel.location?.city ? `${booking.hotel.location.city}, ${booking.hotel.location.country || ''}` : 'Location not available'}</span>
                  </div>
                </td>
                <td>
                  <div className="guest-info">
                    <span className="guest-name">{booking.user.name}</span>
                    <span className="guest-email">{booking.user.email}</span>
                  </div>
                </td>
                <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                <td className="booking-price">${parseFloat(booking.totalPrice).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {booking.status !== 'confirmed' && (
                      <button 
                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                        className="action-btn confirm-btn"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== 'pending' && (
                      <button 
                        onClick={() => handleStatusChange(booking._id, 'pending')}
                        className="action-btn pending-btn"
                      >
                        Pending
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleStatusChange(booking._id, 'cancelled')}
                        className="action-btn cancel-btn"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
