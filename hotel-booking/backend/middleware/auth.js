const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Not a Bearer token');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in Bearer format');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Token verified, decoded:', decoded);
    
    // Convert string ID to MongoDB ObjectId
    if (decoded.id && typeof decoded.id === 'string') {
      try {
        decoded.id = new mongoose.Types.ObjectId(decoded.id);
      } catch (error) {
        console.error('Error converting user ID to ObjectId:', error);
        return res.status(401).json({ message: 'Invalid user ID format' });
      }
    }
    
    // Add user from payload
    req.user = decoded;
    console.log('User added to request:', req.user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
