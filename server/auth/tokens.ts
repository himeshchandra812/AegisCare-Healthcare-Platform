import crypto from 'node:crypto';
import { UserRole } from '../db/schema';

// Secure server-side secret with fallback for development
export const JWT_SECRET = process.env.JWT_SECRET || 'aegiscare-hyderabad-node-emergency-secret-key-2026';
export const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  associatedHospitalId?: string;
  associatedAmbulanceId?: string;
  associatedPatientId?: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Hash a password using PBKDF2 with a unique cryptographically random salt
 */
export function hashPassword(plainPassword: string, salt?: string): { hash: string; salt: string } {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plainPassword, passwordSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: passwordSalt };
}

/**
 * Verify a plain password against stored salt and hash in constant time
 */
export function verifyPassword(plainPassword: string, storedHash: string, storedSalt: string): boolean {
  const { hash } = hashPassword(plainPassword, storedSalt);
  try {
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically signed HMAC-SHA256 Auth Token
 */
export function generateAuthToken(payload: Omit<TokenPayload, 'issuedAt' | 'expiresAt'>): string {
  const now = Date.now();
  const fullPayload: TokenPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + TOKEN_EXPIRY_MS,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode an Auth Token
 */
export function verifyAuthToken(token: string): { valid: boolean; payload?: TokenPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing or invalid format' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  // Verify signature in constant time
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  try {
    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
      return { valid: false, error: 'Invalid token signature' };
    }
  } catch {
    return { valid: false, error: 'Signature verification failure' };
  }

  try {
    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload: TokenPayload = JSON.parse(payloadJson);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Token has expired' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Invalid token payload' };
  }
}
