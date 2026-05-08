const express = require('express');
const router = express.Router();
const formValidationController = require('../controllers/formValidationController');
const auth = require('../middleware/auth');

// @route   GET /api/form-validations
// @desc    Get all form validations for a user
// @access  Private
router.get('/', auth, formValidationController.getAllFormValidations);

// @route   GET /api/form-validations/:id
// @desc    Get single form validation
// @access  Private
router.get('/:id', auth, formValidationController.getFormValidationById);

// @route   POST /api/form-validations
// @desc    Create a form validation
// @access  Private
router.post('/', auth, formValidationController.createFormValidation);

// @route   PUT /api/form-validations/:id
// @desc    Update a form validation
// @access  Private
router.put('/:id', auth, formValidationController.updateFormValidation);

// @route   DELETE /api/form-validations/:id
// @desc    Delete a form validation
// @access  Private
router.delete('/:id', auth, formValidationController.deleteFormValidation);

// @route   POST /api/form-validations/validate
// @desc    Validate form data against validation rules
// @access  Private
router.post('/validate', auth, formValidationController.validateFormData);

module.exports = router;
