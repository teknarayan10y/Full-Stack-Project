import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
  CircularProgress,
  Fade,
  Alert,
  Stack
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import api from '../services/api';

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  role: yup.string().required('Please select a role'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Must contain at least 8 characters, one uppercase, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const roles = [
  { value: 'student', label: 'student', icon: <SchoolIcon /> },
  { value: 'teacher', label: 'teacher', icon: <WorkIcon /> },
  { value: 'coordinator', label: 'event coordinator', icon: <EventIcon /> },
  { value: 'organizer', label: 'organizer', icon: <GroupIcon /> },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const { mutate: registerUser, isLoading } = useMutation({
    mutationFn: (data) => {
      // Only send required fields to the server
      const { confirmPassword, ...userData } = data;
      return api.post('/auth/register', userData).then(res => res.data);
    },
    onSuccess: (data) => {
      // Show success message
      setSuccess('Registration successful! Please check your email to verify your account.');
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', error);
    }
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      await registerUser(data);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        py: 4, // Add vertical padding
        minHeight: 'calc(100vh - 64px)', // Adjust for header height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" mb={4}>
            <Typography 
              component="h1" 
              variant="h4" 
              fontWeight="bold" 
              color="primary"
              gutterBottom
            >
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our community and start your journey
            </Typography>
          </Box>

          <Paper 
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              width: '100%',
            }}
          >
            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                  {error}
                </Alert>
              </Fade>
            )}
            {success && (
              <Fade in={!!success}>
                <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
                  {success}
                </Alert>
              </Fade>
            )}

            <Box 
              component="form" 
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  {...register('name')}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  {...register('email')}
                />

                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.role}
                  variant="outlined"
                >
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    label="Role"
                    {...register('role')}
                    disabled={isLoading}
                    startAdornment={
                      <InputAdornment position="start">
                        <WorkIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {role.icon}
                          {role.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role && (
                    <FormHelperText>{errors.role.message}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <LockIcon color="action" sx={{ mr: 1 }} />
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register('password')}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <LockIcon color="action" sx={{ mr: 1 }} />
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          size="large"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register('confirmPassword')}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    mt: 2,
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <Box textAlign="center" mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/login" 
                      color="primary"
                      fontWeight={600}
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Register;