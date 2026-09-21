import { Router, Response } from 'express';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requirePatientAccess } from '../middleware/rbacMiddleware';

export const patientRouter = Router();

/**
 * GET /api/patients
 * List patients (Doctors/Admins see all; patients/families see self/linked)
 */
patientRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const allPatients = db.getAllPatients();

  if (user.role === 'patient') {
    const self = allPatients.filter((p) => p.userId === user.userId || p.id === user.associatedPatientId);
    res.json({ success: true, data: { patients: self } });
    return;
  }

  if (user.role === 'family_member') {
    const relationships = db.getFamilyRelationshipsForUser(user.userId);
    const patientIds = relationships.map((r) => r.patientId);
    const familyPatients = allPatients.filter((p) => patientIds.includes(p.id) || p.id === user.associatedPatientId);
    res.json({ success: true, data: { patients: familyPatients } });
    return;
  }

  // Clinical / Admin roles
  res.json({ success: true, data: { patients: allPatients } });
});

/**
 * GET /api/patients/:patientId
 * Get specific patient record with RBAC check
 */
patientRouter.get('/:patientId', requireAuth, requirePatientAccess('patientId'), async (req: AuthenticatedRequest, res: Response) => {
  const patient = db.findPatientById(req.params.patientId);
  if (!patient) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Patient not found' } });
    return;
  }

  // Audit medical record read
  await db.logAuditEvent({
    actorId: req.user!.userId,
    actorRole: req.user!.role,
    actorName: req.user!.name,
    actionType: 'VIEW_RECORD',
    resourceType: 'Patient',
    resourceId: patient.id,
    reason: `Viewed patient profile for ${patient.name}`,
    ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.json({ success: true, data: { patient } });
});

/**
 * GET /api/patients/:patientId/medical-profile
 * Retrieve medical profile with allergies, chronic conditions, and medications
 */
patientRouter.get('/:patientId/medical-profile', requireAuth, requirePatientAccess('patientId'), async (req: AuthenticatedRequest, res: Response) => {
  const profile = db.findMedicalProfileByPatientId(req.params.patientId);
  if (!profile) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Medical profile not found' } });
    return;
  }

  // Audit medical profile read
  await db.logAuditEvent({
    actorId: req.user!.userId,
    actorRole: req.user!.role,
    actorName: req.user!.name,
    actionType: 'VIEW_RECORD',
    resourceType: 'MedicalProfile',
    resourceId: profile.id,
    reason: `Accessed sensitive medical history for patient ID ${req.params.patientId}`,
    ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.json({ success: true, data: { medicalProfile: profile } });
});

/**
 * PUT /api/patients/:patientId/medical-profile
 * Update medical profile (allergies, emergency contacts, conditions)
 */
patientRouter.put('/:patientId/medical-profile', requireAuth, requirePatientAccess('patientId'), async (req: AuthenticatedRequest, res: Response) => {
  const { allergies, chronicConditions, currentMedications, emergencyContact } = req.body;

  const updated = await db.updateMedicalProfile(req.params.patientId, {
    allergies: Array.isArray(allergies) ? allergies : undefined,
    chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : undefined,
    currentMedications: Array.isArray(currentMedications) ? currentMedications : undefined,
  });

  if (!updated) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Medical profile not found' } });
    return;
  }

  await db.logAuditEvent({
    actorId: req.user!.userId,
    actorRole: req.user!.role,
    actorName: req.user!.name,
    actionType: 'VIEW_RECORD',
    resourceType: 'MedicalProfile',
    resourceId: updated.id,
    reason: `Updated clinical profile for patient ID ${req.params.patientId}`,
    ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.json({ success: true, data: { medicalProfile: updated } });
});
