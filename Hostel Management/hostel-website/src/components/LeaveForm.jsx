import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../styles/leave.css';

function LeaveForm() {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    classYear: '',
    roomNumber: '',
    contact: '',
    reason: '',
    startDate: null,
    endDate: null,
    approvalBy: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:5000/api/submit-leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Leave request submitted successfully:', data);
      })
      .catch((error) => {
        console.error('Error submitting leave request:', error);
      });
  };
  
  
  return (
    <div className="leave-form-container">
      <Typography variant="h4" className="leave-form-title" gutterBottom>
        Leave Request Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Class / Year"
              name="classYear"
              value={formData.classYear}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Room Number / Hostel Block"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Approval Authority (Warden / Chief Mentor)"
              name="approvalBy"
              value={formData.approvalBy}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Leave"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(value) => handleDateChange('startDate', value)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(value) => handleDateChange('endDate', value)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Submit Leave Request
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default LeaveForm;
