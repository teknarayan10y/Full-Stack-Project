import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Divider, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Paper
} from '@mui/material';
import { 
  Event as EventIcon, 
  Group as GroupIcon, 
  Person as PersonIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

// Mock data - replace with actual API calls
const mockEvents = [
  { id: 1, title: 'Team Meeting', date: new Date(2023, 5, 15, 10, 0), type: 'meeting' },
  { id: 2, title: 'Project Deadline', date: new Date(2023, 5, 20, 18, 0), type: 'deadline' },
  { id: 3, title: 'Client Call', date: new Date(2023, 5, 22, 14, 30), type: 'call' },
];

const mockTeamMembers = [
  { id: 1, name: 'John Doe', role: 'Frontend Developer', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', role: 'Backend Developer', avatar: 'JS' },
  { id: 3, name: 'Alex Johnson', role: 'UI/UX Designer', avatar: 'AJ' },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    teamMembers: 0,
    activeProjects: 0,
    tasksCompleted: 0,
  });
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          upcomingEvents: 3,
          teamMembers: 12,
          activeProjects: 5,
          tasksCompleted: 24,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your projects today.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleLogout}
          startIcon={<PersonIcon />}
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            borderRadius: 3,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>UPCOMING EVENTS</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.upcomingEvents}</Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            borderRadius: 3,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>TEAM MEMBERS</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.teamMembers}</Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
            color: 'white',
            borderRadius: 3,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>ACTIVE PROJECTS</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.activeProjects}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
            color: 'white',
            borderRadius: 3,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>TASKS COMPLETED</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.tasksCompleted}</Typography>
                </Box>
                <NotificationsIcon sx={{ fontSize: 40, opacity: 0.2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Upcoming Events</Typography>
                <Button 
                  size="small" 
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/events')}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {mockEvents.map((event, index) => (
                  <Box key={event.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                          cursor: 'pointer',
                          borderRadius: 2,
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={format(event.date, 'MMMM d, yyyy h:mm a')}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Chip 
                        label={event.type} 
                        size="small" 
                        color={event.type === 'meeting' ? 'primary' : event.type === 'deadline' ? 'error' : 'success'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </ListItem>
                    {index < mockEvents.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))}
              </List>
              <Box mt={2} textAlign="center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/events/create')}
                  fullWidth
                >
                  Add New Event
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Members */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Team Members</Typography>
                <Button 
                  size="small" 
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/team')}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {mockTeamMembers.map((member, index) => (
                  <Box key={member.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                          cursor: 'pointer',
                          borderRadius: 2,
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {member.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.name}
                        secondary={member.role}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Chip 
                        label="Active" 
                        size="small" 
                        color="success"
                        variant="outlined"
                      />
                    </ListItem>
                    {index < mockTeamMembers.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))}
              </List>
              <Box mt={2} textAlign="center">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<PersonIcon />}
                  onClick={() => navigate('/team/invite')}
                  fullWidth
                >
                  Invite Team Member
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
                <Button 
                  size="small" 
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All Activity
                </Button>
              </Box>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <NotificationsIcon color="action" sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" color="text.secondary">
                  Your recent activities will appear here.
                </Typography>
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/activity')}
                >
                  View all activities
                </Button>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
