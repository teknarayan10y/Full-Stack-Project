import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminService } from '../../services/api';
import HotelForm from '../../components/HotelForm';
import './AddHotel.css';

function AddHotel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await adminService.addHotel(formData);
      toast.success('Hotel created successfully!');
      navigate('/admin/hotels');
    } catch (err) {
      let errorMessage = 'Error creating hotel';
      
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map(error => error.msg)
          .join('; ');
        errorMessage = `Validation errors: ${errorMessages}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      console.error('Error creating hotel:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-hotel-page">
      <div className="add-hotel-container">
        <h2>Add New Hotel</h2>
        <HotelForm 
          onSubmit={handleSubmit}
          loading={loading}
          submitButtonText="Create Hotel"
        />
      </div>
    </div>
  );
}

export default AddHotel;
