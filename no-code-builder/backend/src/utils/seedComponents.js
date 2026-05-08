const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Component = require('../models/Component');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/no-code-builder', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Define initial components
const components = [
  // Layout components
  {
    name: 'Container',
    category: 'layout',
    icon: 'layout',
    defaultProps: {
      width: '100%',
      height: 'auto',
    },
    defaultStyle: {
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    isCustom: false
  },
  {
    name: 'Row',
    category: 'layout',
    icon: 'layout',
    defaultProps: {
      width: '100%',
      height: 'auto',
    },
    defaultStyle: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: '10px'
    },
    isCustom: false
  },
  {
    name: 'Column',
    category: 'layout',
    icon: 'layout',
    defaultProps: {
      width: '50%',
      height: 'auto',
    },
    defaultStyle: {
      display: 'flex',
      flexDirection: 'column',
      padding: '10px'
    },
    isCustom: false
  },
  {
    name: 'Card',
    category: 'layout',
    icon: 'layout',
    defaultProps: {
      width: '100%',
      height: 'auto',
    },
    defaultStyle: {
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    isCustom: false
  },
  
  // Input components
  {
    name: 'TextInput',
    category: 'input',
    icon: 'input',
    defaultProps: {
      placeholder: 'Enter text...',
      label: 'Text Input',
      required: false,
      type: 'text'
    },
    defaultStyle: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '16px'
    },
    isCustom: false
  },
  {
    name: 'Button',
    category: 'input',
    icon: 'input',
    defaultProps: {
      text: 'Button',
      type: 'button'
    },
    defaultStyle: {
      padding: '10px 20px',
      backgroundColor: '#4A90E2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    isCustom: false
  },
  {
    name: 'Checkbox',
    category: 'input',
    icon: 'input',
    defaultProps: {
      label: 'Checkbox',
      checked: false
    },
    defaultStyle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    isCustom: false
  },
  {
    name: 'Select',
    category: 'input',
    icon: 'input',
    defaultProps: {
      label: 'Select',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ]
    },
    defaultStyle: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '16px'
    },
    isCustom: false
  },
  
  // Display components
  {
    name: 'Text',
    category: 'display',
    icon: 'display',
    defaultProps: {
      text: 'Text component',
      tag: 'p'
    },
    defaultStyle: {
      fontSize: '16px',
      color: '#333333',
      margin: '0'
    },
    isCustom: false
  },
  {
    name: 'Heading',
    category: 'display',
    icon: 'display',
    defaultProps: {
      text: 'Heading',
      level: 'h2'
    },
    defaultStyle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333333',
      margin: '0 0 16px 0'
    },
    isCustom: false
  },
  {
    name: 'Image',
    category: 'display',
    icon: 'display',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image'
    },
    defaultStyle: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    isCustom: false
  },
  {
    name: 'Icon',
    category: 'display',
    icon: 'display',
    defaultProps: {
      name: 'star',
      size: '24px'
    },
    defaultStyle: {
      color: '#4A90E2'
    },
    isCustom: false
  },
  
  // Navigation components
  {
    name: 'Navbar',
    category: 'navigation',
    icon: 'navigation',
    defaultProps: {
      brand: 'Brand',
      items: [
        { label: 'Home', link: '/' },
        { label: 'About', link: '/about' },
        { label: 'Contact', link: '/contact' }
      ]
    },
    defaultStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    isCustom: false
  },
  {
    name: 'Link',
    category: 'navigation',
    icon: 'navigation',
    defaultProps: {
      text: 'Link',
      href: '#'
    },
    defaultStyle: {
      color: '#4A90E2',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    isCustom: false
  },
  {
    name: 'Menu',
    category: 'navigation',
    icon: 'navigation',
    defaultProps: {
      items: [
        { label: 'Item 1', link: '#' },
        { label: 'Item 2', link: '#' },
        { label: 'Item 3', link: '#' }
      ]
    },
    defaultStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '10px',
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    isCustom: false
  }
];

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing components
    await Component.deleteMany({});
    console.log('Cleared existing components');
    
    // Insert new components
    await Component.insertMany(components);
    console.log(`Seeded ${components.length} components`);
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(() => {
  seedDB();
});
