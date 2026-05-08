const Template = require('../models/Template');

// Get all templates (public ones and user's private ones)
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({
      $or: [
        { isPublic: true },
        { user: req.user.id }
      ]
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get templates by category
exports.getTemplatesByCategory = async (req, res) => {
  try {
    const templates = await Template.find({
      category: req.params.category,
      $or: [
        { isPublic: true },
        { user: req.user.id }
      ]
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's templates
exports.getUserTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ user: req.user.id });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single template
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check if template is public or belongs to user
    if (!template.isPublic && template.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this template' });
    }
    
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create template
exports.createTemplate = async (req, res) => {
  try {
    const template = new Template({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      components: req.body.components,
      thumbnail: req.body.thumbnail,
      isPublic: req.body.isPublic || false,
      user: req.user.id
    });
    
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check if template belongs to user
    if (template.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this template' });
    }
    
    // Update fields
    if (req.body.name) template.name = req.body.name;
    if (req.body.description) template.description = req.body.description;
    if (req.body.category) template.category = req.body.category;
    if (req.body.components) template.components = req.body.components;
    if (req.body.thumbnail) template.thumbnail = req.body.thumbnail;
    if (req.body.isPublic !== undefined) template.isPublic = req.body.isPublic;
    
    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check if template belongs to user
    if (template.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this template' });
    }
    
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
