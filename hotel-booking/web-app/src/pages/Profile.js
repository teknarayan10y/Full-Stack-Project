import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: '',
    previewMode: false // Flag to indicate if the current image is a preview or saved
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [profileUpdated, setProfileUpdated] = useState(false); // Track if profile was updated

  useEffect(() => {
    if (user) {
      // Ensure profile picture URL is complete
      let profilePictureUrl = user.profilePicture || '';
      if (profilePictureUrl && !profilePictureUrl.startsWith('http') && !profilePictureUrl.startsWith('data:')) {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        profilePictureUrl = `${baseUrl}${profilePictureUrl}`;
      }
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePicture: profilePictureUrl,
        previewMode: false
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Preview the image immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the form data with the temporary local preview URL
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result,
          previewMode: true // Flag to indicate this is a preview, not the saved image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    if (!file) return null;
    
    try {
      setUploadProgress(0);
      
      // Use the actual API service to upload the profile picture
      const response = await authService.uploadProfilePicture(file, (progress) => {
        setUploadProgress(progress);
      });
      
      if (response.success && response.profilePicture) {
        // Make sure to return the full URL with the API base URL
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const fullUrl = response.profilePicture.startsWith('http') 
          ? response.profilePicture 
          : `${baseUrl}${response.profilePicture}`;
        
        console.log('Uploaded profile picture URL:', fullUrl);
        return fullUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Failed to upload profile picture');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      let profileData = { ...formData };
      
      // If a file was selected, upload it first
      if (selectedFile) {
        const uploadedPicture = await uploadProfilePicture(selectedFile);
        if (uploadedPicture) {
          profileData.profilePicture = uploadedPicture;
        }
      }
      
      // Update the user profile with the form data and possibly the new profile picture
      const updatedUser = await updateUserProfile(profileData);
      
      // Update the form data with the saved profile data from the server
      if (updatedUser) {
        setFormData({
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          address: updatedUser.address || '',
          profilePicture: updatedUser.profilePicture || '',
          previewMode: false // No longer in preview mode since we have the saved URL
        });
      }
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setSelectedFile(null);
      setProfileUpdated(true); // Mark profile as updated
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">Please log in to view your profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and preferences</p>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="profile-content">
          <div className="profile-picture-section">
            <div className="profile-picture">
              {formData.profilePicture ? (
                <img 
                  src={formData.profilePicture} 
                  alt="Profile" 
                  className={formData.previewMode ? 'preview-image' : ''}
                  onError={(e) => {
                    console.error('Failed to load image:', formData.profilePicture);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=' + formData.name.charAt(0);
                  }}
                />
              ) : (
                <div className="profile-initial">{formData.name.charAt(0)}</div>
              )}
              {formData.previewMode && (
                <div className="preview-badge">Preview</div>
              )}
            </div>
            {isEditing && (
              <div className="profile-picture-upload">
                <label htmlFor="profilePicture">Upload Profile Picture:</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="file-input"
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="upload-progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="profile-details">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{formData.name}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Email</span>
                  <span className="info-value">{formData.email}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{formData.phone || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Address</span>
                  <span className="info-value">{formData.address || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Account Type</span>
                  <span className="info-value">{user.role === 'instructor' ? 'Instructor' : 'Customer'}</span>
                </div>
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Booking Preferences</h2>
          <div className="preferences-list">
            <div className="preference-item">
              <span className="preference-label">Preferred Room Type</span>
              <span className="preference-value">Deluxe</span>
            </div>
            <div className="preference-item">
              <span className="preference-label">Special Requirements</span>
              <span className="preference-value">Non-smoking room, High floor</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Security</h2>
          <div className="security-options">
            <button className="security-btn">Change Password</button>
            <button className="security-btn">Two-Factor Authentication</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
