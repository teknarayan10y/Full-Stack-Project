const Hotel = require('../models/Hotel');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

/**
 * Add virtual tour to a room
 * @route POST /api/virtual-tours/:hotelId/:roomId
 * @access Private/Admin
 */
exports.addVirtualTour = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { hotelId, roomId } = req.params;
    const { videoUrl, threeDModelUrl } = req.body;
    
    // Find hotel and room
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    const room = hotel.rooms.id(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Initialize virtual tour if it doesn't exist
    if (!room.virtualTour) {
      room.virtualTour = {
        enabled: false,
        panoramaImages: [],
        videoUrl: '',
        threeDModelUrl: ''
      };
    }
    
    // Process uploaded panorama images
    if (req.files && req.files.length > 0) {
      const panoramaImages = [];
      
      // Save path to each uploaded image
      req.files.forEach(file => {
        panoramaImages.push(`/uploads/virtual-tours/${file.filename}`);
      });
      
      room.virtualTour.panoramaImages = panoramaImages;
    }
    
    // Update virtual tour data
    room.virtualTour.videoUrl = videoUrl || room.virtualTour.videoUrl;
    room.virtualTour.threeDModelUrl = threeDModelUrl || room.virtualTour.threeDModelUrl;
    room.virtualTour.enabled = true;
    
    await hotel.save();
    
    res.json({
      success: true,
      data: room.virtualTour
    });
  } catch (err) {
    console.error('Error adding virtual tour:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get virtual tour for a room
 * @route GET /api/virtual-tours/:hotelId/:roomId
 * @access Public
 */
exports.getVirtualTour = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    
    // Find hotel and room
    const hotel = await Hotel.findById(hotelId)
      .select('name rooms.$');
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    const room = hotel.rooms.id(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if virtual tour exists
    if (!room.virtualTour || !room.virtualTour.enabled) {
      return res.status(404).json({ message: 'Virtual tour not available for this room' });
    }
    
    res.json({
      success: true,
      data: {
        hotelName: hotel.name,
        roomType: room.type,
        virtualTour: room.virtualTour
      }
    });
  } catch (err) {
    console.error('Error getting virtual tour:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete virtual tour for a room
 * @route DELETE /api/virtual-tours/:hotelId/:roomId
 * @access Private/Admin
 */
exports.deleteVirtualTour = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    
    // Find hotel and room
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    const room = hotel.rooms.id(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if virtual tour exists
    if (!room.virtualTour) {
      return res.status(404).json({ message: 'Virtual tour not found' });
    }
    
    // Delete panorama images from filesystem
    if (room.virtualTour.panoramaImages && room.virtualTour.panoramaImages.length > 0) {
      room.virtualTour.panoramaImages.forEach(imagePath => {
        try {
          const fullPath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }
    
    // Reset virtual tour
    room.virtualTour = {
      enabled: false,
      panoramaImages: [],
      videoUrl: '',
      threeDModelUrl: ''
    };
    
    await hotel.save();
    
    res.json({
      success: true,
      message: 'Virtual tour deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting virtual tour:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
