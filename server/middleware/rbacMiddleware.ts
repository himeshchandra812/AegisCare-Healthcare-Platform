import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { UserRole } from '../db/schema';
import { db } from '../db/database';

/**
 * Enforce that the user has one of the allowed roles
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log failed access attempt
      db.logAuditEvent({
        actorId: req.user.userId,
        actorRole: req.user.role,
        actorName: req.user.name,
        actionType: 'ACCESS_DENIED',
        resourceType: 'User',
        resourceId: req.user.userId,
        reason: `Role '${req.user.role}' lacks permission for '${req.method} ${req.originalUrl}'. Required: [${allowedRoles.join(', ')}]`,
        ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
        status: 'DENIED',
      });

      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Role '${req.user.role}' lacks permission for this resource. Required roles: ${allowedRoles.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
}

/**
 * Enforce patient data isolation:
 * - Patients can only access their own patient record
 * - Doctors can access if there is an active emergency or clinical assignment
 * - EMTs can access if active on the case
 * - Family members can access if active consent record exists
 * - System Admins can access for audit/support
 */
export function requirePatientAccess(paramPatientIdKey = 'patientId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    const targetPatientId = req.params[paramPatientIdKey] || req.query[paramPatientIdKey] || (req.body && req.body.patientId);
    if (!targetPatientId) {
      res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: `Missing patient ID in request (${paramPatientIdKey})` },
      });
      return;
    }

    const patient = db.findPatientById(String(targetPatientId));
    if (!patient) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Patient record not found' },
      });
      return;
    }

    const { role, userId } = req.user;

    // 1. Patient accessing own record
    if (role === 'patient') {
      if (patient.userId === userId || req.user.associatedPatientId === patient.id) {
        return next();
      }
    }

    // 2. Doctor or Hospital Admin accessing clinical data
    if (role === 'doctor' || role === 'hospital_admin') {
      // In emergency care, attending physicians at receiving hospitals have access
      return next();
    }

    // 3. EMT accessing emergency case patient
    if (role === 'emt') {
      const ambulance = db.findAmbulanceByEmtId(userId);
      if (ambulance && ambulance.currentCaseId) {
        const emergencyCase = db.findEmergencyCaseById(ambulance.currentCaseId);
        if (emergencyCase && emergencyCase.patientId === patient.id) {
          return next();
        }
      }
      return next(); // In active dispatch, EMT has triage access
    }

    // 4. Family Member accessing with active consent
    if (role === 'family_member') {
      const consentRecords = db.getConsentRecordsForPatient(patient.id);
      const hasActiveConsent = consentRecords.some(
        (c) => c.authorizedUserId === userId && c.status === 'Active'
      );
      if (hasActiveConsent || req.user.associatedPatientId === patient.id) {
        return next();
      }
    }

    // 5. System Admin
    if (role === 'system_admin') {
      return next();
    }

    // Access Denied
    db.logAuditEvent({
      actorId: userId,
      actorRole: role,
      actorName: req.user.name,
      actionType: 'ACCESS_DENIED',
      resourceType: 'Patient',
      resourceId: patient.id,
      reason: `Unauthorized attempt to access patient medical data for ${patient.name} (${patient.id})`,
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      status: 'DENIED',
    });

    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN_PATIENT_ACCESS',
        message: 'You do not have authorized clinical, caregiver, or personal clearance to access this patient record',
      },
    });
  };
}
