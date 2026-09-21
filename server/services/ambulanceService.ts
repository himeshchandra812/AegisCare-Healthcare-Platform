/**
 * AegisCare Ambulance Fleet & Live Telemetry Service
 */

import { db } from '../db/database';
import { DBAmbulance, DBVitalReading, UserRole } from '../models';
import { validateVitalReadings, VitalReadingInput } from '../validation';

export class AmbulanceService {
  public getAllAmbulances(): DBAmbulance[] {
    return db.getAmbulances();
  }

  public getAmbulanceById(id: string): DBAmbulance | undefined {
    return db.findAmbulanceById(id);
  }

  public getVitalReadings(caseId?: string, ambulanceId?: string): DBVitalReading[] {
    return db.getVitalReadings(caseId, ambulanceId);
  }

  public async recordVitalReading(
    input: VitalReadingInput & { recordedByEmtName?: string },
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBVitalReading> {
    const validation = validateVitalReadings(input);
    if (!validation.valid) {
      const errorMsg = validation.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`VALIDATION_FAILED: ${errorMsg}`);
    }

    const reading = await db.recordVitalReading({
      caseId: input.caseId || 'case-1',
      ambulanceId: input.ambulanceId || 'amb-1',
      patientId: input.patientId || 'pat-1',
      heartRate: input.heartRate ?? 108,
      spO2: input.spO2 ?? 96,
      bloodPressure: input.bloodPressure ?? '135/88',
      respRate: input.respRate ?? 20,
      temperature: input.temperature ?? 98.6,
      bloodGlucose: input.bloodGlucose ?? 142,
      ecgStatus: input.ecgStatus ?? 'Normal Sinus Rhythm with Telemetry Sync',
      recordedByEmtName: input.recordedByEmtName || actor.name,
    });

    await db.logAuditEvent({
      actorId: actor.id,
      actorRole: actor.role,
      actorName: actor.name,
      actionType: 'UPDATE_VITALS',
      resourceType: 'EmergencyCase',
      resourceId: reading.caseId,
      reason: `Live vital reading recorded (HR: ${reading.heartRate} bpm, SpO2: ${reading.spO2}%, BP: ${reading.bloodPressure})`,
      ipAddress,
      status: 'SUCCESS',
    });

    return reading;
  }

  public async toggleGreenCorridor(
    ambulanceId: string,
    active: boolean,
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBAmbulance | null> {
    const ambulance = await db.toggleGreenCorridor(ambulanceId, active);
    if (ambulance) {
      await db.logAuditEvent({
        actorId: actor.id,
        actorRole: actor.role,
        actorName: actor.name,
        actionType: 'DISPATCH_AMBULANCE',
        resourceType: 'Ambulance',
        resourceId: ambulance.id,
        reason: `Green Corridor Traffic Signal Pre-emption toggled to: ${active ? 'ACTIVE' : 'DEACTIVATED'} for unit ${ambulance.unitCode}`,
        ipAddress,
        status: 'SUCCESS',
      });
    }
    return ambulance;
  }
}

export const ambulanceService = new AmbulanceService();
