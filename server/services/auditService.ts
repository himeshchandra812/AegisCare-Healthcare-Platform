/**
 * AegisCare Immutable Audit Logging Service
 */

import { db } from '../db/database';
import { DBAuditEvent } from '../models';

export class AuditService {
  public getAuditEvents(limit = 100): DBAuditEvent[] {
    const events = db.getAuditEvents();
    return events.slice(-limit).reverse();
  }

  public async logEvent(eventData: Omit<DBAuditEvent, 'id' | 'timestamp'>): Promise<DBAuditEvent> {
    return db.logAuditEvent(eventData);
  }
}

export const auditService = new AuditService();
