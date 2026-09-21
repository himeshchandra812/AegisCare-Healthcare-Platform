/**
 * AegisCare Family Relationship & Consent Service
 */

import { db } from '../db/database';
import { DBFamilyRelationship, DBConsentRecord, UserRole } from '../models';

export class FamilyService {
  public getFamilyRelationships(): DBFamilyRelationship[] {
    return db.getFamilyRelationships();
  }

  public getConsentRecords(patientId: string): DBConsentRecord[] {
    return db.getConsentRecordsForPatient(patientId);
  }

  public async toggleConsent(
    patientId: string,
    authorizedUserId: string,
    grant: boolean,
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBConsentRecord> {
    const record = await db.toggleConsent(patientId, authorizedUserId, grant);

    await db.logAuditEvent({
      actorId: actor.id,
      actorRole: actor.role,
      actorName: actor.name,
      actionType: grant ? 'GRANT_CONSENT' : 'REVOKE_CONSENT',
      resourceType: 'ConsentRecord',
      resourceId: record.id,
      reason: `${grant ? 'Granted' : 'Revoked'} emergency record sharing consent for user ${authorizedUserId} on patient ${patientId}`,
      ipAddress,
      status: 'SUCCESS',
    });

    return record;
  }
}

export const familyService = new FamilyService();
