import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUsers, FaStar, FaMapMarkerAlt, FaPercent, 
         FaHotel, FaUmbrellaBeach, FaUtensils, FaSwimmingPool, FaWifi, FaParking, 
         FaShuttleVan, FaCocktail, FaSpa, FaConciergeBell, FaArrowRight } from 'react-icons/fa';
import { hotelService } from '../services/api';
import ThreeDScene from '../components/ThreeDScene';
import './Home3D.css';

function Home3D() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  
  // Add popular search suggestions
  const popularLocations = ['New York', 'Paris', 'Tokyo', 'London', 'Rome', 'Sydney'];
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  
  // Set default dates if not set
  useEffect(() => {
    if (!searchParams.checkIn) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextDay = new Date(tomorrow);
      nextDay.setDate(nextDay.getDate() + 1);
      
      setSearchParams(prev => ({
        ...prev,
        checkIn: formatDate(tomorrow),
        checkOut: formatDate(nextDay)
      }));
    }
    
    // Fetch featured hotels
    const fetchFeaturedHotels = async () => {
      try {
        setLoading(true);
        const hotels = await hotelService.getAllHotels({ featured: true, limit: 3 });
        setFeaturedHotels(hotels);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured hotels:', err);
        setError('Failed to load featured hotels');
        setLoading(false);
      }
    };
    
    fetchFeaturedHotels();
  }, []);
  
  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSearch = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setShowSuggestions(false);
    
    // Check if search term is provided
    if (!searchParams.location.trim()) {
      // If no search term, navigate to hotels page with all filters
      navigate('/hotels', { state: searchParams });
      return;
    }
    
    // Search for hotels matching the criteria
    try {
      setSearchLoading(true);
      setSearchError(null);
      setHasSearched(true);
      
      // Call the API to search for hotels
      const searchTerm = searchParams.location.trim();
      const baseFilters = {
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: searchParams.guests,
        limit: 10 // Get more hotels to filter client-side
      };
      
      // Get all hotels first - avoid using ID-based search to prevent ObjectId errors
      const response = await hotelService.getAllHotels(baseFilters);
      
      // Extract the hotels array from the response
      // The API might return { data: [...] } or directly an array
      const allHotels = response.data || response || [];
      
      // Make sure we have an array before filtering
      if (!Array.isArray(allHotels)) {
        console.error('Expected hotels array but got:', allHotels);
        setSearchResults([]);
        return;
      }
      
      // Filter hotels by name or location (client-side filtering)
      const filteredResults = allHotels.filter(hotel => {
        if (!hotel) return false;
        
        // Check if hotel name matches search term
        const nameMatch = hotel.name && 
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Check if hotel location (city or country) matches search term
        const locationMatch = 
          (hotel.location && typeof hotel.location === 'string' && 
            hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (hotel.location && hotel.location.city && 
            hotel.location.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (hotel.location && hotel.location.country && 
            hotel.location.country.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return nameMatch || locationMatch;
      });
      
      // Limit to 6 results for display
      setSearchResults(filteredResults.slice(0, 6));
      
      // Scroll to search results section
      if (searchResultsRef.current) {
        searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error searching hotels:', err);
      setSearchError('Failed to search hotels. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };
  
  // Handle location input focus and change
  const handleLocationFocus = () => {
    if (searchParams.location.trim() === '') {
      setShowSuggestions(true);
    }
  };
  
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSearchParams({...searchParams, location: value});
    setShowSuggestions(value.trim() === '');
  };
  
  const handleSuggestionClick = (location) => {
    // First directly update the DOM element to ensure immediate visual feedback
    const inputElement = document.querySelector('.search-input-group input[type="text"]');
    if (inputElement) {
      inputElement.value = location;
    }
    
    // Then update React state
    setSearchParams({...searchParams, location});
    
    // Hide suggestions
    setShowSuggestions(false);
    
    // Trigger search with the selected location after a short delay
    // to ensure the state has been updated
    setTimeout(() => {
      handleSearch({ preventDefault: () => {} });
    }, 200);
  };
  
  // Function to view all search results
  const viewAllResults = () => {
    navigate('/hotels', { state: searchParams });
  };
  
  // Function to handle destination click
  const handleDestinationClick = async (destination) => {
    try {
      setSearchLoading(true);
      setSearchError(null);
      setHasSearched(true);
      setSelectedDestination(destination);
      
      // Update search params with the selected destination
      setSearchParams({...searchParams, location: destination});
      
      // Call the API to search for hotels in the selected destination
      const baseFilters = {
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: searchParams.guests,
        limit: 10
      };
      
      // Get all hotels
      const response = await hotelService.getAllHotels(baseFilters);
      
      // Extract the hotels array from the response
      const allHotels = response.data || response || [];
      
      // Make sure we have an array before filtering
      if (!Array.isArray(allHotels)) {
        console.error('Expected hotels array but got:', allHotels);
        setSearchResults([]);
        return;
      }
      
      // Filter hotels by destination
      const filteredResults = allHotels.filter(hotel => {
        if (!hotel) return false;
        
        // Check if hotel location matches the destination
        const locationMatch = 
          (hotel.location && typeof hotel.location === 'string' && 
            hotel.location.toLowerCase().includes(destination.toLowerCase())) ||
          (hotel.location && hotel.location.city && 
            hotel.location.city.toLowerCase().includes(destination.toLowerCase())) ||
          (hotel.location && hotel.location.country && 
            hotel.location.country.toLowerCase().includes(destination.toLowerCase()));
        
        return locationMatch;
      });
      
      // Limit to 6 results for display
      setSearchResults(filteredResults.slice(0, 6));
      
      // Scroll to search results section
      if (searchResultsRef.current) {
        searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error searching hotels:', err);
      setSearchError('Failed to search hotels. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Scroll to section
  const featuredRef = useRef(null);
  const popularRef = useRef(null);
  const amenitiesRef = useRef(null);
  const searchResultsRef = useRef(null);
  
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSceneLoaded = () => {
    setSceneLoaded(true);
    // Add a small delay to ensure the scene is fully rendered
    setTimeout(() => {
      document.querySelector('.hero-content').classList.add('fade-in');
      document.querySelector('.search-container').classList.add('slide-up');
    }, 500);
  };
  
  return (
    <div className="home3d">
      {/* 3D Scene */}
      <ThreeDScene onSceneLoaded={handleSceneLoaded} />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="animated-title">Find Your Perfect Stay</h1>
          <p className="hero-subtitle">Discover amazing hotels and accommodations around the world</p>
          <div className="hero-buttons">
            <button className="hero-button primary" onClick={() => scrollToSection(featuredRef)}>Explore Hotels</button>
            <button className="hero-button secondary" onClick={() => scrollToSection(popularRef)}>Popular Destinations</button>
          </div>
        </div>
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="search-input-group">
              <FaMapMarkerAlt className="search-icon" />
              <input
                type="text"
                placeholder="Search by location or hotel name"
                value={searchParams.location}
                onChange={handleLocationChange}
                onFocus={handleLocationFocus}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && (
                <div className="location-suggestions">
                  <p className="suggestion-title">Popular destinations:</p>
                  {popularLocations.map(location => (
                    <div 
                      key={location} 
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(location)}
                    >
                      <FaMapMarkerAlt className="suggestion-icon" />
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="search-input-group">
              <FaCalendarAlt className="search-icon" />
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                required
              />
            </div>
            <div className="search-input-group">
              <FaCalendarAlt className="search-icon" />
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                required
              />
            </div>
            <div className="search-input-group">
              <FaUsers className="search-icon" />
              <input
                type="number"
                min="1"
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                required
              />
            </div>
            <button type="submit" className="search-button">
              <FaSearch className="search-button-icon" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      <div className="content-container">
        {/* Search Results Section - Only visible after search */}
        {hasSearched && (
          <div className="search-results-section" ref={searchResultsRef}>
            <div className="section-header">
              <h2>{selectedDestination ? `Properties in ${selectedDestination}` : 'Search Results'}</h2>
              <p className="section-subtitle">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} hotels ${selectedDestination ? `in ${selectedDestination}` : `matching "${searchParams.location}"`}` 
                  : `No hotels found ${selectedDestination ? `in ${selectedDestination}` : `matching "${searchParams.location}"`}`}
              </p>
              <p className="search-tip">Tip: You can search by hotel name or location</p>
            </div>
            
            {searchLoading ? (
              <div className="loading-spinner">Searching hotels...</div>
            ) : searchError ? (
              <div className="error-message">{searchError}</div>
            ) : (
              <div className="search-results-container">
                {searchResults.length > 0 ? (
                  <>
                    <div className="featured-hotels-grid">
                      {searchResults.map((hotel) => (
                        <div className="hotel-card" key={hotel._id} onClick={() => navigate(`/hotels/${hotel._id}`)}>
                          <div className="hotel-image">
                            <img src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'https://via.placeholder.com/300x200?text=Hotel'} alt={hotel.name} />
                            {hotel.discount > 0 && (
                              <div className="discount-badge">{hotel.discount}% OFF</div>
                            )}
                          </div>
                          <div className="hotel-info">
                            <h3>{hotel.name}</h3>
                            <div className="hotel-location">
                              <FaMapMarkerAlt className="location-icon" />
                              <span>
                                {typeof hotel.location === 'string' 
                                  ? hotel.location 
                                  : hotel.location && hotel.location.city 
                                    ? `${hotel.location.city}${hotel.location.country ? `, ${hotel.location.country}` : ''}` 
                                    : 'Location not available'}
                              </span>
                            </div>
                            <div className="hotel-rating">
                              {Array.from({ length: Math.floor(hotel.rating || 0) }).map((_, i) => (
                                <FaStar key={i} className="star-icon" />
                              ))}
                              <span className="rating-text">({hotel.rating})</span>
                            </div>
                            <div className="hotel-price">
                              <span className="price">${hotel.price}<span className="per-night">/night</span></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="view-all-container">
                      <button className="view-all-button" onClick={viewAllResults}>
                        {selectedDestination 
                          ? `View All Properties in ${selectedDestination}` 
                          : 'View All Results'}
                        <FaArrowRight className="arrow-icon" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="no-results-message">
                    <h3>No hotels found for "{searchParams.location}"</h3>
                    <p>We couldn't find any hotels matching your search criteria. Try:</p>
                    <ul>
                      <li>Checking for spelling mistakes</li>
                      <li>Using more general search terms</li>
                      <li>Adjusting your dates or guest count</li>
                      <li>Exploring our popular destinations below</li>
                    </ul>
                    <div className="suggestion-buttons">
                      {popularLocations.slice(0, 4).map(location => (
                        <button 
                          key={location} 
                          className="suggestion-button"
                          onClick={() => {
                            setSearchParams({...searchParams, location});
                            handleSearch({ preventDefault: () => {} });
                          }}
                        >
                          <FaMapMarkerAlt /> {location}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="featured-section" ref={featuredRef}>
          <div className="section-header">
            <h2>Featured Hotels</h2>
            <p className="section-subtitle">Handpicked accommodations for your next adventure</p>
          </div>
          {loading ? (
            <div className="loading-spinner">Loading featured hotels...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="featured-hotels-grid">
              {featuredHotels.length > 0 ? (
                featuredHotels.map((hotel) => (
                  <div className="hotel-card" key={hotel._id} onClick={() => navigate(`/hotels/${hotel._id}`)}>
                    <div className="hotel-image">
                      <img src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'https://via.placeholder.com/300x200?text=Hotel'} alt={hotel.name} />
                      {hotel.discount > 0 && (
                        <div className="discount-badge">{hotel.discount}% OFF</div>
                      )}
                    </div>
                    <div className="hotel-info">
                      <h3>{hotel.name}</h3>
                      <div className="hotel-location">
                        <FaMapMarkerAlt className="location-icon" />
                        <span>
                          {typeof hotel.location === 'string' 
                            ? hotel.location 
                            : hotel.location && hotel.location.city 
                              ? `${hotel.location.city}${hotel.location.country ? `, ${hotel.location.country}` : ''}` 
                              : 'Location not available'}
                        </span>
                      </div>
                      <div className="hotel-rating">
                        {Array.from({ length: Math.floor(hotel.rating || 0) }).map((_, i) => (
                          <FaStar key={i} className="star-icon" />
                        ))}
                        <span className="rating-text">({hotel.rating})</span>
                      </div>
                      <div className="hotel-price">
                        <span className="price">${hotel.price}<span className="per-night">/night</span></span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-hotels-message">
                  <p>No featured hotels available at the moment. Check back later!</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="popular-destinations-section" ref={popularRef}>
          <div className="section-header">
            <h2>Popular Destinations</h2>
            <p className="section-subtitle">Explore trending locations loved by travelers</p>
          </div>
          <div className="destinations-grid">
            <div className="destination-card" onClick={() => {
              const destination = 'New York';
              setSearchParams({...searchParams, location: destination});
              setSelectedDestination(destination);
              handleDestinationClick(destination);
            }}>
              <div className="destination-image" style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bmV3JTIweW9ya3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80)'
              }}></div>
              <div className="destination-info">
                <h3>New York</h3>
                <p>120 properties</p>
              </div>
            </div>
            <div className="destination-card" onClick={() => {
              const destination = 'Paris';
              setSearchParams({...searchParams, location: destination});
              setSelectedDestination(destination);
              handleDestinationClick(destination);
            }}>
              <div className="destination-image" style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80)'
              }}></div>
              <div className="destination-info">
                <h3>Paris</h3>
                <p>86 properties</p>
              </div>
            </div>
            <div className="destination-card" onClick={() => {
              const destination = 'Tokyo';
              setSearchParams({...searchParams, location: destination});
              setSelectedDestination(destination);
              handleDestinationClick(destination);
            }}>
              <div className="destination-image" style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG9reW98ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80)'
              }}></div>
              <div className="destination-info">
                <h3>Tokyo</h3>
                <p>94 properties</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="amenities-section" ref={amenitiesRef}>
          <div className="section-header">
            <h2>Top Amenities</h2>
            <p className="section-subtitle">Filter hotels by your favorite amenities</p>
          </div>
          <div className="amenities-grid">
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['WiFi'] } })}>
              <FaWifi className="amenity-icon" />
              <span>WiFi</span>
            </div>
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['Pool'] } })}>
              <FaSwimmingPool className="amenity-icon" />
              <span>Pool</span>
            </div>
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['Restaurant'] } })}>
              <FaUtensils className="amenity-icon" />
              <span>Restaurant</span>
            </div>
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['Parking'] } })}>
              <FaParking className="amenity-icon" />
              <span>Parking</span>
            </div>
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['Spa'] } })}>
              <FaSpa className="amenity-icon" />
              <span>Spa</span>
            </div>
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['Bar'] } })}>
              <FaCocktail className="amenity-icon" />
              <span>Bar</span>
            </div>
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['Airport Shuttle'] } })}>
              <FaShuttleVan className="amenity-icon" />
              <span>Airport Shuttle</span>
            </div>
            <div className="amenity-card" onClick={() => navigate('/hotels', { state: { ...searchParams, amenities: ['Concierge'] } })}>
              <FaConciergeBell className="amenity-icon" />
              <span>Concierge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home3D;
