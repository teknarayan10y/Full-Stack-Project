import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  FormControlLabel,
  Checkbox,
  Divider,
  Card,
  CardContent,
  CardHeader,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const eventSchema = yup.object().shape({
  title: yup.string().required('Event title is required'),
  description: yup.string().required('Event description is required'),
  eventType: yup.string().required('Event type is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  location: yup.string().required('Location is required'),
  capacity: yup
    .number()
    .typeError('Must be a number')
    .positive('Must be a positive number')
    .integer('Must be an integer')
    .required('Capacity is required'),
  isPaid: yup.boolean(),
  price: yup.number().when('isPaid', {
    is: true,
    then: yup
      .number()
      .typeError('Must be a number')
      .positive('Price must be positive')
      .required('Price is required for paid events')
      .test(
        'maxDecimals',
        'Maximum 2 decimal places allowed',
        (value) => (value + '').match(/^\d+(\.\d{1,2})?$/)
      ),
  }),
});

const eventTypes = [
  'Conference',
  'Workshop',
  'Hackathon',
  'Webinar',
  'Networking',
  'Social',
  'Other',
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      isPaid: false,
      price: 0,
    },
  });

  const isPaid = watch('isPaid');

  const handleStartTimeChange = (newValue) => {
    setStartTime(newValue);
    // Update the form value
    setValue('startTime', newValue);
  };

  const handleEndTimeChange = (newValue) => {
    setEndTime(newValue);
    // Update the form value
    setValue('endTime', newValue);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // Combine date and time
      const startDateTime = new Date(data.startDate);
      startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
      
      const endDateTime = new Date(data.endDate);
      endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

      const eventData = {
        ...data,
        startDate: startDateTime,
        endDate: endDateTime,
        price: data.isPaid ? data.price : 0,
      };

      await api.post('/events', eventData);
      toast.success('Event created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Event
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Event Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Event Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.eventType}>
                <InputLabel>Event Type</InputLabel>
                <Select
                  label="Event Type"
                  {...register('eventType')}
                  defaultValue=""
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.eventType?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            {/* Date & Time */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Date & Time
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  {...register('startDate')}
                  onChange={(date) => setValue('startDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  {...register('endDate')}
                  onChange={(date) => setValue('endDate', date)}
                  minDate={watch('startDate')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Location & Capacity */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                {...register('location')}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                {...register('capacity')}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
              />
            </Grid>

            {/* Ticket Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ticket Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('isPaid')}
                    checked={isPaid}
                    onChange={(e) => setValue('isPaid', e.target.checked)}
                  />
                }
                label="This is a paid event"
              />
            </Grid>

            {isPaid && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  disabled={!isPaid}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                    inputProps: { 
                      min: 0,
                      step: 0.01,
                      placeholder: '0.00'
                    }
                  }}
                  {...register('price', {
                    valueAsNumber: true,
                    value: 0
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateEvent;
