/**
 * AegisCare Security & Protection Middleware
 * Rate Limiting, Security Headers, Input Sanitization, and PII Masking
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

// In-Memory Rate Limiter Store (Sliding Window per IP)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale IP entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * IP Rate Limiting Middleware
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  let record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitStore.set(ip, record);
  } else {
    record.count++;
  }

  // Set standard rate limit headers
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

  if (record.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please slow down and try again shortly.',
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      },
    });
  }

  next();
}

/**
 * Standard Security Headers (compatible with Google AI Studio iframe environment)
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  // Avoid restrictive X-Frame-Options: DENY because AI Studio runs in an authorized iframe
  res.setHeader('X-Download-Options', 'noopen');
  next();
}

/**
 * Basic Input Sanitization helper to neutralize malicious HTML/script injections
 */
function sanitizeString(str: string): string {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '');
}

export function sanitizeInputs(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
}

/**
 * PII Masking utility for audit trails and logs
 */
export function maskSensitiveData(data: Record<string, any>): Record<string, any> {
  const masked = { ...data };
  if (masked.password) masked.password = '********';
  if (masked.passwordHash) masked.passwordHash = '********';
  if (masked.salt) masked.salt = '********';
  if (masked.token) masked.token = `${String(masked.token).slice(0, 8)}...`;
  if (masked.phone) {
    const p = String(masked.phone);
    masked.phone = p.length > 5 ? `${p.slice(0, 3)}****${p.slice(-2)}` : '****';
  }
  return masked;
}
