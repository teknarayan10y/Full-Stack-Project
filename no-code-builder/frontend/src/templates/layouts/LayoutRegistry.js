import React from 'react';

// Layout registry with metadata for the builder
const layoutRegistry = {
  // Basic layouts
  SingleColumn: {
    name: 'Single Column',
    description: 'A simple single column layout with header, content, and footer',
    category: 'basic',
    icon: 'columns',
    image: '/images/templates/single-column.svg',
    structure: {
      type: 'Container',
      props: {
        style: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      },
      children: [
        {
          id: 'header',
          type: 'Container',
          props: {
            text: 'Header',
            style: {
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e9ecef'
            }
          }
        },
        {
          id: 'content',
          type: 'Container',
          props: {
            text: 'Content Area',
            style: {
              padding: '2rem',
              flex: '1'
            }
          }
        },
        {
          id: 'footer',
          type: 'Container',
          props: {
            text: 'Footer',
            style: {
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #e9ecef',
              textAlign: 'center'
            }
          }
        }
      ]
    }
  },
  
  TwoColumn: {
    name: 'Two Column',
    description: 'A two column layout with sidebar and main content area',
    category: 'basic',
    icon: 'columns',
    image: '/images/templates/two-column.svg',
    structure: {
      type: 'Container',
      props: {
        style: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      },
      children: [
        {
          id: 'header',
          type: 'Container',
          props: {
            text: 'Header',
            style: {
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e9ecef'
            }
          }
        },
        {
          id: 'main',
          type: 'Row',
          props: {
            style: {
              flex: '1',
              display: 'flex'
            }
          },
          children: [
            {
              id: 'sidebar',
              type: 'Column',
              props: {
                text: 'Sidebar',
                style: {
                  width: '250px',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRight: '1px solid #e9ecef'
                }
              }
            },
            {
              id: 'content',
              type: 'Column',
              props: {
                text: 'Content Area',
                style: {
                  flex: '1',
                  padding: '2rem'
                }
              }
            }
          ]
        },
        {
          id: 'footer',
          type: 'Container',
          props: {
            text: 'Footer',
            style: {
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #e9ecef',
              textAlign: 'center'
            }
          }
        }
      ]
    }
  },
  
  // Dashboard layouts
  AdminDashboard: {
    name: 'Admin Dashboard',
    description: 'A dashboard layout with fixed sidebar and header',
    category: 'dashboard',
    icon: 'tachometer-alt',
    image: '/images/templates/admin-dashboard.svg',
    structure: {
      type: 'Container',
      props: {
        style: {
          minHeight: '100vh',
          display: 'flex'
        }
      },
      children: [
        {
          id: 'sidebar',
          type: 'Container',
          props: {
            text: 'Sidebar',
            style: {
              width: '250px',
              backgroundColor: '#343a40',
              color: 'white',
              padding: '1rem',
              position: 'fixed',
              height: '100vh',
              overflowY: 'auto'
            }
          }
        },
        {
          id: 'mainContent',
          type: 'Container',
          props: {
            style: {
              marginLeft: '250px',
              flex: '1',
              display: 'flex',
              flexDirection: 'column'
            }
          },
          children: [
            {
              id: 'header',
              type: 'Container',
              props: {
                text: 'Header',
                style: {
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e9ecef',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100
                }
              }
            },
            {
              id: 'content',
              type: 'Container',
              props: {
                text: 'Dashboard Content',
                style: {
                  padding: '2rem',
                  flex: '1'
                }
              }
            }
          ]
        }
      ]
    }
  },
  
  // Landing page layouts
  HeroSection: {
    name: 'Hero Section',
    description: 'A landing page with hero section, features, and call to action',
    category: 'landing',
    icon: 'home',
    image: '/images/templates/hero-section.svg',
    structure: {
      type: 'Container',
      props: {
        style: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      },
      children: [
        {
          id: 'header',
          type: 'Container',
          props: {
            style: {
              padding: '1rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e9ecef'
            }
          },
          children: [
            {
              id: 'logo',
              type: 'Text',
              props: {
                text: 'Logo',
                style: {
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }
              }
            },
            {
              id: 'nav',
              type: 'Row',
              props: {
                style: {
                  gap: '1.5rem'
                }
              },
              children: [
                {
                  id: 'navItem1',
                  type: 'Text',
                  props: {
                    text: 'Home',
                    style: {
                      cursor: 'pointer'
                    }
                  }
                },
                {
                  id: 'navItem2',
                  type: 'Text',
                  props: {
                    text: 'Features',
                    style: {
                      cursor: 'pointer'
                    }
                  }
                },
                {
                  id: 'navItem3',
                  type: 'Text',
                  props: {
                    text: 'Pricing',
                    style: {
                      cursor: 'pointer'
                    }
                  }
                },
                {
                  id: 'navItem4',
                  type: 'Text',
                  props: {
                    text: 'Contact',
                    style: {
                      cursor: 'pointer'
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'hero',
          type: 'Container',
          props: {
            style: {
              padding: '4rem 2rem',
              backgroundColor: '#f8f9fa',
              textAlign: 'center'
            }
          },
          children: [
            {
              id: 'heroTitle',
              type: 'Heading',
              props: {
                text: 'Welcome to Our Platform',
                level: 1,
                style: {
                  marginBottom: '1rem',
                  fontSize: '2.5rem'
                }
              }
            },
            {
              id: 'heroSubtitle',
              type: 'Text',
              props: {
                text: 'The best solution for your business needs',
                style: {
                  fontSize: '1.25rem',
                  color: '#6c757d',
                  marginBottom: '2rem'
                }
              }
            },
            {
              id: 'ctaButton',
              type: 'Button',
              props: {
                text: 'Get Started',
                style: {
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1.1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }
              }
            }
          ]
        },
        {
          id: 'features',
          type: 'Container',
          props: {
            style: {
              padding: '4rem 2rem'
            }
          },
          children: [
            {
              id: 'featuresTitle',
              type: 'Heading',
              props: {
                text: 'Features',
                level: 2,
                style: {
                  textAlign: 'center',
                  marginBottom: '3rem'
                }
              }
            },
            {
              id: 'featureCards',
              type: 'Row',
              props: {
                style: {
                  display: 'flex',
                  gap: '2rem',
                  justifyContent: 'center'
                }
              },
              children: [
                {
                  id: 'feature1',
                  type: 'Card',
                  props: {
                    title: 'Feature 1',
                    text: 'Description of feature 1 goes here.',
                    style: {
                      padding: '1.5rem',
                      textAlign: 'center',
                      flex: '1'
                    }
                  }
                },
                {
                  id: 'feature2',
                  type: 'Card',
                  props: {
                    title: 'Feature 2',
                    text: 'Description of feature 2 goes here.',
                    style: {
                      padding: '1.5rem',
                      textAlign: 'center',
                      flex: '1'
                    }
                  }
                },
                {
                  id: 'feature3',
                  type: 'Card',
                  props: {
                    title: 'Feature 3',
                    text: 'Description of feature 3 goes here.',
                    style: {
                      padding: '1.5rem',
                      textAlign: 'center',
                      flex: '1'
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'footer',
          type: 'Container',
          props: {
            style: {
              padding: '2rem',
              backgroundColor: '#343a40',
              color: 'white',
              textAlign: 'center'
            }
          },
          children: [
            {
              id: 'footerText',
              type: 'Text',
              props: {
                text: '© 2025 Your Company. All rights reserved.'
              }
            }
          ]
        }
      ]
    }
  },
  
  // Form layouts
  ContactForm: {
    name: 'Contact Form',
    description: 'A contact form layout with fields and submit button',
    category: 'form',
    icon: 'envelope',
    image: '/images/templates/contact-form.svg',
    structure: {
      type: 'Container',
      props: {
        style: {
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem'
        }
      },
      children: [
        {
          id: 'formTitle',
          type: 'Heading',
          props: {
            text: 'Contact Us',
            level: 2,
            style: {
              marginBottom: '1.5rem',
              textAlign: 'center'
            }
          }
        },
        {
          id: 'nameField',
          type: 'Container',
          props: {
            style: {
              marginBottom: '1rem'
            }
          },
          children: [
            {
              id: 'nameLabel',
              type: 'Text',
              props: {
                text: 'Name',
                style: {
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }
              }
            },
            {
              id: 'nameInput',
              type: 'Input',
              props: {
                placeholder: 'Enter your name',
                style: {
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }
              }
            }
          ]
        },
        {
          id: 'emailField',
          type: 'Container',
          props: {
            style: {
              marginBottom: '1rem'
            }
          },
          children: [
            {
              id: 'emailLabel',
              type: 'Text',
              props: {
                text: 'Email',
                style: {
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }
              }
            },
            {
              id: 'emailInput',
              type: 'Input',
              props: {
                type: 'email',
                placeholder: 'Enter your email',
                style: {
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }
              }
            }
          ]
        },
        {
          id: 'messageField',
          type: 'Container',
          props: {
            style: {
              marginBottom: '1.5rem'
            }
          },
          children: [
            {
              id: 'messageLabel',
              type: 'Text',
              props: {
                text: 'Message',
                style: {
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }
              }
            },
            {
              id: 'messageInput',
              type: 'Textarea',
              props: {
                placeholder: 'Enter your message',
                rows: 5,
                style: {
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'inherit'
                }
              }
            }
          ]
        },
        {
          id: 'submitButton',
          type: 'Button',
          props: {
            text: 'Submit',
            style: {
              backgroundColor: '#4A90E2',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }
          }
        }
      ]
    }
  }
};

export default layoutRegistry;
