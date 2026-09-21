import { Router, Response } from 'express';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

export const hospitalRouter = Router();

/**
 * GET /api/hospitals
 * List all hospitals with real-time bed capacity and specialty status
 */
hospitalRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const hospitals = db.getAllHospitals();
  res.json({ success: true, data: { hospitals } });
});

/**
 * GET /api/hospitals/:id
 * Get details for a specific hospital
 */
hospitalRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const hospital = db.findHospitalById(req.params.id);
  if (!hospital) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Hospital not found' } });
    return;
  }
  res.json({ success: true, data: { hospital } });
});

/**
 * PUT /api/hospitals/:id/beds
 * Update ER and ICU bed availability (Hospital Admins and Doctors)
 */
hospitalRouter.put(
  '/:id/beds',
  requireAuth,
  requireRole(['hospital_admin', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { availableBeds, availableIcuBeds } = req.body;

    const updated = await db.updateHospitalBeds(
      req.params.id,
      Number(availableBeds) || 0,
      Number(availableIcuBeds) || 0
    );

    if (!updated) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Hospital not found' } });
      return;
    }

    await db.logAuditEvent({
      actorId: req.user!.userId,
      actorRole: req.user!.role,
      actorName: req.user!.name,
      actionType: 'UPDATE_BEDS',
      resourceType: 'Hospital',
      resourceId: updated.id,
      reason: `Updated ER available beds to ${availableBeds} and ICU beds to ${availableIcuBeds}`,
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      status: 'SUCCESS',
    });

    res.json({ success: true, data: { hospital: updated } });
  }
);

/**
 * GET /api/hospitals/:id/resource-preps
 * Get incoming emergency prep statuses for hospital
 */
hospitalRouter.get('/:id/resource-preps', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const preps = db.getResourcePrepsForHospital(req.params.id);
  res.json({ success: true, data: { resourcePreps: preps } });
});

/**
 * PUT /api/hospitals/resource-preps/:caseId
 * Update resource prep status for an inbound emergency
 */
hospitalRouter.put(
  '/resource-preps/:caseId',
  requireAuth,
  requireRole(['doctor', 'hospital_admin', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { assignedBay, traumaTeamNotified, cathLabReserved, strokeTeamAlerted, bloodBankAlerted, prepStatus, notes } = req.body;

    const updatedPrep = await db.updateHospitalResourcePrep(req.params.caseId, {
      assignedBay,
      traumaTeamNotified,
      cathLabReserved,
      strokeTeamAlerted,
      bloodBankAlerted,
      prepStatus,
      notes,
    });

    res.json({ success: true, data: { resourcePrep: updatedPrep } });
  }
);
