import { loginRateLimiter , categoryRateLimiter , productRateLimiter , registerRateLimiter } from '../config/rateLimiter.js';

export const loginLimiter = loginRateLimiter;
export const registerLimiter = registerRateLimiter;
export const productLimiter = productRateLimiter;
export const categoryLimiter = categoryRateLimiter;
