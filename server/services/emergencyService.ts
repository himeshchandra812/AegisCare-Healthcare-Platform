/**
 * AegisCare Emergency Case & SOS Dispatch Service
 */

import { db } from '../db/database';
import { DBEmergencyCase, EmergencyStatus, EmergencySeverity, UserRole } from '../models';

export class EmergencyService {
  public getAllCases(): DBEmergencyCase[] {
    return db.getEmergencyCases();
  }

  public getCaseById(id: string): DBEmergencyCase | undefined {
    return db.findEmergencyCaseById(id);
  }

  public async triggerSOS(params: {
    patientId?: string;
    chiefComplaint?: string;
    pickupLocation?: { address: string; landmark: string; lat: number; lng: number };
    severity?: EmergencySeverity;
    actor: { id: string; role: UserRole; name: string };
    ipAddress?: string;
  }): Promise<{ case: DBEmergencyCase; ambulanceId: string; hospitalId: string }> {
    const patientId = params.patientId || 'pat-1';
    const patient = db.findPatientById(patientId) || db.getPatients()[0];

    const newCase = await db.createEmergencyCase({
      caseNumber: `EMG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      chiefComplaint: params.chiefComplaint || 'Acute Cardiac Distress & Palpitations with Diaphoresis',
      severity: params.severity || 'Critical',
      status: 'Dispatched',
      reportedAt: new Date().toISOString(),
      pickupLocation: params.pickupLocation || {
        address: 'Plot 42, Road No 36, Jubilee Hills, Hyderabad',
        landmark: 'Opposite Metro Pillar 1044',
        lat: 17.4319,
        lng: 78.4073,
      },
      assignedAmbulanceId: 'amb-1',
      assignedHospitalId: 'hosp-1',
      assignedEmtName: 'Ramesh Patel, Paramedic',
      careCategoryRequired: 'Advanced Cardiac Life Support (ACLS)',
      notes: [
        '1-Touch Emergency SOS broadcasted by patient.',
        'ACLS Unit Hyd-ALS-01 dispatched with telemetry live-link.',
        'Apollo Health City Jubilee Hills ER Trauma Bay reserved.',
      ],
    });

    // Update ambulance status to Dispatched
    await db.updateAmbulance('amb-1', {
      status: 'Dispatched',
      currentCaseId: newCase.id,
      destinationHospitalId: 'hosp-1',
    });

    // Create Notification for Doctors and Admins
    await db.addNotification({
      targetRole: 'doctor',
      title: 'CRITICAL: Incoming Cardiac Emergency',
      message: `Unit Hyd-ALS-01 dispatched to ${newCase.patientName} (${newCase.patientAge}y). Pre-arrival trauma bay required at Apollo Health City.`,
      severity: 'critical',
      read: false,
    });

    await db.logAuditEvent({
      actorId: params.actor.id,
      actorRole: params.actor.role,
      actorName: params.actor.name,
      actionType: 'DISPATCH_AMBULANCE',
      resourceType: 'EmergencyCase',
      resourceId: newCase.id,
      reason: `Emergency SOS triggered for patient ${patient.name}. Dispatched Unit amb-1 to hosp-1.`,
      ipAddress: params.ipAddress || '127.0.0.1',
      status: 'SUCCESS',
    });

    return {
      case: newCase,
      ambulanceId: 'amb-1',
      hospitalId: 'hosp-1',
    };
  }

  public async updateCaseStatus(
    caseId: string,
    status: EmergencyStatus,
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBEmergencyCase | null> {
    const updated = await db.updateEmergencyCase(caseId, { status });
    if (updated) {
      await db.logAuditEvent({
        actorId: actor.id,
        actorRole: actor.role,
        actorName: actor.name,
        actionType: 'DISPATCH_AMBULANCE',
        resourceType: 'EmergencyCase',
        resourceId: updated.id,
        reason: `Emergency case status transition to '${status}'`,
        ipAddress,
        status: 'SUCCESS',
      });
    }
    return updated;
  }
}

export const emergencyService = new EmergencyService();
