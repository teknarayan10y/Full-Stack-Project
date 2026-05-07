import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Chip,
  Divider,
  IconButton,
  useTheme,
  CircularProgress,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const teamSchema = yup.object().shape({
  name: yup.string().required('Team name is required').min(3, 'Team name must be at least 3 characters'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters'),
  about: yup.string().max(2000, 'About section cannot exceed 2000 characters'),
  tags: yup.array().of(yup.string().max(20, 'Tag cannot exceed 20 characters')),
  isPrivate: yup.boolean().default(false),
});

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [error, setError] = useState('');

  console.log('Team ID from URL params:', id); // Debug log

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      about: '',
      tags: [],
      isPrivate: false,
    },
  });

  const tags = watch('tags', []);
  const isPrivate = watch('isPrivate', false);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) {
        console.error('No team ID provided');
        setError('No team ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching team with ID:', id);
        const response = await api.get(`/teams/${id}`);
        console.log('API Response:', response); // Debug log
        
        if (response.data && response.data.success) {
          reset({
            name: response.data.data.name,
            description: response.data.data.description || '',
            about: response.data.data.about || '',
            tags: response.data.data.tags || [],
            isPrivate: response.data.data.isPrivate || false,
          });
        } else {
          setError('Failed to load team data');
        }
      } catch (error) {
        console.error('Error fetching team:', error);
        console.error('Error response:', error.response); // Debug log
        setError(error.response?.data?.message || 'Failed to load team details');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id, reset]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setValue('tags', newTags, { shouldDirty: true });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setValue('tags', newTags, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await api.put(`/teams/${id}`, data);
      toast.success('Team updated successfully');
      navigate(`/teams/${id}`);
    } catch (error) {
      console.error('Error updating team:', error);
      setError(error.response?.data?.message || 'Failed to update team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await api.delete(`/teams/${id}`);
      toast.success('Team deleted successfully');
      navigate('/teams');
    } catch (error) {
      console.error('Error deleting team:', error);
      setError(error.response?.data?.message || 'Failed to delete team');
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/teams')} variant="contained">
          Back to Teams
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/teams/${id}`)}
        >
          Back to Team
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteConfirmOpen(true)}
        >
          Delete Team
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Team
        </Typography>
        <Typography color="textSecondary" paragraph>
          Update your team details and settings
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Name"
                variant="outlined"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                variant="outlined"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message || 'A brief description of your team'}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="What's your team about?"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About"
                variant="outlined"
                multiline
                rows={6}
                {...register('about')}
                error={!!errors.about}
                helperText={
                  errors.about?.message ||
                  'Tell potential members more about your team, goals, and what you\'re looking for in members.'
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box display="flex" alignItems="center" flexWrap="wrap" mb={1}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ m: 0.5 }}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
              <Box display="flex" alignItems="center">
                <TextField
                  size="small"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Add tags to help others find your team (e.g., "Web Development", "AI", "Startup")
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPrivate}
                    onChange={(e) =>
                      setValue('isPrivate', e.target.checked, { shouldDirty: true })
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography>Make this team private</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {isPrivate
                        ? 'Only invited members can view and join this team.'
                        : 'Anyone can view and request to join this team.'}
                    </Typography>
                  </Box>
                }
                labelPlacement="end"
                sx={{ alignItems: 'flex-start', m: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/teams/${id}`)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isDirty || isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
                    }
                    sx={{ ml: 1 }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to delete this team? This action cannot be undone.
          </Typography>
          <Typography color="error">
            All team data, including events and member information, will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteTeam}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete Team
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditTeam;
