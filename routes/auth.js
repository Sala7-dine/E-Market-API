import express from 'express';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken, generateJti } from '../utils/tokens.js';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

const router = express.Router();

// helper pour set cookie
function setRefreshCookie(res, token) {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true en prod
        sameSite: 'lax',
        domain: process.env.COOKIE_DOMAIN,
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 jours en ms (doit matcher REFRESH_EXP)
    };
    res.cookie('refreshToken', token, cookieOptions);
}

// REGISTER
router.post('/register', async (req,res) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'email & password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'email already used' });

        const user = new User({ email, fullName });
        await user.setPassword(password);
        await user.save();

        res.status(201).json({ message: 'user created' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// LOGIN -> issue access + refresh (refresh en cookie HttpOnly)
router.post('/login', async (req,res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'email & password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'invalid credentials' });

        const valid = await user.validatePassword(password);
        if (!valid) return res.status(400).json({ error: 'invalid credentials' });

        // payload minimal pour access token
        const accessPayload = { sub: user._id.toString(), roles: user.roles };
        const accessToken = signAccessToken(accessPayload);

        // refresh token generation + store hashed version
        const jti = generateJti(); // unique id for the refresh token
        const refreshPayload = { sub: user._id.toString(), jti };
        const refreshToken = signRefreshToken(refreshPayload);

        // hash refresh token before storing to DB
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30d, keep in env ideally

        await RefreshToken.create({
            user: user._id,
            jti,
            tokenHash,
            expiresAt
        });

        // set cookie (HttpOnly) with refresh token
        setRefreshCookie(res, refreshToken);

        res.json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// REFRESH -> rotate refresh token: revoke old, issue new refresh + access
router.post('/refresh', async (req,res) => {
    try {
        // read refresh token from cookie (recommended) or from body
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token) return res.status(401).json({ error: 'No refresh token' });

        let payload;
        try {
            payload = verifyRefreshToken(token); // verifies signature & exp
        } catch (err) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const { sub: userId, jti } = payload;

        // find stored refresh token by jti
        const stored = await RefreshToken.findOne({ jti });
        if (!stored) {
            // token not found => possible reuse attack
            console.warn('Refresh token reuse or missing: jti not found', jti);
            return res.status(401).json({ error: 'Refresh token not found' });
        }

        // check if token active
        if (stored.revoked) {
            // token was revoked -> possible reuse attack
            console.warn('Refresh token revoked - possible reuse', jti);
            return res.status(401).json({ error: 'Refresh token revoked' });
        }

        // compare hashed token to protect if DB leaked
        const match = await bcrypt.compare(token, stored.tokenHash);
        if (!match) {
            // token mismatch -> possible theft or tampering
            console.warn('Refresh token hash mismatch - possible reuse', jti);
            // revoke all tokens for user as mitigation if wanted
            stored.revoked = true;
            await stored.save();
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // rotate: create new refresh token and revoke old
        const newJti = generateJti();
        const newRefreshPayload = { sub: userId, jti: newJti };
        const newRefreshToken = signRefreshToken(newRefreshPayload);
        const newTokenHash = await bcrypt.hash(newRefreshToken, 10);
        const newExpiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));

        // mark old as revoked and set replacedByToken
        stored.revoked = true;
        stored.replacedByToken = newJti;
        await stored.save();

        // save new token
        await RefreshToken.create({
            user: userId,
            jti: newJti,
            tokenHash: newTokenHash,
            expiresAt: newExpiresAt
        });

        // issue new access token
        const accessPayload = { sub: userId }; // optionally roles etc.
        const accessToken = signAccessToken(accessPayload);

        // set cookie for new refresh token
        setRefreshCookie(res, newRefreshToken);

        res.json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
});

// LOGOUT -> revoke current refresh token (cookie must be present)
router.post('/logout', async (req,res) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token) {
            res.clearCookie('refreshToken');
            return res.json({ message: 'logged out' });
        }

        let payload;
        try {
            payload = verifyRefreshToken(token);
        } catch (err) {
            res.clearCookie('refreshToken');
            return res.json({ message: 'logged out' });
        }

        const { jti } = payload;
        const stored = await RefreshToken.findOne({ jti });
        if (stored) {
            stored.revoked = true;
            await stored.save();
        }

        res.clearCookie('refreshToken');
        res.json({ message: 'logged out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
});

export default router;
