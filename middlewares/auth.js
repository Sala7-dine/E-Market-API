import { verifyAccessToken } from '../utils/tokens.js';
import User from '../models/User.js';

export async function authenticate(req, res, next) {
    try {
        const auth = req.headers['authorization'];
        if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
        const token = auth.split(' ')[1];
        const payload = verifyAccessToken(token); // throws si invalide
        // ici payload.sub contient user id par construction
        const user = await User.findById(payload.sub).select('-passwordHash');
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = { id: user._id, email: user.email, roles: user.roles, name: user.name };
        next();
    } catch (err) {
        console.error('auth error', err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}


