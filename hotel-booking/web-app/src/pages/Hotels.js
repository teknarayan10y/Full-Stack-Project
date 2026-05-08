import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { hotelService } from '../services/api';
import './Hotels.css';

function Hotels() {
  const location = useLocation();
  const searchParams = location.state || {};
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    priceMin: searchParams.priceMin || '',
    priceMax: searchParams.priceMax || '',
    rating: '',
    city: searchParams.city || '',
    amenities: []
  });

  // Fallback data if API fails
  const fallbackHotels = [
    {
      id: 1,
      name: "Luxury Hotel & Spa",
      location: { city: "New York" },
      price: 299,
      rating: 4.8,
      imageColor: "linear-gradient(45deg, #1a237e, #0d47a1)",
      amenities: ["Pool", "Spa", "Gym", "Restaurant"]
    },
    {
      id: 2,
      name: "Business Hotel",
      location: { city: "New York" },
      price: 199,
      rating: 4.5,
      imageColor: "linear-gradient(45deg, #311b92, #4527a0)",
      amenities: ["WiFi", "Business Center", "Restaurant"]
    },
    {
      id: 3,
      name: "Boutique Hotel",
      location: { city: "New York" },
      price: 249,
      rating: 4.7,
      imageColor: "linear-gradient(45deg, #0277bd, #039be5)",
      amenities: ["Pool", "Bar", "Restaurant"]
    }
  ];

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hotelService.getAllHotels(filters);
      setHotels(data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to fetch hotels');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const getHotelImage = (hotel) => {
    if (hotel.images && hotel.images.length > 0) {
      const imageUrl = hotel.images[0];
      return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
    }
    return hotel.imageColor || 'linear-gradient(45deg, #1a237e, #0d47a1)';
  };

  if (loading) {
    return <div className="loading">Loading hotels...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotels-page">
      <div className="filters-section">
        <div className="filters-content">
          <div className="filter-group">
            <h3>Hotel Name</h3>
            <input
              type="text"
              name="name"
              placeholder="Search by hotel name"
              value={filters.name}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <h3>Location</h3>
            <input
              type="text"
              name="city"
              placeholder="Search by city"
              value={filters.city}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                name="priceMin"
                placeholder="Min price"
                value={filters.priceMin}
                onChange={handleFilterChange}
                className="filter-input"
                min="0"
              />
              <input
                type="number"
                name="priceMax"
                placeholder="Max price"
                value={filters.priceMax}
                onChange={handleFilterChange}
                className="filter-input"
                min="0"
              />
            </div>
          </div>

          <div className="filter-group">
            <h3>Rating</h3>
            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All ratings</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Amenities</h3>
            <div className="amenities-list">
              {['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Air Conditioning'].map(amenity => (
                <label key={amenity} className="amenity-label">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hotels-container">
        <div className="hotels-grid">
          {(hotels.length > 0 ? hotels : fallbackHotels)
            .filter(hotel => 
              !filters.name || hotel.name.toLowerCase().includes(filters.name.toLowerCase())
            )
            .map(hotel => (
            <div key={hotel._id || hotel.id} className="hotel-card">
              <div 
                className="hotel-image" 
                style={
                  hotel.images && hotel.images.length > 0
                    ? { backgroundImage: `url(${getHotelImage(hotel)})` }
                    : { background: hotel.imageColor }
                }
              ></div>
              <Link to={`/hotels/${hotel._id || hotel.id}`} className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="location">{hotel.location?.city}, {hotel.location?.country}</p>
                <div className="rating">{hotel.rating ? `★ ${hotel.rating.toFixed(1)}` : 'New'}</div>
                <div className="price">
                  {hotel.rooms && hotel.rooms.length > 0
                    ? `$${Math.min(...hotel.rooms.map(r => r.price))}/night`
                    : 'Contact for price'}
                </div>
                <div className="amenities">
                  {(hotel.amenities || []).slice(0, 4).map((amenity, index) => (
                    <span key={index}>{amenity}</span>
                  ))}
                </div>
              </Link>
            </div>
          ))}
          {hotels.length === 0 && !loading && !error && (
            <div className="no-results">No hotels found matching your criteria</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hotels;
