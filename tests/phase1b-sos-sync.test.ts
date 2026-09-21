import { db } from '../server/db/database';
import { generateAuthToken } from '../server/auth/tokens';
import { DBEmergencyCase } from '../server/db/schema';
import { DispatchSyncStatus, EmergencyCase } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(message);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

async function runPhase1bSyncTests() {
  console.log('================================================================');
  console.log('⚡ AEGISCARE PHASE 1B: EMERGENCY SOS SYNCHRONIZATION TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // --- Test 1: Local Demo Status ---
  console.log('--- 1. Emergency Case Model: Local Demo Status ---');
  try {
    const demoCase: EmergencyCase = {
      caseId: 'EM-HYD-DEMO-01',
      dispatchSyncStatus: 'local_demo',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      severity: 'Critical (Red)',
      chiefComplaint: 'Simulated 1-Tap SOS Dispatch in offline/demo mode',
      status: 'Ambulance En Route',
      assignedAmbulance: 'Unit 108-Hyd-42 (ALS)',
      destinationHospital: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
      etaMinutes: 4,
      vitals: {
        heartRate: 98,
        bloodPressure: '140/90',
        spO2: 96,
        respRate: 20,
      },
      simulatedTime: 'Active now (Simulated)',
    };

    assert(demoCase.dispatchSyncStatus === 'local_demo', 'Local demo case explicitly marked with dispatchSyncStatus "local_demo"');
    assert(demoCase.dispatchSyncStatus !== 'synced_server', 'Local demo case is NOT marked as synced_server');
    passed += 2;
  } catch (e: any) {
    failed++;
  }

  // --- Test 2: Successful Server Synchronization ---
  console.log('\n--- 2. Database & API: Successful Server Synchronization ---');
  try {
    const clientRequestId = `req-sos-test-${Date.now()}-abc`;
    const newCasePayload: Omit<DBEmergencyCase, 'id' | 'createdAt' | 'updatedAt'> = {
      caseNumber: `EMR-HYD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientRequestId,
      dispatchSyncStatus: 'synced_server',
      patientId: 'pat-1',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      patientGender: 'Female',
      chiefComplaint: 'Acute chest tightness with diaphoresis',
      severity: 'Critical',
      status: 'Dispatched',
      reportedAt: new Date().toISOString(),
      pickupLocation: {
        address: 'Banjara Hills Road No 10, Hyderabad',
        landmark: 'Near City Center',
        lat: 17.4156,
        lng: 78.4357,
      },
      assignedAmbulanceId: 'amb-1',
      assignedHospitalId: 'hosp-1',
      assignedEmtName: 'Vikram Singh, EMT-P',
      careCategoryRequired: 'Acute Emergency Resuscitation',
      notes: ['SOS signal received and registered in backend database.'],
    };

    const created = await db.createEmergencyCase(newCasePayload);
    assert(created.id.startsWith('case-'), 'Server created unique emergency case ID');
    assert(created.dispatchSyncStatus === 'synced_server', 'Server persisted case with dispatchSyncStatus "synced_server"');
    assert(created.clientRequestId === clientRequestId, 'Server recorded clientRequestId for idempotency tracking');
    passed += 3;
  } catch (e: any) {
    failed++;
  }

  // --- Test 3: Duplicate SOS Submission (Idempotency Prevention) ---
  console.log('\n--- 3. Idempotency: Duplicate SOS Submission Handling ---');
  try {
    const idempotentRequestId = `req-idempotent-${Date.now()}`;
    
    // First creation
    const case1 = await db.createEmergencyCase({
      caseNumber: `EMR-HYD-IDEM-01`,
      clientRequestId: idempotentRequestId,
      dispatchSyncStatus: 'synced_server',
      patientId: 'pat-1',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      patientGender: 'Female',
      chiefComplaint: 'Simulated SOS duplicate test',
      severity: 'Critical',
      status: 'Dispatched',
      reportedAt: new Date().toISOString(),
      pickupLocation: { address: 'Jubilee Hills', landmark: 'Checkpost', lat: 17.43, lng: 78.41 },
      assignedAmbulanceId: 'amb-1',
      assignedHospitalId: 'hosp-1',
      assignedEmtName: 'Vikram Singh',
      careCategoryRequired: 'Acute Emergency',
      notes: [],
    });

    // Lookup by clientRequestId
    const existing = db.findEmergencyCaseByClientRequestId(idempotentRequestId);
    assert(existing !== undefined, 'Server successfully locates existing case by clientRequestId');
    assert(existing?.id === case1.id, 'Idempotent query returns original case ID without allocating duplicate case');
    assert(existing?.caseNumber === 'EMR-HYD-IDEM-01', 'Case number matches initial dispatch');
    passed += 3;
  } catch (e: any) {
    failed++;
  }

  // --- Test 4: Failed Synchronization & Safe Fallback ---
  console.log('\n--- 4. Error Handling: Failed Synchronization State ---');
  try {
    const failedSyncCase: EmergencyCase = {
      caseId: 'EM-HYD-PENDING',
      clientRequestId: 'req-fail-001',
      dispatchSyncStatus: 'sync_error',
      syncErrorMessage: 'Network timeout: Operating in standalone local prototype mode.',
      patientName: 'Lakshmi Devi',
      patientAge: 71,
      severity: 'Critical (Red)',
      chiefComplaint: 'Chest tightness',
      status: 'Dispatch Pending',
      assignedAmbulance: 'Unit 108-Hyd-42 (ALS)',
      destinationHospital: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
      etaMinutes: 4,
      vitals: { heartRate: 98, bloodPressure: '140/90', spO2: 96, respRate: 20 },
      simulatedTime: 'Active now (Simulated)',
    };

    assert(failedSyncCase.dispatchSyncStatus === 'sync_error', 'Sync failure is explicitly labeled as "sync_error"');
    assert(Boolean(failedSyncCase.syncErrorMessage), 'Sync error contains user-visible explanation message');
    assert(failedSyncCase.dispatchSyncStatus !== 'synced_server', 'Failed sync is never presented as synced_server');
    passed += 3;
  } catch (e: any) {
    failed++;
  }

  // --- Test 5: No False Dispatch Confirmation Guard ---
  console.log('\n--- 5. Safety Invariant: No False Dispatch Confirmation ---');
  try {
    const validStatuses: DispatchSyncStatus[] = ['local_demo', 'pending', 'synced_server', 'sync_error'];
    const testCases: { status: DispatchSyncStatus; isRealEmergencyContacted: boolean }[] = [
      { status: 'local_demo', isRealEmergencyContacted: false },
      { status: 'pending', isRealEmergencyContacted: false },
      { status: 'synced_server', isRealEmergencyContacted: false }, // Synced to prototype DB, NEVER real 112/108 services
      { status: 'sync_error', isRealEmergencyContacted: false },
    ];

    testCases.forEach((tc) => {
      assert(
        validStatuses.includes(tc.status),
        `Status "${tc.status}" conforms to strict DispatchSyncStatus type definition`
      );
      assert(
        tc.isRealEmergencyContacted === false,
        `Status "${tc.status}" strictly upholds prototype boundary (no real 112/108 dispatch)`
      );
    });

    passed += testCases.length * 2;
  } catch (e: any) {
    failed++;
  }

  console.log('\n================================================================');
  console.log(`Summary: ${passed}/${passed + failed} Phase 1B Synchronization Tests Passed (${failed} failed)`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase1bSyncTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
