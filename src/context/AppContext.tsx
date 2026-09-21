import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserRole,
  AuthUser,
  DEMO_CREDENTIALS,
  NavigationItemId,
  NotificationRecord,
  EmergencyCase,
  RoleProfile,
  SmartAmbulanceVitals,
  SmartAmbulanceTransportStatus,
  HospitalPreparationStatus,
  SmartAmbulanceAlert,
  CaseTimelineEvent,
  PreArrivalNotificationStatus,
  PreArrivalResourceStatus,
  PreArrivalResourceName,
  PreArrivalHospitalResource,
  PreArrivalTimelineStep,
  PreArrivalAmbulanceCase,
  canRoleAccessView,
  hasRole,
  hasPermission,
} from '../types';
import {
  DEMO_ROLES,
  DEMO_NOTIFICATIONS,
  DEMO_ACTIVE_CASE,
} from '../data/mockData';
import {
  AppLanguage,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  TranslationStrings,
  LanguageOption,
} from '../data/translations';
import { api, setStoredSession, clearStoredSession, getStoredToken } from '../services/api';

export const INITIAL_SMART_VITALS: SmartAmbulanceVitals = {
  heartRate: 86,
  spO2: 97,
  bloodPressure: '136/84',
  respRate: 18,
  temperature: 98.6,
  bloodGlucose: 118,
  ecgStatus: 'Normal Sinus Rhythm (Telemetry Live)',
};

export const INITIAL_TIMELINE: CaseTimelineEvent[] = [
  {
    id: 'time-1',
    timestamp: '10:42 AM',
    title: 'Simulated 112 Emergency Call Received',
    description: 'Caller reported acute retrosternal chest pain with diaphoresis in Jubilee Hills.',
    actor: 'Hyderabad Central 112 Dispatch',
  },
  {
    id: 'time-2',
    timestamp: '10:45 AM',
    title: 'Unit 108-Hyd-42 Dispatched',
    description: 'ALS Ambulance mobilised from Gachibowli Base with EMT Ravi Kumar & Partner.',
    actor: '108 Fleet Operations',
  },
  {
    id: 'time-3',
    timestamp: '10:51 AM',
    title: 'On Scene & Patient Assessment Initiated',
    description: 'Patient Lakshmi Devi (71y) loaded. Supplemental O2 started via nasal cannula.',
    actor: 'EMT Ravi Kumar',
  },
  {
    id: 'time-4',
    timestamp: '10:54 AM',
    title: 'Smart Telemetry Streaming Activated',
    description: 'Live 12-lead ECG, NIBP, and pulse oximetry routed to Hyderabad Apex ER.',
    actor: 'Smart Ambulance Gateway',
  },
  {
    id: 'time-5',
    timestamp: '10:56 AM',
    title: 'Green Corridor Traffic Signal Pre-emption',
    description: 'Road No. 36 to Hitec City green corridor activated with Hyderabad Traffic Police.',
    actor: 'Traffic Corridor Sync',
  },
];

export const INITIAL_SMART_ALERTS: SmartAmbulanceAlert[] = [
  {
    id: 'alert-init-1',
    timestamp: '10:55 AM',
    type: 'transport_started',
    title: 'Transport In Progress to Hyderabad Apex',
    message: 'Ambulance is actively transporting patient under priority corridor clearance.',
    severity: 'info',
    disclaimer: 'Demo Alert — Not connected to real medical equipment.',
  },
  {
    id: 'alert-init-2',
    timestamp: '10:57 AM',
    type: 'hospital_accepted',
    title: 'Receiving Hospital Accepted Incoming Case',
    message: 'Dr. Arjun Rao confirmed Trauma Bay 2 reservation with Interventional Cardiology on standby.',
    severity: 'success',
    disclaimer: 'Demo Alert — Not connected to real medical equipment.',
  },
];

export const INITIAL_PRE_ARRIVAL_RESOURCES: PreArrivalHospitalResource[] = [
  {
    id: 'res-er',
    name: 'Emergency Department',
    category: 'Facility',
    status: 'Available',
    updatedAt: '10:50 AM',
    assignedUnit: 'Trauma Bay 2 Reserved',
  },
  {
    id: 'res-icu',
    name: 'ICU',
    category: 'Facility',
    status: 'Preparing',
    updatedAt: '10:52 AM',
    assignedUnit: 'Cardiac ICU Bed 4',
  },
  {
    id: 'res-trauma',
    name: 'Trauma Team',
    category: 'Support',
    status: 'Available',
    updatedAt: '10:54 AM',
    assignedUnit: 'Emergency Response Squad A',
  },
  {
    id: 'res-cardio',
    name: 'Cardiologist',
    category: 'Specialist',
    status: 'Available',
    updatedAt: '10:55 AM',
    assignedUnit: 'Dr. K. Srinivasulu Reddy (On Standby)',
  },
  {
    id: 'res-neuro',
    name: 'Neurologist',
    category: 'Specialist',
    status: 'Not Required',
    updatedAt: '10:45 AM',
    assignedUnit: 'Dr. Meenakshi S. (On Call)',
  },
  {
    id: 'res-vent',
    name: 'Ventilator',
    category: 'Equipment',
    status: 'Available',
    updatedAt: '10:53 AM',
    assignedUnit: 'Hamilton-T1 Transport/ER Bay 2',
  },
  {
    id: 'res-blood',
    name: 'Blood Bank',
    category: 'Support',
    status: 'Available',
    updatedAt: '10:56 AM',
    assignedUnit: '4 Units O+ Cross-Matched',
  },
  {
    id: 'res-bed',
    name: 'Emergency Bed',
    category: 'Facility',
    status: 'Preparing',
    updatedAt: '10:57 AM',
    assignedUnit: 'Trauma Resuscitation Bay 2',
  },
];

export const INITIAL_INCOMING_QUEUE: PreArrivalAmbulanceCase[] = [
  {
    id: 'case-hyd-402',
    caseNumber: 'EM-HYD-402',
    patientName: 'Lakshmi Devi',
    patientAge: 71,
    patientGender: 'Female',
    ambulanceId: 'Unit 108-Hyd-42 (ALS)',
    emtName: 'Ravi Kumar (Lead ALS)',
    chiefComplaint: 'Acute retrosternal chest pain radiating to jaw & diaphoresis',
    estimatedArrivalMin: 4,
    emergencyPriority: 'Critical (Red)',
    vitals: INITIAL_SMART_VITALS,
    requiredDepartment: 'Cardiology & Emergency Resuscitation',
    requiredResources: ['Emergency Department', 'Cardiologist', 'Trauma Team', 'Emergency Bed'],
    requiredSpecialist: 'Interventional Cardiologist',
    notificationTimestamp: '10:52 AM',
    notificationStatus: 'Accepted',
    destinationHospital: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
    hospitalBay: 'Trauma Bay 2',
    preparationNotes: [
      {
        id: 'note-1',
        author: 'Dr. Arjun Rao',
        role: 'Attending Emergency Physician',
        text: 'Pre-alerted Primary PCI Cath Lab. Prepare Aspirin 325mg and Heparin bolus on arrival.',
        timestamp: '10:56 AM',
      },
      {
        id: 'note-2',
        author: 'Lead Nurse Swathi',
        role: 'Trauma Bay Triage',
        text: 'Trauma Bay 2 suction checked, oxygen line pressurized, 12-lead telemetry cart docked.',
        timestamp: '10:58 AM',
      },
    ],
    requestedSpecialists: [
      {
        id: 'spec-1',
        specialist: 'Interventional Cardiologist (Dr. K. Srinivasulu)',
        requestedBy: 'Dr. Arjun Rao',
        timestamp: '10:54 AM',
        status: 'Assigned',
      },
    ],
    requestedEquipment: [
      {
        id: 'eq-1',
        equipment: 'Biphasic Defibrillator & POC Troponin',
        requestedBy: 'Dr. Arjun Rao',
        timestamp: '10:55 AM',
        status: 'Ready',
      },
    ],
    contactMessages: [
      {
        id: 'msg-1',
        sender: 'EMT',
        senderName: 'EMT Ravi Kumar',
        text: 'Patient stable on 4L O2 cannula. Sublingual Nitro administered at 10:50 AM. Pain reduced from 9/10 to 6/10.',
        timestamp: '10:53 AM',
      },
      {
        id: 'msg-2',
        sender: 'Hospital',
        senderName: 'Dr. Arjun Rao (ER Desk)',
        text: 'Trauma Bay 2 reserved. Direct gurney path open via Ambulance Gate B. Proceed with priority corridor.',
        timestamp: '10:55 AM',
      },
    ],
    aiDecisionSupport: {
      triageIndex: 'ESI Level 1 / Immediate Resuscitation',
      priorityRationale: 'STEMI criteria flagged via automated ST-elevation pattern recognition on Lead II telemetry.',
      suggestedActions: [
        'Direct transfer to Cath Lab on arrival (Door-to-Balloon target < 60m)',
        'Check dual antiplatelet loading doses administered by 108 crew',
        'Verify continuous SpO2 > 94% under supplemental O2',
      ],
      disclaimer: 'Demo decision-support indicator — not a diagnosis.',
    },
  },
  {
    id: 'case-hyd-405',
    caseNumber: 'EM-HYD-405',
    patientName: 'Rajesh Varma',
    patientAge: 54,
    patientGender: 'Male',
    ambulanceId: 'Unit 108-Hyd-18 (ALS)',
    emtName: 'Mohd. Imran',
    chiefComplaint: 'High-speed two-wheeler road collision, suspected pelvic & right femur fracture',
    estimatedArrivalMin: 11,
    emergencyPriority: 'Urgent (Yellow)',
    vitals: {
      heartRate: 104,
      spO2: 95,
      bloodPressure: '112/74',
      respRate: 22,
      temperature: 98.4,
      bloodGlucose: 138,
      ecgStatus: 'Sinus Tachycardia',
    },
    requiredDepartment: 'Trauma Surgery & Orthopedics',
    requiredResources: ['Trauma Team', 'Blood Bank', 'Emergency Bed'],
    requiredSpecialist: 'Trauma Orthopedic Surgeon',
    notificationTimestamp: '10:48 AM',
    notificationStatus: 'Under Review',
    destinationHospital: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
    hospitalBay: 'Trauma Bay 4',
    preparationNotes: [
      {
        id: 'note-405-1',
        author: 'Dr. Sneha Reddy',
        role: 'Resident Physician',
        text: 'Prepare pelvic binder and rapid infuser. Order emergency trauma series X-Ray & FAST ultrasound.',
        timestamp: '10:51 AM',
      },
    ],
    requestedSpecialists: [
      {
        id: 'spec-405-1',
        specialist: 'Orthopedic Trauma Consultant',
        requestedBy: 'Dr. Sneha Reddy',
        timestamp: '10:50 AM',
        status: 'Requested',
      },
    ],
    requestedEquipment: [
      {
        id: 'eq-405-1',
        equipment: 'Portable FAST Ultrasound & Pelvic Splint',
        requestedBy: 'Dr. Sneha Reddy',
        timestamp: '10:52 AM',
        status: 'Prepared',
      },
    ],
    contactMessages: [
      {
        id: 'msg-405-1',
        sender: 'EMT',
        senderName: 'EMT Mohd. Imran',
        text: 'C-spine immobilized. Traction splint applied to right leg. IV access 18G right antecubital running NS.',
        timestamp: '10:49 AM',
      },
    ],
    aiDecisionSupport: {
      triageIndex: 'ESI Level 2 / Emergent Triage',
      priorityRationale: 'High-energy vehicular trauma with tachycardia and potential occult hemorrhage.',
      suggestedActions: [
        'Perform immediate eFAST sonography at bedside',
        'Type and cross-match 4 units Packed Red Blood Cells (O-Neg ready)',
        'CT Pan-Scan once hemodynamics confirmed stable',
      ],
      disclaimer: 'Demo decision-support indicator — not a diagnosis.',
    },
  },
  {
    id: 'case-hyd-408',
    caseNumber: 'EM-HYD-408',
    patientName: 'Sneha Rao',
    patientAge: 29,
    patientGender: 'Female',
    ambulanceId: 'Unit 108-Hyd-29 (BLS)',
    emtName: 'Kavitha Devi',
    chiefComplaint: 'Acute biphasic anaphylaxis with stridor following seafood ingestion in Madhapur',
    estimatedArrivalMin: 18,
    emergencyPriority: 'Critical (Red)',
    vitals: {
      heartRate: 122,
      spO2: 91,
      bloodPressure: '88/54',
      respRate: 28,
      temperature: 99.1,
      bloodGlucose: 106,
      ecgStatus: 'Sinus Tachycardia with respiratory artifact',
    },
    requiredDepartment: 'Emergency & Critical Care',
    requiredResources: ['Emergency Department', 'ICU', 'Ventilator'],
    requiredSpecialist: 'Critical Care Anesthesiologist',
    notificationTimestamp: '10:52 AM',
    notificationStatus: 'Sent',
    destinationHospital: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
    hospitalBay: 'Resuscitation Bay 1',
    preparationNotes: [],
    requestedSpecialists: [],
    requestedEquipment: [
      {
        id: 'eq-408-1',
        equipment: 'Difficult Airway Cart & Video Laryngoscope',
        requestedBy: 'Dr. Arjun Rao',
        timestamp: '10:54 AM',
        status: 'Requested',
      },
    ],
    contactMessages: [
      {
        id: 'msg-408-1',
        sender: 'EMT',
        senderName: 'EMT Kavitha Devi',
        text: 'Intramuscular Epinephrine 0.5mg administered at 10:47 AM. High flow O2 NRB mask 12L/min. Persistent stridor.',
        timestamp: '10:52 AM',
      },
    ],
    aiDecisionSupport: {
      triageIndex: 'ESI Level 1 / Immediate Airway Threat',
      priorityRationale: 'Hypotension (BP 88/54) with compromised upper airway stridor and hypoxia.',
      suggestedActions: [
        'Prepare for emergent rapid sequence intubation with surgical cricothyroidotomy backup',
        'Prepare IV Epinephrine infusion & IV Hydrocortisone 200mg',
        'Rapid bolus 1000mL warm crystalloids',
      ],
      disclaimer: 'Demo decision-support indicator — not a diagnosis.',
    },
  },
];

export const computePreArrivalTimelineSteps = (
  notificationStatus: PreArrivalNotificationStatus,
  transportStatus: SmartAmbulanceTransportStatus,
  hospitalBay: string
): PreArrivalTimelineStep[] => {
  const isCaseCreated = true;
  const isAmbulanceAssigned = true;
  const isNotifSent = notificationStatus !== 'Not Sent';
  const isNotifReceived =
    isNotifSent &&
    ['Received', 'Under Review', 'Accepted', 'Preparation in Progress', 'Ready for Arrival', 'Rejected'].includes(
      notificationStatus
    );
  const isCaseReviewed =
    isNotifReceived &&
    ['Under Review', 'Accepted', 'Preparation in Progress', 'Ready for Arrival', 'Rejected'].includes(
      notificationStatus
    );
  const isHospitalAccepted =
    isCaseReviewed &&
    ['Accepted', 'Preparation in Progress', 'Ready for Arrival'].includes(notificationStatus);
  const isPrepStarted =
    isHospitalAccepted &&
    ['Preparation in Progress', 'Ready for Arrival'].includes(notificationStatus);
  const isHospitalReady =
    isPrepStarted && notificationStatus === 'Ready for Arrival';
  const isAmbulanceArrived = transportStatus === 'Arrived at Hospital';
  const isPatientReceived = isAmbulanceArrived && (isHospitalReady || isHospitalAccepted);

  return [
    {
      stepNumber: 1,
      title: 'Emergency case created',
      description: 'Emergency 112 emergency call logged for acute retrosternal chest pain in Jubilee Hills.',
      timestamp: '10:42 AM',
      actor: '112 Central Dispatch Hyderabad',
      status: 'completed',
    },
    {
      stepNumber: 2,
      title: 'Ambulance assigned',
      description: 'Unit 108-Hyd-42 (ALS) mobilised with EMT Ravi Kumar & Priya Sharma.',
      timestamp: '10:45 AM',
      actor: '108 Fleet Operations Center',
      status: 'completed',
    },
    {
      stepNumber: 3,
      title: 'Pre-arrival notification sent',
      description: isNotifSent
        ? 'Digital pre-arrival telemetry packet broadcast to receiving emergency department.'
        : 'Pending EMT transmission once patient assessment is consolidated.',
      timestamp: isNotifSent ? '10:52 AM' : 'Pending',
      actor: 'EMT Ravi Kumar (Unit 108-Hyd-42)',
      status: isNotifSent ? 'completed' : 'current',
    },
    {
      stepNumber: 4,
      title: 'Hospital notification received',
      description: isNotifReceived
        ? 'Pre-arrival notification captured at triage gateway & display console.'
        : isNotifSent
        ? 'Transmitting via secure telemetry link...'
        : 'Awaiting pre-arrival transmission from ambulance.',
      timestamp: isNotifReceived ? '10:53 AM' : 'Pending',
      actor: 'Hospital ER Operations Desk',
      status: isNotifReceived ? 'completed' : isNotifSent ? 'current' : 'pending',
    },
    {
      stepNumber: 5,
      title: 'Case reviewed',
      description: isCaseReviewed
        ? 'Case triage parameters and 12-lead ECG telemetry assessed by on-duty ER team.'
        : 'Emergency physician awaiting clinical review.',
      timestamp: isCaseReviewed ? '10:54 AM' : 'Pending',
      actor: 'Dr. Arjun Rao (Attending ER Physician)',
      status: isCaseReviewed ? 'completed' : isNotifReceived ? 'current' : 'pending',
    },
    {
      stepNumber: 6,
      title: 'Hospital accepted',
      description:
        notificationStatus === 'Rejected'
          ? 'Case diversion recorded: ER at surge capacity, patient rerouted.'
          : isHospitalAccepted
          ? `Case formally accepted. ${hospitalBay} reserved with priority trauma status.`
          : 'Pending formal hospital intake acceptance or diversion decision.',
      timestamp: isHospitalAccepted ? '10:55 AM' : 'Pending',
      actor: 'Medical Superintendent / ER Administrator',
      status: isHospitalAccepted ? 'completed' : isCaseReviewed ? 'current' : 'pending',
    },
    {
      stepNumber: 7,
      title: 'Preparation started',
      description: isPrepStarted
        ? 'Cath Lab 1, interventional cardiologist, and resuscitation bay mobilization in progress.'
        : isHospitalAccepted
        ? 'Hospital accepted case; awaiting start of physical bay preparation.'
        : 'Preparation pending hospital acceptance.',
      timestamp: isPrepStarted ? '10:56 AM' : 'Pending',
      actor: 'Trauma & Nursing Response Team',
      status: isPrepStarted ? 'completed' : isHospitalAccepted ? 'current' : 'pending',
    },
    {
      stepNumber: 8,
      title: 'Hospital ready',
      description: isHospitalReady
        ? `${hospitalBay} fully prepped with ventilator, rapid infuser, and multidisciplinary trauma staff at bay entrance.`
        : isPrepStarted
        ? 'Trauma team sterilizing equipment and finalizing bed setup.'
        : 'Awaiting completion of clinical preparation.',
      timestamp: isHospitalReady ? '10:58 AM' : 'Pending',
      actor: 'Dr. Arjun Rao & Lead ER Nurse',
      status: isHospitalReady ? 'completed' : isPrepStarted ? 'current' : 'pending',
    },
    {
      stepNumber: 9,
      title: 'Ambulance arrived',
      description: isAmbulanceArrived
        ? 'Ambulance vehicle docked at Emergency Ambulance Bay. Docking confirmed.'
        : 'Ambulance navigating designated Hyderabad green corridor.',
      timestamp: isAmbulanceArrived ? '11:01 AM' : 'ETA ~4 mins',
      actor: 'Ambulance Driver & Security Gate Desk',
      status: isAmbulanceArrived ? 'completed' : isHospitalReady ? 'current' : 'pending',
    },
    {
      stepNumber: 10,
      title: 'Patient received',
      description: isPatientReceived
        ? `Gurney transfer complete. Patient transferred directly to ${hospitalBay}.`
        : isAmbulanceArrived
        ? 'Gurney unloading and clinical handover underway at ER entrance.'
        : 'Handover protocol pending ambulance arrival.',
      timestamp: isPatientReceived ? '11:03 AM' : 'Pending',
      actor: 'Emergency Resuscitation Team',
      status: isPatientReceived ? 'completed' : isAmbulanceArrived ? 'current' : 'pending',
    },
  ];
};

interface AppContextType {
  // Authentication & Role-Based Access Control (RBAC)
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (role: UserRole, email?: string) => Promise<boolean>;
  logout: () => void;
  switchRoleLogin: (role: UserRole) => void;
  hasPermission: (view: NavigationItemId) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;

  currentRole: UserRole;
  currentRoleProfile: RoleProfile;
  setCurrentRole: (role: UserRole) => void;
  currentView: NavigationItemId;
  setCurrentView: (view: NavigationItemId) => void;
  isLargeText: boolean;
  toggleLargeText: () => void;
  isRoleSelectorOpen: boolean;
  setIsRoleSelectorOpen: (open: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
  notifications: NotificationRecord[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  activeCase: EmergencyCase;
  isSimulatedDispatchActive: boolean;
  isSubmittingSOS: boolean;
  triggerSimulatedEmergency: () => Promise<void>;
  resetSimulatedEmergency: () => void;
  currentLanguage: AppLanguage;
  setCurrentLanguage: (lang: AppLanguage) => void;
  t: TranslationStrings;
  supportedLanguages: LanguageOption[];

  // Smart Ambulance Module State & Methods
  smartVitals: SmartAmbulanceVitals;
  smartAmbulanceId: string;
  smartAssignedEmt: string;
  smartAssignedDriver: string;
  smartCurrentCaseId: string;
  smartPatientName: string;
  smartPatientAge: number;
  smartPatientGender: string;
  smartDestinationHospital: string;
  smartTransportStatus: SmartAmbulanceTransportStatus;
  smartEtaMinutes: number;
  smartGpsLocation: {
    address: string;
    coordinates: string;
    corridorStatus: string;
  };
  smartHospitalPrepStatus: HospitalPreparationStatus;
  smartRequiredCareCategory: string;
  smartSeverity: 'Critical (Red)' | 'Urgent (Yellow)' | 'Standard (Green)';
  smartSimulatedConsent: boolean;
  smartAlerts: SmartAmbulanceAlert[];
  smartTimeline: CaseTimelineEvent[];
  smartDoctorOrders: string[];
  smartHospitalBay: string;
  isSimulationControlOpen: boolean;
  setIsSimulationControlOpen: (open: boolean) => void;

  // Hospital Pre-Arrival Coordination Module
  preArrivalStatus: PreArrivalNotificationStatus;
  setPreArrivalStatus: (status: PreArrivalNotificationStatus) => void;
  preArrivalResources: PreArrivalHospitalResource[];
  updatePreArrivalResourceStatus: (
    name: PreArrivalResourceName,
    status: PreArrivalResourceStatus,
    note?: string
  ) => void;
  incomingAmbulanceQueue: PreArrivalAmbulanceCase[];
  activePreArrivalCase: PreArrivalAmbulanceCase;
  preArrivalTimelineSteps: PreArrivalTimelineStep[];
  isDemoScenarioRunning: boolean;
  demoScenarioCurrentStep: number;
  demoScenarioMessage: string;
  runDemoScenario: () => void;
  cancelDemoScenario: () => void;
  setManualPreArrivalStatus: (status: PreArrivalNotificationStatus) => void;

  // EMT Pre-Arrival Actions
  sendPreArrivalNotification: () => void;
  updatePatientPreArrivalInfo: (info: {
    patientName?: string;
    patientAge?: number;
    patientGender?: string;
    chiefComplaint?: string;
    severity?: 'Critical (Red)' | 'Urgent (Yellow)' | 'Standard (Green)';
    requiredCareCategory?: string;
  }) => void;
  changeDestinationHospital: (hospitalName: string, etaMin?: number) => void;
  contactHospitalPreArrival: (message: string) => void;
  cancelPreArrivalNotification: (reason?: string) => void;

  // Hospital Pre-Arrival Actions
  acceptPreArrivalCase: (caseId?: string) => void;
  rejectPreArrivalCase: (reason: string, caseId?: string) => void;
  requestMoreInfoFromEmt: (inquiry: string, caseId?: string) => void;
  startHospitalPreparation: (caseId?: string) => void;
  markHospitalReady: (caseId?: string) => void;
  contactEmtFromHospital: (message: string, caseId?: string) => void;

  // Doctor Pre-Arrival Actions
  reviewPreArrivalCase: (caseId?: string) => void;
  requestDoctorSpecialist: (specialistName: string, caseId?: string) => void;
  requestDoctorEquipment: (equipmentName: string, caseId?: string) => void;
  addDoctorPreparationNote: (note: string, caseId?: string) => void;

  // Actions
  updateSmartVitals: (vitals: Partial<SmartAmbulanceVitals>) => void;
  setSmartTransportStatus: (status: SmartAmbulanceTransportStatus) => void;
  setSmartHospitalPrepStatus: (status: HospitalPreparationStatus) => void;
  toggleSmartCritical: (force?: boolean) => void;
  toggleSmartConsent: () => void;
  addDoctorOrder: (order: string) => void;
  notifyHospitalTeam: (teamName: string) => void;
  requestDoctorInfo: (query: string) => void;
  contactHospitalFromAmbulance: (msg: string) => void;
  shareAmbulanceLocation: () => void;
  confirmHospitalArrival: () => void;
  dismissSmartAlert: (id: string) => void;
  triggerSimulationPreset: (
    preset: 'vital_spike' | 'vital_stabilize' | 'critical_toggle' | 'cycle_transport' | 'cycle_hospital'
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem('aegiscare_auth_session');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    try {
      const savedRole = sessionStorage.getItem('aegiscare_current_role') as UserRole | null;
      if (savedRole && DEMO_CREDENTIALS[savedRole]) {
        return savedRole;
      }
    } catch {
      // fallback
    }
    return 'patient';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedAuth = sessionStorage.getItem('aegiscare_auth_session');
      if (savedAuth !== 'true') return null;

      const savedRole = (sessionStorage.getItem('aegiscare_current_role') as UserRole) || 'patient';
      const cred = DEMO_CREDENTIALS[savedRole] || DEMO_CREDENTIALS.patient;
      const profile = DEMO_ROLES[savedRole] || DEMO_ROLES.patient;
      return {
        id: `user-${savedRole}-demo`,
        email: cred.email,
        role: savedRole,
        name: profile.name,
        title: profile.title,
        avatarInitials: profile.avatarInitials,
        departmentOrAffiliation: profile.departmentOrAffiliation || cred.category,
        token: `demo-token-${savedRole}-${Date.now()}`,
        lastLogin: 'Session Active',
      };
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<NavigationItemId>('home');
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>(DEMO_NOTIFICATIONS);
  const [activeCase, setActiveCase] = useState<EmergencyCase>(DEMO_ACTIVE_CASE);
  const [isSimulatedDispatchActive, setIsSimulatedDispatchActive] = useState<boolean>(true);
  const [isSubmittingSOS, setIsSubmittingSOS] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>('en');

  // Verify server session on mount if token exists
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      const token = getStoredToken();
      if (!token) return;

      try {
        const res = await api.getCurrentUser();
        if (!isMounted) return;

        if (res.success && res.data?.user) {
          const u = res.data.user;
          const role = u.role as UserRole;
          setCurrentRoleState(role);
          setCurrentUser({
            id: u.id,
            email: u.email,
            role,
            name: u.name,
            title: u.title,
            avatarInitials: u.avatarInitials,
            departmentOrAffiliation: u.departmentOrAffiliation,
            associatedHospitalId: u.associatedHospitalId,
            associatedAmbulanceId: u.associatedAmbulanceId,
            associatedPatientId: u.associatedPatientId,
            token,
            lastLogin: 'Verified Active Session',
          });
          setIsAuthenticated(true);
        } else if (res.error?.code === 'UNAUTHORIZED' || res.error?.code === 'TOKEN_EXPIRED') {
          // Explicit token invalidation from server
          clearStoredSession();
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('Session verification fallback to offline state', err);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Role Login & Logout methods connected to backend API
  const login = useCallback(async (role: UserRole, email?: string, password = 'demo123'): Promise<boolean> => {
    const cred = DEMO_CREDENTIALS[role];
    const targetEmail = email || cred.email;

    try {
      // Authenticate with backend API
      const res = await api.login({
        email: targetEmail,
        password,
        role,
      });

      if (res.success && res.data) {
        const { token, user } = res.data;
        setStoredSession(token, user);

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          name: user.name,
          title: user.title,
          avatarInitials: user.avatarInitials,
          departmentOrAffiliation: user.departmentOrAffiliation || cred.category,
          token,
          lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setCurrentRoleState(user.role as UserRole);
        setCurrentUser(authUser);
        setIsAuthenticated(true);
        setCurrentView('home');
        setIsRoleSelectorOpen(false);

        try {
          sessionStorage.setItem('aegiscare_auth_session', 'true');
          sessionStorage.setItem('aegiscare_current_role', user.role);
        } catch {
          // ignore
        }
        return true;
      }
    } catch (e) {
      console.warn('Backend login fallback to local session', e);
    }

    // Fallback if backend is cold starting
    const profile = DEMO_ROLES[role];
    const userObj: AuthUser = {
      id: `user-${role}-demo`,
      email: targetEmail,
      role,
      name: profile.name,
      title: profile.title,
      avatarInitials: profile.avatarInitials,
      departmentOrAffiliation: profile.departmentOrAffiliation || cred.category,
      token: `demo-jwt-token-${role}-${Date.now()}`,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentRoleState(role);
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    setCurrentView('home');
    setIsRoleSelectorOpen(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    // Notify backend
    api.logout().catch(() => {});
    clearStoredSession();

    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('home');
    setIsRoleSelectorOpen(false);
    setIsNotificationsDrawerOpen(false);
    setIsEmergencyModalOpen(false);
    setIsSimulationControlOpen(false);

    try {
      sessionStorage.removeItem('aegiscare_auth_session');
      sessionStorage.removeItem('aegiscare_current_role');
    } catch {
      // ignore
    }
  }, []);

  const switchRoleLogin = useCallback((role: UserRole) => {
    login(role);
  }, [login]);

  const setCurrentRole = useCallback((role: UserRole) => {
    login(role);
  }, [login]);

  const hasPerm = useCallback((view: NavigationItemId) => {
    return canRoleAccessView(currentRole, view);
  }, [currentRole]);

  const hasRoleCheck = useCallback((roles: UserRole | UserRole[]) => {
    return hasRole(currentRole, roles);
  }, [currentRole]);

  // Smart Ambulance Module State
  const [smartVitals, setSmartVitals] = useState<SmartAmbulanceVitals>(INITIAL_SMART_VITALS);
  const [smartAmbulanceId] = useState<string>('Unit 108-Hyd-42 (ALS)');
  const [smartAssignedEmt] = useState<string>('Ravi Kumar (Lead ALS Paramedic)');
  const [smartAssignedDriver] = useState<string>('Priya Sharma');
  const [smartCurrentCaseId] = useState<string>('EM-HYD-402');
  const [smartPatientName, setSmartPatientName] = useState<string>('Lakshmi Devi');
  const [smartPatientAge, setSmartPatientAge] = useState<number>(71);
  const [smartPatientGender, setSmartPatientGender] = useState<string>('Female');
  const [smartChiefComplaint, setSmartChiefComplaint] = useState<string>('Acute retrosternal chest pain radiating to jaw & diaphoresis');
  const [smartDestinationHospital, setSmartDestinationHospital] = useState<string>('Hyderabad Apex Trauma & Multi-Speciality (Demo)');
  const [smartTransportStatus, setSmartTransportStatusState] = useState<SmartAmbulanceTransportStatus>('Transport In Progress');
  const [smartEtaMinutes, setSmartEtaMinutes] = useState<number>(4);
  const [smartGpsLocation] = useState({
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    coordinates: '17.4325° N, 78.3980° E',
    corridorStatus: 'Active Green Wave Signal Pre-emption',
  });
  const [smartHospitalPrepStatus, setSmartHospitalPrepStatusState] = useState<HospitalPreparationStatus>('Preparation in Progress');
  const [smartRequiredCareCategory, setSmartRequiredCareCategory] = useState<string>('Cardiac Emergency / Cath Lab (Primary PCI)');
  const [smartSeverity, setSmartSeverity] = useState<'Critical (Red)' | 'Urgent (Yellow)' | 'Standard (Green)'>('Urgent (Yellow)');
  const [smartSimulatedConsent, setSmartSimulatedConsent] = useState<boolean>(true);
  const [smartAlerts, setSmartAlerts] = useState<SmartAmbulanceAlert[]>(INITIAL_SMART_ALERTS);
  const [smartTimeline, setSmartTimeline] = useState<CaseTimelineEvent[]>(INITIAL_TIMELINE);
  const [smartDoctorOrders, setSmartDoctorOrders] = useState<string[]>([
    'Reserve Trauma Bay 2 with emergency suction & biphasic defibrillator',
    'Pre-alert Primary PCI Interventional Cardiology team',
    'Prepare 2 units PRBC O-Positive blood match on standby',
  ]);
  const [smartHospitalBay, setSmartHospitalBay] = useState<string>('Trauma Bay 2');
  const [isSimulationControlOpen, setIsSimulationControlOpen] = useState<boolean>(false);

  // Hospital Pre-Arrival Coordination State
  const [preArrivalStatus, setPreArrivalStatusState] = useState<PreArrivalNotificationStatus>('Accepted');
  const [preArrivalResources, setPreArrivalResources] = useState<PreArrivalHospitalResource[]>(INITIAL_PRE_ARRIVAL_RESOURCES);
  const [incomingAmbulanceQueue, setIncomingAmbulanceQueue] = useState<PreArrivalAmbulanceCase[]>(INITIAL_INCOMING_QUEUE);
  const [isDemoScenarioRunning, setIsDemoScenarioRunning] = useState<boolean>(false);
  const [demoScenarioCurrentStep, setDemoScenarioCurrentStep] = useState<number>(0);
  const [demoScenarioMessage, setDemoScenarioMessage] = useState<string>('');
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to append a demo alert with the mandatory prototype disclaimer
  const addSmartAlert = useCallback(
    (
      type: SmartAmbulanceAlert['type'],
      title: string,
      message: string,
      severity: SmartAmbulanceAlert['severity'] = 'info'
    ) => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newAlert: SmartAmbulanceAlert = {
        id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: nowStr,
        type,
        title,
        message,
        severity,
        disclaimer: 'Demo Alert — Not connected to real medical equipment.',
      };
      setSmartAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);

      // Also post to generic notification drawer if urgent or warning
      if (severity === 'urgent' || severity === 'warning') {
        const notif: NotificationRecord = {
          id: `notif-${Date.now()}`,
          timestamp: 'Just now',
          title: `[Simulated Alert] ${title}`,
          message: `${message} (Demo Alert — Not connected to real medical equipment.)`,
          severity,
          read: false,
          targetRole: 'all',
          actionUrl: 'smart_ambulance',
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    },
    []
  );

  // Helper to append timeline event
  const addTimelineEvent = useCallback((title: string, description: string, actor: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: CaseTimelineEvent = {
      id: `time-${Date.now()}`,
      timestamp: nowStr,
      title,
      description,
      actor,
    };
    setSmartTimeline((prev) => [...prev, newEvent]);
  }, []);

  // Update vitals with threshold checking
  const updateSmartVitals = useCallback(
    (newVitals: Partial<SmartAmbulanceVitals>) => {
      setSmartVitals((prev) => {
        const updated: SmartAmbulanceVitals = { ...prev, ...newVitals };

        // Threshold checks (realistic medical telemetry demo ranges, clearly labeled as parameter checks)
        if (updated.heartRate > 110) {
          addSmartAlert(
            'vitals_threshold',
            'Observed Demo Metric: Elevated Heart Rate Parameter',
            `Heart rate simulated at ${updated.heartRate} bpm. High rate telemetry flag raised.`,
            'urgent'
          );
        } else if (updated.heartRate < 50) {
          addSmartAlert(
            'vitals_threshold',
            'Observed Demo Metric: Low Heart Rate Parameter',
            `Heart rate simulated at ${updated.heartRate} bpm. Bradycardia telemetry flag raised.`,
            'warning'
          );
        }

        if (updated.spO2 < 93) {
          addSmartAlert(
            'vitals_threshold',
            'Observed Demo Metric: SpO2 Oxygen Saturation Deviation',
            `Pulse oximeter reading dropped to ${updated.spO2}%. O2 cannula flow check indicated.`,
            'urgent'
          );
        }

        if (updated.temperature > 100.4) {
          addSmartAlert(
            'vitals_threshold',
            'Observed Demo Metric: Pyrexia Temperature Check',
            `Body temperature recorded at ${updated.temperature}°F.`,
            'warning'
          );
        }

        if (updated.bloodGlucose > 180) {
          addSmartAlert(
            'vitals_threshold',
            'Observed Demo Metric: Blood Glucose Parameter High',
            `Capillary blood glucose recorded at ${updated.bloodGlucose} mg/dL.`,
            'warning'
          );
        } else if (updated.bloodGlucose < 70) {
          addSmartAlert(
            'vitals_threshold',
            'Observed Demo Metric: Hypoglycemia Parameter Warning',
            `Capillary blood glucose recorded low at ${updated.bloodGlucose} mg/dL.`,
            'urgent'
          );
        }

        return updated;
      });

      // Keep activeCase in sync
      setActiveCase((prev) => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          heartRate: newVitals.heartRate ?? prev.vitals.heartRate,
          bloodPressure: newVitals.bloodPressure ?? prev.vitals.bloodPressure,
          spO2: newVitals.spO2 ?? prev.vitals.spO2,
          respRate: newVitals.respRate ?? prev.vitals.respRate,
          temperature: newVitals.temperature ?? prev.vitals.temperature,
          bloodGlucose: newVitals.bloodGlucose ?? prev.vitals.bloodGlucose,
          ecgStatus: newVitals.ecgStatus ?? prev.vitals.ecgStatus,
        },
      }));
    },
    [addSmartAlert]
  );

  // Set transport status
  const setSmartTransportStatus = useCallback(
    (status: SmartAmbulanceTransportStatus) => {
      setSmartTransportStatusState(status);
      addTimelineEvent(
        `Transport Status: ${status}`,
        `Ambulance status updated to "${status}". Notification dispatched to ER & Traffic Control.`,
        'EMT Ravi Kumar (Unit 108-Hyd-42)'
      );

      if (status === 'Transport In Progress') {
        addSmartAlert(
          'transport_started',
          'Ambulance Transport In Progress',
          'Unit 108-Hyd-42 has commenced active patient transport towards Hyderabad Apex.',
          'info'
        );
        setSmartEtaMinutes(4);
      } else if (status === 'Transport Paused') {
        addSmartAlert(
          'status_change',
          'Transport Paused: In-Transit Patient Stabilization',
          'Ambulance vehicle paused safely roadside for patient stabilization protocol.',
          'warning'
        );
        setSmartEtaMinutes((prev) => prev + 3);
      } else if (status === 'Arrived at Hospital') {
        addSmartAlert(
          'arrival',
          'Ambulance Arrived at Hospital ER Bay',
          'Unit 108-Hyd-42 arrived at Hyderabad Apex Trauma Bay 2. Patient handover commenced.',
          'success'
        );
        setSmartEtaMinutes(0);
        setSmartHospitalPrepStatusState('Ready for Arrival');
      }
    },
    [addSmartAlert, addTimelineEvent]
  );

  // Set hospital preparation status
  const setSmartHospitalPrepStatus = useCallback(
    (status: HospitalPreparationStatus) => {
      setSmartHospitalPrepStatusState(status);
      addTimelineEvent(
        `Hospital Preparation: ${status}`,
        `Emergency Department updated preparation status to "${status}".`,
        'Dr. Arjun Rao / Priya Sharma (Hyderabad Apex)'
      );

      if (status === 'Case Accepted') {
        addSmartAlert(
          'hospital_accepted',
          'Hospital Accepted Inbound Case',
          'Hyderabad Apex ER attending team formally accepted Case #EM-HYD-402.',
          'success'
        );
      } else if (status === 'Preparation in Progress') {
        addSmartAlert(
          'status_change',
          'ER Preparation in Progress',
          'Trauma Bay 2 nursing staff and Cath Lab 1 on pre-procedure standby.',
          'info'
        );
      } else if (status === 'Ready for Arrival') {
        addSmartAlert(
          'status_change',
          'Trauma Bay Primed & Ready for Patient Arrival',
          'Defibrillator, suction, and attending physicians stationed at Bay 2.',
          'success'
        );
      } else if (status === 'Case Received') {
        addSmartAlert(
          'status_change',
          'Patient Handover Formalised (Case Received)',
          'Patient transferred from 108 gurney to ER resuscitation bed.',
          'success'
        );
      }
    },
    [addSmartAlert, addTimelineEvent]
  );

  // Toggle Critical severity
  const toggleSmartCritical = useCallback(
    (force?: boolean) => {
      setSmartSeverity((prev) => {
        const next = force !== undefined ? (force ? 'Critical (Red)' : 'Urgent (Yellow)') : prev === 'Critical (Red)' ? 'Urgent (Yellow)' : 'Critical (Red)';
        if (next === 'Critical (Red)') {
          addSmartAlert(
            'critical',
            'SIMULATED RED ALERT: Case Severity Upgraded to Critical',
            'Attending trauma resuscitation team paged. Immediate cath lab readiness activated.',
            'urgent'
          );
          addTimelineEvent('Severity Escalated to Critical Red', 'EMT marked patient condition as critical during transit.', 'EMT Ravi Kumar');
        } else {
          addSmartAlert(
            'status_change',
            'Case Severity Re-classified to Urgent Yellow',
            'Patient vitals stabilized following sublingual medication and oxygen support.',
            'info'
          );
        }
        return next;
      });
    },
    [addSmartAlert, addTimelineEvent]
  );

  // Toggle simulated consent
  const toggleSmartConsent = useCallback(() => {
    setSmartSimulatedConsent((prev) => {
      const next = !prev;
      api.toggleConsent('pat-1', 'usr-family-1', next).catch(() => {});
      addSmartAlert(
        'status_change',
        next ? 'ABHA Emergency Data Sharing Consent Enabled' : 'Patient Data Privacy Restricting Enabled',
        next
          ? 'Emergency medical history sharing authorized by registered family caregiver (Rajesh Reddy).'
          : 'Detailed medical history masked under simulated patient consent preferences.',
        'info'
      );
      return next;
    });
  }, [addSmartAlert]);

  // Add doctor clinical order
  const addDoctorOrder = useCallback(
    (order: string) => {
      if (!order.trim()) return;
      api.createClinicalOrder({ caseId: 'case-1', orderText: order.trim() }).catch(() => {});
      setSmartDoctorOrders((prev) => [...prev, order.trim()]);
      addTimelineEvent(`Doctor Order: ${order.trim()}`, 'Attending ER Physician issued pre-arrival directive to ambulance crew.', 'Dr. Arjun Rao');
      addSmartAlert(
        'status_change',
        'New Clinical Pre-Arrival Order Transmitted',
        `Dr. Arjun Rao ordered: "${order.trim()}" to Unit 108 crew.`,
        'info'
      );
    },
    [addSmartAlert, addTimelineEvent]
  );

  // Notify hospital team
  const notifyHospitalTeam = useCallback(
    (teamName: string) => {
      addTimelineEvent(`Specialty Team Alerted: ${teamName}`, `Paging system dispatched pre-arrival alert to ${teamName}.`, 'Dr. Arjun Rao');
      addSmartAlert(
        'status_change',
        `Hospital Team Paged: ${teamName}`,
        `${teamName} received inbound telemetry packet and is mobilizing.`,
        'success'
      );
    },
    [addSmartAlert, addTimelineEvent]
  );

  // Request doctor info from EMT
  const requestDoctorInfo = useCallback(
    (query: string) => {
      addTimelineEvent(`Doctor Clinical Query: ${query}`, 'Physician requested in-transit clarification from EMT crew.', 'Dr. Arjun Rao');
      addSmartAlert(
        'status_change',
        'Physician Telemetry Clarification Requested',
        `Doctor queried: "${query}". EMT notified on vehicle terminal.`,
        'info'
      );
    },
    [addSmartAlert, addTimelineEvent]
  );

  // Contact hospital from ambulance
  const contactHospitalFromAmbulance = useCallback(
    (msg: string) => {
      addTimelineEvent(`Ambulance Radio Intercom: ${msg}`, 'Direct voice/data relay with receiving trauma bay.', 'EMT Ravi Kumar');
      addSmartAlert(
        'status_change',
        'Ambulance Transmitted Radio Update',
        `EMT reported: "${msg}" to Hyderabad Apex ER team.`,
        'info'
      );
    },
    [addSmartAlert, addTimelineEvent]
  );

  // Share location
  const shareAmbulanceLocation = useCallback(() => {
    addSmartAlert(
      'status_change',
      'High-Precision GPS Location Beacon Shared',
      'Coordinates 17.4325° N, 78.3980° E relayed to Hyderabad Traffic Police & Apex ER console.',
      'info'
    );
  }, [addSmartAlert]);

  // Confirm arrival
  const confirmHospitalArrival = useCallback(() => {
    setSmartTransportStatus('Arrived at Hospital');
  }, [setSmartTransportStatus]);

  // Dismiss alert
  const dismissSmartAlert = useCallback((id: string) => {
    setSmartAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Demo Simulation Presets for Presenter
  const triggerSimulationPreset = useCallback(
    (preset: 'vital_spike' | 'vital_stabilize' | 'critical_toggle' | 'cycle_transport' | 'cycle_hospital') => {
      if (preset === 'vital_spike') {
        updateSmartVitals({
          heartRate: 118,
          spO2: 91,
          bloodPressure: '162/104',
          respRate: 26,
          temperature: 99.4,
          bloodGlucose: 195,
          ecgStatus: 'Sinus Tachycardia with ST-segment deviation (Simulated)',
        });
      } else if (preset === 'vital_stabilize') {
        updateSmartVitals({
          heartRate: 80,
          spO2: 98,
          bloodPressure: '124/80',
          respRate: 16,
          temperature: 98.6,
          bloodGlucose: 112,
          ecgStatus: 'Normal Sinus Rhythm (Telemetry Live)',
        });
        setSmartSeverity('Urgent (Yellow)');
      } else if (preset === 'critical_toggle') {
        toggleSmartCritical();
      } else if (preset === 'cycle_transport') {
        const statuses: SmartAmbulanceTransportStatus[] = [
          'Standby',
          'En Route to Scene',
          'At Scene - Patient Loaded',
          'Transport In Progress',
          'Transport Paused',
          'Arrived at Hospital',
        ];
        const nextIndex = (statuses.indexOf(smartTransportStatus) + 1) % statuses.length;
        setSmartTransportStatus(statuses[nextIndex]);
      } else if (preset === 'cycle_hospital') {
        const stages: HospitalPreparationStatus[] = [
          'Pending Acceptance',
          'Case Accepted',
          'Preparation in Progress',
          'Ready for Arrival',
          'Case Received',
        ];
        const nextIndex = (stages.indexOf(smartHospitalPrepStatus) + 1) % stages.length;
        setSmartHospitalPrepStatus(stages[nextIndex]);
      }
    },
    [
      smartTransportStatus,
      smartHospitalPrepStatus,
      updateSmartVitals,
      toggleSmartCritical,
      setSmartTransportStatus,
      setSmartHospitalPrepStatus,
    ]
  );

  // Sync html class for large text mode (for senior 60+ users)
  useEffect(() => {
    if (isLargeText) {
      document.documentElement.classList.add('text-lg-mode');
    } else {
      document.documentElement.classList.remove('text-lg-mode');
    }
  }, [isLargeText]);

  const toggleLargeText = () => setIsLargeText((prev) => !prev);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const triggerSimulatedEmergency = async () => {
    if (isSubmittingSOS) {
      console.log('[AegisCare SOS] Duplicate submission prevented: dispatch request already in progress.');
      return;
    }

    setIsSubmittingSOS(true);
    setIsSimulatedDispatchActive(true);

    const clientRequestId = `req-sos-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const tempCaseId = `EM-HYD-${Math.floor(100 + Math.random() * 900)}`;

    const newCase: EmergencyCase = {
      caseId: tempCaseId,
      clientRequestId,
      dispatchSyncStatus: 'pending',
      patientName: currentRole === 'patient' ? DEMO_ROLES.patient.name : 'Lakshmi Devi',
      patientAge: 71,
      severity: 'Critical (Red)',
      chiefComplaint: 'Simulated 1-Tap SOS Dispatch triggered from mobile patient passport',
      status: 'Ambulance En Route',
      assignedAmbulance: 'Unit 108-Hyd-42 (ALS)',
      destinationHospital: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
      etaMinutes: 4,
      vitals: {
        heartRate: 98,
        bloodPressure: '140/90',
        spO2: 96,
        respRate: 20,
        temperature: 98.6,
        bloodGlucose: 124,
        ecgStatus: 'Sinus Tachycardia (Demo Telemetry)',
      },
      simulatedTime: 'Active now (Simulated)',
    };
    setActiveCase(newCase);

    const alertNotif: NotificationRecord = {
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      title: 'SIMULATED SOS: 112 Dispatch Relay Triggered',
      message: `Simulated Case #${newCase.caseId} assigned to Unit 108-Hyd-42. (Demo Prototype — Not connected to real 112/108 services).`,
      severity: 'urgent',
      read: false,
      targetRole: 'all',
      actionUrl: 'emergency',
    };
    setNotifications((prev) => [alertNotif, ...prev]);

    try {
      const token = getStoredToken();
      if (token) {
        const res = await api.triggerSOS({
          clientRequestId,
          chiefComplaint: newCase.chiefComplaint,
          severity: 'Critical',
          pickupAddress: 'Banjara Hills Road No 10, Hyderabad (Simulated Demo)',
        });

        if (res.success && res.data?.case) {
          const sCase = res.data.case;
          setActiveCase((prev) => ({
            ...prev,
            caseId: sCase.caseNumber || sCase.id || prev.caseId,
            dispatchSyncStatus: 'synced_server',
          }));
        } else {
          setActiveCase((prev) => ({
            ...prev,
            dispatchSyncStatus: 'sync_error',
            syncErrorMessage: res.error?.message || 'Server did not acknowledge dispatch',
          }));
        }
      } else {
        // No session token -> standalone local demonstration mode
        setActiveCase((prev) => ({
          ...prev,
          dispatchSyncStatus: 'local_demo',
        }));
      }
    } catch (err) {
      console.warn('[AegisCare SOS] Backend dispatch unavailable, running in local demonstration mode:', err);
      setActiveCase((prev) => ({
        ...prev,
        dispatchSyncStatus: 'local_demo',
        syncErrorMessage: 'Operating in standalone local prototype mode.',
      }));
    } finally {
      setIsSubmittingSOS(false);
    }
  };

  const resetSimulatedEmergency = () => {
    setActiveCase({
      ...DEMO_ACTIVE_CASE,
      dispatchSyncStatus: 'local_demo',
    });
    setIsSimulatedDispatchActive(false);
    setIsSubmittingSOS(false);
  };

  // Pre-Arrival Derived State
  const activePreArrivalCase =
    incomingAmbulanceQueue.find((c) => c.id === 'case-hyd-402') || incomingAmbulanceQueue[0];

  const preArrivalTimelineSteps = computePreArrivalTimelineSteps(
    preArrivalStatus,
    smartTransportStatus,
    smartHospitalBay
  );

  const setPreArrivalStatus = useCallback(
    (status: PreArrivalNotificationStatus) => {
      setPreArrivalStatusState(status);
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === 'case-hyd-402'
            ? {
                ...c,
                notificationStatus: status,
                vitals: smartVitals,
                destinationHospital: smartDestinationHospital,
                hospitalBay: smartHospitalBay,
              }
            : c
        )
      );
    },
    [smartVitals, smartDestinationHospital, smartHospitalBay]
  );

  const setManualPreArrivalStatus = useCallback(
    (status: PreArrivalNotificationStatus) => {
      setPreArrivalStatus(status);
      if (status === 'Preparation in Progress') {
        setSmartHospitalPrepStatusState('Preparation in Progress');
      } else if (status === 'Ready for Arrival') {
        setSmartHospitalPrepStatusState('Ready for Arrival');
      } else if (status === 'Accepted') {
        setSmartHospitalPrepStatusState('Case Accepted');
      }
      addSmartAlert(
        'status_change',
        `Pre-Arrival Status Set: ${status}`,
        `Hospital pre-arrival notification manually adjusted to "${status}" for Unit 108-Hyd-42. (Simulated Demo Action)`,
        status === 'Rejected' ? 'warning' : 'info'
      );
    },
    [setPreArrivalStatus, addSmartAlert]
  );

  const updatePreArrivalResourceStatus = useCallback(
    (name: PreArrivalResourceName, status: PreArrivalResourceStatus, note?: string) => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPreArrivalResources((prev) =>
        prev.map((r) =>
          r.name === name
            ? { ...r, status, updatedAt: nowStr, ...(note ? { assignedUnit: note } : {}) }
            : r
        )
      );
      addSmartAlert(
        'hospital_accepted',
        `Hospital Resource Updated: ${name}`,
        `${name} status marked as "${status}" for incoming emergency cases. (Simulated Demo Data)`,
        'info'
      );
    },
    [addSmartAlert]
  );

  // EMT Pre-Arrival Actions
  const sendPreArrivalNotification = useCallback(() => {
    setPreArrivalStatusState('Sent');
    setIncomingAmbulanceQueue((prev) =>
      prev.map((c) =>
        c.id === 'case-hyd-402'
          ? { ...c, notificationStatus: 'Sent', vitals: smartVitals }
          : c
      )
    );
    addSmartAlert(
      'status_change',
      'Pre-Arrival Notification Sent',
      `Telemetry packet transmitted to ${smartDestinationHospital}. ETA: ~${smartEtaMinutes} mins. (Simulated)`,
      'info'
    );

    // Simulate triage gateway receiving packet after 1.5s
    setTimeout(() => {
      setPreArrivalStatusState('Received');
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === 'case-hyd-402' ? { ...c, notificationStatus: 'Received' } : c
        )
      );
      addSmartAlert(
        'status_change',
        'Notification Received by Hospital',
        'Hospital triage server acknowledged packet reception. Case queued for physician review. (Simulated)',
        'info'
      );
    }, 1500);

    // Simulate doctor reviewing after 3.5s
    setTimeout(() => {
      setPreArrivalStatusState('Under Review');
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === 'case-hyd-402' ? { ...c, notificationStatus: 'Under Review' } : c
        )
      );
    }, 3500);
  }, [smartDestinationHospital, smartEtaMinutes, smartVitals, addSmartAlert]);

  const updatePatientPreArrivalInfo = useCallback(
    (info: {
      patientName?: string;
      patientAge?: number;
      patientGender?: string;
      chiefComplaint?: string;
      severity?: 'Critical (Red)' | 'Urgent (Yellow)' | 'Standard (Green)';
      requiredCareCategory?: string;
    }) => {
      if (info.patientName) setSmartPatientName(info.patientName);
      if (info.patientAge) setSmartPatientAge(info.patientAge);
      if (info.patientGender) setSmartPatientGender(info.patientGender);
      if (info.chiefComplaint) setSmartChiefComplaint(info.chiefComplaint);
      if (info.severity) setSmartSeverity(info.severity);
      if (info.requiredCareCategory) setSmartRequiredCareCategory(info.requiredCareCategory);

      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === 'case-hyd-402'
            ? {
                ...c,
                ...(info.patientName ? { patientName: info.patientName } : {}),
                ...(info.patientAge ? { patientAge: info.patientAge } : {}),
                ...(info.patientGender ? { patientGender: info.patientGender } : {}),
                ...(info.chiefComplaint ? { chiefComplaint: info.chiefComplaint } : {}),
                ...(info.severity ? { emergencyPriority: info.severity } : {}),
                ...(info.requiredCareCategory ? { requiredDepartment: info.requiredCareCategory } : {}),
              }
            : c
        )
      );

      addSmartAlert(
        'status_change',
        'Patient Pre-Arrival Information Updated',
        'Clinical details synchronized across ER queue and receiving specialists.',
        'info'
      );
    },
    [addSmartAlert]
  );

  const changeDestinationHospital = useCallback(
    (hospitalName: string, etaMin: number = 7) => {
      setSmartDestinationHospital(hospitalName);
      setSmartEtaMinutes(etaMin);
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === 'case-hyd-402'
            ? {
                ...c,
                destinationHospital: hospitalName,
                estimatedArrivalMin: etaMin,
                notificationStatus: 'Sent',
              }
            : c
        )
      );
      addSmartAlert(
        'status_change',
        `Destination Hospital Changed: ${hospitalName}`,
        `Ambulance route re-planned. New simulated ETA: ${etaMin} minutes. Notification sent to new facility.`,
        'warning'
      );
    },
    [addSmartAlert]
  );

  const contactHospitalPreArrival = useCallback(
    (message: string) => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: 'EMT' as const,
        senderName: 'EMT Ravi Kumar (Unit 108-Hyd-42)',
        text: message,
        timestamp: nowStr,
      };
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === 'case-hyd-402'
            ? { ...c, contactMessages: [...c.contactMessages, newMsg] }
            : c
        )
      );
      addSmartAlert(
        'status_change',
        'Priority Message Transmitted to Hospital',
        `EMT: "${message.slice(0, 60)}..." sent to ER Charge Desk. (Simulated)`,
        'info'
      );
    },
    [addSmartAlert]
  );

  const cancelPreArrivalNotification = useCallback(
    (reason: string = 'Transport diverted or canceled by medical command') => {
      setPreArrivalStatusState('Not Sent');
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === 'case-hyd-402' ? { ...c, notificationStatus: 'Not Sent' } : c
        )
      );
      addSmartAlert(
        'status_change',
        'Pre-Arrival Notification Canceled',
        `Notification retracted for Unit 108-Hyd-42. Reason: ${reason}. (Simulated)`,
        'warning'
      );
    },
    [addSmartAlert]
  );

  // Hospital Pre-Arrival Actions
  const acceptPreArrivalCase = useCallback(
    (caseId: string = 'case-hyd-402') => {
      if (caseId === 'case-hyd-402') {
        setPreArrivalStatusState('Accepted');
        setSmartHospitalPrepStatusState('Case Accepted');
      }
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, notificationStatus: 'Accepted' } : c))
      );
      addSmartAlert(
        'hospital_accepted',
        'Hospital Accepted Incoming Case',
        'Emergency intake confirmed. Trauma Bay 2 reserved. Multi-disciplinary squad on standby. (Simulated Demo Decision)',
        'success'
      );
    },
    [addSmartAlert]
  );

  const rejectPreArrivalCase = useCallback(
    (reason: string, caseId: string = 'case-hyd-402') => {
      if (caseId === 'case-hyd-402') {
        setPreArrivalStatusState('Rejected');
        setSmartHospitalPrepStatusState('Pending Acceptance');
      }
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, notificationStatus: 'Rejected', rejectionReason: reason } : c
        )
      );
      addSmartAlert(
        'critical',
        'Incoming Case Diverted / Rejected by Hospital',
        `Hospital intake status: Rejected. Reason: ${reason}. Diverting to alternative facility. (Simulated Demo Decision)`,
        'urgent'
      );
    },
    [addSmartAlert]
  );

  const requestMoreInfoFromEmt = useCallback(
    (inquiry: string, caseId: string = 'case-hyd-402') => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: 'Hospital' as const,
        senderName: 'Dr. Arjun Rao (ER Desk)',
        text: inquiry,
        timestamp: nowStr,
      };
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, contactMessages: [...c.contactMessages, newMsg] } : c
        )
      );
      addSmartAlert(
        'status_change',
        'Information Requested from Ambulance',
        `ER Desk: "${inquiry.slice(0, 60)}..." transmitted to 108 ambulance crew.`,
        'warning'
      );
    },
    [addSmartAlert]
  );

  const startHospitalPreparation = useCallback(
    (caseId: string = 'case-hyd-402') => {
      if (caseId === 'case-hyd-402') {
        setPreArrivalStatusState('Preparation in Progress');
        setSmartHospitalPrepStatusState('Preparation in Progress');
      }
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, notificationStatus: 'Preparation in Progress' } : c
        )
      );
      setPreArrivalResources((prev) =>
        prev.map((r) =>
          r.name === 'Emergency Bed' || r.name === 'ICU' || r.name === 'Trauma Team'
            ? { ...r, status: 'Preparing', updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : r
        )
      );
      addSmartAlert(
        'status_change',
        'Hospital Preparation Started',
        'Resuscitation team mobilized, ICU bed pre-warmed, and sterile trauma instruments staged. (Simulated)',
        'info'
      );
    },
    [addSmartAlert]
  );

  const markHospitalReady = useCallback(
    (caseId: string = 'case-hyd-402') => {
      if (caseId === 'case-hyd-402') {
        setPreArrivalStatusState('Ready for Arrival');
        setSmartHospitalPrepStatusState('Ready for Arrival');
      }
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, notificationStatus: 'Ready for Arrival' } : c
        )
      );
      setPreArrivalResources((prev) =>
        prev.map((r) =>
          r.name === 'Emergency Bed' || r.name === 'Emergency Department' || r.name === 'Trauma Team'
            ? { ...r, status: 'Available', updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : r
        )
      );
      addSmartAlert(
        'hospital_accepted',
        'Hospital Ready for Arrival',
        'Trauma Bay 2 is fully ready and staffed. Direct bay transfer corridor cleared. (Simulated Demo Decision)',
        'success'
      );
    },
    [addSmartAlert]
  );

  const contactEmtFromHospital = useCallback(
    (message: string, caseId: string = 'case-hyd-402') => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: 'Hospital' as const,
        senderName: 'Hospital Operations Coordinator',
        text: message,
        timestamp: nowStr,
      };
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, contactMessages: [...c.contactMessages, newMsg] } : c
        )
      );
      addSmartAlert(
        'status_change',
        'Hospital Contacted Ambulance Crew',
        `Message sent to Unit 108: "${message.slice(0, 60)}..."`,
        'info'
      );
    },
    [addSmartAlert]
  );

  // Doctor Pre-Arrival Actions
  const reviewPreArrivalCase = useCallback(
    (caseId: string = 'case-hyd-402') => {
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId && (c.notificationStatus === 'Received' || c.notificationStatus === 'Sent')
            ? { ...c, notificationStatus: 'Under Review' }
            : c
        )
      );
      addSmartAlert(
        'status_change',
        'Case Under Clinical Physician Review',
        'Dr. Arjun Rao is actively reviewing incoming ECG waveforms and clinical telemetry. (Demo decision-support indicator — not a diagnosis.)',
        'info'
      );
    },
    [addSmartAlert]
  );

  const requestDoctorSpecialist = useCallback(
    (specialistName: string, caseId: string = 'case-hyd-402') => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newSpec = {
        id: `spec-${Date.now()}`,
        specialist: specialistName,
        requestedBy: 'Dr. Arjun Rao (Attending Physician)',
        timestamp: nowStr,
        status: 'Assigned' as const,
      };
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, requestedSpecialists: [...c.requestedSpecialists, newSpec] }
            : c
        )
      );
      if (specialistName.toLowerCase().includes('cardio')) {
        updatePreArrivalResourceStatus('Cardiologist', 'Available', `${specialistName} (Mobilized)`);
      } else if (specialistName.toLowerCase().includes('neuro')) {
        updatePreArrivalResourceStatus('Neurologist', 'Available', `${specialistName} (Mobilized)`);
      } else {
        updatePreArrivalResourceStatus('Trauma Team', 'Available', `${specialistName} (Mobilized)`);
      }
      addSmartAlert(
        'hospital_accepted',
        `Specialist Requested: ${specialistName}`,
        `Dr. Arjun Rao requested on-call consultation for incoming patient case. (Simulated Demo Data)`,
        'info'
      );
    },
    [updatePreArrivalResourceStatus, addSmartAlert]
  );

  const requestDoctorEquipment = useCallback(
    (equipmentName: string, caseId: string = 'case-hyd-402') => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newEq = {
        id: `eq-${Date.now()}`,
        equipment: equipmentName,
        requestedBy: 'Dr. Arjun Rao (Attending Physician)',
        timestamp: nowStr,
        status: 'Ready' as const,
      };
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, requestedEquipment: [...c.requestedEquipment, newEq] }
            : c
        )
      );
      if (equipmentName.toLowerCase().includes('ventilator')) {
        updatePreArrivalResourceStatus('Ventilator', 'Available', `${equipmentName} (Bedside Bay 2)`);
      }
      addSmartAlert(
        'hospital_accepted',
        `Equipment Requested: ${equipmentName}`,
        `Bedside preparation order issued for ${equipmentName}. (Simulated Demo Data)`,
        'info'
      );
    },
    [updatePreArrivalResourceStatus, addSmartAlert]
  );

  const addDoctorPreparationNote = useCallback(
    (noteText: string, caseId: string = 'case-hyd-402') => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newNote = {
        id: `note-${Date.now()}`,
        author: 'Dr. Arjun Rao',
        role: 'Attending Emergency Physician',
        text: noteText,
        timestamp: nowStr,
      };
      setIncomingAmbulanceQueue((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, preparationNotes: [...c.preparationNotes, newNote] }
            : c
        )
      );
      addSmartAlert(
        'status_change',
        'Doctor Preparation Note Added',
        `"${noteText.slice(0, 60)}..." logged to emergency case sheet.`,
        'info'
      );
    },
    [addSmartAlert]
  );

  // Demo Scenario Runner (Section 7)
  const cancelDemoScenario = useCallback(() => {
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
    setIsDemoScenarioRunning(false);
    setDemoScenarioMessage('');
  }, []);

  const runDemoScenario = useCallback(() => {
    cancelDemoScenario();
    setIsDemoScenarioRunning(true);
    setDemoScenarioCurrentStep(1);
    setDemoScenarioMessage('Stage 1/7: Ambulance departing from Jubilee Hills, Hyderabad (Simulation Mode)...');

    // Stage 1: Departure
    setSmartTransportStatusState('Transport In Progress');
    setSmartEtaMinutes(8);
    setPreArrivalStatusState('Not Sent');
    addSmartAlert(
      'transport_started',
      'Demo Scenario: Ambulance En Route from Jubilee Hills',
      'Unit 108-Hyd-42 has departed with patient. Navigating green wave corridor toward Hyderabad Apex.',
      'info'
    );

    // Stage 2 (after 2.5s): EMT sends notification
    demoTimerRef.current = setTimeout(() => {
      setDemoScenarioCurrentStep(2);
      setDemoScenarioMessage('Stage 2/7: Pre-arrival telemetry notification sent by EMT...');
      setPreArrivalStatusState('Sent');
      setSmartEtaMinutes(7);
      addSmartAlert(
        'status_change',
        'Demo Scenario: Pre-Arrival Notification Sent',
        'EMT transmits 12-lead ECG and live telemetry packet to Hyderabad Apex ER.',
        'info'
      );

      // Stage 3 (after 2.5s): Hospital receives & reviews
      demoTimerRef.current = setTimeout(() => {
        setDemoScenarioCurrentStep(3);
        setDemoScenarioMessage('Stage 3/7: Hospital receives notification & Dr. Rao begins triage review...');
        setPreArrivalStatusState('Under Review');
        setSmartEtaMinutes(5);
        addSmartAlert(
          'status_change',
          'Demo Scenario: Hospital Reviewing Telemetry',
          'Hospital triage monitor alarms. Attending physician Dr. Arjun Rao examines ST-elevation ECG.',
          'info'
        );

        // Stage 4 (after 2.5s): Hospital accepts case
        demoTimerRef.current = setTimeout(() => {
          setDemoScenarioCurrentStep(4);
          setDemoScenarioMessage('Stage 4/7: Hospital accepts case & reserves Trauma Bay 2...');
          setPreArrivalStatusState('Accepted');
          setSmartHospitalPrepStatusState('Case Accepted');
          setSmartEtaMinutes(4);
          addSmartAlert(
            'hospital_accepted',
            'Demo Scenario: Hospital Intake Accepted',
            'Hyderabad Apex confirms bed reservation. Primary PCI catheterization lab on standby.',
            'success'
          );

          // Stage 5 (after 2.5s): Resource preparation started
          demoTimerRef.current = setTimeout(() => {
            setDemoScenarioCurrentStep(5);
            setDemoScenarioMessage('Stage 5/7: Hospital begins active resource preparation...');
            setPreArrivalStatusState('Preparation in Progress');
            setSmartHospitalPrepStatusState('Preparation in Progress');
            setSmartEtaMinutes(3);
            setPreArrivalResources((prev) =>
              prev.map((r) =>
                r.name === 'Emergency Bed' || r.name === 'ICU' || r.name === 'Trauma Team'
                  ? {
                      ...r,
                      status: 'Preparing',
                      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    }
                  : r
              )
            );
            addSmartAlert(
              'status_change',
              'Demo Scenario: Resource Preparation In Progress',
              'Nursing squad pre-warms trauma bay, primes IV lines, and stages biphasic defibrillator.',
              'info'
            );

            // Stage 6 (after 2.5s): Hospital ready
            demoTimerRef.current = setTimeout(() => {
              setDemoScenarioCurrentStep(6);
              setDemoScenarioMessage('Stage 6/7: Hospital marked ready for arrival...');
              setPreArrivalStatusState('Ready for Arrival');
              setSmartHospitalPrepStatusState('Ready for Arrival');
              setSmartEtaMinutes(1);
              setPreArrivalResources((prev) =>
                prev.map((r) =>
                  r.name === 'Emergency Bed' || r.name === 'Emergency Department' || r.name === 'Trauma Team'
                    ? {
                        ...r,
                        status: 'Available',
                        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      }
                    : r
                )
              );
              addSmartAlert(
                'hospital_accepted',
                'Demo Scenario: Hospital Ready for Immediate Intake',
                'Trauma Bay 2 ready. Direct ambulance bay path cleared for zero-delay patient transfer.',
                'success'
              );

              // Stage 7 (after 2.5s): Ambulance arrives
              demoTimerRef.current = setTimeout(() => {
                setDemoScenarioCurrentStep(7);
                setDemoScenarioMessage('Stage 7/7: Ambulance docked at hospital ER. Patient transfer complete.');
                setSmartTransportStatusState('Arrived at Hospital');
                setSmartEtaMinutes(0);
                setIsDemoScenarioRunning(false);
                addSmartAlert(
                  'arrival',
                  'Demo Scenario: Ambulance Arrived & Handover Complete',
                  'Unit 108-Hyd-42 has docked. Patient Lakshmi Devi received directly in Trauma Bay 2.',
                  'success'
                );
              }, 2500);
            }, 2500);
          }, 2500);
        }, 2500);
      }, 2500);
    }, 2500);
  }, [cancelDemoScenario, addSmartAlert]);

  useEffect(() => {
    return () => {
      if (demoTimerRef.current) {
        clearTimeout(demoTimerRef.current);
      }
    };
  }, []);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        // Authentication & RBAC
        isAuthenticated,
        currentUser,
        login,
        logout,
        switchRoleLogin,
        hasPermission: hasPerm,
        hasRole: hasRoleCheck,

        currentRole,
        currentRoleProfile: DEMO_ROLES[currentRole],
        setCurrentRole,
        currentView,
        setCurrentView,
        isLargeText,
        toggleLargeText,
        isRoleSelectorOpen,
        setIsRoleSelectorOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        activeCase,
        isSimulatedDispatchActive,
        isSubmittingSOS,
        triggerSimulatedEmergency,
        resetSimulatedEmergency,
        currentLanguage,
        setCurrentLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,

        // Smart Ambulance Module
        smartVitals,
        smartAmbulanceId,
        smartAssignedEmt,
        smartAssignedDriver,
        smartCurrentCaseId,
        smartPatientName,
        smartPatientAge,
        smartPatientGender,
        smartDestinationHospital,
        smartTransportStatus,
        smartEtaMinutes,
        smartGpsLocation,
        smartHospitalPrepStatus,
        smartRequiredCareCategory,
        smartSeverity,
        smartSimulatedConsent,
        smartAlerts,
        smartTimeline,
        smartDoctorOrders,
        smartHospitalBay,
        isSimulationControlOpen,
        setIsSimulationControlOpen,

        // Hospital Pre-Arrival Coordination Module
        preArrivalStatus,
        setPreArrivalStatus,
        preArrivalResources,
        updatePreArrivalResourceStatus,
        incomingAmbulanceQueue,
        activePreArrivalCase,
        preArrivalTimelineSteps,
        isDemoScenarioRunning,
        demoScenarioCurrentStep,
        demoScenarioMessage,
        runDemoScenario,
        cancelDemoScenario,
        setManualPreArrivalStatus,

        // EMT Pre-Arrival Actions
        sendPreArrivalNotification,
        updatePatientPreArrivalInfo,
        changeDestinationHospital,
        contactHospitalPreArrival,
        cancelPreArrivalNotification,

        // Hospital Pre-Arrival Actions
        acceptPreArrivalCase,
        rejectPreArrivalCase,
        requestMoreInfoFromEmt,
        startHospitalPreparation,
        markHospitalReady,
        contactEmtFromHospital,

        // Doctor Pre-Arrival Actions
        reviewPreArrivalCase,
        requestDoctorSpecialist,
        requestDoctorEquipment,
        addDoctorPreparationNote,

        updateSmartVitals,
        setSmartTransportStatus,
        setSmartHospitalPrepStatus,
        toggleSmartCritical,
        toggleSmartConsent,
        addDoctorOrder,
        notifyHospitalTeam,
        requestDoctorInfo,
        contactHospitalFromAmbulance,
        shareAmbulanceLocation,
        confirmHospitalArrival,
        dismissSmartAlert,
        triggerSimulationPreset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

