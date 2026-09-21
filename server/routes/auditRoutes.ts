import { Router, Response } from 'express';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

export const auditRouter = Router();

/**
 * GET /api/audit/logs
 * Retrieve audit trail records (System Administrator only)
 */
auditRouter.get(
  '/logs',
  requireAuth,
  requireRole(['system_admin']),
  (req: AuthenticatedRequest, res: Response) => {
    const limit = Number(req.query.limit) || 100;
    const logs = db.getAuditEvents(limit);
    res.json({ success: true, data: { logs } });
  }
);
