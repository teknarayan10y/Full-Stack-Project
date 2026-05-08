import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, room, dates } = location.state || {};
  const { isAuthenticated, user } = useAuth();

  const calculateNights = () => {
    if (!dates?.checkIn || !dates?.checkOut) return 0;
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomPrice = room?.price || 0;
    const subtotal = roomPrice * nights;
    const taxes = subtotal * 0.1; // 10% tax
    return (subtotal + taxes).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (!hotel || !room || !dates) {
      navigate('/hotels');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setFormData(prev => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }));
  }, [hotel, room, dates, isAuthenticated, navigate, user, location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Log the input data to help with debugging
      console.log('Hotel:', hotel);
      console.log('Room:', room);
      console.log('Dates:', dates);
      console.log('Payment method:', paymentMethod);
      console.log('Form data:', formData);

      if (!hotel || !room || !dates) {
        setError('Missing booking information. Please try again.');
        setLoading(false);
        return;
      }

      // Make sure we have valid IDs
      const hotelId = hotel.id || hotel._id;
      const roomId = room.id || room._id;
      
      if (!hotelId || !roomId) {
        setError('Invalid hotel or room information. Please try again.');
        setLoading(false);
        return;
      }

      // Format guests as an object with adults and children properties
      const guestsFormatted = {
        adults: typeof dates.guests === 'number' ? dates.guests : 1,
        children: 0
      };
      console.log('Formatted guests:', guestsFormatted);

      // Ensure payment method is in the correct format
      // The backend expects just the method name, not an object
      const formattedPaymentMethod = typeof paymentMethod === 'object' 
        ? paymentMethod.method || 'credit-card'
        : paymentMethod || 'credit-card';

      const bookingData = {
        hotelId,
        roomId,
        roomType: room.type || 'Standard',
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        guests: guestsFormatted,
        totalPrice: calculateTotal(),
        paymentMethod: formattedPaymentMethod,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests || ''
      };

      console.log('Final booking data:', bookingData);

      const response = await bookingService.createBooking(bookingData);
      console.log('Booking response:', response);
      
      if (response.success) {
        navigate('/bookings');
      } else {
        setError(response.error || 'Failed to create booking');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-confirmation">
        <div className="loading">Processing your booking...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-confirmation">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!hotel || !room || !dates) {
    return (
      <div className="booking-confirmation">
        <div className="booking-confirmation-container">
          <div className="error">Invalid booking details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-confirmation">
      <div className="booking-confirmation-container">
        <div className="booking-header">
          <h2>Booking Confirmation</h2>
          <p>Thank you for your booking! Your reservation has been confirmed.</p>
        </div>

        <div className="booking-details">
          <div className="detail-section">
            <h3>Hotel Details</h3>
            <div className="detail-item">
              <span className="detail-label">Hotel Name</span>
              <span className="detail-value">{hotel.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Room Type</span>
              <span className="detail-value">{room.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Check-in</span>
              <span className="detail-value">{new Date(dates.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Check-out</span>
              <span className="detail-value">{new Date(dates.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Guests</span>
              <span className="detail-value">{dates.guests}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Payment Details</h3>
            <div className="price-breakdown">
              <div className="price-item">
                <span>Room Charges</span>
                <span>${room.price} × {calculateNights()} nights</span>
              </div>
              <div className="price-item">
                <span>Taxes & Fees</span>
                <span>${(room.price * calculateNights() * 0.1).toFixed(2)}</span>
              </div>
              <div className="total-price">
                <span>Total Amount</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section payment-method">
            <h2>Payment Method</h2>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="debit-card"
                  checked={paymentMethod === 'debit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="phonepe"
                  checked={paymentMethod === 'phonepe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PhonePe
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gpay"
                  checked={paymentMethod === 'gpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                GPay
              </label>
            </div>
          </div>

          <div className="form-section guest-details">
            <h2>Guest Details</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-section payment-details">
            <h2>Payment Details</h2>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength="16"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="confirm-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>

        <div className="booking-actions">
          <button className="action-button print-button" onClick={handlePrint}>
            <i className="fas fa-print"></i> Print Confirmation
          </button>
          <button className="action-button view-bookings-button" onClick={() => navigate('/bookings')}>
            <i className="fas fa-list"></i> View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
