import fs from 'node:fs';
import path from 'node:path';
import {
  AegisCareDatabaseSchema,
  DBUser,
  DBPatient,
  DBMedicalProfile,
  DBEmergencyCase,
  DBAmbulance,
  DBVitalReading,
  DBHospital,
  DBHospitalResourcePrep,
  DBPreArrivalNotification,
  DBDoctor,
  DBClinicalOrder,
  DBFamilyRelationship,
  DBConsentRecord,
  DBNotification,
  DBAuditEvent,
} from './schema';
import { INITIAL_SEED_DATA } from './seedData';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE_PATH = path.join(DATA_DIR, 'aegiscare_db.json');

class AegisCareDatabase {
  private data: AegisCareDatabaseSchema;
  private isSaving = false;
  private saveQueued = false;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): AegisCareDatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure all top level collections exist
        return {
          ...INITIAL_SEED_DATA,
          ...parsed,
        };
      }
    } catch (err) {
      console.error('[DB] Failed to load existing database file, initializing with seed data:', err);
    }

    // Default initialization with seed data
    this.persistSync(INITIAL_SEED_DATA);
    return JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
  }

  private persistSync(dataToSave: AegisCareDatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE_PATH);
    } catch (err) {
      console.error('[DB] Failed to write database synchronously:', err);
    }
  }

  public async persist(): Promise<void> {
    if (this.isSaving) {
      this.saveQueued = true;
      return;
    }

    this.isSaving = true;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        await fs.promises.mkdir(DATA_DIR, { recursive: true });
      }
      const tempPath = `${DB_FILE_PATH}.tmp`;
      await fs.promises.writeFile(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      await fs.promises.rename(tempPath, DB_FILE_PATH);
    } catch (err) {
      console.error('[DB] Failed to write database atomically:', err);
    } finally {
      this.isSaving = false;
      if (this.saveQueued) {
        this.saveQueued = false;
        await this.persist();
      }
    }
  }

  // --- Users & Auth ---
  public findUserById(id: string): DBUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserByRole(role: string): DBUser | undefined {
    return this.data.users.find((u) => u.role === role);
  }

  public getAllUsers(): DBUser[] {
    return this.data.users;
  }

  // --- Patients & Medical Profiles ---
  public findPatientById(id: string): DBPatient | undefined {
    return this.data.patients.find((p) => p.id === id);
  }

  public findPatientByUserId(userId: string): DBPatient | undefined {
    return this.data.patients.find((p) => p.userId === userId);
  }

  public getAllPatients(): DBPatient[] {
    return this.data.patients;
  }

  public getPatients(): DBPatient[] {
    return this.getAllPatients();
  }

  public findMedicalProfileByPatientId(patientId: string): DBMedicalProfile | undefined {
    return this.data.medicalProfiles.find((m) => m.patientId === patientId);
  }

  public async updateMedicalProfile(patientId: string, updates: Partial<DBMedicalProfile>): Promise<DBMedicalProfile | null> {
    const idx = this.data.medicalProfiles.findIndex((m) => m.patientId === patientId);
    if (idx === -1) return null;
    this.data.medicalProfiles[idx] = {
      ...this.data.medicalProfiles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await this.persist();
    return this.data.medicalProfiles[idx];
  }

  // --- Emergency Cases ---
  public getAllEmergencyCases(): DBEmergencyCase[] {
    return this.data.emergencyCases;
  }

  public getEmergencyCases(): DBEmergencyCase[] {
    return this.getAllEmergencyCases();
  }

  public findEmergencyCaseById(id: string): DBEmergencyCase | undefined {
    return this.data.emergencyCases.find((c) => c.id === id);
  }

  public findEmergencyCaseByClientRequestId(clientRequestId: string): DBEmergencyCase | undefined {
    if (!clientRequestId) return undefined;
    return this.data.emergencyCases.find((c) => c.clientRequestId === clientRequestId);
  }

  public async createEmergencyCase(newCase: Omit<DBEmergencyCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<DBEmergencyCase> {
    if (newCase.clientRequestId) {
      const existing = this.data.emergencyCases.find((c) => c.clientRequestId === newCase.clientRequestId);
      if (existing) {
        return existing;
      }
    }
    const id = `case-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullCase: DBEmergencyCase = {
      ...newCase,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.emergencyCases.unshift(fullCase);
    await this.persist();
    return fullCase;
  }

  public async updateEmergencyCase(id: string, updates: Partial<DBEmergencyCase>): Promise<DBEmergencyCase | null> {
    const idx = this.data.emergencyCases.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.emergencyCases[idx] = {
      ...this.data.emergencyCases[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await this.persist();
    return this.data.emergencyCases[idx];
  }

  // --- Ambulances & Vital Readings ---
  public getAllAmbulances(): DBAmbulance[] {
    return this.data.ambulances;
  }

  public getAmbulances(): DBAmbulance[] {
    return this.getAllAmbulances();
  }

  public findAmbulanceById(id: string): DBAmbulance | undefined {
    return this.data.ambulances.find((a) => a.id === id);
  }

  public findAmbulanceByEmtId(emtUserId: string): DBAmbulance | undefined {
    return this.data.ambulances.find((a) => a.assignedEmtId === emtUserId);
  }

  public async updateAmbulance(id: string, updates: Partial<DBAmbulance>): Promise<DBAmbulance | null> {
    const idx = this.data.ambulances.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.ambulances[idx] = {
      ...this.data.ambulances[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await this.persist();
    return this.data.ambulances[idx];
  }

  public async toggleGreenCorridor(ambulanceId: string, active: boolean): Promise<DBAmbulance | null> {
    return this.updateAmbulance(ambulanceId, { greenCorridorActive: active });
  }

  public getVitalsForCase(caseId: string): DBVitalReading[] {
    return this.data.vitalReadings.filter((v) => v.caseId === caseId);
  }

  public getVitalReadings(caseId?: string, ambulanceId?: string): DBVitalReading[] {
    return this.data.vitalReadings.filter((v) => {
      if (caseId && v.caseId !== caseId) return false;
      if (ambulanceId && v.ambulanceId !== ambulanceId) return false;
      return true;
    });
  }

  public async recordVitalReading(vitals: Omit<DBVitalReading, 'id' | 'timestamp'>): Promise<DBVitalReading> {
    const id = `vit-${Date.now()}`;
    const reading: DBVitalReading = {
      ...vitals,
      id,
      timestamp: new Date().toISOString(),
    };
    this.data.vitalReadings.unshift(reading);
    await this.persist();
    return reading;
  }

  // --- Hospitals & Resource Preps ---
  public getAllHospitals(): DBHospital[] {
    return this.data.hospitals;
  }

  public getHospitals(): DBHospital[] {
    return this.getAllHospitals();
  }

  public findHospitalById(id: string): DBHospital | undefined {
    return this.data.hospitals.find((h) => h.id === id);
  }

  public async updateHospitalBeds(hospitalId: string, availableBeds: number, availableIcuBeds: number): Promise<DBHospital | null> {
    const idx = this.data.hospitals.findIndex((h) => h.id === hospitalId);
    if (idx === -1) return null;
    this.data.hospitals[idx] = {
      ...this.data.hospitals[idx],
      availableBeds,
      availableIcuBeds,
      updatedAt: new Date().toISOString(),
    };
    await this.persist();
    return this.data.hospitals[idx];
  }

  public getResourcePreps(hospitalId?: string): DBHospitalResourcePrep[] {
    if (hospitalId) {
      return this.data.hospitalResourcePreps.filter((r) => r.hospitalId === hospitalId);
    }
    return this.data.hospitalResourcePreps;
  }

  public getResourcePrepsForHospital(hospitalId: string): DBHospitalResourcePrep[] {
    return this.getResourcePreps(hospitalId);
  }

  public findResourcePrepByCaseId(caseId: string): DBHospitalResourcePrep | undefined {
    return this.data.hospitalResourcePreps.find((r) => r.caseId === caseId);
  }

  public async updateHospitalResourcePrep(caseId: string, updates: Partial<DBHospitalResourcePrep>): Promise<DBHospitalResourcePrep> {
    const idx = this.data.hospitalResourcePreps.findIndex((r) => r.caseId === caseId);
    const now = new Date().toISOString();
    if (idx === -1) {
      const newPrep: DBHospitalResourcePrep = {
        id: `prep-${Date.now()}`,
        hospitalId: updates.hospitalId || 'hosp-1',
        caseId,
        assignedBay: updates.assignedBay || 'Emergency Resuscitation Bay 1',
        traumaTeamNotified: updates.traumaTeamNotified ?? true,
        cathLabReserved: updates.cathLabReserved ?? false,
        strokeTeamAlerted: updates.strokeTeamAlerted ?? false,
        bloodBankAlerted: updates.bloodBankAlerted ?? false,
        prepStatus: updates.prepStatus || 'Team Alerted',
        notes: updates.notes || '',
        updatedAt: now,
      };
      this.data.hospitalResourcePreps.push(newPrep);
      await this.persist();
      return newPrep;
    }

    this.data.hospitalResourcePreps[idx] = {
      ...this.data.hospitalResourcePreps[idx],
      ...updates,
      updatedAt: now,
    };
    await this.persist();
    return this.data.hospitalResourcePreps[idx];
  }

  public async updateResourcePrep(caseId: string, updates: Partial<DBHospitalResourcePrep>): Promise<DBHospitalResourcePrep> {
    return this.updateHospitalResourcePrep(caseId, updates);
  }

  public async createPreArrivalNotification(data: Omit<DBPreArrivalNotification, 'id' | 'timestamp'>): Promise<DBPreArrivalNotification> {
    const id = `pan-${Date.now()}`;
    const notif: DBPreArrivalNotification = {
      ...data,
      id,
      timestamp: new Date().toISOString(),
    };
    this.data.preArrivalNotifications.unshift(notif);
    await this.persist();
    return notif;
  }

  public getDemoCredentials() {
    return this.data.users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      name: u.name,
      title: u.title,
      avatarInitials: u.avatarInitials,
      phone: u.phone,
      departmentOrAffiliation: u.departmentOrAffiliation,
      plainPasswordHint: 'demo123',
    }));
  }

  // --- Doctors & Clinical Orders ---
  public getAllDoctors(): DBDoctor[] {
    return this.data.doctors;
  }

  public getDoctors(): DBDoctor[] {
    return this.getAllDoctors();
  }

  public findDoctorByUserId(userId: string): DBDoctor | undefined {
    return this.data.doctors.find((d) => d.userId === userId);
  }

  public getClinicalOrdersForCase(caseId: string): DBClinicalOrder[] {
    return this.data.clinicalOrders.filter((o) => o.caseId === caseId);
  }

  public async createClinicalOrder(order: Omit<DBClinicalOrder, 'id' | 'timestamp'>): Promise<DBClinicalOrder> {
    const id = `ord-${Date.now()}`;
    const newOrder: DBClinicalOrder = {
      ...order,
      id,
      timestamp: new Date().toISOString(),
    };
    this.data.clinicalOrders.unshift(newOrder);
    await this.persist();
    return newOrder;
  }

  public async updateClinicalOrderStatus(orderId: string, status: DBClinicalOrder['status']): Promise<DBClinicalOrder | null> {
    const idx = this.data.clinicalOrders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;
    this.data.clinicalOrders[idx].status = status;
    await this.persist();
    return this.data.clinicalOrders[idx];
  }

  // --- Family & Consent ---
  public getFamilyRelationships(): DBFamilyRelationship[] {
    return this.data.familyRelationships;
  }

  public getFamilyRelationshipsForUser(familyUserId: string): DBFamilyRelationship[] {
    return this.data.familyRelationships.filter((r) => r.familyUserId === familyUserId);
  }

  public getConsentRecordsForPatient(patientId: string): DBConsentRecord[] {
    return this.data.consentRecords.filter((c) => c.patientId === patientId);
  }

  public async toggleCaregiverConsent(patientId: string, authorizedUserId: string, active: boolean): Promise<DBConsentRecord> {
    let consent = this.data.consentRecords.find(
      (c) => c.patientId === patientId && c.authorizedUserId === authorizedUserId
    );

    const now = new Date().toISOString();
    if (consent) {
      consent.status = active ? 'Active' : 'Revoked';
      if (!active) consent.revokedAt = now;
    } else {
      consent = {
        id: `con-${Date.now()}`,
        patientId,
        authorizedUserId,
        authorizedUserName: 'Sneha Sharma',
        purpose: 'Caregiver Monitoring',
        status: active ? 'Active' : 'Revoked',
        grantedAt: now,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      this.data.consentRecords.push(consent);
    }
    await this.persist();
    return consent;
  }

  public async toggleConsent(patientId: string, authorizedUserId: string, active: boolean): Promise<DBConsentRecord> {
    return this.toggleCaregiverConsent(patientId, authorizedUserId, active);
  }

  // --- Notifications ---
  public getNotificationsForUser(userId: string, role?: string): DBNotification[] {
    return this.data.notifications.filter(
      (n) => (n.userId && n.userId === userId) || (role && n.targetRole === role)
    );
  }

  public async addNotification(notification: Omit<DBNotification, 'id' | 'createdAt'>): Promise<DBNotification> {
    const id = `notif-${Date.now()}`;
    const newNotif: DBNotification = {
      ...notification,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    await this.persist();
    return newNotif;
  }

  public async markNotificationRead(id: string): Promise<boolean> {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (!notif) return false;
    notif.read = true;
    await this.persist();
    return true;
  }

  // --- Immutable Audit Logging ---
  public async logAuditEvent(event: Omit<DBAuditEvent, 'id' | 'timestamp'>): Promise<DBAuditEvent> {
    const id = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullEvent: DBAuditEvent = {
      ...event,
      id,
      timestamp: new Date().toISOString(),
    };
    this.data.auditEvents.unshift(fullEvent);
    // Keep max 1000 audit events in local memory
    if (this.data.auditEvents.length > 1000) {
      this.data.auditEvents = this.data.auditEvents.slice(0, 1000);
    }
    await this.persist();
    return fullEvent;
  }

  public getAuditEvents(limit = 100): DBAuditEvent[] {
    return this.data.auditEvents.slice(0, limit);
  }
}

// Singleton database instance
export const db = new AegisCareDatabase();
