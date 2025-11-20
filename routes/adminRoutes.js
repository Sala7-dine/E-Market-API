import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';
import { GetAllReviews, DeleteReview } from '../controllers/reviewController.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Promouvoir un user en seller
router.patch(
  '/users/:userId/promote',
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['user', 'seller'].includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true },
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        success: true,
        message: `Utilisateur ${role === 'seller' ? 'promu en vendeur' : 'rétrogradé en utilisateur'}`,
        data: user,
      });
    } catch {
      res.status(500).json({ error: 'Erreur lors de la modification du rôle' });
    }
  },
);

// Accéder aux logs applicatifs
router.get('/logs', authenticate, requireAdmin, (req, res) => {
  try {
    const logsDir = 'public';
    const logFiles = fs
      .readdirSync(logsDir)
      .filter((file) => file.includes('logs') && file.endsWith('.log'))
      .map((file) => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          modified: stats.mtime,
        };
      });

    res.json({
      success: true,
      logs: logFiles,
    });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la lecture des logs' });
  }
});

// Lire un fichier de log spécifique
router.get('/logs/:filename', authenticate, requireAdmin, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join('public', filename);

    if (!fs.existsSync(filePath) || !filename.includes('logs')) {
      return res.status(404).json({ error: 'Fichier de log non trouvé' });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    res.json({
      success: true,
      filename,
      content: content.split('\n').slice(-100), // Dernières 100 lignes
    });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
  }
});

// Gestion des avis
router.get('/reviews', authenticate, requireAdmin, GetAllReviews);
router.delete('/reviews/:productId/:reviewId', authenticate, requireAdmin, DeleteReview);

export default router;
