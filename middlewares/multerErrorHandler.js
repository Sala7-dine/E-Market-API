import multer from 'multer';

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 10MB)' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Trop de fichiers (max 5)' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Champ de fichier inattendu' });
    }
    return res.status(400).json({ error: 'Erreur de téléchargement de fichier' });
   }
  if (err.message === 'Type de fichier non autorisé') {
    return res.status(400).json({ error: 'Type de fichier non autorisé. Utilisez: jpg, jpeg, png, gif, webp' });
  }
  next(err);
};
