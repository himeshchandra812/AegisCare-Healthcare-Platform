/**
 * AegisCare Doctor & Clinical Directives Service
 */

import { db } from '../db/database';
import { DBDoctor, DBClinicalOrder, UserRole } from '../models';

export class DoctorService {
  public getAllDoctors(): DBDoctor[] {
    return db.getDoctors();
  }

  public getOrdersForCase(caseId: string): DBClinicalOrder[] {
    return db.getClinicalOrdersForCase(caseId);
  }

  public async createClinicalOrder(
    data: {
      caseId: string;
      doctorId?: string;
      doctorName?: string;
      orderText: string;
      category?: 'Medication' | 'Procedure' | 'Prep' | 'Diagnostic';
    },
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBClinicalOrder> {
    const order = await db.createClinicalOrder({
      caseId: data.caseId || 'case-1',
      doctorId: data.doctorId || actor.id,
      doctorName: data.doctorName || actor.name,
      orderText: data.orderText,
      category: data.category || 'Medication',
      status: 'Ordered',
    });

    await db.logAuditEvent({
      actorId: actor.id,
      actorRole: actor.role,
      actorName: actor.name,
      actionType: 'ISSUE_ORDER',
      resourceType: 'ClinicalOrder',
      resourceId: order.id,
      reason: `Clinical order created for Case ${order.caseId}: "${order.orderText}"`,
      ipAddress,
      status: 'SUCCESS',
    });

    return order;
  }

  public async updateOrderStatus(
    orderId: string,
    status: 'Ordered' | 'Acknowledged' | 'Administered',
    actor: { id: string; role: UserRole; name: string },
    ipAddress = '127.0.0.1'
  ): Promise<DBClinicalOrder | null> {
    const updated = await db.updateClinicalOrderStatus(orderId, status);
    if (updated) {
      await db.logAuditEvent({
        actorId: actor.id,
        actorRole: actor.role,
        actorName: actor.name,
        actionType: 'ISSUE_ORDER',
        resourceType: 'ClinicalOrder',
        resourceId: updated.id,
        reason: `Clinical order status updated to '${status}'`,
        ipAddress,
        status: 'SUCCESS',
      });
    }
    return updated;
  }
}

export const doctorService = new DoctorService();
