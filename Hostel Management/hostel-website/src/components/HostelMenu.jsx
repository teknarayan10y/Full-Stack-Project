import React, { useState } from 'react';
import {
  Paper, Typography, Grid, Card, CardContent, Dialog,
  DialogTitle, DialogContent, Tabs, Tab, Box, IconButton
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import '../styles/HostelMenu.css';

const tamilMenu = {
  Monday: {
    breakfast: 'Idli, Sambar, Coconut Chutney, Filter Coffee',
    lunch: 'Rice, Sambar, Rasam, Poriyal, Kootu, Curd Rice',
    dinner: 'Dosa, Sambar, Chutney, Vegetable Kurma'
  },
  Tuesday: {
    breakfast: 'Pongal, Vadai, Coconut Chutney, Tea',
    lunch: 'Rice, Vathal Kuzhambu, Aviyal, Paruppu, Appalam',
    dinner: 'Chapati, Vegetable Curry, Curd Rice, Pickle'
  },
  Wednesday: {
    breakfast: 'Uthappam, Sambar, Tomato Chutney, Coffee',
    lunch: 'Rice, Mandi Kuzhambu, Poriyal, Paruppu, Mor Kuzhambu',
    dinner: 'Idiyappam, Vegetable Stew, Sweet Pongal'
  },
  Thursday: {
    breakfast: 'Upma, Vadai, Coconut Chutney, Tea',
    lunch: 'Rice, Fish Curry, Sambar, Poriyal, Rasam',
    dinner: 'Parotta, Chicken Curry, Onion Raita'
  },
  Friday: {
    breakfast: 'Poori, Potato Masala, Coffee',
    lunch: 'Rice, Sambar, Rasam, Egg Curry, Poriyal',
    dinner: 'Variety Rice, Curd Rice, Appalam'
  },
  Saturday: {
    breakfast: 'Dosa, Sambar, Mint Chutney, Tea',
    lunch: 'Rice, Mutton Curry, Sambar, Poriyal, Rasam',
    dinner: 'Idli, Chicken Curry, Coconut Chutney'
  },
  Sunday: {
    breakfast: 'Venpongal, Sambar, Coconut Chutney, Coffee',
    lunch: 'Biryani, Raita, Salna, Brinjal Curry',
    dinner: 'Rava Dosa, Sambar, Kurma, Kesari'
  }
};

const internationalMenu = {
  Monday: {
    breakfast: 'Pancakes, Maple Syrup, Scrambled Eggs, Coffee',
    lunch: 'Grilled Chicken Sandwich, French Fries, Coleslaw',
    dinner: 'Spaghetti Bolognese, Garlic Bread, Green Salad'
  },
  Tuesday: {
    breakfast: 'Croissants, Butter, Jam, Fresh Fruits, Tea',
    lunch: 'Fish & Chips, Tartar Sauce, Mushy Peas',
    dinner: 'Stir-fried Noodles, Spring Rolls, Sweet Chili Sauce'
  },
  Wednesday: {
    breakfast: 'Waffles, Whipped Cream, Bacon, Orange Juice',
    lunch: 'Mexican Rice Bowl, Grilled Vegetables, Guacamole',
    dinner: 'Thai Green Curry, Jasmine Rice, Stir-fried Vegetables'
  },
  Thursday: {
    breakfast: 'Cereal Selection, Milk, Fresh Fruits, Coffee',
    lunch: 'Mediterranean Platter, Hummus, Pita Bread',
    dinner: 'Pizza, Caesar Salad, Garlic Knots'
  },
  Friday: {
    breakfast: 'English Breakfast, Baked Beans, Toast, Tea',
    lunch: 'Teriyaki Chicken, Sticky Rice, Asian Slaw',
    dinner: 'Beef Burger, Potato Wedges, Coleslaw'
  },
  Saturday: {
    breakfast: 'French Toast, Berry Compote, Coffee',
    lunch: 'Korean BBQ Bowl, Kimchi, Steamed Rice',
    dinner: 'Grilled Salmon, Mashed Potatoes, Roasted Vegetables'
  },
  Sunday: {
    breakfast: 'Bagels, Cream Cheese, Smoked Salmon, Coffee',
    lunch: 'Sunday Roast, Yorkshire Pudding, Gravy',
    dinner: 'Pasta Alfredo, Garlic Bread, Tiramisu'
  }
};

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} className="tab-panel">
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function HostelMenu() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [menuType, setMenuType] = useState('tamil'); // 'tamil' or 'international'
  const [feedback, setFeedback] = useState({});

  const handleDayClick = (day, meals) => {
    setSelectedDay({ day, meals });
    setTabValue(0);
  };

  const handleClose = () => {
    setSelectedDay(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFeedback = (mealType, isLike) => {
    fetch('http://localhost:5000/api/send-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: selectedDay.day,
        meal: mealType, // ✅ change this line
        like: isLike ? 1 : 0,
        dislike: !isLike ? 1 : 0
      })
    });
  
    const dayKey = selectedDay.day;
    const key = `${dayKey}-${mealType}`;
  
    // Ensure that both like and dislike cannot be selected simultaneously
    if (isLike) {
      setFeedback((prev) => ({
        ...prev,
        [key]: { like: (prev[key]?.like ? 0 : 1), dislike: 0 },
      }));
    } else {
      setFeedback((prev) => ({
        ...prev,
        [key]: { like: 0, dislike: (prev[key]?.dislike ? 0 : 1) },
      }));
    }
  };
  

  return (
    <>
       <Paper
  elevation={3}
  className="menu-container"
  sx={{
    backgroundImage: 'url(/images/collegebg.jpg)', // Use the correct path here
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%', 
    minHeight: '100vh',
     // To cover the full height
  }}
> 

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Weekly Hostel Menu
          </Typography>
          <Box>
            <Tabs value={menuType} onChange={(e, newValue) => setMenuType(newValue)}>
              <Tab value="tamil" label="Tamil Menu" sx={{ '&.Mui-selected': { color: '#4caf50' } }} />
              <Tab value="international" label="International Menu" sx={{ '&.Mui-selected': { color: '#2196f3' } }} />
            </Tabs>
          </Box>
        </Box>
        <Grid container spacing={3}>
          {Object.entries(menuType === 'tamil' ? tamilMenu : internationalMenu).map(([day, meals]) => (
            <Grid item xs={12} sm={6} md={4} key={day}>
              <Card
                className="day-card"
                onClick={() => handleDayClick(day, meals)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {day}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Click to view detailed menu
                  </Typography>
                  <RestaurantIcon sx={{ mt: 2, color: 'primary.main' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={Boolean(selectedDay)} onClose={handleClose} maxWidth="sm" fullWidth>
        {selectedDay && (
          <>
            <DialogTitle
              sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h6">{selectedDay.day}'s Menu</Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                  '&:hover': { color: (theme) => theme.palette.primary.main },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab icon={<FreeBreakfastIcon />} label="Breakfast" sx={{ '&.Mui-selected': { color: '#ff9800' } }} />
                <Tab icon={<LunchDiningIcon />} label="Lunch" sx={{ '&.Mui-selected': { color: '#4caf50' } }} />
                <Tab icon={<DinnerDiningIcon />} label="Dinner" sx={{ '&.Mui-selected': { color: '#2196f3' } }} />
              </Tabs>

              {/* Breakfast */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" color="#ff9800" gutterBottom>
                  Breakfast
                </Typography>
                <Typography>{selectedDay.meals.breakfast}</Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color="success"
                    onClick={() => handleFeedback('breakfast', true)}
                    disabled={feedback[`${selectedDay.day}-breakfast`]?.like === 1}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {feedback[`${selectedDay.day}-breakfast`]?.like || 0}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() => handleFeedback('breakfast', false)}
                    disabled={feedback[`${selectedDay.day}-breakfast`]?.dislike === 1}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {feedback[`${selectedDay.day}-breakfast`]?.dislike || 0}
                  </Typography>
                </Box>
              </TabPanel>

              {/* Lunch */}
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" color="#4caf50" gutterBottom>
                  Lunch
                </Typography>
                <Typography>{selectedDay.meals.lunch}</Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color="success"
                    onClick={() => handleFeedback('lunch', true)}
                    disabled={feedback[`${selectedDay.day}-lunch`]?.like === 1}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {feedback[`${selectedDay.day}-lunch`]?.like || 0}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() => handleFeedback('lunch', false)}
                    disabled={feedback[`${selectedDay.day}-lunch`]?.dislike === 1}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {feedback[`${selectedDay.day}-lunch`]?.dislike || 0}
                  </Typography>
                </Box>
              </TabPanel>

              {/* Dinner */}
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" color="#2196f3" gutterBottom>
                  Dinner
                </Typography>
                <Typography>{selectedDay.meals.dinner}</Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color="success"
                    onClick={() => handleFeedback('dinner', true)}
                    disabled={feedback[`${selectedDay.day}-dinner`]?.like === 1}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {feedback[`${selectedDay.day}-dinner`]?.like || 0}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() => handleFeedback('dinner', false)}
                    disabled={feedback[`${selectedDay.day}-dinner`]?.dislike === 1}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {feedback[`${selectedDay.day}-dinner`]?.dislike || 0}
                  </Typography>
                </Box>
              </TabPanel>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}

export default HostelMenu;
