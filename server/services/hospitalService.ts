/**
 * AegisCare Hospital & Resuscitation Resource Service
 */

import { db } from '../db/database';
import { DBHospital, DBHospitalResourcePrep, DBPreArrivalNotification, UserRole } from '../models';

export class HospitalService {
  public getAllHospitals(): DBHospital[] {
    return db.getHospitals();
  }

  public getHospitalById(id: string): DBHospital | undefined {
    return db.findHospitalById(id);
  }

  public async updateBedAvailability(
    hospitalId: string,
    availableBeds: number,
    availableIcuBeds: number,
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBHospital | null> {
    const updated = await db.updateHospitalBeds(hospitalId, availableBeds, availableIcuBeds);
    if (updated) {
      await db.logAuditEvent({
        actorId: actor.id,
        actorRole: actor.role,
        actorName: actor.name,
        actionType: 'UPDATE_BEDS',
        resourceType: 'Hospital',
        resourceId: updated.id,
        reason: `Bed capacity updated at ${updated.name}: ER Beds = ${availableBeds}, ICU Beds = ${availableIcuBeds}`,
        ipAddress,
        status: 'SUCCESS',
      });
    }
    return updated;
  }

  public getResourcePreps(hospitalId?: string): DBHospitalResourcePrep[] {
    return db.getResourcePreps(hospitalId);
  }

  public async updateResourcePrep(
    caseId: string,
    updates: Partial<DBHospitalResourcePrep>,
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBHospitalResourcePrep | null> {
    const prep = await db.updateResourcePrep(caseId, updates);
    if (prep) {
      await db.logAuditEvent({
        actorId: actor.id,
        actorRole: actor.role,
        actorName: actor.name,
        actionType: 'UPDATE_BEDS',
        resourceType: 'Hospital',
        resourceId: prep.hospitalId,
        reason: `Trauma preparation status changed to '${prep.prepStatus}' for Case ${caseId}`,
        ipAddress,
        status: 'SUCCESS',
      });
    }
    return prep;
  }

  public async sendPreArrivalNotification(
    data: {
      caseId: string;
      ambulanceId: string;
      hospitalId: string;
      message: string;
      urgency: 'routine' | 'urgent' | 'stat';
      senderName: string;
      senderRole: UserRole;
    },
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBPreArrivalNotification> {
    const notification = await db.createPreArrivalNotification(data);
    await db.logAuditEvent({
      actorId: actor.id,
      actorRole: actor.role,
      actorName: actor.name,
      actionType: 'VIEW_RECORD',
      resourceType: 'Hospital',
      resourceId: data.hospitalId,
      reason: `Pre-arrival notification transmitted to ${data.hospitalId} (${data.urgency.toUpperCase()})`,
      ipAddress,
      status: 'SUCCESS',
    });
    return notification;
  }
}

export const hospitalService = new HospitalService();
