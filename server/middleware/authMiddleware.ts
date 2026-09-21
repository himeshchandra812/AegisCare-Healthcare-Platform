import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken, TokenPayload } from '../auth/tokens';
import { db } from '../db/database';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token required in Authorization header (Bearer <token>)',
      },
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const { valid, payload, error } = verifyAuthToken(token);

  if (!valid || !payload) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: error || 'Invalid or expired session token',
      },
    });
    return;
  }

  // Ensure user is still active in database
  const user = db.findUserById(payload.userId);
  if (!user || !user.isActive) {
    res.status(401).json({
      success: false,
      error: {
        code: 'USER_INACTIVE',
        message: 'User account is inactive or no longer exists',
      },
    });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Optional Auth - populates req.user if valid token provided, but doesn't block if missing
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const { valid, payload } = verifyAuthToken(token);
    if (valid && payload) {
      req.user = payload;
    }
  }
  next();
}
