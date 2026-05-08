const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Booking = require('../models/Booking');

/**
 * Get personalized hotel recommendations for a user
 * @route GET /api/recommendations
 * @access Private
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with preferences and booking history
    const user = await User.findById(userId)
      .select('preferences favorites bookings')
      .populate({
        path: 'bookings',
        select: 'hotel room checkIn checkOut',
        populate: {
          path: 'hotel',
          select: 'name location rating amenities'
        }
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Build recommendation filters based on user preferences
    const filters = {};
    
    // If user has preferred locations, prioritize those
    if (user.preferences?.preferredLocations?.length > 0) {
      filters['location.city'] = { $in: user.preferences.preferredLocations };
    }
    
    // If user has preferred amenities, prioritize hotels with those
    if (user.preferences?.preferredAmenities?.length > 0) {
      filters['amenities'] = { $in: user.preferences.preferredAmenities };
    }
    
    // If user has a preferred room type, prioritize hotels with those
    if (user.preferences?.preferredRoomType && user.preferences.preferredRoomType !== 'Any') {
      filters['rooms.type'] = user.preferences.preferredRoomType;
    }
    
    // Get hotels based on user preferences
    let recommendedHotels = await Hotel.find(filters)
      .select('name description location images rating amenities rooms')
      .limit(10)
      .sort({ rating: -1 });
    
    // If no hotels match the specific preferences, get top-rated hotels
    if (recommendedHotels.length === 0) {
      recommendedHotels = await Hotel.find()
        .select('name description location images rating amenities rooms')
        .limit(10)
        .sort({ rating: -1 });
    }
    
    // Calculate personalization score for each hotel
    const scoredHotels = recommendedHotels.map(hotel => {
      let score = 0;
      
      // Base score is the hotel rating (0-5)
      score += hotel.rating;
      
      // Add points for matching amenities
      if (user.preferences?.preferredAmenities?.length > 0) {
        const matchingAmenities = hotel.amenities.filter(amenity => 
          user.preferences.preferredAmenities.includes(amenity)
        );
        score += matchingAmenities.length * 0.5;
      }
      
      // Add points for matching location
      if (user.preferences?.preferredLocations?.length > 0 && 
          user.preferences.preferredLocations.includes(hotel.location.city)) {
        score += 2;
      }
      
      // Add points if hotel has the preferred room type
      if (user.preferences?.preferredRoomType && user.preferences.preferredRoomType !== 'Any') {
        const hasPreferredRoom = hotel.rooms.some(room => 
          room.type === user.preferences.preferredRoomType
        );
        if (hasPreferredRoom) {
          score += 1.5;
        }
      }
      
      // Add points if hotel is in user's favorites
      const isFavorite = user.favorites.some(favId => favId.toString() === hotel._id.toString());
      if (isFavorite) {
        score += 3;
      }
      
      // Return hotel with personalization score
      return {
        ...hotel.toObject(),
        personalizationScore: parseFloat(score.toFixed(1))
      };
    });
    
    // Sort by personalization score
    scoredHotels.sort((a, b) => b.personalizationScore - a.personalizationScore);
    
    res.json({
      success: true,
      data: scoredHotels
    });
  } catch (err) {
    console.error('Error getting recommendations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get similar hotels to a specific hotel
 * @route GET /api/recommendations/similar/:hotelId
 * @access Public
 */
exports.getSimilarHotels = async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    // Get the reference hotel
    const referenceHotel = await Hotel.findById(hotelId)
      .select('location amenities rating rooms.price');
    
    if (!referenceHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Find hotels in the same city with similar amenities
    const similarHotels = await Hotel.find({
      _id: { $ne: hotelId },
      'location.city': referenceHotel.location.city,
      amenities: { $in: referenceHotel.amenities }
    })
    .select('name description location images rating amenities rooms')
    .limit(4)
    .sort({ rating: -1 });
    
    res.json({
      success: true,
      data: similarHotels
    });
  } catch (err) {
    console.error('Error getting similar hotels:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get trending destinations based on recent bookings
 * @route GET /api/recommendations/trending
 * @access Public
 */
exports.getTrendingDestinations = async (req, res) => {
  try {
    // Get recent bookings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBookings = await Booking.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: 'cancelled' }
    })
    .populate('hotel', 'location.city location.country')
    .select('hotel');
    
    // Count bookings by destination
    const destinationCounts = {};
    recentBookings.forEach(booking => {
      if (booking.hotel && booking.hotel.location) {
        const destination = `${booking.hotel.location.city}, ${booking.hotel.location.country}`;
        destinationCounts[destination] = (destinationCounts[destination] || 0) + 1;
      }
    });
    
    // Convert to array and sort by count
    const trendingDestinations = Object.entries(destinationCounts)
      .map(([destination, count]) => {
        const [city, country] = destination.split(', ');
        return { city, country, bookingCount: count };
      })
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);
    
    res.json({
      success: true,
      data: trendingDestinations
    });
  } catch (err) {
    console.error('Error getting trending destinations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
