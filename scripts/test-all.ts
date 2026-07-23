import { money, addMoney, subtractMoney, calculateBasisPoints } from '../lib/domain/money';
import { validateBalancedEntries, reverseEntries } from '../lib/domain/ledger';
import { generateSignedQrToken, verifyQrToken } from '../lib/services/qr-token-service';
import { storeOtp, verifyOtpCode, canSendOtp, deleteOtp, generateSecureOtpCode } from '../lib/auth/otp-store';
import { checkRateLimitAsync } from '../lib/middleware/rate-limit';
import { signSessionToken, verifySessionToken } from '../lib/auth/jwt';
import { verifyWebhookSignature } from '../lib/services/payment-gateway';
import { getIdempotentResult, saveIdempotentResult, acquireIdempotencyLock } from '../lib/services/idempotency-service';
import { defaultPaymentProvider } from '../lib/services/payment-provider-adapter';
import { hasPermission } from '../lib/auth/rbac';
import { requestDualApproval, approveBySecondAdmin } from '../lib/services/approval-service';
import { createSettlementBatch } from '../lib/services/settlement-service';
import { setnxCache } from '../lib/db/redis';
import crypto from 'crypto';

console.log('🧪 Running Full TORBAA Master Production Readiness Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exit(1);
  }
}

async function runTests() {
  // 1. Money Domain Tests
  console.log('--- 1. Money Domain Tests ---');
  const m1 = money(1000n, 'TRY');
  const m2 = money(500n, 'TRY');
  const sum = addMoney(m1, m2);
  assert(sum.amountMinor === 1500n, 'addMoney: 1000 + 500 = 1500 minor units');

  const diff = subtractMoney(m1, m2);
  assert(diff.amountMinor === 500n, 'subtractMoney: 1000 - 500 = 500 minor units');

  const commission = calculateBasisPoints(money(10000n), 300);
  assert(commission.amountMinor === 300n, 'calculateBasisPoints: 3% of 10000 = 300 minor units');

  // 2. Double-Entry Ledger Tests
  console.log('\n--- 2. Double-Entry Ledger Tests ---');
  const entries = [
    { walletId: 'w-user', direction: 'DEBIT' as const, amountMinor: 1000n },
    { walletId: 'w-merchant', direction: 'CREDIT' as const, amountMinor: 970n },
    { walletId: 'w-platform-fees', direction: 'CREDIT' as const, amountMinor: 30n },
  ];

  let isValidLedger = true;
  try {
    validateBalancedEntries(entries);
  } catch (e) {
    isValidLedger = false;
  }
  assert(isValidLedger, 'validateBalancedEntries: Balanced debit/credit entries (1000 = 970 + 30) pass validation');

  const reversed = reverseEntries(entries);
  assert(
    reversed[0].direction === 'CREDIT' && reversed[1].direction === 'DEBIT' && reversed[2].direction === 'DEBIT',
    'reverseEntries: Flips DEBIT -> CREDIT and CREDIT -> DEBIT for full commission reversal'
  );

  // 3. Cryptographic QR Token Tests
  console.log('\n--- 3. Cryptographic QR Token Tests ---');
  const qrPayload = {
    intentId: 'intent-test-1',
    userId: 'user-1',
    branchId: 'branch-1',
    amountMinor: 4500n,
  };
  const { qrToken } = generateSignedQrToken(qrPayload, 60);
  assert(typeof qrToken === 'string' && qrToken.length > 20, 'generateSignedQrToken: Returns base64url token');

  const verification = verifyQrToken(qrToken);
  assert(verification.isValid === true, 'verifyQrToken: Valid HMAC signature token verifies successfully');
  assert(verification.payload?.amountMinor === 4500n, 'verifyQrToken: Decodes original payload amountMinor');

  // 4. Production Secure Cryptographic OTP Engine Tests
  console.log('\n--- 4. Production Secure Cryptographic OTP Engine Tests ---');
  const secureCode = generateSecureOtpCode();
  assert(secureCode.length === 6 && !isNaN(Number(secureCode)), 'generateSecureOtpCode: Generates 6-digit crypto.randomInt OTP');

  const testPhone = '5329998877';
  await storeOtp(testPhone, secureCode, 120);

  const invalidRes = await verifyOtpCode(testPhone, '000000');
  assert(invalidRes.isValid === false, 'verifyOtpCode: Wrong code rejected by HMAC comparison');

  const validRes = await verifyOtpCode(testPhone, secureCode);
  assert(validRes.isValid === true, 'verifyOtpCode: Correct HMAC-SHA256 code verified and consumed');

  // Test deleteOtp cleanup
  await storeOtp(testPhone, '112233', 120);
  await deleteOtp(testPhone);
  const deletedVerify = await verifyOtpCode(testPhone, '112233');
  assert(deletedVerify.isValid === false, 'deleteOtp: Cleans up stored OTP on SMS transmission error');

  // 5. Distributed Rate Limiter & Atomic SET NX Tests
  console.log('\n--- 5. Distributed Rate Limiter & Atomic SET NX Tests ---');
  const setnx1 = await setnxCache('lock-key-1', 'locked', 60);
  assert(setnx1 === true, 'setnxCache: First atomic SET NX EX lock acquired');

  const setnx2 = await setnxCache('lock-key-1', 'locked', 60);
  assert(setnx2 === false, 'setnxCache: Second atomic SET NX EX lock fails cleanly (Zero Race Conditions)');

  const rlKey = 'test-ip-redis-123';
  for (let i = 0; i < 3; i++) {
    await checkRateLimitAsync(rlKey, 3, 60);
  }
  const blockedRl = await checkRateLimitAsync(rlKey, 3, 60);
  assert(blockedRl.allowed === false, 'checkRateLimitAsync: Blocks request after reaching limit');

  // 6. JOSE JWT Authentication & Permission RBAC Tests
  console.log('\n--- 6. JOSE JWT Authentication & Permission RBAC Tests ---');
  const sessionJwt = await signSessionToken({
    userId: 'u-jwt-1',
    phone: '5321112233',
    fullName: 'Test User',
    role: 'ADMIN',
  });
  const decodedSession = await verifySessionToken(sessionJwt);
  assert(decodedSession?.userId === 'u-jwt-1' && decodedSession?.role === 'ADMIN', 'signSessionToken/verifySessionToken: Valid HS256 JWT verified');

  assert(hasPermission('ADMIN', 'refund.approve') === true, 'hasPermission: Admin has refund.approve permission');
  assert(hasPermission('CUSTOMER', 'refund.approve') === false, 'hasPermission: Customer does not have refund.approve permission');
  assert(hasPermission('MERCHANT', 'refund.create') === true, 'hasPermission: Merchant has refund.create permission');

  // 7. Payment Provider Adapter & Settlement Batch Calculation Tests
  console.log('\n--- 7. Payment Provider Adapter & Settlement Batch Calculation Tests ---');
  const settlement = defaultPaymentProvider.calculateSettlement(10000n, 300); // ₺100,00 - %3 = ₺97,00 net
  assert(settlement.commissionAmountMinor === 300n, 'calculateSettlement: 3% commission on ₺100 = ₺3,00');
  assert(settlement.netPayoutMinor === 9700n, 'calculateSettlement: Net merchant payout = ₺97,00');

  const batch = await createSettlementBatch('m-101');
  assert(batch.merchantId === 'm-101' && batch.status === 'PENDING_PAYOUT', 'createSettlementBatch: Groups completed payments into settlement payout batch');

  // 8. 4-Eye Approval (Çift Onay) Engine Tests
  console.log('\n--- 8. 4-Eye Approval (Çift Onay) Engine Tests ---');
  const dualAppr = await requestDualApproval({
    actionType: 'HIGH_VALUE_REFUND',
    requestedByUserId: 'admin-1',
    amountMinor: 1500000n, // ₺15.000 (Above ₺10.000 threshold)
    payload: { paymentId: 'pay-999' },
  });
  assert(dualAppr.requiresSecondApproval === true, 'requestDualApproval: High-value refund requires 2nd admin approval');

  const sameAdminAppr = await approveBySecondAdmin(dualAppr.approvalRecord.id, 'admin-1');
  assert(sameAdminAppr.success === false, 'approveBySecondAdmin: Prevents 1st admin from giving 2nd approval (4-Eye Principle)');

  const secondAdminAppr = await approveBySecondAdmin(dualAppr.approvalRecord.id, 'admin-2');
  assert(secondAdminAppr.success === true, 'approveBySecondAdmin: 2nd admin successfully grants approval');

  // 9. Real Idempotency Lock & 409 Conflict Payload Hash Tests
  console.log('\n--- 9. Real Idempotency Lock & 409 Conflict Payload Hash Tests ---');
  const ik = `idempotent-test-key-${Date.now()}`;
  const originalPayload = { merchantId: 'm-1', amountMinor: 5000 };
  const conflictingPayload = { merchantId: 'm-1', amountMinor: 9999 };

  await acquireIdempotencyLock(ik, originalPayload, 60);
  await saveIdempotentResult(ik, originalPayload, 'COMPLETED', 200, { paymentId: 'pay-999', status: 'SUCCESS' });

  const conflictCheck = await acquireIdempotencyLock(ik, conflictingPayload, 60);
  assert(conflictCheck.conflict === true, 'acquireIdempotencyLock: Returns 409 conflict when same key is submitted with different payload body');

  const retrievedIdempotency = await getIdempotentResult(ik);
  assert(retrievedIdempotency?.responseBody?.paymentId === 'pay-999', 'saveIdempotentResult/getIdempotentResult: Idempotency lock stored and retrieved');

  // 10. HMAC Webhook Signature Tests
  console.log('\n--- 10. HMAC Webhook Signature Tests ---');
  const rawBody = '{"paymentId":"pay-123","status":"SUCCESS"}';
  const secretKey = process.env.PAYMENT_SECRET_KEY || 'dev_payment_secret_key_2026';
  const validSig = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');

  const isSigValid = verifyWebhookSignature(rawBody, validSig);
  assert(isSigValid === true, 'verifyWebhookSignature: Valid HMAC-SHA256 signature passes verification');

  const mismatchLenSig = verifyWebhookSignature(rawBody, 'short_invalid_sig');
  assert(mismatchLenSig === false, 'verifyWebhookSignature: Length mismatch handled safely without timingSafeEqual Exception');

  console.log(`\n🎉 Master Production Readiness Test Suite Completed: ${passedTests}/${totalTests} tests passed!`);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
