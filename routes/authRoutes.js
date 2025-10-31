import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
} from '../controllers/authController.js';
import dotenv from 'dotenv';
import {
  loginLimiter,
  registerLimiter,
} from '../middlewares/rateLimiterMiddleware.js';

dotenv.config();
const router = express.Router();

// helper pour set cookie
// function setRefreshCookie(res, token) {
//     const cookieOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // true en prod
//         sameSite: 'lax',
//         domain: process.env.COOKIE_DOMAIN,
//         maxAge: 1000 * 60 * 60 * 24 * 30 // 30 jours en ms (doit matcher REFRESH_EXP)
//     };
//     res.cookie('refreshToken', token, cookieOptions);
// }

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);

router.post('/logout', logout);

// // Protected example routes
// router.get('/profile', authenticate, (req, res) => {
//     res.json(req.user);
// });
//
// // Example role-based routes
// router.get('/admin', authenticate, authorizeRoles('admin'), (req, res) => {
//     res.json({ message: 'Bienvenue admin' });
// });
//
// router.get('/seller', authenticate, authorizeRoles('seller'), (req, res) => {
//     res.json({ message: 'Bienvenue vendeur' });
// });

export default router;
