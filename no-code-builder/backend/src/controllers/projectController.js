const mongoose = require('mongoose');
const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get projects by user
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.params.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    // Process pages with template structures if they exist
    let pages = req.body.pages || [{ name: 'Home', components: [] }];
    
    // Process each page
    pages.forEach(page => {
      if (page.components) {
        // Process each component
        page.components.forEach(component => {
          // Mark template structures
          if (component.children && Array.isArray(component.children)) {
            processComponentChildren(component);
          }
          
          // Ensure component has an ID
          if (!component.id) {
            component.id = new mongoose.Types.ObjectId().toString();
          }
        });
      }
    });
    
    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      user: req.user.id,
      pages: pages
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ message: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is authorized to update this project
    if (project.user && req.user && project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this project' });
    }

    // Process pages with template structures if they exist
    if (req.body.pages) {
      // Process each page
      req.body.pages.forEach(page => {
        if (page.components) {
          // Process each component
          page.components.forEach(component => {
            // Mark template structures
            if (component.children && Array.isArray(component.children)) {
              processComponentChildren(component);
            }
            
            // Ensure component has an ID
            if (!component.id) {
              component.id = new mongoose.Types.ObjectId().toString();
            }
          });
        }
      });
    }

    // Create update object with only the fields that need to be updated
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.pages) updateData.pages = req.body.pages;
    if (req.body.published !== undefined) updateData.published = req.body.published;
    if (req.body.publishedUrl) updateData.publishedUrl = req.body.publishedUrl;
    
    updateData.updatedAt = Date.now();

    // Use findByIdAndUpdate to avoid version conflicts
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(400).json({ message: err.message });
  }
};

// Helper function to process component children recursively
function processComponentChildren(component) {
  // Mark as template structure
  component.isTemplate = true;
  
  // Ensure component has an ID
  if (!component.id) {
    component.id = new mongoose.Types.ObjectId().toString();
  }
  
  // Process children recursively
  if (component.children && Array.isArray(component.children)) {
    component.children.forEach(child => {
      if (typeof child === 'object') {
        processComponentChildren(child);
      }
    });
  }
}

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a page to a project
exports.addPage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const newPage = {
      name: req.body.name,
      components: [],
      layout: req.body.layout || {}
    };
    
    project.pages.push(newPage);
    project.updatedAt = Date.now();
    
    const updatedProject = await project.save();
    res.status(201).json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a page in a project
exports.updatePage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const pageIndex = project.pages.findIndex(page => page._id.toString() === req.params.pageId);
    if (pageIndex === -1) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    if (req.body.name) project.pages[pageIndex].name = req.body.name;
    if (req.body.components) project.pages[pageIndex].components = req.body.components;
    if (req.body.layout) project.pages[pageIndex].layout = req.body.layout;
    
    project.updatedAt = Date.now();
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a page from a project
exports.deletePage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const pageIndex = project.pages.findIndex(page => page._id.toString() === req.params.pageId);
    if (pageIndex === -1) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    project.pages.splice(pageIndex, 1);
    project.updatedAt = Date.now();
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Publish a project
exports.publishProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.published = true;
    project.publishedUrl = req.body.publishedUrl || `/app/${project._id}`;
    project.updatedAt = Date.now();
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is authorized to delete this project
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this project' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
