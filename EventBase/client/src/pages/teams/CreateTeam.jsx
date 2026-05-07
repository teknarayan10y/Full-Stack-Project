import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const teamSchema = yup.object().shape({
  name: yup.string().required('Team name is required').min(3, 'Team name must be at least 3 characters'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters'),
  tags: yup.array().of(yup.string().max(20, 'Tag cannot exceed 20 characters')),
  isPrivate: yup.boolean().default(false),
  members: yup.array().of(
    yup.object().shape({
      email: yup.string().email('Invalid email').required('Email is required'),
      name: yup.string().required('Name is required'),
      phone: yup.string(),
      college: yup.string(),
    })
  ),
});

const CreateTeam = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    college: ''
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: [],
      isPrivate: false,
      members: [],
    },
  });

  const tags = watch('tags', []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setValue('tags', newTags);
  };

  const handleAddMember = () => {
    setValue('members', [...(watch('members') || []), newMember]);
    setNewMember({ name: '', email: '', phone: '', college: '' });
    setIsMemberDialogOpen(false);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = [...(watch('members') || [])];
    updatedMembers.splice(index, 1);
    setValue('members', updatedMembers);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await api.post('/teams', data);
      toast.success('Team created successfully!');
      navigate('/teams');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error.response?.data?.message || 'Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Teams
      </Button>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Team
        </Typography>
        <Typography color="textSecondary" paragraph>
          Set up your team and invite members to collaborate.
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
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Tell us about your team..."
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
                Add tags to help others find your team
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  {...register('isPrivate')}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="isPrivate">Make this team private</label>
              </Box>
              <Typography variant="caption" color="textSecondary" display="block">
                Private teams are only visible to team members
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Team Members
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setIsMemberDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Add Team Member
                </Button>

                {watch('members')?.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <List dense>
                      {watch('members').map((member, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={member.name}
                            secondary={
                              <>
                                <Box component="span" display="block">
                                  <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                  {member.email}
                                </Box>
                                {member.phone && (
                                  <Box component="span" display="block">
                                    <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    {member.phone}
                                  </Box>
                                )}
                                {member.college && (
                                  <Box component="span" display="block">
                                    <SchoolIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    {member.college}
                                  </Box>
                                )}
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleRemoveMember(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/teams')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Creating...' : 'Create Team'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Dialog open={isMemberDialogOpen} onClose={() => setIsMemberDialogOpen(false)}>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone (Optional)"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="College/Institution (Optional)"
                value={newMember.college}
                onChange={(e) => setNewMember({ ...newMember, college: e.target.value })}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMemberDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddMember} 
            variant="contained" 
            disabled={!newMember.name || !newMember.email}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateTeam;
