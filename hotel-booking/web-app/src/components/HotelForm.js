import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './HotelForm.css';

const AMENITIES_LIST = [
  'WiFi',
  'Pool',
  'Spa',
  'Gym',
  'Restaurant',
  'Room Service',
  'Bar',
  'Parking',
  'Air Conditioning',
  'Conference Room',
  'Business Center'
];

const INITIAL_ROOM = {
  type: 'Standard',
  price: '100',
  capacity: 2,
  amenities: []
};

const INITIAL_STATE = {
  name: '',
  description: '',
  location: {
    address: '',
    city: '',
    country: '',
    coordinates: {
      latitude: '',
      longitude: ''
    }
  },
  amenities: [],
  rooms: [{ ...INITIAL_ROOM }]
};

function HotelForm({ initialData, onSubmit, loading, submitButtonText }) {
  const [hotelData, setHotelData] = useState(initialData || INITIAL_STATE);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Validate hotel name
    if (!hotelData.name?.trim()) {
      newErrors.name = 'Hotel name is required';
    } else if (hotelData.name.trim().length < 3 || hotelData.name.trim().length > 100) {
      newErrors.name = 'Hotel name must be between 3 and 100 characters';
    }

    // Validate description
    if (!hotelData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (hotelData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    // Validate location
    if (!hotelData.location?.city?.trim()) {
      newErrors['location.city'] = 'City is required';
    }

    if (!hotelData.location?.country?.trim()) {
      newErrors['location.country'] = 'Country is required';
    }

    // Optional coordinates validation
    if (hotelData.location?.coordinates?.latitude) {
      const lat = parseFloat(hotelData.location.coordinates.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors['location.coordinates.latitude'] = 'Invalid latitude (-90 to 90)';
      }
    }

    if (hotelData.location?.coordinates?.longitude) {
      const lng = parseFloat(hotelData.location.coordinates.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors['location.coordinates.longitude'] = 'Invalid longitude (-180 to 180)';
      }
    }

    // Validate rooms
    if (!Array.isArray(hotelData.rooms) || hotelData.rooms.length === 0) {
      newErrors.rooms = 'At least one room is required';
    } else {
      const validRooms = hotelData.rooms.filter(room => {
        return (
          room?.type?.trim() && 
          !isNaN(parseFloat(room?.price)) && 
          parseFloat(room?.price) > 0 &&
          !isNaN(parseInt(room?.capacity)) && 
          parseInt(room?.capacity) > 0
        );
      });

      if (validRooms.length === 0) {
        newErrors.rooms = 'At least one valid room with type, price, and capacity is required';
      }
    }

    // Validate hotel amenities if provided
    if (hotelData.amenities?.length) {
      if (!Array.isArray(hotelData.amenities)) {
        newErrors.amenities = 'Hotel amenities must be a list';
      } else if (!hotelData.amenities.every(amenity => AMENITIES_LIST.includes(amenity))) {
        newErrors.amenities = 'Invalid amenity selected';
      }
    }

    // Validate images
    if (!images.length && !initialData) {
      newErrors.images = 'At least one image is required';
    } else if (images.length > 10) {
      newErrors.images = 'Maximum 10 images allowed';
    } else {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(img.type)) {
          newErrors.images = `Image ${i + 1} must be JPEG, PNG, or WebP format`;
          break;
        }
        if (img.size > 5 * 1024 * 1024) {
          newErrors.images = `Image ${i + 1} must be less than 5MB`;
          break;
        }
      }
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data before validation:', hotelData);

    if (!validate()) {
      console.log('Validation errors:', errors);
      return;
    }

    const formData = new FormData();

    // Create the hotel data object with proper structure
    const hotelDataObj = {
      name: hotelData.name?.trim(),
      description: hotelData.description?.trim(),
      location: {
        city: hotelData.location?.city?.trim(),
        country: hotelData.location?.country?.trim(),
        address: hotelData.location?.address?.trim(),
        coordinates: hotelData.location?.coordinates?.latitude && hotelData.location?.coordinates?.longitude
          ? {
              latitude: parseFloat(hotelData.location.coordinates.latitude),
              longitude: parseFloat(hotelData.location.coordinates.longitude)
            }
          : undefined
      },
      rooms: hotelData.rooms?.filter(room => room.type && room.price && room.capacity).map(room => ({
        type: room.type.trim(),
        price: parseFloat(room.price),
        capacity: parseInt(room.capacity),
        amenities: room.amenities || []
      })),
      amenities: hotelData.amenities || []
    };
    
    // Log the final data
    console.log('Hotel data being sent:', {
      name: hotelDataObj.name,
      location: hotelDataObj.location,
      rooms: hotelDataObj.rooms
    });

    // Append the structured data
    const jsonData = JSON.stringify(hotelDataObj);
    console.log('Sending JSON data:', jsonData);
    formData.append('data', jsonData);

    // Add images
    if (images?.length) {
      images.forEach((image, index) => {
        console.log(`Appending image ${index}:`, image.name);
        formData.append('images', image);
      });
    } else {
      console.log('No images to append');
    }

    // Log the form data entries
    for (let [key, value] of formData.entries()) {
      console.log(`FormData entry - ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('[')) {
      const path = name.replace(/\[/g, '.').replace(/\]/g, '');
      const parts = path.split('.');
      
      setHotelData(prev => {
        const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
        let current = newData;
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!(part in current)) {
            current[part] = {};
          }
          current = current[part];
        }
        
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
        return newData;
      });
    } else {
      setHotelData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setHotelData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRoomAmenityChange = (roomIndex, amenity) => {
    setHotelData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, index) => 
        index === roomIndex
          ? {
              ...room,
              amenities: room.amenities.includes(amenity)
                ? room.amenities.filter(a => a !== amenity)
                : [...room.amenities, amenity]
            }
          : room
      )
    }));
  };

  const handleRoomChange = (index, field, value) => {
    setHotelData(prev => {
      // Create a deep copy of the previous state
      const newData = JSON.parse(JSON.stringify(prev));
      
      // Update the specific room field
      if (!newData.rooms[index]) {
        newData.rooms[index] = { ...INITIAL_ROOM };
      }

      // Convert price and capacity to numbers
      if (field === 'price') {
        newData.rooms[index][field] = parseFloat(value) || '';
      } else if (field === 'capacity') {
        newData.rooms[index][field] = parseInt(value) || '';
      } else {
        newData.rooms[index][field] = value;
      }
      
      return newData;
    });
  };

  const addRoom = () => {
    setHotelData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { ...INITIAL_ROOM }]
    }));
  };

  const removeRoom = (index) => {
    if (hotelData.rooms.length > 1) {
      setHotelData(prev => ({
        ...prev,
        rooms: prev.rooms.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create preview URLs for the images
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);

    // Log the selected files
    console.log('Selected files:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit}>
      {/* Basic Information */}
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-group">
          <label>Hotel Name *</label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={hotelData.name}
            onChange={handleChange}
            name="name"
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label>Description *</label>
          <textarea
            className={`form-input ${errors.description ? 'error' : ''}`}
            value={hotelData.description}
            onChange={handleChange}
            name="description"
            required
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
      </div>

      {/* Location Information */}
      <div className="form-section">
        <h3>Location</h3>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-input"
            value={hotelData.location.address}
            onChange={handleChange}
            name="location[address]"
          />
        </div>
        
        <div className="form-group">
          <label className="required-field">
            City <span className="required-star">*</span>
            {errors['location.city'] && (
              <span className="alert-icon" title={errors['location.city']}>⚠️</span>
            )}
          </label>
          <input
            type="text"
            className={`form-input ${errors['location.city'] ? 'error' : ''}`}
            value={hotelData.location.city}
            onChange={handleChange}
            name="location[city]"
            required
          />
          {errors['location.city'] && <span className="error-text">{errors['location.city']}</span>}
        </div>
        
        <div className="form-group">
          <label className="required-field">
            Country <span className="required-star">*</span>
            {errors['location.country'] && (
              <span className="alert-icon" title={errors['location.country']}>⚠️</span>
            )}
          </label>
          <input
            type="text"
            className={`form-input ${errors['location.country'] ? 'error' : ''}`}
            value={hotelData.location.country}
            onChange={handleChange}
            name="location[country]"
            required
          />
          {errors['location.country'] && <span className="error-text">{errors['location.country']}</span>}
        </div>

        <div className="coordinates">
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              className="form-input"
              value={hotelData.location.coordinates.latitude}
              onChange={handleChange}
              name="location[coordinates][latitude]"
              step="any"
            />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              className="form-input"
              value={hotelData.location.coordinates.longitude}
              onChange={handleChange}
              name="location[coordinates][longitude]"
              step="any"
            />
          </div>
        </div>
      </div>

      {/* Hotel Amenities */}
      <div className="form-section">
        <h3>Hotel Amenities</h3>
        <div className="amenities-grid">
          {AMENITIES_LIST.map(amenity => (
            <label key={amenity} className="amenity-checkbox">
              <input
                type="checkbox"
                checked={hotelData.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <div className="form-section">
        <h3>Rooms</h3>
        {hotelData.rooms.map((room, index) => (
          <div key={index} className="room-section">
            <h4>Room {index + 1}</h4>
            <div className="form-group">
              <label className="required-field">
                Room Type <span className="required-star">*</span>
                {errors[`rooms.${index}.type`] && (
                  <span className="alert-icon" title={errors[`rooms.${index}.type`]}>⚠️</span>
                )}
              </label>
              <input
                type="text"
                className={`form-input ${errors[`rooms.${index}.type`] ? 'error' : ''}`}
                value={room.type}
                onChange={(e) => handleRoomChange(index, 'type', e.target.value)}
                required
              />
              {errors[`rooms.${index}.type`] && (
                <span className="error-text">{errors[`rooms.${index}.type`]}</span>
              )}
            </div>

            <div className="form-group">
              <label className="required-field">
                Price per Night <span className="required-star">*</span>
                {errors[`rooms.${index}.price`] && (
                  <span className="alert-icon" title={errors[`rooms.${index}.price`]}>⚠️</span>
                )}
              </label>
              <input
                type="number"
                className={`form-input ${errors[`rooms.${index}.price`] ? 'error' : ''}`}
                value={room.price}
                onChange={(e) => handleRoomChange(index, 'price', e.target.value)}
                min="0"
                required
              />
              {errors[`rooms.${index}.price`] && (
                <span className="error-text">{errors[`rooms.${index}.price`]}</span>
              )}
            </div>

            <div className="form-group">
              <label className="required-field">
                Capacity <span className="required-star">*</span>
                {errors[`rooms.${index}.capacity`] && (
                  <span className="alert-icon" title={errors[`rooms.${index}.capacity`]}>⚠️</span>
                )}
              </label>
              <input
                type="number"
                className={`form-input ${errors[`rooms.${index}.capacity`] ? 'error' : ''}`}
                value={room.capacity}
                onChange={(e) => handleRoomChange(index, 'capacity', e.target.value)}
                min="1"
                required
              />
              {errors[`rooms.${index}.capacity`] && (
                <span className="error-text">{errors[`rooms.${index}.capacity`]}</span>
              )}
            </div>

            <div className="room-amenities">
              <h5>Room Amenities</h5>
              <div className="amenities-grid">
                {AMENITIES_LIST.map(amenity => (
                  <label key={`${index}-${amenity}`} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      checked={room.amenities.includes(amenity)}
                      onChange={() => handleRoomAmenityChange(index, amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            {hotelData.rooms.length > 1 && (
              <button
                type="button"
                className="remove-room-btn"
                onClick={() => removeRoom(index)}
              >
                Remove Room
              </button>
            )}
          </div>
        ))}
        
        <button type="button" className="add-room-btn" onClick={addRoom}>
          Add Another Room
        </button>
      </div>

      {/* Images */}
      <div className="form-section">
        <h3>Hotel Images {!initialData && '*'}</h3>
        <div className="form-group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={`form-input ${errors.images ? 'error' : ''}`}
            required={!initialData}
          />
          <small>You can select multiple images</small>
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>
        {images.length > 0 && (
          <div className="selected-images">
            <p>Selected {images.length} image(s)</p>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Please wait...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}

HotelForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submitButtonText: PropTypes.string.isRequired
};

export default HotelForm;
