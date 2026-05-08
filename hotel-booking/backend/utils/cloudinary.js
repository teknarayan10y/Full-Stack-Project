const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {string} file - Base64 encoded file
 * @returns {Promise<Object>} Cloudinary upload response
 */
exports.uploadToCloudinary = async (filePath) => {
  try {
    console.log('Starting Cloudinary upload for:', filePath);
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'hotel-booking',
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('Cloudinary upload successful:', {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      size: result.bytes
    });

    return result;
  } catch (error) {
    console.error('Cloudinary upload failed:', error?.message || error);
    throw new Error(`Failed to upload image: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} Cloudinary deletion response
 */
exports.deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};
