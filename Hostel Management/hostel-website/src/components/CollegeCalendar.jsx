import React, { useState } from 'react';
import { 
  Paper, Typography, Grid, Card, CardContent, Chip, Dialog,
  DialogTitle, DialogContent, Tabs, Tab, Box, IconButton, Divider
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CloseIcon from '@mui/icons-material/Close';
import ComputerIcon from '@mui/icons-material/Computer';
import '../styles/CollegeCalendar.css';

const courseDetails = {
  U21CS401: { name: 'Probability and Statistics Theory', faculty: 'Mr Nirmalkumar M (PhD)', credits: 4 },
  U21CS402: { name: 'Theory and Analysis of Algorithms', faculty: 'Mr Naveenkumar M (PhD)', credits: 3 },
  U21CS403: { name: 'Operating Systems', faculty: 'Dr Senthilkumar G (PhD)', credits: 3 },
  U21MA401: { name: 'AI Fundamentals and Machine Learning', faculty: 'Dr Tamilarasi M & Mr Sriram L (TR)', credits: 3 },
  U21CS404: { name: 'Biometric Systems', faculty: 'Ms Nikhita Kumar (MS)', credits: 3 },
  U21CS405: { name: 'Computer Networks', faculty: 'Dr S M Ramesh (PhD)', credits: 3 },
  U21GE401: { name: 'Essential Japanese / Hindi / German for Engineers', faculty: 'Ms Merugu / Mr Arun Kr / Ms Archita', credits: 1 },
  U21CS406: { name: 'Operating Systems Laboratory', faculty: 'Mr Naveenkumar M (PhD)', credits: 1.5 },
  U21MA406: { name: 'AI Fundamentals and Machine Learning Laboratory', faculty: 'Dr Tamilarasi M & Mr Sriram L (TR)', credits: 1.5 }
};

const classSchedule = {
  Monday: [
    { time: '08:45 AM - 09:30 AM', subject: courseDetails.U21CS401.name, faculty: courseDetails.U21CS401.faculty, room: 'C 208' },
    { time: '09:30 AM - 10:45 AM', subject: courseDetails.U21CS402.name, faculty: courseDetails.U21CS402.faculty, room: 'C 208' },
    { time: '11:05 AM - 11:55 AM', subject: courseDetails.U21CS403.name, faculty: courseDetails.U21CS403.faculty, room: 'C 208' },
    { time: '11:55 AM - 12:45 PM', subject: courseDetails.U21CS406.name, faculty: courseDetails.U21CS406.faculty, room: 'LAB' },
    { time: '01:45 PM - 02:35 PM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '02:35 PM - 03:25 PM', subject: courseDetails.U21CS404.name, faculty: courseDetails.U21CS404.faculty, room: 'C 208' },
    { time: '03:25 PM - 04:15 PM', subject: courseDetails.U21CS405.name, faculty: courseDetails.U21CS405.faculty, room: 'C 208' }
  ],
  Tuesday: [
    { time: '08:45 AM - 09:30 AM', subject: courseDetails.U21CS402.name, faculty: courseDetails.U21CS402.faculty, room: 'C 208' },
    { time: '09:30 AM - 10:45 AM', subject: courseDetails.U21CS403.name, faculty: courseDetails.U21CS403.faculty, room: 'C 208' },
    { time: '11:05 AM - 11:55 AM', subject: courseDetails.U21CS404.name, faculty: courseDetails.U21CS404.faculty, room: 'C 208' },
    { time: '11:55 AM - 12:45 PM', subject: courseDetails.U21MA406.name, faculty: courseDetails.U21MA406.faculty, room: 'LAB' },
    { time: '01:45 PM - 02:35 PM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '02:35 PM - 03:25 PM', subject: courseDetails.U21CS405.name, faculty: courseDetails.U21CS405.faculty, room: 'C 208' },
    { time: '03:25 PM - 04:15 PM', subject: courseDetails.U21GE401.name, faculty: courseDetails.U21GE401.faculty, room: 'C 208' }
  ],
  Wednesday: [
    { time: '08:45 AM - 09:30 AM', subject: courseDetails.U21CS401.name, faculty: courseDetails.U21CS401.faculty, room: 'C 208' },
    { time: '09:30 AM - 10:45 AM', subject: courseDetails.U21CS402.name, faculty: courseDetails.U21CS402.faculty, room: 'C 208' },
    { time: '11:05 AM - 11:55 AM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '11:55 AM - 12:45 PM', subject: courseDetails.U21CS406.name, faculty: courseDetails.U21CS406.faculty, room: 'LAB' },
    { time: '01:45 PM - 02:35 PM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '02:35 PM - 03:25 PM', subject: courseDetails.U21GE401.name, faculty: courseDetails.U21GE401.faculty, room: 'C 208' },
    { time: '03:25 PM - 04:15 PM', subject: 'Open Elective', faculty: '', room: 'C 208' }
  ],
  Thursday: [
    { time: '08:45 AM - 09:30 AM', subject: courseDetails.U21CS402.name, faculty: courseDetails.U21CS402.faculty, room: 'C 208' },
    { time: '09:30 AM - 10:45 AM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '11:05 AM - 11:55 AM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '11:55 AM - 12:45 PM', subject: courseDetails.U21MA406.name, faculty: courseDetails.U21MA406.faculty, room: 'LAB' },
    { time: '01:45 PM - 02:35 PM', subject: courseDetails.U21CS405.name, faculty: courseDetails.U21CS405.faculty, room: 'C 208' },
    { time: '02:35 PM - 03:25 PM', subject: courseDetails.U21CS406.name, faculty: courseDetails.U21CS406.faculty, room: 'C 208' },
    { time: '03:25 PM - 04:15 PM', subject: 'Technical / Soft Skills', faculty: '', room: 'C 208' }
  ],
  Friday: [
    { time: '08:45 AM - 09:30 AM', subject: courseDetails.U21CS404.name, faculty: courseDetails.U21CS404.faculty, room: 'C 208' },
    { time: '09:30 AM - 10:45 AM', subject: courseDetails.U21CS401.name, faculty: courseDetails.U21CS401.faculty, room: 'C 208' },
    { time: '11:05 AM - 11:55 AM', subject: 'Open Elective', faculty: '', room: 'C 208' },
    { time: '11:55 AM - 12:45 PM', subject: courseDetails.U21MA406.name, faculty: courseDetails.U21MA406.faculty, room: 'LAB' },
    { time: '01:45 PM - 02:35 PM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '02:35 PM - 03:25 PM', subject: courseDetails.U21GE401.name, faculty: courseDetails.U21GE401.faculty, room: 'C 208' },
    { time: '03:25 PM - 04:15 PM', subject: courseDetails.U21MA406.name, faculty: courseDetails.U21MA406.faculty, room: 'C 208' }
  ],
  Saturday: [
    { time: '08:45 AM - 09:30 AM', subject: courseDetails.U21MA401.name, faculty: courseDetails.U21MA401.faculty, room: 'C 208' },
    { time: '09:30 AM - 10:45 AM', subject: 'Activity Day', faculty: '', room: 'C 208' },
    { time: '11:05 AM - 11:55 AM', subject: 'Activity Day', faculty: '', room: 'C 208' },
    { time: '11:55 AM - 12:45 PM', subject: 'Activity Day', faculty: '', room: 'C 208' },
    { time: '01:45 PM - 02:35 PM', subject: 'Activity Day', faculty: '', room: 'C 208' },
    { time: '02:35 PM - 03:25 PM', subject: 'Activity Day', faculty: '', room: 'C 208' },
    { time: '03:25 PM - 04:15 PM', subject: 'Activity Day', faculty: '', room: 'C 208' }
  ]
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`time-slot-tabpanel-${index}`}
      aria-labelledby={`time-slot-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ClassDetails({ classItem }) {
  const isLab = classItem.room === 'LAB' || classItem.subject.toLowerCase().includes('lab');

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      backgroundColor: isLab ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
      padding: 2,
      borderRadius: 1,
      border: isLab ? '1px solid rgba(25, 118, 210, 0.2)' : 'none'
    }}>
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {isLab && <ComputerIcon sx={{ color: 'primary.main' }} />}
        {classItem.subject}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon sx={{ color: 'orange' }} />
        <Typography variant="body2" color="textSecondary">
          {classItem.time}
        </Typography>
      </Box>
      {classItem.faculty && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon sx={{ color: 'green' }} />
          <Typography variant="body2" color="textSecondary">
            {classItem.faculty}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MeetingRoomIcon sx={{ color: isLab ? 'primary.main' : 'blue' }} />
        <Typography variant="body2" color="textSecondary">
          {classItem.room}
        </Typography>
      </Box>
    </Box>
  );
}

function CollegeCalendar() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [timeSlotValue, setTimeSlotValue] = useState(0);

  const handleDayClick = (day, classes) => {
    setSelectedDay({ day, classes });
    setTabValue(0);
  };

  const handleClose = () => {
    setSelectedDay(null);
  };

  const handleTabChange = (event, newValue) => {
    setTimeSlotValue(newValue);
  };

  const getTimeSlot = (index) => {
    switch(index) {
      case 0: return 'Morning Classes (8:45 AM - 10:45 AM)';
      case 1: return 'Mid-Morning Classes (11:05 AM - 12:45 PM)';
      case 2: return 'Afternoon Classes (1:45 PM - 4:15 PM)';
      default: return '';
    }
  };

  return (
    <>
      <Paper elevation={3} className="calendar-container">
        <Typography variant="h5" component="h2" gutterBottom>
          Class Schedule
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(classSchedule).map(([day, classes]) => (
            <Grid item xs={12} sm={6} md={4} key={day}>
              <Card 
                className="schedule-card" 
                onClick={() => handleDayClick(day, classes)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {day}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {classes.length} Classes
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog
        open={Boolean(selectedDay)}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedDay && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedDay.day}'s Classes</Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                  '&:hover': {
                    color: (theme) => theme.palette.primary.main,
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Tabs
                value={timeSlotValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="time slots"
              >
                <Tab
                  label="Morning (8:45 - 10:45)"
                  icon={<AccessTimeIcon />}
                  sx={{ '&.Mui-selected': { color: '#ff9800' } }}
                  id={`time-slot-tab-0`}
                  aria-controls={`time-slot-tabpanel-0`}
                />
                <Tab
                  label="Mid-Morning (11:05 - 12:45)"
                  icon={<AccessTimeIcon />}
                  sx={{ '&.Mui-selected': { color: '#4caf50' } }}
                  id={`time-slot-tab-1`}
                  aria-controls={`time-slot-tabpanel-1`}
                />
                <Tab
                  label="Afternoon (1:45 - 4:15)"
                  icon={<AccessTimeIcon />}
                  sx={{ '&.Mui-selected': { color: '#2196f3' } }}
                  id={`time-slot-tab-2`}
                  aria-controls={`time-slot-tabpanel-2`}
                />
              </Tabs>

              {[0, 1, 2].map((timeSlot) => (
                <TabPanel key={timeSlot} value={timeSlotValue} index={timeSlot}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {getTimeSlot(timeSlot)}
                  </Typography>
                  {selectedDay.classes
                    .filter(classItem => {
                      const startTime = classItem.time.split(' - ')[0];
                      
                      switch(timeSlot) {
                        case 0: // Morning (8:45 - 10:45)
                          return startTime.startsWith('08:') || startTime.startsWith('09:') || startTime.startsWith('10:');
                        case 1: // Mid-Morning (11:05 - 12:45)
                          return startTime.startsWith('11:') || startTime === '12:45 PM';
                        case 2: // Afternoon (1:45 - 4:15)
                          return startTime.includes('PM') && !startTime.startsWith('12:');
                        default:
                          return false;
                      }
                    })
                    .sort((a, b) => {
                      const getMinutes = (time) => {
                        const [startTime] = time.split(' - ');
                        const [hours, minutes] = startTime.split(':');
                        const hour = parseInt(hours);
                        const minute = parseInt(minutes);
                        return hour * 60 + minute;
                      };
                      return getMinutes(a.time) - getMinutes(b.time);
                    })
                    .map((classItem, index, array) => (
                      <Box key={index}>
                        <ClassDetails classItem={classItem} />
                        {index < array.length - 1 && array[index + 1].time.startsWith('11:55') && (
                          <Divider sx={{ my: 2, borderColor: 'primary.light' }} />
                        )}
                      </Box>
                    ))}
                </TabPanel>
              ))}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}

export default CollegeCalendar;
