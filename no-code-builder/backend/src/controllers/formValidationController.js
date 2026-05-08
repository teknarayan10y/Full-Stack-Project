const FormValidation = require('../models/FormValidation');

// Get all form validations for a user
exports.getAllFormValidations = async (req, res) => {
  try {
    const formValidations = await FormValidation.find({ user: req.user.id });
    res.json(formValidations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single form validation
exports.getFormValidationById = async (req, res) => {
  try {
    const formValidation = await FormValidation.findById(req.params.id);
    
    if (!formValidation) {
      return res.status(404).json({ message: 'Form validation not found' });
    }
    
    // Check if form validation belongs to user
    if (formValidation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this form validation' });
    }
    
    res.json(formValidation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create form validation
exports.createFormValidation = async (req, res) => {
  try {
    const formValidation = new FormValidation({
      name: req.body.name,
      description: req.body.description,
      fields: req.body.fields,
      submitAction: req.body.submitAction,
      user: req.user.id
    });
    
    const newFormValidation = await formValidation.save();
    res.status(201).json(newFormValidation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update form validation
exports.updateFormValidation = async (req, res) => {
  try {
    const formValidation = await FormValidation.findById(req.params.id);
    
    if (!formValidation) {
      return res.status(404).json({ message: 'Form validation not found' });
    }
    
    // Check if form validation belongs to user
    if (formValidation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this form validation' });
    }
    
    // Update fields
    if (req.body.name) formValidation.name = req.body.name;
    if (req.body.description) formValidation.description = req.body.description;
    if (req.body.fields) formValidation.fields = req.body.fields;
    if (req.body.submitAction) formValidation.submitAction = req.body.submitAction;
    
    formValidation.updatedAt = Date.now();
    
    const updatedFormValidation = await formValidation.save();
    res.json(updatedFormValidation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete form validation
exports.deleteFormValidation = async (req, res) => {
  try {
    const formValidation = await FormValidation.findById(req.params.id);
    
    if (!formValidation) {
      return res.status(404).json({ message: 'Form validation not found' });
    }
    
    // Check if form validation belongs to user
    if (formValidation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this form validation' });
    }
    
    await FormValidation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Form validation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Validate form data against validation rules
exports.validateFormData = async (req, res) => {
  try {
    const { formId, formData } = req.body;
    
    const formValidation = await FormValidation.findById(formId);
    
    if (!formValidation) {
      return res.status(404).json({ message: 'Form validation not found' });
    }
    
    // Validate form data against validation rules
    const errors = {};
    
    formValidation.fields.forEach(field => {
      const fieldName = field.name;
      const fieldValue = formData[fieldName];
      
      // Skip validation if field is not required and value is empty
      const isRequired = field.validationRules.some(rule => rule.type === 'required');
      if (!isRequired && (fieldValue === undefined || fieldValue === '')) {
        return;
      }
      
      field.validationRules.forEach(rule => {
        let isValid = true;
        
        switch (rule.type) {
          case 'required':
            isValid = fieldValue !== undefined && fieldValue !== '';
            break;
            
          case 'minLength':
            isValid = fieldValue && fieldValue.length >= rule.value;
            break;
            
          case 'maxLength':
            isValid = fieldValue && fieldValue.length <= rule.value;
            break;
            
          case 'pattern':
            isValid = fieldValue && new RegExp(rule.value).test(fieldValue);
            break;
            
          case 'email':
            isValid = fieldValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue);
            break;
            
          case 'number':
            isValid = fieldValue && !isNaN(Number(fieldValue));
            break;
            
          case 'min':
            isValid = fieldValue && Number(fieldValue) >= rule.value;
            break;
            
          case 'max':
            isValid = fieldValue && Number(fieldValue) <= rule.value;
            break;
            
          case 'custom':
            // Custom validation would be implemented on the frontend
            isValid = true;
            break;
        }
        
        if (!isValid && !errors[fieldName]) {
          errors[fieldName] = rule.message;
        }
      });
    });
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    
    res.json({ valid: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
