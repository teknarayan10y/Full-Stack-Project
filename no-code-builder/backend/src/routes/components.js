const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const auth = require('../middleware/auth');

// @route   GET /api/components
// @desc    Get all components
// @access  Public
router.get('/', componentController.getAllComponents);

// @route   GET /api/components/category/:category
// @desc    Get components by category
// @access  Public
router.get('/category/:category', componentController.getComponentsByCategory);

// @route   GET /api/components/user/:userId
// @desc    Get user's custom components
// @access  Private
router.get('/user/:userId', auth, componentController.getUserComponents);

// @route   GET /api/components/:id
// @desc    Get single component
// @access  Public
router.get('/:id', componentController.getComponentById);

// @route   POST /api/components
// @desc    Create a component
// @access  Private
router.post('/', auth, componentController.createComponent);

// @route   PUT /api/components/:id
// @desc    Update a component
// @access  Private
router.put('/:id', auth, componentController.updateComponent);

// @route   DELETE /api/components/:id
// @desc    Delete a component
// @access  Private
router.delete('/:id', auth, componentController.deleteComponent);

// @route   POST /api/components/:id/clone
// @desc    Clone a component
// @access  Private
router.post('/:id/clone', auth, componentController.cloneComponent);

module.exports = router;
