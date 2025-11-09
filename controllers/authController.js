import * as authService from '../services/authService.js';

export async function register(req, res) {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


// Login : envoie accessToken dans body, refreshToken dans cookie HTTP-only
export async function login(req, res) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    // Stocker le refreshToken dans un cookie HTTP-only
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // HTTPS en prod
      sameSite: 'None', // obligatoire pour cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.json({ user, accessToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Refresh : lit le refreshToken depuis le cookie
export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'refreshToken manquant' });
    }

    const newAccessToken = await authService.refresh(token);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

// Logout : lit le refreshToken depuis le cookie et le supprime
export async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(400).json({ error: 'refreshToken requis' });
    }

    await authService.logout(token);

    // Supprime le cookie côté client
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    });

    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}