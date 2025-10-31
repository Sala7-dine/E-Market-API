import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export const compressImages = (
  destination,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 80,
) => {
  return async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      if (!req.file) return next();

      // Single file
      try {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const filepath = path.join('public', destination, filename);

        await sharp(req.file.buffer)
          .resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality })
          .toFile(filepath);

        req.file.filename = filename;
        req.file.mimetype = 'image/webp';
        req.file.size = (await fs.stat(filepath)).size;
        next();
      } catch (err) {
        next(err);
      }
    } else {
      // Multiple files
      try {
        req.compressedFiles = await Promise.all(
          req.files.map(async (file) => {
            const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
            const filepath = path.join('public', destination, filename);

            await sharp(file.buffer)
              .resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
              })
              .webp({ quality })
              .toFile(filepath);

            return {
              filename,
              mimetype: 'image/webp',
              size: (await fs.stat(filepath)).size,
            };
          }),
        );
        next();
      } catch (err) {
        next(err);
      }
    }
  };
};
