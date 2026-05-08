import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  validateStatus: status => status >= 200 && status < 300
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Server Error:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Error setting up request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  // Register user
  async register(userData) {
    try {
      console.log('Attempting registration with data:', userData);
      const response = await api.post('/api/auth/register', userData);
      console.log('Registration response:', response);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await api.post('/api/auth/login', credentials);
      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file, onUploadProgress) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post('/api/upload/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(percentCompleted);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Upload profile picture error:', error);
      throw error;
    }
  },

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await api.put('/api/auth/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.put('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
};

// Hotel Services
export const hotelService = {
  // Get all hotels
  async getAllHotels(filters = {}) {
    const response = await api.get('/api/hotels', { params: filters });
    return response.data;
  },

  // Get hotel by ID
  async getHotelById(id) {
    try {
      const response = await api.get(`/api/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel:', error);
      throw error;
    }
  },

  // Search hotels
  async searchHotels(searchParams) {
    const response = await api.get('/api/hotels/search', { params: searchParams });
    return response.data;
  },

  // Add review
  async addReview(hotelId, reviewData) {
    const response = await api.post(`/api/hotels/${hotelId}/reviews`, reviewData);
    return response.data;
  }
};

// Admin Services
export const adminService = {
  // Get all hotels for admin
  async getHotels() {
    try {
      const response = await api.get('/api/admin/hotels');
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  // Get dashboard stats
  async getStats() {
    try {
      const response = await api.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Add new hotel
  async addHotel(hotelData) {
    try {
      const response = await api.post('/api/admin/hotels', hotelData);
      return response.data;
    } catch (error) {
      console.error('Error adding hotel:', error);
      throw error;
    }
  },

  // Update hotel
  async updateHotel(id, hotelData) {
    try {
      const response = await api.put(`/api/admin/hotels/${id}`, hotelData);
      return response.data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      throw error;
    }
  },

  // Delete hotel
  async deleteHotel(id) {
    try {
      const response = await api.delete(`/api/admin/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  },

  // Upload hotel images
  async uploadHotelImages(id, imageFiles) {
    try {
      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await api.post(`/api/admin/hotels/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }
};

// Booking Services
export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  // Get all bookings (admin only)
  async getAllBookings() {
    try {
      const response = await api.get('/api/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  },

  // Get user's bookings
  async getUserBookings() {
    try {
      const response = await api.get('/api/bookings/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  async getBookingById(id) {
    try {
      const response = await api.get(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Update booking
  async updateBooking(id, bookingData) {
    try {
      const response = await api.put(`/api/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Cancel booking
  async cancelBooking(id) {
    try {
      const response = await api.post(`/api/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },
  
  // Update booking status (admin only)
  async updateBookingStatus(id, status) {
    try {
      const response = await api.put(`/api/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
};
