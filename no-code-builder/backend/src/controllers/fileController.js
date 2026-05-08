const File = require('../models/File');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, filename, path: filePath } = req.file;
    const userId = req.body.userId || req.user.id;
    const projectId = req.body.projectId || null;

    // Create a unique filename to prevent collisions
    const uniqueFilename = `${uuidv4()}-${originalname}`;
    const newPath = path.join(uploadsDir, uniqueFilename);
    
    // Move the file to the uploads directory with the unique filename
    fs.renameSync(filePath, newPath);

    // Create file record in database
    const file = new File({
      name: uniqueFilename,
      originalName: originalname,
      type: mimetype,
      size: size,
      url: `/api/files/download/${uniqueFilename}`,
      path: newPath,
      user: userId,
      project: projectId,
      isPublic: req.body.isPublic === 'true'
    });

    await file.save();

    res.status(201).json(file);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all files for a user
exports.getUserFiles = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user is requesting their own files or if admin
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access these files' });
    }
    
    const files = await File.find({ user: userId }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error('Error getting user files:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all files for a project
exports.getProjectFiles = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    const files = await File.find({ project: projectId }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error('Error getting project files:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single file by ID
exports.getFileById = async (req, res) => {
  try {
    const fileId = req.params.id;
    
    const file = await File.findById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user is authorized to access this file
    if (!file.isPublic && file.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this file' });
    }
    
    res.json(file);
  } catch (err) {
    console.error('Error getting file:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Download a file
exports.downloadFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    
    const file = await File.findOne({ name: filename });
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user is authorized to download this file
    if (!file.isPublic && file.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to download this file' });
    }
    
    res.download(file.path, file.originalName);
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a file
exports.updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const { isPublic, projectId } = req.body;
    
    const file = await File.findById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user is authorized to update this file
    if (file.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this file' });
    }
    
    // Update file properties
    if (isPublic !== undefined) file.isPublic = isPublic;
    if (projectId !== undefined) file.project = projectId;
    
    await file.save();
    
    res.json(file);
  } catch (err) {
    console.error('Error updating file:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    
    const file = await File.findById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user is authorized to delete this file
    if (file.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this file' });
    }
    
    // Delete the file from the filesystem
    fs.unlinkSync(file.path);
    
    // Delete the file record from the database
    await File.findByIdAndDelete(fileId);
    
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
