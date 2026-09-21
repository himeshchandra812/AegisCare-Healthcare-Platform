/**
 * Frontend Session & RBAC Integration Verification
 * Tests the first safe increment:
 * 1. Token authentication via API
 * 2. Profile hydration from /api/auth/me
 * 3. Expired token rejection
 * 4. Cross-role boundary view access rules
 */

import { authService } from '../server/services/authService';
import { generateAuthToken, verifyAuthToken } from '../server/auth/tokens';
import { canRoleAccessView, UserRole, NavigationItemId } from '../src/types';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, message?: string) {
  if (condition) {
    results.push({ suite, name, passed: true, message });
    console.log(`  ✅ [PASS] ${suite} > ${name}${message ? ` (${message})` : ''}`);
  } else {
    results.push({ suite, name, passed: false, message });
    console.error(`  ❌ [FAIL] ${suite} > ${name}${message ? ` (${message})` : ''}`);
  }
}

async function runSessionTests() {
  console.log('====================================================');
  console.log('⚡ AegisCare Session & RBAC Guard Verification');
  console.log('====================================================\n');

  // Test 1: User Login & Token Generation
  console.log('--- 1. Login & Token Authority ---');
  const loginRes = await authService.login('dr.ananya.rao@demo.aegiscare.in', 'demo123');
  assert(!!loginRes.token, 'Auth', 'Doctor Login Token Generated');
  assert(loginRes.user.role === 'doctor', 'Auth', 'Doctor Role Preserved', loginRes.user.name);

  // Test 2: Token verification for session hydration
  console.log('\n--- 2. Token Verification & Session Hydration ---');
  const verifyRes = verifyAuthToken(loginRes.token);
  assert(verifyRes.valid === true, 'Session', 'Token Signature Verified');
  assert(verifyRes.payload?.userId === 'usr-doctor-1', 'Session', 'User ID matches payload');
  assert(verifyRes.payload?.role === 'doctor', 'Session', 'Role correctly bound to payload');

  // Test 3: Expired Token Rejection
  console.log('\n--- 3. Token Expiry Isolation ---');
  const expiredPayload = {
    userId: 'usr-doctor-1',
    email: 'dr.ananya.rao@demo.aegiscare.in',
    role: 'doctor' as const,
    name: 'Dr. Ananya Rao, MD',
    issuedAt: Date.now() - 3600000 * 48,
    expiresAt: Date.now() - 3600000 * 24,
  };
  const encHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const encPayload = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
  const crypto = await import('node:crypto');
  const secret = process.env.JWT_SECRET || 'aegiscare-hyderabad-node-emergency-secret-key-2026';
  const expSig = crypto.createHmac('sha256', secret).update(`${encHeader}.${encPayload}`).digest('base64url');
  const expiredToken = `${encHeader}.${encPayload}.${expSig}`;

  const expiredCheck = verifyAuthToken(expiredToken);
  assert(expiredCheck.valid === false, 'Security', 'Expired Token Invalidation Verified');

  // Test 4: Role-Based View Guard Isolation
  console.log('\n--- 4. Client-Side RBAC Guard Integrity ---');
  const testMatrix: Array<{ role: UserRole; view: NavigationItemId; expected: boolean }> = [
    { role: 'patient', view: 'medical_profile', expected: true },
    { role: 'patient', view: 'traveller', expected: true },
    { role: 'patient', view: 'analytics', expected: false },
    { role: 'doctor', view: 'doctors', expected: true },
    { role: 'doctor', view: 'smart_ambulance', expected: true },
    { role: 'doctor', view: 'analytics', expected: false }, // Doctors use clinical console; analytics is for admins/operators
    { role: 'emt', view: 'smart_ambulance', expected: true },
    { role: 'emt', view: 'emergency', expected: true },
    { role: 'hospital_admin', view: 'hospitals', expected: true },
    { role: 'hospital_admin', view: 'analytics', expected: true },
    { role: 'family_member', view: 'family_tracking', expected: true },
    { role: 'system_admin', view: 'analytics', expected: true },
  ];

  for (const item of testMatrix) {
    const allowed = canRoleAccessView(item.role, item.view);
    assert(
      allowed === item.expected,
      'RBAC Matrix',
      `Role [${item.role}] -> View [${item.view}]: ${allowed ? 'Allowed' : 'Restricted'}`
    );
  }

  console.log('\n====================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`Summary: ${passed}/${total} Tests Passed (${failed} failed)`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSessionTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
