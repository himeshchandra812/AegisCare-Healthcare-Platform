import { Router, Response } from 'express';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import { DBClinicalOrder } from '../db/schema';

export const doctorRouter = Router();

/**
 * GET /api/doctors
 * List on-duty doctors
 */
doctorRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const doctors = db.getAllDoctors();
  res.json({ success: true, data: { doctors } });
});

/**
 * GET /api/doctors/orders/:caseId
 * Get clinical orders issued for an emergency case
 */
doctorRouter.get('/orders/:caseId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const orders = db.getClinicalOrdersForCase(req.params.caseId);
  res.json({ success: true, data: { orders } });
});

/**
 * POST /api/doctors/orders
 * Issue a new clinical order (Physicians & System Admins)
 */
doctorRouter.post(
  '/orders',
  requireAuth,
  requireRole(['doctor', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { caseId, orderText, category } = req.body;

    if (!caseId || !orderText) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'caseId and orderText are required' },
      });
      return;
    }

    const doctor = db.findDoctorByUserId(req.user!.userId);
    const doctorName = doctor ? doctor.name : req.user!.name;

    const newOrder: Omit<DBClinicalOrder, 'id' | 'timestamp'> = {
      caseId,
      doctorId: doctor ? doctor.id : 'doc-1',
      doctorName,
      orderText,
      category: category || 'Medication',
      status: 'Ordered',
    };

    const createdOrder = await db.createClinicalOrder(newOrder);

    // Create notification for EMT
    await db.addNotification({
      targetRole: 'emt',
      title: `Physician Order Issued: ${doctorName}`,
      message: `${orderText} (Case: ${caseId})`,
      severity: 'urgent',
      read: false,
    });

    // Audit order issuance
    await db.logAuditEvent({
      actorId: req.user!.userId,
      actorRole: req.user!.role,
      actorName: req.user!.name,
      actionType: 'ISSUE_ORDER',
      resourceType: 'ClinicalOrder',
      resourceId: createdOrder.id,
      reason: `Physician issued clinical order for emergency case ${caseId}`,
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      status: 'SUCCESS',
    });

    res.json({ success: true, data: { order: createdOrder } });
  }
);

/**
 * PUT /api/doctors/orders/:id/status
 * Update order administration status (EMT administers, Doctor signs)
 */
doctorRouter.put(
  '/orders/:id/status',
  requireAuth,
  requireRole(['emt', 'doctor', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;
    const updated = await db.updateClinicalOrderStatus(req.params.id, status);

    if (!updated) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
      return;
    }

    res.json({ success: true, data: { order: updated } });
  }
);
