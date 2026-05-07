import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,  // Added this line
  TextField,
  useTheme,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText as MuiListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isTeamAdmin = team?.createdBy === currentUser?._id;

  useEffect(() => {
    console.log('Team ID from URL params:', id);
    
    if (!id) {
      console.error('No team ID provided in URL');
      toast.error('No team ID provided');
      setLoading(false);
      navigate('/teams');
      return;
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;
      
      try {
        console.log('Fetching team with ID:', id);
        setLoading(true);
        
        const { data } = await api.get(`/teams/${id}`);
        console.log('Team data received:', data);
        
        if (!data) {
          throw new Error('No team data received');
        }
        
        console.log('Team members:', data.members);
        console.log('First member:', data.members?.[0]);
        
        setTeam(data);
        setIsOwner(data.createdBy?._id === currentUser?._id);
      } catch (error) {
        console.error('Error fetching team:', error);
        console.error('Error details:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to load team details');
        navigate('/teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id, currentUser?._id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!team) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Team not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/teams')}
          sx={{ mt: 2 }}
        >
          Back to Teams
        </Button>
      </Container>
    );
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInviteMember = async () => {
    if (!email) return;
    
    try {
      setIsSubmitting(true);
      await api.post(`/teams/${id}/invite`, { email });
      toast.success('Invitation sent successfully');
      setEmail('');
      setInviteDialogOpen(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await api.delete(`/teams/${id}/members/${memberId}`);
      setTeam({
        ...team,
        members: team.members.filter(member => member._id !== memberId)
      });
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
    
    try {
      await api.delete(`/teams/${id}/members/${currentUser._id}`);
      toast.success('You have left the team');
      navigate('/teams');
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Failed to leave team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/teams/${id}`);
      toast.success('Team deleted successfully');
      navigate('/teams');
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/teams')}
          sx={{ mb: 2 }}
        >
          Back to Teams
        </Button>
        
        {isOwner && (
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/teams/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit Team
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => setInviteDialogOpen(true)}
            >
              Invite Members
            </Button>
          </Box>
        )}
        <Box>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {isOwner ? (
              <MenuItem onClick={() => {
                handleMenuClose();
                handleDeleteTeam();
              }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ color: 'error' }}>
                  Delete Team
                </ListItemText>
              </MenuItem>
            ) : (
              <MenuItem onClick={() => {
                handleMenuClose();
                handleLeaveTeam();
              }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ color: 'error' }}>
                  Leave Team
                </ListItemText>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            height: 120, 
            bgcolor: 'primary.main',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: -40,
              left: 40,
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 3,
            }}
          >
            <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
        </Box>
        
        <Box sx={{ pt: 6, px: 4, pb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h4" component="h1">
                {team.name}
                {team.isPrivate && (
                  <Chip 
                    label="Private" 
                    size="small" 
                    sx={{ ml: 2, bgcolor: 'grey.100' }} 
                  />
                )}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Created by {team.createdBy?.name || 'Unknown'}
              </Typography>
            </Box>
            <Box>
              <Chip 
                icon={<GroupIcon />} 
                label={`${team.members?.length || 0} members`} 
                variant="outlined"
                sx={{ mr: 1 }}
              />
              {team.tags?.map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  sx={{ mr: 0.5, mb: 0.5 }} 
                />
              ))}
            </Box>
          </Box>
          
          {team.description && (
            <Box mt={2}>
              <Typography>{team.description}</Typography>
            </Box>
          )}
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 48,
            },
          }}
        >
          <Tab icon={<GroupIcon />} label="Members" />
          <Tab icon={<EventIcon />} label="Events" />
          <Tab icon={<DescriptionIcon />} label="About" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {team.members?.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member._id || member.user?._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <List dense>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              {member.user?.name?.charAt(0) || 'U'}
                            </Avatar>
                          </ListItemAvatar>
                          <MuiListItemText 
                            primary={member.user?.name || 'Unknown User'} 
                            secondary={
                              <>
                                <Box component="span" display="block">
                                  {member.role === 'admin' ? 'Admin' : 'Member'}
                                </Box>
                                {member.user?.email && (
                                  <Box component="span" display="block" sx={{ mt: 0.5 }}>
                                    <EmailIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                    {member.user.email}
                                  </Box>
                                )}
                              </>
                            }
                          />
                          {isOwner && member.role !== 'admin' && (
                            <ListItemSecondaryAction>
                              <Tooltip title="Remove member">
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleRemoveMember(member.user?._id)}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                        
                        {(member.user?.phone || member.user?.college) && (
                          <Box sx={{ pl: 9, pr: 2, pb: 1 }}>
                            {member.user?.phone && (
                              <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {member.user.phone}
                                </Typography>
                              </Box>
                            )}
                            {member.user?.college && (
                              <Box display="flex" alignItems="center">
                                <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {member.user.college}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box textAlign="center" py={4}>
            <EventIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No events yet
            </Typography>
            <Typography color="textSecondary" paragraph>
              This team doesn't have any events scheduled yet.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<EventIcon />}
              onClick={() => navigate('/events/new')}
            >
              Create Event
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              About This Team
            </Typography>
            <Typography paragraph>
              {team.about || 'No additional information available.'}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  TEAM INFO
                </Typography>
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      {team.members?.length || 0} {team.members?.length === 1 ? 'Member' : 'Members'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      Created on {new Date(team.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  TEAM SETTINGS
                </Typography>
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography>
                      <strong>Visibility:</strong> {team.isPrivate ? 'Private' : 'Public'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography>
                      <strong>Joining:</strong> {team.isPrivate ? 'By invitation only' : 'Open to join'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Invite Member Dialog */}
      <Dialog 
        open={inviteDialogOpen} 
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite to Team</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Send an invitation to join <strong>{team.name}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            InputProps={{
              startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleInviteMember} 
            variant="contained"
            disabled={!email || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeamDetail;
