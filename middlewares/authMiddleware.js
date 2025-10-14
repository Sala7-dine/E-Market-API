import { verifyAccessToken } from '../utils/tokens.js';
import User from '../models/User.js';

export async function authenticate(req, res, next) {
    try {
        const header = req.headers['authorization'];
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const token = header.split(' ')[1];
        const payload = verifyAccessToken(token);

        const user = await User.findById(payload.sub).select('-passwordHash');
        if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
}
