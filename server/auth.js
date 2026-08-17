// server/auth.js - JWT Authentication & Cryptographic Utilities for CivicOne

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'civicone_super_secret_jwt_key_2026_prod_token';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Hash a plain text password or PIN using Bcrypt
 */
export async function hashPassword(plainText) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
}

/**
 * Compare plain text password against hashed password
 */
export async function comparePassword(plainText, hashed) {
  if (!plainText || !hashed) return false;
  return await bcrypt.compare(plainText, hashed);
}

/**
 * Issue a signed JWT token containing user identity claims & role
 * @param {Object} payload { userId, citizenId, role, department, state }
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify & decode a JWT token string
 * @param {string} token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
