import { Box, Container, Grid, Typography, Link, IconButton, Divider, useTheme } from '@mui/material';
import { Facebook, Twitter, LinkedIn, GitHub, Email } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Product', links: [
      { name: 'Features', to: '/features' },
      { name: 'Pricing', to: '/pricing' },
      { name: 'Updates', to: '/updates' },
      { name: 'Beta', to: '/beta' },
    ]},
    { title: 'Company', links: [
      { name: 'About Us', to: '/about' },
      { name: 'Careers', to: '/careers' },
      { name: 'Press', to: '/press' },
      { name: 'Blog', to: '/blog' },
    ]},
    { title: 'Support', links: [
      { name: 'Help Center', to: '/help' },
      { name: 'Contact Us', to: '/contact' },
      { name: 'Privacy Policy', to: '/privacy' },
      { name: 'Terms of Service', to: '/terms' },
    ]},
  ];

  const socialLinks = [
    { icon: <Facebook />, label: 'Facebook', url: 'https://facebook.com' },
    { icon: <Twitter />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <LinkedIn />, label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: <GitHub />, label: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4} sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              EventEase
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Making event management simple and efficient for teams of all sizes.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  aria-label={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
          
          {footerLinks.map((column) => (
            <Grid item xs={6} md={2} key={column.title}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {column.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {column.links.map((link) => (
                  <li key={link.name} style={{ marginBottom: theme.spacing(1) }}>
                    <Link
                      component={RouterLink}
                      to={link.to}
                      color="text.secondary"
                      variant="body2"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </Box>
            </Grid>
          ))}

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Subscribe to our newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The latest news, articles, and resources, sent to your inbox weekly.
            </Typography>
            <Box component="form" sx={{ display: 'flex', gap: 1 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flexGrow: 1,
                  padding: theme.spacing(1, 2),
                  borderRadius: theme.shape.borderRadius,
                  border: `1px solid ${theme.palette.divider}`,
                  fontSize: '0.875rem',
                  '&:focus': {
                    outline: 'none',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  border: 'none',
                  borderRadius: theme.shape.borderRadius,
                  padding: theme.spacing(1, 2),
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <Email fontSize="small" />
              </button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} EventEase. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              variant="body2"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              variant="body2"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="/cookies"
              color="text.secondary"
              variant="body2"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;