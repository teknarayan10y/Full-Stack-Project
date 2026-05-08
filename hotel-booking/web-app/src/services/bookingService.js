// API endpoints for booking service
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

class BookingService {
  async createBooking(bookingData) {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending booking data:', JSON.stringify(bookingData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log('Server response:', response.status, data);

      if (!response.ok) {
        if (data.errors) {
          console.error('Validation errors:', data.errors);
          throw new Error(data.errors.map(err => err.msg).join(', '));
        }
        if (data.error) {
          console.error('Server error details:', data.error);
          console.error('Server error stack:', data.stack);
          throw new Error(data.error || data.message || 'Failed to create booking');
        }
        throw new Error(data.message || 'Failed to create booking');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  }

  async getBooking(bookingId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserBookings(userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user bookings');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return { success: false, error: error.message };
    }
  }
}

export const bookingService = new BookingService();
