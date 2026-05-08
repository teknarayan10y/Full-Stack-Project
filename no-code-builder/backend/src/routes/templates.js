const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const auth = require('../middleware/auth');

// @route   GET /api/templates
// @desc    Get all templates (public ones and user's private ones)
// @access  Private
router.get('/', auth, templateController.getAllTemplates);

// @route   GET /api/templates/category/:category
// @desc    Get templates by category
// @access  Private
router.get('/category/:category', auth, templateController.getTemplatesByCategory);

// @route   GET /api/templates/user
// @desc    Get user's templates
// @access  Private
router.get('/user', auth, templateController.getUserTemplates);

// @route   GET /api/templates/:id
// @desc    Get single template
// @access  Private
router.get('/:id', auth, templateController.getTemplateById);

// @route   POST /api/templates
// @desc    Create a template
// @access  Private
router.post('/', auth, templateController.createTemplate);

// @route   PUT /api/templates/:id
// @desc    Update a template
// @access  Private
router.put('/:id', auth, templateController.updateTemplate);

// @route   DELETE /api/templates/:id
// @desc    Delete a template
// @access  Private
router.delete('/:id', auth, templateController.deleteTemplate);

module.exports = router;
