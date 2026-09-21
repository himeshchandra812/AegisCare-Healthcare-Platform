import { Router, Response } from 'express';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

export const familyRouter = Router();

/**
 * GET /api/family/relationships
 * List linked family members / caregivers for the current authenticated user
 */
familyRouter.get('/relationships', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const relationships = db.getFamilyRelationshipsForUser(user.userId);
  res.json({ success: true, data: { relationships } });
});

/**
 * GET /api/family/consents/:patientId
 * Get consent records for a patient
 */
familyRouter.get('/consents/:patientId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const consents = db.getConsentRecordsForPatient(req.params.patientId);
  res.json({ success: true, data: { consents } });
});

/**
 * POST /api/family/consents/toggle
 * Grant or revoke digital caregiver consent
 */
familyRouter.post(
  '/consents/toggle',
  requireAuth,
  requireRole(['patient', 'family_member', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { patientId, authorizedUserId, active } = req.body;

    if (!patientId || !authorizedUserId) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'patientId and authorizedUserId are required' },
      });
      return;
    }

    const consent = await db.toggleCaregiverConsent(patientId, authorizedUserId, Boolean(active));

    await db.logAuditEvent({
      actorId: req.user!.userId,
      actorRole: req.user!.role,
      actorName: req.user!.name,
      actionType: active ? 'GRANT_CONSENT' : 'REVOKE_CONSENT',
      resourceType: 'ConsentRecord',
      resourceId: consent.id,
      reason: `${active ? 'Granted' : 'Revoked'} caregiver access permissions for patient ${patientId}`,
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      status: 'SUCCESS',
    });

    res.json({ success: true, data: { consent } });
  }
);
