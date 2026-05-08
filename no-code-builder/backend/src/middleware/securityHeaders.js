/**
 * Middleware to set security and caching headers
 */
const securityHeaders = (req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Use Content-Security-Policy instead of X-Frame-Options
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  
  // Remove deprecated headers
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('X-Frame-Options');
  
  // Modern caching headers instead of Expires
  res.setHeader('Cache-Control', 'max-age=31536000, public, immutable');
  res.removeHeader('Expires');
  
  // Ensure proper charset in Content-Type
  if (res.getHeader('Content-Type') && !res.getHeader('Content-Type').includes('charset=utf-8')) {
    const contentType = res.getHeader('Content-Type');
    res.setHeader('Content-Type', `${contentType}; charset=utf-8`);
  }
  
  next();
};

module.exports = securityHeaders;
