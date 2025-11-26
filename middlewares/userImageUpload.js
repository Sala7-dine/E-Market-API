import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadUserImageToCloudinary = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    const result = await cloudinary.uploader.upload(
      `data:image/webp;base64,${compressedBuffer.toString('base64')}`,
      {
        folder: 'users/avatars',
        resource_type: 'image'
      }
    );

    req.file.cloudinaryUrl = result.secure_url;
    req.file.cloudinaryId = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
};

export const deleteUserImageFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error('Error deleting image from Cloudinary:', err);
  }
};