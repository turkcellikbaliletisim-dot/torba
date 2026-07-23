import { money, addMoney, subtractMoney, calculateBasisPoints } from '../lib/domain/money';
import { validateBalancedEntries, reverseEntries } from '../lib/domain/ledger';
import { generateSignedQrToken, verifyQrToken } from '../lib/services/qr-token-service';
import { recommendCampaigns } from '../lib/ai/recommendations';
import { evaluateTransactionRisk } from '../lib/ai/fraud-detection';
import { storeOtp, verifyOtpCode, canSendOtp } from '../lib/auth/otp-store';
import { checkRateLimit } from '../lib/middleware/rate-limit';
import { signSessionToken, verifySessionToken } from '../lib/auth/jwt';
import { verifyWebhookSignature } from '../lib/services/payment-gateway';
import crypto from 'crypto';

console.log('🧪 Running Full TORBAA Automated Test Suite...\n');

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
    { walletId: 'w-merchant', direction: 'CREDIT' as const, amountMinor: 1000n },
  ];

  let isValidLedger = true;
  try {
    validateBalancedEntries(entries);
  } catch (e) {
    isValidLedger = false;
  }
  assert(isValidLedger, 'validateBalancedEntries: Balanced debit/credit entries pass validation');

  const reversed = reverseEntries(entries);
  assert(
    reversed[0].direction === 'CREDIT' && reversed[1].direction === 'DEBIT',
    'reverseEntries: Flips DEBIT -> CREDIT and CREDIT -> DEBIT'
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

  // 4. Hashed OTP Engine Tests
  console.log('\n--- 4. Hashed OTP Engine Tests ---');
  const testPhone = '5329998877';
  const testCode = '849201';
  storeOtp(testPhone, testCode, 120);

  const invalidRes = verifyOtpCode(testPhone, '000000');
  assert(invalidRes.isValid === false, 'verifyOtpCode: Wrong code rejected');

  const validRes = verifyOtpCode(testPhone, testCode);
  assert(validRes.isValid === true, 'verifyOtpCode: Correct SHA-256 code verified');

  const cooldownCheck = canSendOtp(testPhone, 60);
  assert(cooldownCheck.allowed === true, 'canSendOtp: Cooldown cleared after verification');

  // 5. Sliding Window Rate Limiter Tests
  console.log('\n--- 5. Sliding Window Rate Limiter Tests ---');
  const rlKey = 'test-ip-123';
  for (let i = 0; i < 3; i++) {
    checkRateLimit(rlKey, 3, 60);
  }
  const blockedRl = checkRateLimit(rlKey, 3, 60);
  assert(blockedRl.allowed === false, 'checkRateLimit: Blocks request after reaching limit');

  // 6. JOSE JWT Authentication Tests
  console.log('\n--- 6. JOSE JWT Authentication Tests ---');
  const sessionJwt = await signSessionToken({
    userId: 'u-jwt-1',
    phone: '5321112233',
    fullName: 'Test User',
    role: 'ADMIN',
  });
  const decodedSession = await verifySessionToken(sessionJwt);
  assert(decodedSession?.userId === 'u-jwt-1' && decodedSession?.role === 'ADMIN', 'signSessionToken/verifySessionToken: Valid HS256 JWT verified');

  // 7. HMAC Webhook Signature Tests
  console.log('\n--- 7. HMAC Webhook Signature Tests ---');
  const rawBody = '{"paymentId":"pay-123","status":"SUCCESS"}';
  const secretKey = process.env.PAYMENT_SECRET_KEY || 'dev_payment_secret_key_2026';
  const validSig = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
  const isSigValid = verifyWebhookSignature(rawBody, validSig);
  assert(isSigValid === true, 'verifyWebhookSignature: Valid HMAC-SHA256 signature passes verification');

  console.log(`\n🎉 Test Suite Completed: ${passedTests}/${totalTests} tests passed!`);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
