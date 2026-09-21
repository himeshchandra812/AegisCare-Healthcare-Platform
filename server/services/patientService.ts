/**
 * AegisCare Patient & Medical Record Service
 */

import { db } from '../db/database';
import { DBPatient, DBMedicalProfile, UserRole } from '../models';

export class PatientService {
  public getAllPatients(): DBPatient[] {
    return db.getPatients();
  }

  public getPatientById(id: string): DBPatient | undefined {
    return db.findPatientById(id);
  }

  public getMedicalProfile(patientId: string, actor: { id: string; role: UserRole; name: string }, ipAddress = '127.0.0.1'): DBMedicalProfile | undefined {
    const profile = db.findMedicalProfileByPatientId(patientId);
    if (profile) {
      db.logAuditEvent({
        actorId: actor.id,
        actorRole: actor.role,
        actorName: actor.name,
        actionType: 'VIEW_RECORD',
        resourceType: 'MedicalProfile',
        resourceId: profile.id,
        reason: `Medical profile read for patient ${patientId}`,
        ipAddress,
        status: 'SUCCESS',
      });
    }
    return profile;
  }

  public async updateMedicalProfile(
    patientId: string,
    updates: Partial<DBMedicalProfile>,
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBMedicalProfile | null> {
    const updated = await db.updateMedicalProfile(patientId, updates);
    if (updated) {
      await db.logAuditEvent({
        actorId: actor.id,
        actorRole: actor.role,
        actorName: actor.name,
        actionType: 'VIEW_RECORD',
        resourceType: 'MedicalProfile',
        resourceId: updated.id,
        reason: `Medical profile updated for patient ${patientId}`,
        ipAddress,
        status: 'SUCCESS',
      });
    }
    return updated;
  }
}

export const patientService = new PatientService();
