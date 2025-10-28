import {
  loginRateLimiter,
  categoryRateLimiter,
  productRateLimiter,
  registerRateLimiter,
} from "../config/rateLimiter.js";

// Middleware qui désactive le rate limiting en mode test
const skipInTest = (limiter) => {
  return (req, res, next) => {
    if (process.env.NODE_ENV === "test") {
      return next();
    }
    return limiter(req, res, next);
  };
};

export const loginLimiter = skipInTest(loginRateLimiter);
export const registerLimiter = skipInTest(registerRateLimiter);
export const productLimiter = skipInTest(productRateLimiter);
export const categoryLimiter = skipInTest(categoryRateLimiter);
