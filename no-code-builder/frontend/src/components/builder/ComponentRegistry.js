import React from 'react';
import ImageComponent from './components/ImageComponent';
import FileUploadComponent from './components/FileUploadComponent';

// Import other components as needed

// Component registry with metadata for the builder
const componentRegistry = {
  // Layout components
  Container: {
    component: ({ children, ...props }) => (
      <div {...props}>{children}</div>
    ),
    category: 'layout',
    icon: 'square',
    name: 'Container',
    description: 'A basic container element',
    defaultProps: {
      style: {
        padding: '1rem',
        backgroundColor: '#ffffff',
        border: '1px solid #eee',
        borderRadius: '4px'
      }
    }
  },
  
  Row: {
    component: ({ children, ...props }) => (
      <div style={{ display: 'flex', flexDirection: 'row' }} {...props}>{children}</div>
    ),
    category: 'layout',
    icon: 'grip-lines',
    name: 'Row',
    description: 'A horizontal row using flexbox',
    defaultProps: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        width: '100%'
      }
    }
  },
  
  Column: {
    component: ({ children, ...props }) => (
      <div style={{ display: 'flex', flexDirection: 'column' }} {...props}>{children}</div>
    ),
    category: 'layout',
    icon: 'grip-lines-vertical',
    name: 'Column',
    description: 'A vertical column using flexbox',
    defaultProps: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%'
      }
    }
  },
  
  // Basic components
  Text: {
    component: ({ text, ...props }) => (
      <p {...props}>{text}</p>
    ),
    category: 'basic',
    icon: 'font',
    name: 'Text',
    description: 'A simple text element',
    defaultProps: {
      text: 'Text content goes here',
      style: {
        fontSize: '1rem',
        color: '#333',
        margin: '0'
      }
    }
  },
  
  Heading: {
    component: ({ text, level = 2, ...props }) => {
      const HeadingTag = `h${level}`;
      return <HeadingTag {...props}>{text}</HeadingTag>;
    },
    category: 'basic',
    icon: 'heading',
    name: 'Heading',
    description: 'A heading element (h1-h6)',
    defaultProps: {
      text: 'Heading',
      level: 2,
      style: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#333',
        margin: '0 0 1rem 0'
      }
    }
  },
  
  Button: {
    component: ({ text, ...props }) => (
      <button {...props}>{text}</button>
    ),
    category: 'basic',
    icon: 'mouse-pointer',
    name: 'Button',
    description: 'A clickable button element',
    defaultProps: {
      text: 'Click Me',
      style: {
        padding: '0.5rem 1rem',
        backgroundColor: '#4A90E2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500'
      }
    }
  },
  
  // Form components
  Input: {
    component: (props) => (
      <input {...props} />
    ),
    category: 'form',
    icon: 'keyboard',
    name: 'Input',
    description: 'A text input field',
    defaultProps: {
      type: 'text',
      placeholder: 'Enter text...',
      style: {
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100%'
      }
    }
  },
  
  Textarea: {
    component: (props) => (
      <textarea {...props} />
    ),
    category: 'form',
    icon: 'align-left',
    name: 'Textarea',
    description: 'A multi-line text input',
    defaultProps: {
      placeholder: 'Enter text...',
      rows: 4,
      style: {
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100%',
        fontFamily: 'inherit'
      }
    }
  },
  
  Select: {
    component: ({ options = [], ...props }) => (
      <select {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    ),
    category: 'form',
    icon: 'caret-square-down',
    name: 'Select',
    description: 'A dropdown select input',
    defaultProps: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      style: {
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100%'
      }
    }
  },
  
  // Media components
  Image: {
    component: ImageComponent,
    category: 'media',
    icon: 'image',
    name: 'Image',
    description: 'An image component with optional caption',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image',
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      hoverEffect: true,
      caption: 'Image Caption',
      captionPosition: 'below',
      captionAlignment: 'center',
      captionColor: '#666',
      captionSize: '0.875rem'
    }
  },
  
  // File upload component
  FileUpload: {
    component: FileUploadComponent,
    category: 'media',
    icon: 'upload',
    name: 'File Upload',
    description: 'A file upload component with drag and drop support',
    defaultProps: {
      title: 'Upload Files',
      description: 'Drag and drop files here or click to browse',
      titleSize: '1.25rem',
      titleColor: '#333',
      titleAlignment: 'left',
      descriptionSize: '0.875rem',
      descriptionColor: '#666',
      descriptionAlignment: 'left',
      width: '100%',
      margin: '1rem 0',
      padding: '0',
      acceptedFileTypes: 'image/*,application/pdf',
      maxFileSize: 5242880, // 5MB
      maxFiles: 5
    }
  }
};

export default componentRegistry;
