// server/crypto.js - AES-256-GCM Encryption & Cryptographic Tokenization Engine for CivicOne Vault

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// Default 256-bit encryption key (must be 32 bytes)
const ENCRYPTION_KEY = Buffer.from(
  process.env.ENCRYPTION_KEY || 'civicone_secret_key_32bytes_v1!!',
  'utf-8'
).slice(0, 32);

/**
 * Encrypt plain text payload using AES-256-GCM
 * @param {string} text Plaintext content
 * @returns {object} { encryptedData, iv, authTag }
 */
export function encryptData(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag
  };
}

/**
 * Decrypt AES-256-GCM encrypted payload
 * @param {string} encryptedData 
 * @param {string} ivHex 
 * @param {string} authTagHex 
 */
export function decryptData(encryptedData, ivHex, authTagHex) {
  if (!encryptedData || !ivHex || !authTagHex) return null;
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error("AES-256 Decryption Error:", err.message);
    return null;
  }
}

/**
 * Generate a SHA-256 Cryptographic Identity Hash for documents
 * @param {string} content 
 */
export function generateSHA256(content) {
  return crypto.createHash('sha256').update(content || '').digest('hex');
}
