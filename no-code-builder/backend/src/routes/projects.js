const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, projectController.getAllProjects);

// @route   GET /api/projects/user/:userId
// @desc    Get projects by user
// @access  Private
router.get('/user/:userId', auth, projectController.getUserProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, projectController.getProjectById);

// @route   POST /api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, projectController.createProject);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, projectController.updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, projectController.deleteProject);

// @route   POST /api/projects/:id/pages
// @desc    Add a page to a project
// @access  Private
router.post('/:id/pages', auth, projectController.addPage);

// @route   PUT /api/projects/:id/pages/:pageId
// @desc    Update a page in a project
// @access  Private
router.put('/:id/pages/:pageId', auth, projectController.updatePage);

// @route   DELETE /api/projects/:id/pages/:pageId
// @desc    Delete a page from a project
// @access  Private
router.delete('/:id/pages/:pageId', auth, projectController.deletePage);

// @route   PUT /api/projects/:id/publish
// @desc    Publish a project
// @access  Private
router.put('/:id/publish', auth, projectController.publishProject);


module.exports = router;
