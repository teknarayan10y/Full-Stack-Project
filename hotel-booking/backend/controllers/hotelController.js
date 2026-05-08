const { validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

/**
 * Create a new hotel
 * @route POST /api/hotels
 */
exports.createHotel = async (req, res) => {
  try {
    // Check for validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded files if validation fails
      if (req.files && req.files.images) {
        req.files.images.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse the validated data
    const formData = JSON.parse(req.body.data);
    const {
      name,
      description,
      location,
      rooms,
      amenities
    } = formData;

    // Add instructor ID to the hotel data
    const instructorId = req.user.id;

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.images) {
      const files = req.files.images;
      console.log('Processing files:', files.map(f => ({ name: f.originalname, path: f.path })));
      
      for (const file of files) {
        try {
          if (!file.path || !fs.existsSync(file.path)) {
            console.error('File path does not exist:', file.path);
            continue;
          }

          console.log('Uploading file to Cloudinary:', {
            name: file.originalname,
            path: file.path,
            size: fs.statSync(file.path).size
          });

          const result = await uploadToCloudinary(file.path);
          console.log('Cloudinary response:', result);
          
          if (result && result.secure_url) {
            imageUrls.push(result.secure_url);
            console.log('Added image URL:', result.secure_url);
          } else {
            console.error('Invalid Cloudinary response:', result);
          }
        } catch (error) {
          console.error('Error uploading to Cloudinary:', error);
        } finally {
          // Clean up temp file
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
    }
    
    if (imageUrls.length === 0) {
      console.log('No images were successfully uploaded');
    } else {
      console.log('Successfully uploaded images:', imageUrls);
    }

    // Create new hotel
    const hotel = new Hotel({
      instructor: instructorId,
      name: name.trim(),
      description: description.trim(),
      location: {
        address: location.address?.trim() || '',
        city: location.city.trim(),
        country: location.country.trim(),
        coordinates: location.coordinates ? {
          lat: parseFloat(location.coordinates.latitude),
          lng: parseFloat(location.coordinates.longitude)
        } : undefined
      },
      images: imageUrls,
      rooms: rooms.map(room => ({
        type: room.type.trim(),
        price: parseFloat(room.price),
        capacity: parseInt(room.capacity),
        amenities: room.amenities?.map(amenity => amenity.trim()) || []
      })),
      amenities: amenities?.map(amenity => amenity.trim()) || [],
      instructor: instructorId
    });

    await hotel.save();

    // Save the hotel
    const savedHotel = await hotel.save();
    console.log('Saved hotel with images:', savedHotel.images);

    // Transform the response to ensure proper image URLs
    const responseData = savedHotel.toObject();
    responseData.images = responseData.images?.filter(url => url && typeof url === 'string' && url.startsWith('http')) || [];

    res.status(201).json({
      success: true,
      data: responseData
    });

    console.log('Sent response with images:', responseData.images);
  } catch (err) {
    console.error('Error in createHotel:', err);
    
    // Delete uploaded files if something goes wrong
    if (req.files && req.files.images) {
      req.files.images.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Get all hotels with filters
 * @route GET /api/hotels
 */
exports.getHotels = async (req, res) => {
  try {
    const {
      name,
      city,
      priceMin,
      priceMax,
      rating,
      capacity,
      amenities,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};
    
    if (name) {
      query.name = new RegExp(name, 'i');
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (priceMin || priceMax) {
      query['rooms.price'] = {};
      if (priceMin) query['rooms.price'].$gte = parseFloat(priceMin);
      if (priceMax) query['rooms.price'].$lte = parseFloat(priceMax);
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    if (capacity) {
      query['rooms.capacity'] = { $gte: parseInt(capacity) };
    }
    
    if (amenities) {
      const amenitiesList = amenities.split(',').map(a => a.trim());
      query.amenities = { $all: amenitiesList };
    }

    // Execute query with pagination
    const hotels = await Hotel.find(query)
      .select('name description location images rooms amenities rating createdAt')
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count
    const total = await Hotel.countDocuments(query);

    res.json({
      success: true,
      data: hotels,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error in getHotels:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Get hotel by ID
 * @route GET /api/hotels/:id
 */
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (err) {
    console.error('Error in getHotelById:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Update hotel
 * @route PUT /api/hotels/:id
 */
exports.updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    // Check ownership
    if (hotel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this hotel'
      });
    }

    hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: hotel
    });
  } catch (err) {
    console.error('Error in updateHotel:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Delete hotel
 * @route DELETE /api/hotels/:id
 */
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    // Check ownership
    if (hotel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this hotel'
      });
    }

    // Delete images from Cloudinary
    for (const image of hotel.images) {
      if (image.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }

    await hotel.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error in deleteHotel:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
