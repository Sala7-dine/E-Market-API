import * as authService from '../services/authService.js';

export async function register(req, res) {
    try {
        const user = await authService.register(req.body);
        console.log(user);
        res.status(201).json({ message: 'Utilisateur créé', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function login(req, res) {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        res.json({ user, accessToken, refreshToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function refresh(req, res) {
    try {
        const token = req.body.refreshToken;
        const newAccessToken = await authService.refresh(token);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}


export async function logout(req, res) {
    try {
        const token = req.body.refreshToken;
        if (!token) {
            return res.status(400).json({ error: 'refreshToken requis' });
        }

        const result = await authService.logout(token);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}
