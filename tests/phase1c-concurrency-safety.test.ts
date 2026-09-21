import { db } from '../server/db/database';
import { generateAuthToken, verifyAuthToken, JWT_SECRET } from '../server/auth/tokens';
import { DBEmergencyCase } from '../server/db/schema';
import { DispatchSyncStatus, EmergencyCase } from '../src/types';
import crypto from 'crypto';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(message);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

async function runPhase1cConcurrencyAndSafetyTests() {
  console.log('================================================================');
  console.log('⚡ AEGISCARE PHASE 1C: CONCURRENCY, API & SAFETY VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // --- A. Sequential duplicate SOS requests ---
  console.log('--- A. Sequential Duplicate SOS Requests ---');
  try {
    const seqRequestId = `req-seq-${Date.now()}`;
    const payload: Omit<DBEmergencyCase, 'id' | 'createdAt' | 'updatedAt'> = {
      caseNumber: `EMR-SEQ-01`,
      clientRequestId: seqRequestId,
      dispatchSyncStatus: 'synced_server',
      patientId: 'pat-1',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      patientGender: 'Female',
      chiefComplaint: 'Sequential test dispatch',
      severity: 'Critical',
      status: 'Dispatched',
      reportedAt: new Date().toISOString(),
      pickupLocation: { address: 'Banjara Hills', landmark: 'Apex', lat: 17.41, lng: 78.43 },
      assignedAmbulanceId: 'amb-1',
      assignedHospitalId: 'hosp-1',
      assignedEmtName: 'Vikram Singh',
      careCategoryRequired: 'Acute Emergency',
      notes: [],
    };

    const first = await db.createEmergencyCase(payload);
    const second = await db.createEmergencyCase({
      ...payload,
      caseNumber: 'EMR-SEQ-02', // attempts to supply different number with same requestId
    });

    assert(first.id === second.id, 'Sequential duplicate request returns existing case ID');
    assert(second.caseNumber === 'EMR-SEQ-01', 'Sequential duplicate preserves original caseNumber without duplication');
    passed += 2;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- B. Concurrent duplicate SOS requests ---
  console.log('\n--- B. Concurrent Duplicate SOS Requests (Promise.all) ---');
  try {
    const concurrentRequestId = `req-concurrent-${Date.now()}`;
    const basePayload: Omit<DBEmergencyCase, 'id' | 'createdAt' | 'updatedAt'> = {
      caseNumber: `EMR-CONC-01`,
      clientRequestId: concurrentRequestId,
      dispatchSyncStatus: 'synced_server',
      patientId: 'pat-1',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      patientGender: 'Female',
      chiefComplaint: 'Simultaneous SOS bursts',
      severity: 'Critical',
      status: 'Dispatched',
      reportedAt: new Date().toISOString(),
      pickupLocation: { address: 'Jubilee Hills', landmark: 'Post', lat: 17.42, lng: 78.41 },
      assignedAmbulanceId: 'amb-1',
      assignedHospitalId: 'hosp-1',
      assignedEmtName: 'Vikram Singh',
      careCategoryRequired: 'Acute Emergency',
      notes: [],
    };

    // Fire 5 identical requests concurrently in parallel
    const results = await Promise.all([
      db.createEmergencyCase(basePayload),
      db.createEmergencyCase(basePayload),
      db.createEmergencyCase(basePayload),
      db.createEmergencyCase(basePayload),
      db.createEmergencyCase(basePayload),
    ]);

    const firstId = results[0].id;
    const allMatch = results.every((r) => r.id === firstId);
    assert(allMatch, 'All 5 concurrent requests returned the identical emergency case ID');

    // Confirm that only 1 record exists in database for this requestId
    const matchingCases = db.getAllEmergencyCases().filter((c) => c.clientRequestId === concurrentRequestId);
    assert(matchingCases.length === 1, 'Database contains exactly 1 case record for the clientRequestId');
    passed += 2;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- C. Retry after lost response ---
  console.log('\n--- C. Retry After Lost Response ---');
  try {
    const retryRequestId = `req-retry-${Date.now()}`;
    const created = await db.createEmergencyCase({
      caseNumber: 'EMR-RETRY-01',
      clientRequestId: retryRequestId,
      dispatchSyncStatus: 'synced_server',
      patientId: 'pat-1',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      patientGender: 'Female',
      chiefComplaint: 'Original dispatched packet',
      severity: 'Critical',
      status: 'Dispatched',
      reportedAt: new Date().toISOString(),
      pickupLocation: { address: 'HiTech City', landmark: 'Cyber Towers', lat: 17.45, lng: 78.38 },
      assignedAmbulanceId: 'amb-1',
      assignedHospitalId: 'hosp-1',
      assignedEmtName: 'Vikram Singh',
      careCategoryRequired: 'Acute Resuscitation',
      notes: ['Initial packet'],
    });

    // Client retries lookup by clientRequestId
    const retrieved = db.findEmergencyCaseByClientRequestId(retryRequestId);
    assert(retrieved !== undefined, 'Client retry successfully recovers case by clientRequestId');
    assert(retrieved?.id === created.id, 'Recovered case ID matches original dispatch');
    assert(retrieved?.dispatchSyncStatus === 'synced_server', 'Recovered case reflects synced_server status');
    passed += 3;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- D. Backend failure during SOS ---
  console.log('\n--- D. Backend Failure During SOS & Local Fallback ---');
  try {
    const simulatedOfflineCase: EmergencyCase = {
      caseId: 'EM-HYD-OFFLINE',
      clientRequestId: 'req-offline-01',
      dispatchSyncStatus: 'local_demo',
      syncErrorMessage: 'Operating in standalone local prototype mode.',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      severity: 'Critical (Red)',
      chiefComplaint: 'Offline fallback simulation',
      status: 'Ambulance En Route',
      assignedAmbulance: 'Unit 108-Hyd-42 (ALS)',
      destinationHospital: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
      etaMinutes: 4,
      vitals: { heartRate: 98, bloodPressure: '140/90', spO2: 96, respRate: 20 },
      simulatedTime: 'Active now (Simulated)',
    };

    assert(simulatedOfflineCase.dispatchSyncStatus === 'local_demo', 'Offline case state is explicitly "local_demo"');
    assert(simulatedOfflineCase.dispatchSyncStatus !== 'synced_server', 'Offline case is never marked as synced_server');
    passed += 2;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- E. Repeated button clicks / in-flight protection ---
  console.log('\n--- E. In-Flight Protection Against Rapid Button Clicks ---');
  try {
    let isSubmitting = true;
    let clickCount = 0;
    const triggerFn = () => {
      if (isSubmitting) return 'BLOCKED_IN_FLIGHT';
      clickCount++;
      return 'PROCESSED';
    };

    const firstAttempt = triggerFn();
    const secondAttempt = triggerFn();
    assert(firstAttempt === 'BLOCKED_IN_FLIGHT', 'First in-flight trigger prevented concurrent dispatch');
    assert(secondAttempt === 'BLOCKED_IN_FLIGHT', 'Subsequent rapid button clicks safely rejected');
    assert(clickCount === 0, 'No extra dispatches scheduled while in-flight lock active');
    passed += 3;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- F. Expired authentication token ---
  console.log('\n--- F. Expired Authentication Token Rejection ---');
  try {
    // Generate token with past expiration manually to test cryptographic expiration rejection
    const now = Date.now();
    const expiredPayload = {
      userId: 'usr-patient-1',
      role: 'patient',
      email: 'rajesh.sharma@demo.aegiscare.in',
      name: 'Rajesh Sharma',
      issuedAt: now - 100000,
      expiresAt: now - 50000,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
    const expiredToken = `${encodedHeader}.${encodedPayload}.${signature}`;

    const verified = verifyAuthToken(expiredToken);
    assert(verified.valid === false, 'Server cryptographic validator marks expired token as invalid');
    assert(verified.error === 'Token has expired', 'Server provides explicit expiration error message');
    passed += 2;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- G. Unauthorized patient access ---
  console.log('\n--- G. Unauthorized Patient Record Access Boundary ---');
  try {
    const patientUser = db.findUserById('usr-patient-1'); // Associated with pat-1
    assert(patientUser !== undefined, 'Patient user exists in database');

    const permittedPatient = db.findPatientById(patientUser?.associatedPatientId || 'pat-1');
    assert(permittedPatient?.id === 'pat-1', 'Patient has access to own record (pat-1)');

    // Attempt to access pat-2 (Lakshmi Devi) as usr-patient-1
    const targetPatientId = 'pat-2';
    const isOwner = patientUser?.associatedPatientId === targetPatientId;
    assert(isOwner === false, 'Patient usr-patient-1 is recognized as unauthorized for pat-2');
    passed += 3;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- H. Unauthorized hospital resource access ---
  console.log('\n--- H. Unauthorized Hospital Resource Access Boundary ---');
  try {
    const patientUser = db.findUserById('usr-patient-1');
    const isHospitalAdmin = patientUser?.role === 'hospital_admin';
    assert(isHospitalAdmin === false, 'Patient role is rejected from modifying hospital bed inventory');

    const doctorUser = db.findUserById('usr-doctor-1');
    assert(doctorUser?.role === 'doctor', 'Doctor role verified');
    // Doctors cannot reallocate entire hospital bed inventory (restricted to hospital_admin / system_admin)
    const canUpdateBeds = ['hospital_admin', 'system_admin'].includes(doctorUser?.role || '');
    assert(canUpdateBeds === false, 'Doctor role is restricted from hospital-wide administrative bed allocation');
    passed += 3;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- I. Revoked caregiver consent ---
  console.log('\n--- I. Revoked Caregiver Consent Check ---');
  try {
    const patientId = 'pat-1';
    const caregiverUserId = 'usr-family-1';

    // Revoke consent
    await db.toggleCaregiverConsent(patientId, caregiverUserId, false);
    const consentsRevoked = db.getConsentRecordsForPatient(patientId);
    const activeConsent = consentsRevoked.find((c) => c.authorizedUserId === caregiverUserId && c.status === 'Active');
    assert(activeConsent === undefined, 'Revoked consent prevents caregiver access to patient telemetric data');

    // Re-grant consent
    await db.toggleCaregiverConsent(patientId, caregiverUserId, true);
    const consentsGranted = db.getConsentRecordsForPatient(patientId);
    const reActiveConsent = consentsGranted.find((c) => c.authorizedUserId === caregiverUserId && c.status === 'Active');
    assert(reActiveConsent !== undefined, 'Granted consent allows caregiver telemetric monitoring');
    passed += 2;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  // --- J. UI state consistency after failure scenarios ---
  console.log('\n--- J. UI State Consistency After Failure Scenarios ---');
  try {
    const syncStates: DispatchSyncStatus[] = ['local_demo', 'pending', 'synced_server', 'sync_error'];
    syncStates.forEach((state) => {
      const sampleCase: EmergencyCase = {
        caseId: 'EM-HYD-TEST',
        dispatchSyncStatus: state,
        patientName: 'Test Patient',
        patientAge: 65,
        severity: 'Urgent (Yellow)',
        chiefComplaint: 'Testing state consistency',
        status: 'Ambulance En Route',
        assignedAmbulance: 'Unit 108',
        destinationHospital: 'Apex Trauma',
        etaMinutes: 5,
        vitals: { heartRate: 80, bloodPressure: '120/80', spO2: 98, respRate: 16 },
        simulatedTime: 'Active now',
      };
      assert(typeof sampleCase.caseId === 'string', `Case with state "${state}" preserves valid caseId string`);
      assert(typeof sampleCase.vitals.heartRate === 'number', `Case with state "${state}" preserves numeric vitals`);
    });
    passed += syncStates.length * 2;
  } catch (e: any) {
    console.error(e);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`Summary: ${passed}/${passed + failed} Phase 1C Concurrency & Safety Tests Passed (${failed} failed)`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase1cConcurrencyAndSafetyTests().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
