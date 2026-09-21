import { Router, Response } from 'express';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import { DBEmergencyCase } from '../db/schema';

export const emergencyRouter = Router();

/**
 * GET /api/emergency/cases
 * List active emergency cases
 */
emergencyRouter.get('/cases', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const cases = db.getAllEmergencyCases();
  res.json({ success: true, data: { cases } });
});

/**
 * GET /api/emergency/cases/:caseId
 * Get specific case details
 */
emergencyRouter.get('/cases/:caseId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const emergencyCase = db.findEmergencyCaseById(req.params.caseId);
  if (!emergencyCase) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Emergency case not found' } });
    return;
  }
  res.json({ success: true, data: { case: emergencyCase } });
});

/**
 * POST /api/emergency/sos
 * Trigger a 1-Touch 112 SOS Emergency Dispatch
 */
emergencyRouter.post('/sos', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { chiefComplaint, severity, pickupAddress, lat, lng, clientRequestId } = req.body;
  const user = req.user!;

  // Idempotency check: If an emergency case with the same clientRequestId exists, return it cleanly
  if (clientRequestId && typeof clientRequestId === 'string') {
    const existingCase = db.findEmergencyCaseByClientRequestId(clientRequestId);
    if (existingCase) {
      res.json({
        success: true,
        data: {
          case: existingCase,
          message: 'Existing emergency case retrieved (idempotent request deduplicated).',
          isDuplicate: true,
          dispatchSyncStatus: 'synced_server',
        },
      });
      return;
    }
  }

  const patient = db.findPatientByUserId(user.userId) || db.findPatientById(user.associatedPatientId || 'pat-1');

  const newCase: Omit<DBEmergencyCase, 'id' | 'createdAt' | 'updatedAt'> = {
    caseNumber: `EMR-HYD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    clientRequestId: clientRequestId || undefined,
    dispatchSyncStatus: 'synced_server',
    patientId: patient ? patient.id : 'pat-1',
    patientName: patient ? patient.name : user.name,
    patientAge: patient ? patient.age : 68,
    patientGender: patient ? patient.gender : 'Male',
    chiefComplaint: chiefComplaint || 'Acute Emergency SOS Signal Triggered by Patient',
    severity: severity || 'Critical',
    status: 'Dispatched',
    reportedAt: new Date().toISOString(),
    pickupLocation: {
      address: pickupAddress || 'Banjara Hills Road No 10, Hyderabad',
      landmark: 'Near City Center',
      lat: lat || 17.4156,
      lng: lng || 78.4357,
    },
    assignedAmbulanceId: 'amb-1',
    assignedHospitalId: 'hosp-1',
    assignedEmtName: 'Vikram Singh, EMT-P',
    careCategoryRequired: 'Acute Emergency Resuscitation',
    notes: [
      `SOS signal triggered at ${new Date().toLocaleTimeString('en-IN')}`,
      'Central 108 Dispatch automatically routing nearest ALS Unit 108-HYD-42',
      'Apollo Health City Emergency Department alerted for incoming intake',
    ],
  };

  const createdCase = await db.createEmergencyCase(newCase);

  // Update ambulance to In Transit
  await db.updateAmbulance('amb-1', {
    status: 'In Transit',
    currentCaseId: createdCase.id,
    greenCorridorActive: true,
  });

  // Create notifications
  await db.addNotification({
    targetRole: 'doctor',
    title: `STAT ALERT: New Emergency Case ${createdCase.caseNumber}`,
    message: `${createdCase.patientName} (${createdCase.patientAge}y) - ${createdCase.chiefComplaint}. ALS 108 inbound.`,
    severity: 'critical',
    read: false,
  });

  await db.addNotification({
    targetRole: 'hospital_admin',
    title: `Inbound Emergency: ${createdCase.caseNumber}`,
    message: `Apollo Jubilee Hills Trauma Bay requested for incoming patient ${createdCase.patientName}.`,
    severity: 'urgent',
    read: false,
  });

  // Audit event
  await db.logAuditEvent({
    actorId: user.userId,
    actorRole: user.role,
    actorName: user.name,
    actionType: 'DISPATCH_AMBULANCE',
    resourceType: 'EmergencyCase',
    resourceId: createdCase.id,
    reason: `Initiated emergency SOS dispatch for case ${createdCase.caseNumber}`,
    ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.json({
    success: true,
    data: {
      case: createdCase,
      message: 'Simulated 112 Emergency Dispatch successfully initiated.',
    },
  });
});

/**
 * PUT /api/emergency/cases/:caseId/status
 * Update status of an ongoing emergency case
 */
emergencyRouter.put(
  '/cases/:caseId/status',
  requireAuth,
  requireRole(['doctor', 'emt', 'ambulance_operator', 'hospital_admin', 'system_admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { status, note } = req.body;
    const emergencyCase = db.findEmergencyCaseById(req.params.caseId);

    if (!emergencyCase) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Emergency case not found' } });
      return;
    }

    const updatedNotes = note ? [...emergencyCase.notes, `${new Date().toLocaleTimeString('en-IN')}: ${note}`] : emergencyCase.notes;

    const updated = await db.updateEmergencyCase(req.params.caseId, {
      status,
      notes: updatedNotes,
    });

    res.json({ success: true, data: { case: updated } });
  }
);
