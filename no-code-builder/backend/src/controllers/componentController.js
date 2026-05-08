const Component = require('../models/Component');

// Get all components
exports.getAllComponents = async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get components by category
exports.getComponentsByCategory = async (req, res) => {
  try {
    const components = await Component.find({ category: req.params.category });
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's custom components
exports.getUserComponents = async (req, res) => {
  try {
    const components = await Component.find({ 
      user: req.params.userId,
      isCustom: true 
    });
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single component
exports.getComponentById = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json(component);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create component
exports.createComponent = async (req, res) => {
  const component = new Component({
    name: req.body.name,
    category: req.body.category,
    icon: req.body.icon,
    defaultProps: req.body.defaultProps || {},
    defaultStyle: req.body.defaultStyle || {},
    isCustom: req.body.isCustom || false,
    user: req.body.user
  });

  try {
    const newComponent = await component.save();
    res.status(201).json(newComponent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update component
exports.updateComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    // Update fields
    if (req.body.name) component.name = req.body.name;
    if (req.body.category) component.category = req.body.category;
    if (req.body.icon) component.icon = req.body.icon;
    if (req.body.defaultProps) component.defaultProps = req.body.defaultProps;
    if (req.body.defaultStyle) component.defaultStyle = req.body.defaultStyle;
    if (req.body.isCustom !== undefined) component.isCustom = req.body.isCustom;

    const updatedComponent = await component.save();
    res.json(updatedComponent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete component
exports.deleteComponent = async (req, res) => {
  try {
    const result = await Component.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json({ message: 'Component deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clone a component (useful for creating custom components based on existing ones)
exports.cloneComponent = async (req, res) => {
  try {
    const sourceComponent = await Component.findById(req.params.id);
    if (!sourceComponent) {
      return res.status(404).json({ message: 'Source component not found' });
    }
    
    const newComponent = new Component({
      name: req.body.name || `${sourceComponent.name} (Clone)`,
      category: sourceComponent.category,
      icon: sourceComponent.icon,
      defaultProps: req.body.defaultProps || sourceComponent.defaultProps,
      defaultStyle: req.body.defaultStyle || sourceComponent.defaultStyle,
      isCustom: true,
      user: req.body.user
    });
    
    const savedComponent = await newComponent.save();
    res.status(201).json(savedComponent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
