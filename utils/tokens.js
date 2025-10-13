import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";

dotenv.config();

const ACCESS_EXP = process.env.ACCESS_TOKEN_EXP || '15m';
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXP || '30d';
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export function signAccessToken(payload) {
    // payload should include minimal claims (sub, roles, maybe name)
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

export function signRefreshToken(payload) {
    // we include jti inside payload
    // payload minimal: { sub: userId, jti: uuid }
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}

export function generateJti() {
    return uuidv4();
}
