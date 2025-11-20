import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadToCloudinary = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    if (!req.file) return next();

    // Single file
    try {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const result = await cloudinary.uploader.upload(
        `data:image/webp;base64,${compressedBuffer.toString('base64')}`,
        {
          folder: 'products',
          resource_type: 'image'
        }
      );

      req.file.filename = result.public_id;
      req.file.url = result.secure_url;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    // Multiple files
    try {
      req.compressedFiles = await Promise.all(
        req.files.map(async (file) => {
          const compressedBuffer = await sharp(file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          const result = await cloudinary.uploader.upload(
            `data:image/webp;base64,${compressedBuffer.toString('base64')}`,
            {
              folder: 'products',
              resource_type: 'image'
            }
          );

          return {
            filename: result.public_id,
            url: result.secure_url,
            mimetype: 'image/webp',
            size: compressedBuffer.length,
          };
        })
      );
      next();
    } catch (err) {
      next(err);
    }
  }
};