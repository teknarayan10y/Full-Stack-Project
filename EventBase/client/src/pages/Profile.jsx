import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Link as LinkIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),
  location: yup.string(),
  website: yup.string().url('Please enter a valid URL'),
  skills: yup.string(),
  social: yup.object({
    twitter: yup.string().url('Please enter a valid URL'),
    linkedin: yup.string().url('Please enter a valid URL'),
    github: yup.string().url('Please enter a valid URL')
  })
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      location: '',
      website: '',
      skills: '',
      social: {
        twitter: '',
        linkedin: '',
        github: ''
      }
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setProfileData(data.data);
        reset({
          name: data.data.name,
          email: data.data.email,
          bio: data.data.profile?.bio || '',
          location: data.data.profile?.location || '',
          website: data.data.profile?.website || '',
          skills: data.data.profile?.skills?.join(', ') || '',
          social: {
            twitter: data.data.profile?.social?.twitter || '',
            linkedin: data.data.profile?.social?.linkedin || '',
            github: data.data.profile?.social?.github || ''
          }
        });
      } catch (error) {
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const profileData = {
        name: data.name,
        email: data.email,
        profile: {
          bio: data.bio,
          location: data.location,
          website: data.website,
          skills: data.skills ? data.skills.split(',').map(skill => skill.trim()) : [],
          social: {
            twitter: data.social.twitter,
            linkedin: data.social.linkedin,
            github: data.social.github
          }
        }
      };

      const { data: updatedUser } = await api.put('/auth/updatedetails', profileData);
      updateUser(updatedUser.data);
      setProfileData(updatedUser.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          {!isEditing && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              disabled={isLoading}
            >
              Edit Profile
            </Button>
          )}
        </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Left Column - Avatar and Basic Info */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                src={profileData?.profile?.avatar}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mb: 2,
                  fontSize: '3rem',
                  bgcolor: theme.palette.primary.main
                }}
              >
                {profileData?.name?.charAt(0).toUpperCase()}
              </Avatar>
              
              {isEditing && (
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ mb: 2 }}
                >
                  Change Photo
                  <input type="file" hidden accept="image/*" />
                </Button>
              )}
              
              <Typography variant="h6" align="center">
                {profileData?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                {profileData?.role?.charAt(0).toUpperCase() + profileData?.role?.slice(1)}
              </Typography>
              
              {!isEditing && profileData?.profile?.location && (
                <Box display="flex" alignItems="center" mt={1}>
                  <LocationIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="textSecondary">
                    {profileData.profile.location}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {!isEditing && (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    CONTACT INFORMATION
                  </Typography>
                  {profileData?.email && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <EmailIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {profileData.email}
                      </Typography>
                    </Box>
                  )}
                  {profileData?.profile?.website && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <LinkIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                      <Typography 
                        variant="body2" 
                        component="a" 
                        href={profileData.profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ textDecoration: 'none', color: 'primary.main' }}
                      >
                        {profileData.profile.website}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {(profileData?.profile?.social?.twitter || 
                  profileData?.profile?.social?.linkedin || 
                  profileData?.profile?.social?.github) && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      SOCIAL LINKS
                    </Typography>
                    <Box display="flex" gap={1}>
                      {profileData?.profile?.social?.twitter && (
                        <IconButton 
                          href={profileData.profile.social.twitter} 
                          target="_blank" 
                          size="small"
                          color="primary"
                        >
                          <TwitterIcon />
                        </IconButton>
                      )}
                      {profileData?.profile?.social?.linkedin && (
                        <IconButton 
                          href={profileData.profile.social.linkedin} 
                          target="_blank" 
                          size="small"
                          color="primary"
                        >
                          <LinkedInIcon />
                        </IconButton>
                      )}
                      {profileData?.profile?.social?.github && (
                        <IconButton 
                          href={profileData.profile.social.github} 
                          target="_blank" 
                          size="small"
                          color="primary"
                        >
                          <GitHubIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Grid>
          
          {/* Right Column - Detailed Info */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  {...register('bio')}
                  error={!!errors.bio}
                  helperText={errors.bio?.message}
                  disabled={!isEditing}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  {...register('location')}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  {...register('website')}
                  error={!!errors.website}
                  helperText={errors.website?.message}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Skills (comma separated)"
                  {...register('skills')}
                  error={!!errors.skills}
                  helperText={errors.skills?.message || "e.g., JavaScript, React, Node.js"}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1 }}>
                  Social Links
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Twitter"
                      {...register('social.twitter')}
                      error={!!errors.social?.twitter}
                      helperText={errors.social?.twitter?.message}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TwitterIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      {...register('social.linkedin')}
                      error={!!errors.social?.linkedin}
                      helperText={errors.social?.linkedin?.message}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkedInIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GitHub"
                      {...register('social.github')}
                      error={!!errors.social?.github}
                      helperText={errors.social?.github?.message}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GitHubIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              {isEditing && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button 
                      variant="outlined" 
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={!isDirty || isLoading}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </form>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      </Paper>
    </Container>
  );
};

export default Profile;
