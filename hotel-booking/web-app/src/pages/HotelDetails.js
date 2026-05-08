import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hotelService } from '../services/api';
import './HotelDetails.css';

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [bookingInfo, setBookingInfo] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    paymentMethod: 'card',
    roomId: null,
    roomType: null,
    price: null,
  });

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await hotelService.getHotelById(id);
        if (response.success) {
          console.log('Hotel data received:', response.data);
          setHotel(response.data);
        } else {
          throw new Error('Failed to fetch hotel details');
        }
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!selectedRoom || !bookingInfo.checkIn || !bookingInfo.checkOut) return 0;
    const checkIn = new Date(bookingInfo.checkIn);
    const checkOut = new Date(bookingInfo.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return selectedRoom.price * nights;
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    if (room) {
      setBookingInfo(prev => ({
        ...prev,
        roomId: room.id,
        roomType: room.type,
        price: room.price
      }));
    }
  };

  const validateDates = () => {
    const today = new Date();
    const checkIn = new Date(bookingInfo.checkIn);
    const checkOut = new Date(bookingInfo.checkOut);

    if (checkIn < today) {
      alert('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date');
      return false;
    }

    return true;
  };

  const validateGuests = () => {
    if (!selectedRoom) return false;
    
    if (bookingInfo.guests < 1 || bookingInfo.guests > selectedRoom.capacity) {
      alert(`Number of guests must be between 1 and ${selectedRoom.capacity}`);
      return false;
    }
    return true;
  };

  const handleBooking = () => {
    console.log('Booking process started');
    console.log('Auth status:', isAuthenticated);
    console.log('Selected room:', selectedRoom);
    console.log('Booking info:', bookingInfo);

    if (!isAuthenticated) {
      alert('You need to login first. Redirecting to login page...');
      navigate('/login', { state: { from: `/hotels/${id}` } });
      return;
    }

    if (!selectedRoom) {
      alert('Please select a room first before proceeding with the booking');
      return;
    }

    if (!bookingInfo.checkIn || !bookingInfo.checkOut) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    if (!bookingInfo.guests || bookingInfo.guests < 1) {
      alert('Please enter the number of guests');
      return;
    }

    if (!validateDates()) {
      alert('Please check your dates - make sure check-out is after check-in');
      return;
    }

    if (!validateGuests()) {
      alert(`Please ensure guest count is between 1 and ${selectedRoom.capacity}`);
      return;
    }

    // Calculate total price
    const checkIn = new Date(bookingInfo.checkIn);
    const checkOut = new Date(bookingInfo.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * selectedRoom.price;

    console.log('All validations passed, attempting navigation');
    console.log('Navigation details:', {
      path: '/booking-confirmation',
      state: {
        hotel: hotel,
        room: selectedRoom,
        booking: {
          ...bookingInfo,
          totalPrice,
          nights
        }
      }
    });

    try {
      navigate('/booking-confirmation', {
        state: {
          hotel,
          room: selectedRoom,
          dates: {
            ...bookingInfo,
            nights,
            totalPrice
          }
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Error during navigation: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!hotel) return <div className="error-message">Hotel not found</div>;

  return (
    <div className="hotel-details">
      <div className="image-gallery">
        {hotel?.images?.length > 0 ? (
          <>
            <div className="main-image">
              <img 
                src={hotel.images[activeImage]}
                alt={hotel.name}
                onError={(e) => {
                  console.error('Failed to load image:', hotel.images[activeImage]);
                  e.target.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
                }}
                onLoad={() => console.log('Image loaded successfully:', hotel.images[activeImage])}
              />
            </div>
            <div className="image-thumbnails">
              {hotel.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                  }}
                  alt={`${hotel.name} - ${index + 1}`}
                  className={activeImage === index ? 'active' : ''}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-images">No images available</div>
        )}
      </div>

      <div className="hotel-info-container">
        <div className="hotel-main-info">
          <h1>{hotel?.name || 'Hotel Name Not Available'}</h1>
          <div className="location-info">
            <h3>Location</h3>
            <p>{hotel?.location?.city}, {hotel?.location?.country}</p>
            <p>{hotel?.location?.address || 'Address not available'}</p>
          </div>
          <div className="location-rating">
            <span className="location">{hotel?.location?.city}, {hotel?.location?.country}</span>
            <span className="rating">{hotel?.rating ? `★ ${hotel?.rating.toFixed(1)}` : 'New'}</span>
          </div>
          <div className="description">
            <h3>Description</h3>
            <p>{hotel?.description || 'No description available'}</p>
          </div>

          <div className="amenities-section">
            <h3>Amenities</h3>
            <div className="amenities-list">
              {hotel?.amenities?.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              )) || 'No amenities listed'}
            </div>
          </div>

          <div className="rooms-section">
            <h3>Available Rooms</h3>
            <div className="rooms-list">
              {hotel?.rooms?.map((room, index) => (
                <div key={index} className="room-card">
                  <h4>{room.type}</h4>
                  <p>Capacity: {room.capacity} guests</p>
                  <p>Price: ${room.price}/night</p>
                  <p>{room.description || ''}</p>
                  <button 
                    className={`select-room-btn ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                    onClick={() => handleRoomSelect(room)}
                  >
                    {selectedRoom?.id === room.id ? 'Selected' : 'Select Room'}
                  </button>
                </div>
              )) || <p>No rooms available</p>}
            </div>
          </div>

          <div className="booking-card">
            <h3>Book Your Stay</h3>

            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                value={bookingInfo.checkIn}
                onChange={(e) => setBookingInfo({ ...bookingInfo, checkIn: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                value={bookingInfo.checkOut}
                onChange={(e) => setBookingInfo({ ...bookingInfo, checkOut: e.target.value })}
                min={bookingInfo.checkIn || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Guests</label>
              <input
                type="number"
                value={bookingInfo.guests}
                onChange={(e) => setBookingInfo({ ...bookingInfo, guests: parseInt(e.target.value) })}
                min="1"
                max={selectedRoom?.capacity || 1}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Room Type:</label>
              <select
                value={selectedRoom?.id || ''}
                onChange={(e) => {
                  const room = hotel?.rooms?.find(r => r.id === e.target.value);
                  if (room) handleRoomSelect(room);
                }}
                required
              >
                <option value="">Choose a room</option>
                {hotel?.rooms?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.type || 'Room Type Not Available'} - ${room?.price || 'N/A'}/night
                  </option>
                ))}
              </select>
            </div>

            {selectedRoom && (
              <div className="room-details">
                <h4>{selectedRoom.type || 'Room Type Not Available'}</h4>
                <p>Price: ${selectedRoom?.price || 'N/A'}/night</p>
                <p>Capacity: {selectedRoom?.capacity || 'N/A'} guests</p>
                <div className="amenities">
                  <h3>Amenities</h3>
                  <ul>
                    {selectedRoom?.amenities?.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    )) || <li>No amenities listed</li>}
                  </ul>
                </div>
              </div>
            )}

            <button
              className="book-now-btn"
              onClick={handleBooking}
              disabled={!selectedRoom || !bookingInfo.checkIn || !bookingInfo.checkOut || !bookingInfo.guests}
            >
              {isAuthenticated ? 
                (!selectedRoom ? 'Select a Room' : 
                 !bookingInfo.checkIn || !bookingInfo.checkOut ? 'Select Dates' : 
                 'Book Now') : 
                'Login to Book'}
            </button>
          </div>

          <div className="rooms-section">
            <h2>Available Rooms</h2>
            <div className="rooms-grid">
              {hotel?.rooms?.map((room) => (
                <div
                  key={room.id}
                  className={`room-card ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <h3>{room.type || 'Room Type Not Available'}</h3>
                  <p className="price">${room?.price || 'N/A'}/night</p>
                  <div className="room-details">
                    <p>Capacity: {room?.capacity || 'N/A'} guests</p>
                    <p>Bed Type: {room?.bedType || 'Not specified'}</p>
                  </div>
                  <div className="room-amenities">
                    <h4>Room Amenities</h4>
                    <ul>
                      {room?.amenities?.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      )) || <li>No amenities listed</li>}
                    </ul>
                  </div>
                </div>
              )) || <p>No rooms available</p>}
            </div>
          </div>

          <div className="amenities-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {hotel?.amenities?.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span className="amenity-icon">✓</span>
                  <span>{amenity}</span>
                </div>
              )) || <p>No amenities listed</p>}
            </div>
          </div>

          {hotel?.reviews && hotel.reviews.length > 0 && (
            <div className="reviews-section">
              <h2>Guest Reviews</h2>
              <div className="reviews-grid">
                {hotel.reviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-rating">
                        {Array(review.rating).fill('⭐').join('')}
                      </span>
                    </div>
                    <p className="review-text">{review.comment}</p>
                    <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
