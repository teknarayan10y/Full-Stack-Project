const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const virtualTourController = require('../controllers/virtualTourController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/virtual-tours');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for panorama images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'panorama-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * @route   POST /api/virtual-tours/:hotelId/:roomId
 * @desc    Add virtual tour to a room
 * @access  Private/Admin
 */
router.post(
  '/:hotelId/:roomId',
  [
    auth,
    admin,
    upload.array('panoramaImages', 10), // Allow up to 10 panorama images
    [
      check('videoUrl').optional().isURL().withMessage('Video URL must be a valid URL'),
      check('threeDModelUrl').optional().isURL().withMessage('3D model URL must be a valid URL')
    ]
  ],
  virtualTourController.addVirtualTour
);

/**
 * @route   GET /api/virtual-tours/:hotelId/:roomId
 * @desc    Get virtual tour for a room
 * @access  Public
 */
router.get('/:hotelId/:roomId', virtualTourController.getVirtualTour);

/**
 * @route   DELETE /api/virtual-tours/:hotelId/:roomId
 * @desc    Delete virtual tour for a room
 * @access  Private/Admin
 */
router.delete('/:hotelId/:roomId', [auth, admin], virtualTourController.deleteVirtualTour);

module.exports = router;
