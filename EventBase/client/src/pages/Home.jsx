// src/pages/Home.jsx
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Stack,
  alpha
} from '@mui/material';
import {
  Event as EventIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <EventIcon color="primary" sx={{ fontSize: 50 }} />,
    title: 'Easy Event Creation',
    description: 'Create and customize events in minutes with our intuitive interface.'
  },
  {
    icon: <GroupIcon color="primary" sx={{ fontSize: 50 }} />,
    title: 'Guest Management',
    description: 'Manage your guest list and send invitations with just a few clicks.'
  },
  {
    icon: <NotificationsIcon color="primary" sx={{ fontSize: 50 }} />,
    title: 'Real-time Updates',
    description: 'Stay informed with instant notifications about your events.'
  },
  {
    icon: <CalendarIcon color="primary" sx={{ fontSize: 50 }} />,
    title: 'Calendar Integration',
    description: 'Sync with your favorite calendar apps for better planning.'
  }
];

const stats = [
  { value: '1+', label: 'Events Created' },
  { value: '5+', label: 'Happy Users' },
  { value: '10+', label: 'Invites Sent' },
  { value: '24/7', label: 'Support' }
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          pt: { xs: 12, md: 16 },
          pb: { xs: 10, md: 18 },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  component="h1"
                  variant={isMobile ? 'h3' : 'h2'}
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                    color: 'text.primary',
                  }}
                >
                  Plan and manage your
                  <Typography
                    component="span"
                    color="primary"
                    variant={isMobile ? 'h3' : 'h2'}
                    sx={{
                      display: 'block',
                      fontWeight: 700,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    events with ease
                  </Typography>
                </Typography>
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    maxWidth: '90%',
                    mx: 'auto',
                    [theme.breakpoints.up('md')]: {
                      mx: 0,
                      mb: 5,
                    },
                  }}
                >
                  EventEase helps you organize, manage, and track all your events in one place. 
                  Create, invite, and manage attendees with just a few clicks.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
                      },
                    }}
                  >
                    Get Started for Free
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://img.freepik.com/free-vector/event-management-background-with-flat-design_23-2147959001.jpg"
                  alt="Event Management"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 600,
                    display: 'block',
                    mx: 'auto',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Everything You Need for Perfect Events
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            mb: 8,
          }}
        >
          Powerful features to make your event planning seamless and stress-free
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                      borderColor: 'transparent',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="span"
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          />
          <Box
            component="span"
            sx={{
              position: 'absolute',
              bottom: -80,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            }}
          />
          <Box position="relative" zIndex={1}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Ready to create amazing events?
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
              }}
            >
              Join thousands of event organizers who trust EventEase for their event management needs.
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
                },
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;