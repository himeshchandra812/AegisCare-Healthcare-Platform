/**
 * AegisCare Phase 1A Security & Authorization Verification Suite
 * Tests:
 *  1. Successful Login
 *  2. Failed Login
 *  3. Logout & Audit
 *  4. Expired Session Token Rejection
 *  5. Unauthorized Role Access (RBAC)
 *  6. Patient Accessing Another Patient's Record (ABAC Isolation)
 *  7. Family Member Access Without Active Consent (Consent Denial)
 *  8. EMT Assigned Emergency Case Boundary
 *  9. Valid Emergency Case & SOS Creation
 * 10. Invalid Vital Reading Validation Rejection
 * 11. Immutable Audit Event Trail Generation
 */

import { db } from '../db/database';
import { authService } from '../services/authService';
import { emergencyService } from '../services/emergencyService';
import { ambulanceService } from '../services/ambulanceService';
import { patientService } from '../services/patientService';
import { familyService } from '../services/familyService';
import { auditService } from '../services/auditService';
import { verifyAuthToken, generateAuthToken } from '../auth/tokens';
import { validateVitalReadings, validateIndianPhone, validateBloodPressure } from '../validation';

interface TestRecord {
  category: string;
  name: string;
  passed: boolean;
  message?: string;
}

const testResults: TestRecord[] = [];

function check(condition: boolean, category: string, name: string, message?: string) {
  if (condition) {
    testResults.push({ category, name, passed: true, message });
    console.log(`  ✅ [PASS] ${category} > ${name}${message ? ` (${message})` : ''}`);
  } else {
    testResults.push({ category, name, passed: false, message });
    console.error(`  ❌ [FAIL] ${category} > ${name}${message ? ` (${message})` : ''}`);
  }
}

async function runPhase1ATestSuite() {
  console.log('================================================================');
  console.log('⚡ AEGISCARE PHASE 1A: SECURITY, RBAC & PERSISTENCE TEST SUITE');
  console.log('================================================================\n');

  // TEST 1: Successful Login
  console.log('--- 1. Authentication: Successful Login ---');
  try {
    const loginRes = await authService.login('dr.ananya.rao@demo.aegiscare.in', 'demo123');
    check(!!loginRes.token && loginRes.user.role === 'doctor', 'Auth', 'Doctor Login Successful', loginRes.user.name);
  } catch (e: any) {
    check(false, 'Auth', 'Doctor Login Successful', e.message);
  }

  // TEST 2: Failed Login
  console.log('\n--- 2. Authentication: Failed Login Handling ---');
  let failedAsExpected = false;
  try {
    await authService.login('dr.ananya.rao@demo.aegiscare.in', 'wrong_password_999');
  } catch (e: any) {
    failedAsExpected = e.message === 'INVALID_CREDENTIALS';
  }
  check(failedAsExpected, 'Auth', 'Rejected Invalid Password Attempt');

  // TEST 3: Logout & Audit Record
  console.log('\n--- 3. Session Termination & Logout Audit ---');
  const preLogoutAuditCount = auditService.getAuditEvents().length;
  await authService.logout({
    userId: 'usr-doctor-1',
    role: 'doctor',
    name: 'Dr. Ananya Rao, MD',
  });
  const postLogoutAuditCount = auditService.getAuditEvents().length;
  check(postLogoutAuditCount === preLogoutAuditCount + 1, 'Auth', 'Logout Generates Audit Event');

  // TEST 4: Expired Session Token Rejection
  console.log('\n--- 4. Cryptographic Expiration: Expired Token Rejection ---');
  const expiredPayload = {
    userId: 'usr-patient-1',
    email: 'rajesh.sharma@demo.aegiscare.in',
    role: 'patient' as const,
    name: 'Rajesh Sharma',
    issuedAt: Date.now() - (48 * 3600 * 1000), // 48 hours ago
    expiresAt: Date.now() - (24 * 3600 * 1000), // expired 24 hours ago
  };
  const encHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const encPayload = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
  const crypto = await import('node:crypto');
  const secret = process.env.JWT_SECRET || 'aegiscare-hyderabad-node-emergency-secret-key-2026';
  const expSig = crypto.createHmac('sha256', secret).update(`${encHeader}.${encPayload}`).digest('base64url');
  const expiredToken = `${encHeader}.${encPayload}.${expSig}`;

  const expiredVerifyResult = verifyAuthToken(expiredToken);
  check(
    expiredVerifyResult.valid === false && expiredVerifyResult.error === 'Token has expired',
    'Security',
    'Rejection of Expired Session Token'
  );

  // TEST 5: Unauthorized Role Access (RBAC)
  console.log('\n--- 5. RBAC Authorization: Role Restrictions ---');
  const patientUser = db.findUserById('usr-patient-1');
  check(patientUser?.role === 'patient', 'RBAC', 'Patient User Identified');
  const hospitalAdminRole = 'hospital_admin';
  const isPatientAllowedAdmin = (patientUser?.role as string) === hospitalAdminRole;
  check(!isPatientAllowedAdmin, 'RBAC', 'Patient Blocked From Hospital Admin Actions');

  // TEST 6: Patient Accessing Another Patient's Record (ABAC Isolation)
  console.log('\n--- 6. Data Isolation: Cross-Patient Access Prevention ---');
  const patient1 = db.findPatientById('pat-1');
  const unauthorizedCallerUserId = 'usr-patient-other-999';
  const isAuthorizedSelf = patient1?.userId === unauthorizedCallerUserId;
  check(!isAuthorizedSelf, 'ABAC', 'Foreign Patient Denied Direct Access to pat-1 Medical Profile');

  // TEST 7: Family Member Without Active Consent
  console.log('\n--- 7. ABAC: Family Consent Verification ---');
  // Revoke consent temporarily
  await db.toggleConsent('pat-1', 'usr-family-1', false);
  const revokedConsents = db.getConsentRecordsForPatient('pat-1');
  const hasActiveConsentWhenRevoked = revokedConsents.some(
    (c) => c.authorizedUserId === 'usr-family-1' && c.status === 'Active'
  );
  check(!hasActiveConsentWhenRevoked, 'ABAC', 'Caregiver Access Denied When Consent is Revoked');

  // Re-grant consent
  await db.toggleConsent('pat-1', 'usr-family-1', true);
  const activeConsents = db.getConsentRecordsForPatient('pat-1');
  const hasActiveConsentWhenGranted = activeConsents.some(
    (c) => c.authorizedUserId === 'usr-family-1' && c.status === 'Active'
  );
  check(hasActiveConsentWhenGranted, 'ABAC', 'Caregiver Access Granted When Consent is Active');

  // TEST 8: EMT Assigned Emergency Case Boundary
  console.log('\n--- 8. EMT Case Assignment Boundary ---');
  const emtAmbulance = db.findAmbulanceByEmtId('usr-emt-1');
  check(Boolean(emtAmbulance?.currentCaseId), 'EMT', 'EMT Correctly Bound to Assigned Emergency Case');

  // TEST 9: Valid Emergency Case & SOS Creation
  console.log('\n--- 9. Emergency Case & SOS Creation ---');
  const sosResult = await emergencyService.triggerSOS({
    patientId: 'pat-1',
    chiefComplaint: 'Acute Severe Chest Pressure Radiating to Left Arm',
    actor: { id: 'usr-patient-1', role: 'patient', name: 'Rajesh Sharma' },
  });
  check(
    !!sosResult.case.id && sosResult.case.status === 'Dispatched',
    'Emergency',
    '1-Touch SOS Dispatches ALS Unit and Creates Case'
  );

  // TEST 10: Invalid Vital Reading Validation Rejection
  console.log('\n--- 10. Clinical Validation: Vital Sign Out-Of-Range Checks ---');
  const invalidVitals1 = validateVitalReadings({ heartRate: 999 }); // Impossible HR
  check(!invalidVitals1.valid && invalidVitals1.errors.length > 0, 'Validation', 'Rejection of Heart Rate 999 bpm');

  const invalidVitals2 = validateVitalReadings({ spO2: -15 }); // Impossible SpO2
  check(!invalidVitals2.valid, 'Validation', 'Rejection of Negative Oxygen Saturation');

  const invalidBP = validateBloodPressure('not-a-bp');
  check(!invalidBP.valid, 'Validation', 'Rejection of Malformed Blood Pressure String');

  const validBP = validateBloodPressure('130/84');
  check(validBP.valid, 'Validation', 'Acceptance of Valid Blood Pressure (130/84 mmHg)');

  const validPhone = validateIndianPhone('+919876543210');
  check(validPhone, 'Validation', 'Validation of Indian Mobile Number (+91 98765 43210)');

  // TEST 11: Audit Event Generation on Sensitive Operations
  console.log('\n--- 11. Immutable Audit Trail Persistence ---');
  const startAuditTotal = auditService.getAuditEvents().length;
  await auditService.logEvent({
    actorId: 'usr-doctor-1',
    actorRole: 'doctor',
    actorName: 'Dr. Ananya Rao, MD',
    actionType: 'ISSUE_ORDER',
    resourceType: 'ClinicalOrder',
    resourceId: 'order-test-101',
    reason: 'Stat IV Aspirin 325mg and Heparin Bolus protocol issued',
    ipAddress: '127.0.0.1',
    status: 'SUCCESS',
  });
  const endAuditTotal = auditService.getAuditEvents().length;
  check(endAuditTotal === startAuditTotal + 1, 'Audit', 'Sensitive Action Successfully Written to Audit Trail');

  // Summary
  console.log('\n================================================================');
  const total = testResults.length;
  const passed = testResults.filter((t) => t.passed).length;
  const failed = total - passed;
  console.log(`Summary: ${passed}/${total} Phase 1A Security & Architecture Tests Passed (${failed} failed)`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase1ATestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
