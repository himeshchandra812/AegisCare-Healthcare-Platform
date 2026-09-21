export type UserRole =
  | 'patient'
  | 'family_member'
  | 'doctor'
  | 'emt'
  | 'ambulance_operator'
  | 'hospital_admin'
  | 'system_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  title: string;
  avatarInitials: string;
  departmentOrAffiliation: string;
  contactNumber?: string;
  verificationStatus?: string;
  token: string;
  lastLogin: string;
}

export interface DemoCredential {
  role: UserRole;
  email: string;
  passwordHint: string;
  name: string;
  title: string;
  roleDescription: string;
  badge: string;
  category: string;
  allowedFeatures: string[];
  restrictedFeatures: string[];
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoCredential> = {
  patient: {
    role: 'patient',
    email: 'patient.demo@example.com',
    passwordHint: 'demo123',
    name: 'Ananya Reddy',
    title: 'Registered Citizen / Patient',
    badge: 'Patient Access',
    category: 'Consumer / Patient',
    roleDescription: 'Personal health portal with 1-touch emergency SOS, nearby ER locator, digital health records, and family sharing.',
    allowedFeatures: [
      'Patient Dashboard',
      'Emergency Assistance (112 SOS)',
      'Request Ambulance',
      'Emergency Hospital Finder',
      'Doctor Finder',
      'Traveller Healthcare',
      'Digital Medical Profile',
      'Medical Records',
      'Emergency Contacts',
      'Family Sharing',
      'My Alerts',
      'My Appointments',
      'Patient Profile & Settings',
      'Logout',
    ],
    restrictedFeatures: [
      'Doctor Dashboard & Clinical Tools',
      'Doctor Patient Management',
      'EMT Dashboard & Controls',
      'Ambulance Fleet Management',
      'Hospital Administration',
      'Hospital Resource Management',
      'System Administration',
      'Internal Hospital Analytics',
      'Ambulance Dispatch Controls',
      'Other Patients\' Confidential Records',
    ],
  },
  family_member: {
    role: 'family_member',
    email: 'family.demo@example.com',
    passwordHint: 'demo123',
    name: 'Rajesh Reddy',
    title: 'Registered Family Caregiver',
    badge: 'Caregiver / Family',
    category: 'Consumer / Patient',
    roleDescription: 'Caregiver portal to track elderly loved ones, receive real-time ambulance location, and manage emergency consent.',
    allowedFeatures: [
      'Family Dashboard',
      'Linked Patient Tracking (Lakshmi Devi)',
      'Ambulance Status & Location',
      'Hospital Destination & ETA',
      'Emergency Notifications',
      'Shared Medical Information',
      'Consent & Permission Settings',
      'Family Contacts',
      'Profile & Settings',
      'Logout',
    ],
    restrictedFeatures: [
      'Internal Hospital Operations',
      'Doctor Clinical Tools & Directives',
      'EMT Dispatch Controls',
      'Ambulance Fleet Administration',
      'System Administration',
      'Unauthorised Patient Records',
    ],
  },
  doctor: {
    role: 'doctor',
    email: 'doctor.demo@example.com',
    passwordHint: 'demo123',
    name: 'Dr. Arjun Rao',
    title: 'Attending Emergency Physician',
    badge: 'Attending Physician',
    category: 'Clinical / Hospital',
    roleDescription: 'Clinical console for incoming emergency trauma cases, pre-arrival vital signs, clinical orders, and teleconsultations.',
    allowedFeatures: [
      'Doctor Dashboard',
      'My Patients & Clinical Queue',
      'Emergency Cases & Inbound Telemetry',
      'Incoming Ambulances (Case #EM-HYD-402)',
      'Patient Vitals & Live Waveforms',
      'Pre-Arrival Cases & Bay Reservation',
      'Consultation Requests & Appointments',
      'Teleconsultation & Video Link',
      'Clinical Notes (Simulated)',
      'Case History & Triage Orders',
      'Doctor Profile & Availability',
      'Notifications & Alerts',
      'Logout',
    ],
    restrictedFeatures: [
      'Patient-facing Doctor Finder (Booking Catalog)',
      'Ambulance Fleet Management',
      'System Administration',
      'Unauthorised Patient Records',
      'Patient-only Emergency Request Screens',
    ],
  },
  emt: {
    role: 'emt',
    email: 'emt.demo@example.com',
    passwordHint: 'demo123',
    name: 'Ravi Kumar',
    title: 'Lead ALS Paramedic',
    badge: 'ALS Paramedic Crew',
    category: 'First Responder',
    roleDescription: 'High-contrast mobile operational console, vitals monitoring, corridor navigation, and ER pre-arrival communication.',
    allowedFeatures: [
      'EMT Dashboard',
      'Assigned Ambulance (Unit 108-Hyd-42)',
      'Active Emergency Case',
      'Patient Vitals Telemetry (HR, SpO2, BP, ECG)',
      'Patient Medical Profile (Permission-Based)',
      'Ambulance Navigation & Corridor Routing',
      'Hospital Pre-Arrival Notification',
      'Emergency Alerts & Critical Mode',
      'Transport Status Controls',
      'Equipment Checklist',
      'Hospital Communication & ER Radio',
      'EMT Profile & Settings',
      'Logout',
    ],
    restrictedFeatures: [
      'Doctor Finder',
      'Hospital Administration & Bed Management',
      'System Administration',
      'Unassigned Patient Records',
      'Ambulance Fleet Administration',
    ],
  },
  ambulance_operator: {
    role: 'ambulance_operator',
    email: 'operator.demo@example.com',
    passwordHint: 'demo123',
    name: 'Suresh Naidu',
    title: '108 Fleet Dispatch Controller',
    badge: 'Fleet Operations (108)',
    category: 'First Responder',
    roleDescription: 'Fleet management, vehicle availability, dispatch queue routing, driver assignments, and corridor traffic tracking.',
    allowedFeatures: [
      'Operator Dashboard',
      'Fleet Management (4 Vehicles)',
      'Ambulance Assignments',
      'EMT & Driver Rosters',
      '112 Dispatch Requests Queue',
      'Active Cases Monitoring',
      'Vehicle Status & Maintenance Logs',
      'Route & Corridor Monitoring',
      'Operator Analytics',
      'Profile & Settings',
      'Logout',
    ],
    restrictedFeatures: [
      'Patient-facing Doctor Finder',
      'Doctor Clinical Dashboard',
      'Hospital Internal Bed Management',
      'System Administration',
      'Unauthorised Medical Records',
    ],
  },
  hospital_admin: {
    role: 'hospital_admin',
    email: 'hospital.demo@example.com',
    passwordHint: 'demo123',
    name: 'Priya Sharma',
    title: 'Medical Superintendent',
    badge: 'Medical Superintendent',
    category: 'Administrative',
    roleDescription: 'Facility capacity management, ER bed allocation, ICU resources, incoming ambulance queue, and hospital throughput.',
    allowedFeatures: [
      'Hospital Dashboard',
      'Incoming Ambulances & Pre-Arrival Queue',
      'Emergency Cases & Trauma Bay Allocation',
      'Hospital Resources & Capacity',
      'ICU and Bed Status',
      'Doctor Availability & On-Call Rosters',
      'Emergency Department Operations',
      'Pre-Arrival Coordination & Handover',
      'Hospital Analytics & Throughput',
      'Hospital Settings & Profile',
      'Logout',
    ],
    restrictedFeatures: [
      'System Administration',
      'Unauthorised Patient Medical Records',
      'Fleet Management Outside Permitted Hospital Workflows',
    ],
  },
  system_admin: {
    role: 'system_admin',
    email: 'admin.demo@example.com',
    passwordHint: 'demo123',
    name: 'Vikram Malhotra',
    title: 'System Operations & Security Admin',
    badge: 'System Operations',
    category: 'Administrative',
    roleDescription: 'System health monitoring, role permission management, audit logs, security & privacy controls, and demo configurations.',
    allowedFeatures: [
      'System Dashboard',
      'User Management',
      'Role Management (RBAC Matrix)',
      'Permission Management',
      'Audit Logs & Access History',
      'Security Settings & Privacy Controls',
      'Platform Telematics Analytics',
      'Feature Configuration & Toggles',
      'Demo Data Management & Scenario Reset',
      'Profile & Settings',
      'Logout',
    ],
    restrictedFeatures: [
      'Direct Patient Medical Care',
      'First Responder Tactical Driving',
    ],
  },
};

export interface RoleProfile {
  id: UserRole;
  title: string;
  category: 'Consumer / Patient' | 'First Responder' | 'Clinical / Hospital' | 'Administrative';
  badgeLabel: string;
  name: string;
  avatarInitials: string;
  description: string;
  primaryActionLabel: string;
  dashboardHighlights: string[];
  departmentOrAffiliation?: string;
  contactNumber?: string;
  verificationStatus?: string;
}

export type NavigationItemId =
  | 'home'
  | 'emergency'
  | 'smart_ambulance'
  | 'hospitals'
  | 'doctors'
  | 'traveller'
  | 'medical_profile'
  | 'family_tracking'
  | 'notifications'
  | 'analytics'
  | 'settings';

export const ROLE_PERMITTED_VIEWS: Record<UserRole, NavigationItemId[]> = {
  patient: [
    'home',
    'emergency',
    'smart_ambulance',
    'hospitals',
    'doctors',
    'traveller',
    'medical_profile',
    'family_tracking',
    'notifications',
    'settings',
  ],
  family_member: [
    'home',
    'family_tracking',
    'smart_ambulance',
    'hospitals',
    'medical_profile',
    'emergency',
    'notifications',
    'settings',
  ],
  doctor: [
    'home',
    'doctors',
    'emergency',
    'smart_ambulance',
    'hospitals',
    'medical_profile',
    'notifications',
    'settings',
  ],
  emt: [
    'home',
    'smart_ambulance',
    'emergency',
    'hospitals',
    'notifications',
    'settings',
  ],
  ambulance_operator: [
    'home',
    'smart_ambulance',
    'emergency',
    'hospitals',
    'analytics',
    'notifications',
    'settings',
  ],
  hospital_admin: [
    'home',
    'hospitals',
    'smart_ambulance',
    'emergency',
    'analytics',
    'notifications',
    'settings',
  ],
  system_admin: [
    'home',
    'analytics',
    'emergency',
    'hospitals',
    'smart_ambulance',
    'medical_profile',
    'notifications',
    'settings',
  ],
};

export const canRoleAccessView = (role: UserRole, view: NavigationItemId): boolean => {
  const allowed = ROLE_PERMITTED_VIEWS[role];
  return allowed ? allowed.includes(view) : false;
};

export const hasRole = (currentRole: UserRole, allowedRoles: UserRole | UserRole[]): boolean => {
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(currentRole);
  }
  return currentRole === allowedRoles;
};

export const hasPermission = (currentRole: UserRole, view: NavigationItemId): boolean => {
  return canRoleAccessView(currentRole, view);
};

export interface NavigationItem {
  id: NavigationItemId;
  label: string;
  description: string;
  category?: 'Core Services' | 'Clinical & Care' | 'System & Personal';
  badge?: string;
  isEmergency?: boolean;
  comingSoon?: boolean;
  stageNote?: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  bloodGroup?: string;
  abhaId?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications?: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider: string;
  policyNumber: string;
  lastTriageDate?: string;
}

export interface AmbulanceRecord {
  id: string;
  unitCode: string;
  type: 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Critical Care Transport';
  status: 'Available' | 'Dispatched' | 'En Route' | 'At Scene' | 'In Transit to ER' | 'Maintenance';
  driverName: string;
  emtName: string;
  currentLocation: string;
  hospitalDestination?: string;
  etaMinutes?: number;
  telemetryStatus: 'Active - High Bandwidth' | 'Standard Telemetry' | 'Offline';
  oxygenLevel: number;
  batteryReserve: number;
}

export interface HospitalRecord {
  id: string;
  name: string;
  traumaLevel: 'Level 1 Trauma' | 'Level 2 Trauma' | 'Community Hospital' | 'Specialty Cardiac Center';
  address: string;
  city?: string;
  state?: string;
  distanceKm: number;
  estimatedDriveMin: number;
  availableBeds: {
    er: number;
    icu: number;
    general: number;
  };
  erWaitTimeMin: number;
  helipadAvailable: boolean;
  specialties: string[];
  contactPhone: string;
  emergencyFeeInr?: number;
}

export interface DoctorRecord {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospitalAffiliation: string;
  availability: 'Available Today' | 'In Surgery' | 'On Call' | 'Next Available Tomorrow';
  languages: string[];
  rating: number;
  consultationModes: ('In-Person' | 'Telehealth' | 'Emergency Pre-Arrival')[];
  consultationFeeInr?: number;
}

export interface NotificationRecord {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'urgent' | 'info' | 'success' | 'warning';
  read: boolean;
  targetRole?: UserRole | 'all';
  actionUrl?: NavigationItemId;
}

export interface SmartAmbulanceVitals {
  heartRate: number;
  spO2: number;
  bloodPressure: string;
  respRate: number;
  temperature: number; // °F
  bloodGlucose: number; // mg/dL
  ecgStatus: string;
}

export type SmartAmbulanceTransportStatus =
  | 'Standby'
  | 'Dispatched'
  | 'En Route to Scene'
  | 'On Scene'
  | 'At Scene - Patient Loaded'
  | 'Transport In Progress'
  | 'Transport Paused'
  | 'Arrived at Hospital';

export type HospitalPreparationStatus =
  | 'Pending Acceptance'
  | 'Case Accepted'
  | 'Preparation in Progress'
  | 'Ready for Arrival'
  | 'Case Received';

export interface SmartAmbulanceAlert {
  id: string;
  timestamp: string;
  type: 'vitals_threshold' | 'status_change' | 'transport_started' | 'hospital_accepted' | 'arrival' | 'critical';
  title: string;
  message: string;
  severity: 'urgent' | 'warning' | 'info' | 'success';
  disclaimer: string;
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
}

export type DispatchSyncStatus = 'local_demo' | 'pending' | 'synced_server' | 'sync_error';

export interface EmergencyCase {
  caseId: string;
  clientRequestId?: string;
  dispatchSyncStatus: DispatchSyncStatus;
  syncErrorMessage?: string;
  patientName: string;
  patientAge: number;
  severity: 'Critical (Red)' | 'Urgent (Yellow)' | 'Standard (Green)';
  chiefComplaint: string;
  status: 'Dispatch Pending' | 'Ambulance En Route' | 'Patient Stabilized' | 'Handover Complete';
  assignedAmbulance: string;
  destinationHospital: string;
  etaMinutes: number;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    spO2: number;
    respRate: number;
    temperature?: number;
    bloodGlucose?: number;
    ecgStatus?: string;
  };
  simulatedTime: string;
}

export interface SystemStatusMetric {
  service: string;
  status: 'Operational' | 'Simulated Sync' | 'Standby';
  latencyMs: number;
  lastPing: string;
}

// ==========================================
// HOSPITAL PRE-ARRIVAL COORDINATION MODULE
// ==========================================

export type PreArrivalNotificationStatus =
  | 'Not Sent'
  | 'Sent'
  | 'Received'
  | 'Under Review'
  | 'Accepted'
  | 'Preparation in Progress'
  | 'Ready for Arrival'
  | 'Rejected';

export type PreArrivalResourceStatus =
  | 'Available'
  | 'Preparing'
  | 'Unavailable'
  | 'Not Required';

export type PreArrivalResourceName =
  | 'Emergency Department'
  | 'ICU'
  | 'Trauma Team'
  | 'Cardiologist'
  | 'Neurologist'
  | 'Ventilator'
  | 'Blood Bank'
  | 'Emergency Bed';

export interface PreArrivalHospitalResource {
  id: string;
  name: PreArrivalResourceName;
  category: 'Facility' | 'Specialist' | 'Equipment' | 'Support';
  status: PreArrivalResourceStatus;
  updatedAt: string;
  assignedUnit?: string;
}

export interface PreArrivalTimelineStep {
  stepNumber: number;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  status: 'completed' | 'current' | 'pending';
}

export interface PreArrivalAmbulanceCase {
  id: string;
  caseNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  ambulanceId: string;
  emtName: string;
  chiefComplaint: string;
  estimatedArrivalMin: number;
  emergencyPriority: 'Critical (Red)' | 'Urgent (Yellow)' | 'Standard (Green)';
  vitals: SmartAmbulanceVitals;
  requiredDepartment: string;
  requiredResources: string[];
  requiredSpecialist: string;
  notificationTimestamp: string;
  notificationStatus: PreArrivalNotificationStatus;
  destinationHospital: string;
  hospitalBay: string;
  preparationNotes: {
    id: string;
    author: string;
    role: string;
    text: string;
    timestamp: string;
  }[];
  requestedSpecialists: {
    id: string;
    specialist: string;
    requestedBy: string;
    timestamp: string;
    status: 'Requested' | 'Assigned' | 'En Route';
  }[];
  requestedEquipment: {
    id: string;
    equipment: string;
    requestedBy: string;
    timestamp: string;
    status: 'Requested' | 'Prepared' | 'Ready';
  }[];
  contactMessages: {
    id: string;
    sender: 'EMT' | 'Hospital' | 'Doctor';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
  rejectionReason?: string;
  aiDecisionSupport: {
    triageIndex: string;
    priorityRationale: string;
    suggestedActions: string[];
    disclaimer: string;
  };
}

