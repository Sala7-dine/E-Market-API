import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import bcrypt from "bcryptjs";
import {
  generateJti,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";
import logger from "../config/logger.js";

export async function register({ email, password, fullName, roles }) {
  try {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email déjà utilisé");

    const user = new User({ email, fullName, roles });
    await user.setPassword(password);
    await user.save();
    logger.info(`User registered: ${email}`);
    return user;
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      logger.warn(`Failed login attempt for: ${email}`);
      throw new Error("Email ou mot de passe incorrect");
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
    logger.info(`User logged in: ${email}`);
    return { user, accessToken, refreshToken };
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    throw err;
  }
}

export async function refresh(token) {
  if (!token) {
    throw new Error("Refresh token requis");
  }
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new Error("Refresh token invalide");
  }

  const stored = await RefreshToken.findOne({ jti: payload.jti });
  if (!stored) throw new Error("Refresh token invalide");
  if (stored.revoked) throw new Error("Refresh token invalide");
  if (stored.expiresAt && Date.now() >= stored.expiresAt.getTime()) {
    throw new Error("Refresh token invalide");
  }

  const isMatch = await bcrypt.compare(token, stored.tokenHash);
  if (!isMatch) throw new Error("Refresh token invalide");

  return signAccessToken({ sub: payload.sub });
}

export async function logout(token) {
  try {
    const decoded = verifyRefreshToken(token);

    // Invalidate the stored refresh token by its jti
    await RefreshToken.findOneAndDelete({ jti: decoded.jti });

    logger.info(`User logged out: ${decoded.sub}`);
    return { message: "Déconnexion réussie" };
  } catch (err) {
    logger.error(`Logout error: ${err.message}`);
    throw err;
  }
}
