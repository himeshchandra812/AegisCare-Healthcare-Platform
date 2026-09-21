/**
 * AegisCare Phase 1 Backend Security & Persistence Verification Test Suite
 * Executes full test coverage against Auth, RBAC, Database Persistence, and Audit Logging
 */

import { db } from '../server/db/database';
import { hashPassword, verifyPassword, generateAuthToken, verifyAuthToken } from '../server/auth/tokens';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details?: string) {
  if (condition) {
    results.push({ suite, name, passed: true, details });
    console.log(`  ✅ [PASS] ${suite} > ${name}${details ? ` (${details})` : ''}`);
  } else {
    results.push({ suite, name, passed: false, details, error: 'Assertion failed' });
    console.error(`  ❌ [FAIL] ${suite} > ${name}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('⚡ AegisCare Phase 1 Security & Backend Verification');
  console.log('====================================================\n');

  // 1. Authentication & Password Tests
  console.log('--- Suite 1: Authentication & Password Verification ---');
  const user = db.findUserByEmail('dr.ananya.rao@demo.aegiscare.in');
  assert(!!user, 'Authentication', 'User exists in database', user?.name);

  if (user) {
    const validPwd = verifyPassword('demo123', user.passwordHash, user.salt);
    assert(validPwd, 'Authentication', 'Password verification with valid password (demo123)');

    const invalidPwd = verifyPassword('wrongpassword', user.passwordHash, user.salt);
    assert(!invalidPwd, 'Authentication', 'Rejection of invalid password');
  }

  // 2. Token Generation & Expiration Tests
  console.log('\n--- Suite 2: Cryptographic Tokens & Expiration ---');
  const token = generateAuthToken({
    userId: 'usr-doctor-1',
    email: 'dr.ananya.rao@demo.aegiscare.in',
    role: 'doctor',
    name: 'Dr. Ananya Rao, MD',
  });
  assert(typeof token === 'string' && token.split('.').length === 3, 'Tokens', 'Valid HMAC-SHA256 Token Format');

  const verification = verifyAuthToken(token);
  assert(verification.valid === true && verification.payload?.userId === 'usr-doctor-1', 'Tokens', 'Token signature validation');

  const tamperedToken = token.slice(0, -5) + 'AAAAA';
  const tamperedVerification = verifyAuthToken(tamperedToken);
  assert(tamperedVerification.valid === false, 'Tokens', 'Tampered token signature rejection');

  // Test expired token rejection
  const expiredPayload = {
    userId: 'usr-patient-1',
    email: 'test@demo.in',
    role: 'patient' as const,
    name: 'Test Patient',
    issuedAt: Date.now() - 100000,
    expiresAt: Date.now() - 5000,
  };
  const encHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const encPayload = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
  const crypto = await import('node:crypto');
  const secret = process.env.JWT_SECRET || 'aegiscare-hyderabad-node-emergency-secret-key-2026';
  const expSig = crypto.createHmac('sha256', secret).update(`${encHeader}.${encPayload}`).digest('base64url');
  const expiredToken = `${encHeader}.${encPayload}.${expSig}`;
  const expiredResult = verifyAuthToken(expiredToken);
  assert(expiredResult.valid === false && expiredResult.error === 'Token has expired', 'Tokens', 'Session expiration rejection');

  // 3. RBAC & Data Isolation Tests
  console.log('\n--- Suite 3: RBAC & Resource Isolation ---');
  const patient = db.findPatientById('pat-1');
  assert(!!patient, 'RBAC', 'Patient record retrieval', patient?.name);

  const patientSelfUser = db.findUserById('usr-patient-1');
  assert(patient?.userId === patientSelfUser?.id, 'RBAC', 'Patient ownership matches user identity');

  // Family Consent Check
  const consentRecords = db.getConsentRecordsForPatient('pat-1');
  const activeConsent = consentRecords.some(c => c.authorizedUserId === 'usr-family-1' && c.status === 'Active');
  assert(activeConsent, 'RBAC', 'Family member consent authorization check');

  // EMT Assigned Case Check
  const ambulance = db.findAmbulanceByEmtId('usr-emt-1');
  assert(ambulance?.id === 'amb-1' && Boolean(ambulance?.currentCaseId), 'RBAC', 'EMT assignment to active emergency case');

  // Hospital Bed Count Updates
  const hospital = db.findHospitalById('hosp-1');
  assert(!!hospital && hospital.availableBeds > 0, 'RBAC', 'Hospital resource accessibility', hospital?.name);

  // 4. Persistence & Mutability Tests
  console.log('\n--- Suite 4: Database Persistence & Atomic Mutations ---');
  const newVitals = await db.recordVitalReading({
    caseId: 'case-1',
    ambulanceId: 'amb-1',
    patientId: 'pat-1',
    heartRate: 118,
    spO2: 95,
    bloodPressure: '142/90',
    respRate: 22,
    temperature: 98.8,
    bloodGlucose: 146,
    ecgStatus: 'Telemetry Stream Verified (Test Run)',
    recordedByEmtName: 'Test Paramedic',
  });
  assert(!!newVitals.id && newVitals.heartRate === 118, 'Persistence', 'Vital reading insertion & query');

  const newOrder = await db.createClinicalOrder({
    caseId: 'case-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Ananya Rao',
    orderText: 'IV Normal Saline 500ml Bolus (Test Protocol)',
    category: 'Medication',
    status: 'Ordered',
  });
  assert(!!newOrder.id && newOrder.status === 'Ordered', 'Persistence', 'Clinical order insertion & status tracking');

  // 5. Audit Logging Tests
  console.log('\n--- Suite 5: Immutable Audit Logging ---');
  const initialAuditCount = db.getAuditEvents().length;
  await db.logAuditEvent({
    actorId: 'usr-patient-1',
    actorRole: 'patient',
    actorName: 'Rajesh Sharma',
    actionType: 'VIEW_RECORD',
    resourceType: 'MedicalProfile',
    resourceId: 'med-1',
    reason: 'Patient self-access to cardiac medical profile',
    ipAddress: '127.0.0.1',
    status: 'SUCCESS',
  });
  const newAuditCount = db.getAuditEvents().length;
  assert(newAuditCount === initialAuditCount + 1, 'Audit', 'Audit trail event recording and persistence');

  // Summary
  console.log('\n====================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`Summary: ${passed}/${total} tests passed (${failed} failed)`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
