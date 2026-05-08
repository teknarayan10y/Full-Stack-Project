const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create profile pictures directory if it doesn't exist
const profilePicsDir = path.join(uploadsDir, 'profile-pictures');
if (!fs.existsSync(profilePicsDir)) {
  fs.mkdirSync(profilePicsDir, { recursive: true });
}

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a unique filename
    const filename = `${user._id}-${Date.now()}${path.extname(req.file.originalname)}`;
    const filepath = path.join(profilePicsDir, filename);

    // Write the file to disk
    fs.writeFileSync(filepath, req.file.buffer);

    // Update user's profile picture URL
    const profilePictureUrl = `/uploads/profile-pictures/${filename}`;
    user.profilePicture = profilePictureUrl;
    user.updatedAt = Date.now();
    await user.save();

    res.json({
      success: true,
      profilePicture: profilePictureUrl
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
