import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Trop de tentatives de connexion. Réessayez plus tart.",
  },
  standardHeaders: true, // ajoute les headers RateLimit
  legacyHeaders: false, // désactive les anciens headers
});

export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    error: "Trop de tentatives de création de compte. Réessayez plus tart.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const productRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Trop de tentatives de création de produit. Réessayez plus tart.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const categoryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Trop de tentatives de création de categorie. Réessayez plus tart.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
