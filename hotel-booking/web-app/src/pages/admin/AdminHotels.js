import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import './Admin.css';

function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await adminService.getHotels();
      console.log('Fetched hotels:', data);
      setHotels(data || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await adminService.deleteHotel(id);
        setHotels(hotels.filter(hotel => hotel._id !== id));
      } catch (err) {
        setError('Failed to delete hotel');
      }
    }
  };

  if (loading) return <div className="loading">Loading hotels...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-hotels">
      <div className="admin-content">
        <div className="admin-header">
        <h1>Manage Hotels</h1>
        <Link to="/admin/hotels/add" className="add-button">Add New Hotel</Link>
      </div>

      <div className="hotels-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Price Range</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(hotel => (
              <tr key={hotel._id}>
                <td>
                  {hotel.images?.length > 0 ? (
                    <img 
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="hotel-thumbnail"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Failed to load image:', hotel.images[0]);
                        e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', hotel.images[0]);
                        // Remove placeholder class if it exists
                        e.target.classList.remove('placeholder');
                      }}
                    />
                  ) : (
                    <div className="hotel-thumbnail placeholder">
                      No Image
                    </div>
                  )}
                </td>
                <td>{hotel.name}</td>
                <td>{hotel.location?.city}, {hotel.location?.country}</td>
                <td>
                  {hotel.rooms?.length > 0 ? (
                    `$${hotel.rooms[0]?.price || 0} - $${hotel.rooms[hotel.rooms.length - 1]?.price || 0}`
                  ) : 'No rooms'}
                </td>
                <td>{hotel.rating ? `★ ${hotel.rating.toFixed(1)}` : 'New'}</td>
                <td className="actions">
                  <Link to={`/admin/hotels/edit/${hotel._id}`} className="edit-button">Edit</Link>
                  <button onClick={() => handleDelete(hotel._id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default AdminHotels;
