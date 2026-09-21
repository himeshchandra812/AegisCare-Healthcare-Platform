/**
 * AegisCare Database Schema & Domain Types
 * Hyderabad Emergency Healthcare Node
 */

export type UserRole =
  | 'patient'
  | 'family_member'
  | 'doctor'
  | 'emt'
  | 'ambulance_operator'
  | 'hospital_admin'
  | 'system_admin';

export type Permission =
  | 'patient:read_self'
  | 'patient:write_self'
  | 'patient:read_all'
  | 'medical:read_assigned'
  | 'medical:read_emergency'
  | 'medical:write_orders'
  | 'ambulance:read_fleet'
  | 'ambulance:update_telemetry'
  | 'ambulance:dispatch'
  | 'hospital:read_beds'
  | 'hospital:update_resources'
  | 'hospital:pre_arrival_triage'
  | 'family:read_consented'
  | 'family:manage_consent'
  | 'audit:read_logs'
  | 'system:manage_users'
  | 'system:configure_corridor';

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  name: string;
  title: string;
  avatarInitials: string;
  phone: string;
  departmentOrAffiliation?: string;
  associatedHospitalId?: string;
  associatedAmbulanceId?: string;
  associatedPatientId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBMockCredential {
  role: UserRole;
  email: string;
  plainPasswordHint: string;
  name: string;
  title: string;
  category: string;
}

export interface DBPatient {
  id: string;
  userId: string;
  abhaId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBMedicalProfile {
  id: string;
  patientId: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  pastSurgeries: string[];
  insuranceProvider: string;
  policyNumber: string;
  primaryPhysicianName: string;
  primaryPhysicianHospital: string;
  qrAccessCode: string;
  createdAt: string;
  updatedAt: string;
}

export type EmergencySeverity = 'Critical' | 'Severe' | 'Moderate' | 'Low';
export type EmergencyStatus = 'Reported' | 'Dispatched' | 'En Route' | 'On Scene' | 'In Transit' | 'Admitted' | 'Resolved';

export interface DBEmergencyCase {
  id: string;
  caseNumber: string;
  clientRequestId?: string;
  dispatchSyncStatus?: 'local_demo' | 'pending' | 'synced_server' | 'sync_error';
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  chiefComplaint: string;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  reportedAt: string;
  pickupLocation: {
    address: string;
    landmark: string;
    lat: number;
    lng: number;
  };
  assignedAmbulanceId: string;
  assignedHospitalId: string;
  assignedEmtName: string;
  careCategoryRequired: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DBAmbulance {
  id: string;
  unitCode: string;
  vehicleNumber: string;
  type: 'ALS' | 'BLS' | 'Neonatal' | 'Patient Transport';
  status: 'Available' | 'Dispatched' | 'En Route' | 'At Scene' | 'In Transit' | 'Maintenance';
  baseLocation: string;
  currentGps: {
    address: string;
    lat: number;
    lng: number;
  };
  assignedDriver: string;
  assignedEmtId: string;
  assignedEmtName: string;
  currentCaseId?: string;
  destinationHospitalId?: string;
  batteryPercentage: number;
  oxygenReservePercentage: number;
  etaMinutes: number;
  greenCorridorActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBVitalReading {
  id: string;
  caseId: string;
  ambulanceId: string;
  patientId: string;
  heartRate: number;
  spO2: number;
  bloodPressure: string;
  respRate: number;
  temperature: number;
  bloodGlucose: number;
  ecgStatus: string;
  recordedByEmtName: string;
  timestamp: string;
}

export interface DBHospital {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  traumaLevel: 'Level 1' | 'Level 2' | 'Level 3';
  totalBeds: number;
  availableBeds: number;
  totalIcuBeds: number;
  availableIcuBeds: number;
  cathLabActive: boolean;
  strokeTeamActive: boolean;
  emergencyDeskPhone: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBHospitalResourcePrep {
  id: string;
  hospitalId: string;
  caseId: string;
  assignedBay: string;
  traumaTeamNotified: boolean;
  cathLabReserved: boolean;
  strokeTeamAlerted: boolean;
  bloodBankAlerted: boolean;
  prepStatus: 'Pending Notification' | 'Team Alerted' | 'Bed & Bay Ready' | 'Surgical Suite Prepared' | 'Physician at Bay';
  notes: string;
  updatedAt: string;
}

export interface DBPreArrivalNotification {
  id: string;
  caseId: string;
  ambulanceId: string;
  hospitalId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  urgency: 'routine' | 'urgent' | 'stat';
  timestamp: string;
}

export interface DBDoctor {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  registrationNumber: string;
  qualifications: string;
  isAvailableForEmergency: boolean;
  activeConsultationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBClinicalOrder {
  id: string;
  caseId: string;
  doctorId: string;
  doctorName: string;
  orderText: string;
  category: 'Medication' | 'Procedure' | 'Prep' | 'Diagnostic';
  status: 'Ordered' | 'Acknowledged' | 'Administered';
  timestamp: string;
}

export interface DBFamilyRelationship {
  id: string;
  familyUserId: string;
  familyMemberName: string;
  patientId: string;
  patientName: string;
  relationship: 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Caregiver';
  isEmergencyContact: boolean;
  isAuthorizedCaregiver: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBConsentRecord {
  id: string;
  patientId: string;
  authorizedUserId: string;
  authorizedUserName: string;
  purpose: 'Emergency Response' | 'Caregiver Monitoring' | 'Teleconsultation' | 'Insurance Claims';
  status: 'Active' | 'Revoked' | 'Expired';
  grantedAt: string;
  expiresAt: string;
  revokedAt?: string;
  ipAddress?: string;
}

export interface DBNotification {
  id: string;
  userId?: string;
  targetRole?: UserRole;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent' | 'critical';
  read: boolean;
  createdAt: string;
}

export interface DBAuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: UserRole;
  actorName: string;
  actionType: 'LOGIN' | 'LOGOUT' | 'VIEW_RECORD' | 'UPDATE_VITALS' | 'ISSUE_ORDER' | 'DISPATCH_AMBULANCE' | 'UPDATE_BEDS' | 'GRANT_CONSENT' | 'REVOKE_CONSENT' | 'ACCESS_DENIED';
  resourceType: 'Patient' | 'MedicalProfile' | 'EmergencyCase' | 'Ambulance' | 'Hospital' | 'ClinicalOrder' | 'ConsentRecord' | 'User';
  resourceId: string;
  reason: string;
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
}

export interface AegisCareDatabaseSchema {
  users: DBUser[];
  patients: DBPatient[];
  medicalProfiles: DBMedicalProfile[];
  emergencyCases: DBEmergencyCase[];
  ambulances: DBAmbulance[];
  vitalReadings: DBVitalReading[];
  hospitals: DBHospital[];
  hospitalResourcePreps: DBHospitalResourcePrep[];
  preArrivalNotifications: DBPreArrivalNotification[];
  doctors: DBDoctor[];
  clinicalOrders: DBClinicalOrder[];
  familyRelationships: DBFamilyRelationship[];
  consentRecords: DBConsentRecord[];
  notifications: DBNotification[];
  auditEvents: DBAuditEvent[];
}
