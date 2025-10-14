import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import bcrypt from "bcryptjs";
import {generateJti, signAccessToken, signRefreshToken, verifyRefreshToken} from '../utils/tokens.js';

export async function register({ email, password, fullName, roles }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email déjà utilisé');

    const user = new User({ email, fullName, roles });
    await user.setPassword(password);
    await user.save();

    return user;
}


export async function login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
        throw new Error('Email ou mot de passe incorrect');
    }

    const jti = generateJti();

    const refreshToken = signRefreshToken({ sub: user._id, jti });

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
        user: user._id,
        jti,
        tokenHash,
        expiresAt,
    });

    const accessToken = signAccessToken({ sub: user._id, roles: user.roles });
    return { user, accessToken, refreshToken };
}

export async function refresh(token) {
    const payload = verifyRefreshToken(token);
    const stored = await RefreshToken.findOne({ token });
    if (!stored) throw new Error('Refresh token invalide');

    const newAccessToken = signAccessToken({ sub: payload.sub });
    return newAccessToken;
}

export async function logout(token) {
    const decoded = verifyRefreshToken(token);
    await RefreshToken.findOneAndDelete({ token });
    return { message: 'Déconnexion réussie' };
}
