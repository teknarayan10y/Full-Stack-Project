const User = require('../models/User');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

/**
 * Get user's loyalty program details
 * @route GET /api/loyalty
 * @access Private
 */
exports.getLoyaltyDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('loyaltyProgram name email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.loyaltyProgram,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error fetching loyalty details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Calculate and award points for a booking
 * @param {String} userId - User ID
 * @param {String} bookingId - Booking ID
 * @param {Number} amount - Booking amount
 */
exports.awardPointsForBooking = async (userId, bookingId, amount) => {
  try {
    // Calculate points (1 point per $10 spent)
    const pointsEarned = Math.floor(amount / 10);
    
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for awarding points');
      return false;
    }
    
    // Initialize loyalty program if it doesn't exist
    if (!user.loyaltyProgram) {
      user.loyaltyProgram = {
        points: 0,
        tier: 'Bronze',
        memberSince: Date.now(),
        pointsHistory: []
      };
    }
    
    // Add points to user's account
    user.loyaltyProgram.points += pointsEarned;
    
    // Add to points history
    user.loyaltyProgram.pointsHistory.push({
      points: pointsEarned,
      description: `Points earned for booking #${bookingId}`,
      date: Date.now(),
      bookingId
    });
    
    // Update tier based on total points
    if (user.loyaltyProgram.points >= 1000) {
      user.loyaltyProgram.tier = 'Platinum';
    } else if (user.loyaltyProgram.points >= 500) {
      user.loyaltyProgram.tier = 'Gold';
    } else if (user.loyaltyProgram.points >= 200) {
      user.loyaltyProgram.tier = 'Silver';
    }
    
    await user.save();
    return true;
  } catch (err) {
    console.error('Error awarding points:', err);
    return false;
  }
};

/**
 * Redeem points for a discount
 * @route POST /api/loyalty/redeem
 * @access Private
 */
exports.redeemPoints = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { points } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has enough points
    if (!user.loyaltyProgram || user.loyaltyProgram.points < points) {
      return res.status(400).json({ message: 'Not enough points' });
    }
    
    // Calculate discount amount (1 point = $0.10)
    const discountAmount = points * 0.1;
    
    // Generate discount code
    const discountCode = `REWARD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // Deduct points
    user.loyaltyProgram.points -= points;
    
    // Add to points history
    user.loyaltyProgram.pointsHistory.push({
      points: -points,
      description: `Redeemed for discount code ${discountCode}`,
      date: Date.now()
    });
    
    await user.save();
    
    res.json({
      success: true,
      data: {
        discountCode,
        discountAmount,
        remainingPoints: user.loyaltyProgram.points
      }
    });
  } catch (err) {
    console.error('Error redeeming points:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user's points history
 * @route GET /api/loyalty/history
 * @access Private
 */
exports.getPointsHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('loyaltyProgram.pointsHistory')
      .populate({
        path: 'loyaltyProgram.pointsHistory.bookingId',
        select: 'hotel checkIn checkOut totalPrice'
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user.loyaltyProgram?.pointsHistory || []
    });
  } catch (err) {
    console.error('Error fetching points history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
