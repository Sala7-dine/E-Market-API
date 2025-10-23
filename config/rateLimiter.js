import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
    windowMs: 1 * 60 * 5000,
    max: 5,
    message: {
        status: 429,
        error: 'Trop de tentatives de connexion. Réessayez plus tart.',
    },
    standardHeaders: true, // ajoute les headers RateLimit
    legacyHeaders: false,  // désactive les anciens headers
});

export const registerRateLimiter = rateLimit({
    windowMs: 1 * 60 * 2000,
    max: 10,
    message: {
        status: 429,
        error: 'Trop de tentatives de création de compte. Réessayez plus tart.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const productRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: {
        status: 429,
        error: 'Trop de tentatives de création de produit. Réessayez plus tart.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const categoryRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: {
        status: 429,
        error: 'Trop de tentatives de création de categorie. Réessayez plus tart.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});


