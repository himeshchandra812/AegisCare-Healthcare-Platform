/**
 * AegisCare Strict Input Validation & Clinical Range Verification
 * Hyderabad Node Emergency Healthcare Platform
 */

import { UserRole, EmergencySeverity, EmergencyStatus } from '../models';

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrorDetail[];
}

/**
 * Validates Indian Phone Numbers
 * Supports formats: +919876543210, 919876543210, 9876543210, 09876543210
 */
export function validateIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  // Matches Indian mobile numbers starting with 6-9
  const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  return indianMobileRegex.test(cleanPhone);
}

/**
 * Validates Email addresses standard syntax
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates System User Roles (7 standard roles)
 */
export const VALID_ROLES: UserRole[] = [
  'patient',
  'family_member',
  'doctor',
  'emt',
  'ambulance_operator',
  'hospital_admin',
  'system_admin',
];

export function validateUserRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole);
}

/**
 * Validates Emergency Severity
 */
export const VALID_SEVERITIES: EmergencySeverity[] = ['Critical', 'Severe', 'Moderate', 'Low'];

export function validateEmergencySeverity(sev: string): sev is EmergencySeverity {
  return VALID_SEVERITIES.includes(sev as EmergencySeverity);
}

/**
 * Validates Emergency Status
 */
export const VALID_STATUSES: EmergencyStatus[] = [
  'Reported',
  'Dispatched',
  'En Route',
  'On Scene',
  'In Transit',
  'Admitted',
  'Resolved',
];

export function validateEmergencyStatus(status: string): status is EmergencyStatus {
  return VALID_STATUSES.includes(status as EmergencyStatus);
}

/**
 * Validates Blood Pressure Format (e.g., "120/80") and Physiological Ranges
 */
export function validateBloodPressure(bp: string): { valid: boolean; systolic?: number; diastolic?: number; message?: string } {
  if (!bp || typeof bp !== 'string') {
    return { valid: false, message: 'Blood pressure must be a string in Systolic/Diastolic format (e.g. 120/80)' };
  }
  const match = bp.trim().match(/^(\d{2,3})\/(\d{2,3})$/);
  if (!match) {
    return { valid: false, message: 'Invalid BP format. Expected format: Systolic/Diastolic (e.g., 120/80)' };
  }
  const systolic = parseInt(match[1], 10);
  const diastolic = parseInt(match[2], 10);

  if (systolic < 40 || systolic > 300) {
    return { valid: false, message: `Systolic BP (${systolic} mmHg) out of physiological range (40 - 300 mmHg)` };
  }
  if (diastolic < 20 || diastolic > 200) {
    return { valid: false, message: `Diastolic BP (${diastolic} mmHg) out of physiological range (20 - 200 mmHg)` };
  }
  if (systolic <= diastolic) {
    return { valid: false, message: `Systolic BP (${systolic}) must be greater than Diastolic BP (${diastolic})` };
  }

  return { valid: true, systolic, diastolic };
}

/**
 * Comprehensive Vital Signs Validation
 */
export interface VitalReadingInput {
  caseId?: string;
  ambulanceId?: string;
  patientId?: string;
  heartRate?: number;
  spO2?: number;
  bloodPressure?: string;
  respRate?: number;
  temperature?: number;
  bloodGlucose?: number;
  ecgStatus?: string;
}

export function validateVitalReadings(vitals: VitalReadingInput): ValidationResult {
  const errors: ValidationErrorDetail[] = [];

  // Heart Rate: physiological range 20 - 300 bpm
  if (vitals.heartRate !== undefined) {
    if (typeof vitals.heartRate !== 'number' || isNaN(vitals.heartRate)) {
      errors.push({ field: 'heartRate', message: 'Heart Rate must be a number', value: vitals.heartRate });
    } else if (vitals.heartRate < 20 || vitals.heartRate > 300) {
      errors.push({
        field: 'heartRate',
        message: 'Heart Rate must be within physiological range (20 - 300 BPM)',
        value: vitals.heartRate,
      });
    }
  }

  // SpO2: 0 - 100%
  if (vitals.spO2 !== undefined) {
    if (typeof vitals.spO2 !== 'number' || isNaN(vitals.spO2)) {
      errors.push({ field: 'spO2', message: 'SpO2 must be a number', value: vitals.spO2 });
    } else if (vitals.spO2 < 0 || vitals.spO2 > 100) {
      errors.push({
        field: 'spO2',
        message: 'Oxygen Saturation (SpO2) must be between 0% and 100%',
        value: vitals.spO2,
      });
    }
  }

  // Blood Pressure
  if (vitals.bloodPressure !== undefined) {
    const bpCheck = validateBloodPressure(vitals.bloodPressure);
    if (!bpCheck.valid) {
      errors.push({ field: 'bloodPressure', message: bpCheck.message || 'Invalid Blood Pressure', value: vitals.bloodPressure });
    }
  }

  // Respiratory Rate: 4 - 80 breaths/min
  if (vitals.respRate !== undefined) {
    if (typeof vitals.respRate !== 'number' || isNaN(vitals.respRate)) {
      errors.push({ field: 'respRate', message: 'Respiratory Rate must be a number', value: vitals.respRate });
    } else if (vitals.respRate < 4 || vitals.respRate > 80) {
      errors.push({
        field: 'respRate',
        message: 'Respiratory Rate must be within range (4 - 80 breaths/min)',
        value: vitals.respRate,
      });
    }
  }

  // Body Temperature: 85 - 115 °F
  if (vitals.temperature !== undefined) {
    if (typeof vitals.temperature !== 'number' || isNaN(vitals.temperature)) {
      errors.push({ field: 'temperature', message: 'Temperature must be a number', value: vitals.temperature });
    } else if (vitals.temperature < 85 || vitals.temperature > 115) {
      errors.push({
        field: 'temperature',
        message: 'Body Temperature must be within range (85.0 - 115.0 °F)',
        value: vitals.temperature,
      });
    }
  }

  // Blood Glucose: 10 - 800 mg/dL
  if (vitals.bloodGlucose !== undefined) {
    if (typeof vitals.bloodGlucose !== 'number' || isNaN(vitals.bloodGlucose)) {
      errors.push({ field: 'bloodGlucose', message: 'Blood Glucose must be a number', value: vitals.bloodGlucose });
    } else if (vitals.bloodGlucose < 10 || vitals.bloodGlucose > 800) {
      errors.push({
        field: 'bloodGlucose',
        message: 'Blood Glucose must be within range (10 - 800 mg/dL)',
        value: vitals.bloodGlucose,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Consent Status Validation
 */
export const VALID_CONSENT_STATUSES = ['Active', 'Revoked', 'Expired'] as const;
export function validateConsentStatus(status: string): boolean {
  return VALID_CONSENT_STATUSES.includes(status as any);
}
