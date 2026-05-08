const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function resetRoomAvailability(hotelId, roomId) {
  try {
    // Find the hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      console.error('Hotel not found');
      return;
    }
    
    // Find the room
    const room = hotel.rooms.id(roomId);
    if (!room) {
      console.error('Room not found');
      return;
    }
    
    // Reset room availability
    console.log('Current room availability:', room.available);
    room.available = true;
    await hotel.save();
    console.log('Room availability reset successfully');
    
    // Verify the change
    const updatedHotel = await Hotel.findById(hotelId);
    const updatedRoom = updatedHotel.rooms.id(roomId);
    console.log('Updated room availability:', updatedRoom.available);
  } catch (err) {
    console.error('Reset room availability error:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// The hotel and room IDs from your error message
const hotelId = '67da0dd72f5c699504c0d606';
const roomId = '67da0dd72f5c699504c0d608';

resetRoomAvailability(hotelId, roomId);
