const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/temp'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Create temp directory if it doesn't exist
const fs = require('fs');
const tempDir = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Accept images, documents, and common file types
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv', 'application/json'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and common file types are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: fileFilter
});

// Routes
// @route   POST /api/files/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', auth, upload.single('file'), fileController.uploadFile);

// @route   GET /api/files/user/:userId
// @desc    Get all files for a user
// @access  Private
router.get('/user/:userId', auth, fileController.getUserFiles);

// @route   GET /api/files/project/:projectId
// @desc    Get all files for a project
// @access  Private
router.get('/project/:projectId', auth, fileController.getProjectFiles);

// @route   GET /api/files/:id
// @desc    Get a single file by ID
// @access  Private
router.get('/:id', auth, fileController.getFileById);

// @route   GET /api/files/download/:filename
// @desc    Download a file
// @access  Private
router.get('/download/:filename', auth, fileController.downloadFile);

// @route   PUT /api/files/:id
// @desc    Update a file
// @access  Private
router.put('/:id', auth, fileController.updateFile);

// @route   DELETE /api/files/:id
// @desc    Delete a file
// @access  Private
router.delete('/:id', auth, fileController.deleteFile);

// Error handling for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
