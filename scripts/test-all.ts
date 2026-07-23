import { money, addMoney, subtractMoney, calculateBasisPoints } from '../lib/domain/money';
import { validateBalancedEntries, reverseEntries } from '../lib/domain/ledger';
import { generateSignedQrToken, verifyQrToken } from '../lib/services/qr-token-service';
import { recommendCampaigns } from '../lib/ai/recommendations';
import { evaluateTransactionRisk } from '../lib/ai/fraud-detection';

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

// 1. Money Domain Tests
console.log('--- 1. Money Domain Tests ---');
const m1 = money(1000n, 'TRY'); // ₺10,00
const m2 = money(500n, 'TRY');  // ₺5,00
const sum = addMoney(m1, m2);
assert(sum.amountMinor === 1500n, 'addMoney: 1000 + 500 = 1500 minor units');

const diff = subtractMoney(m1, m2);
assert(diff.amountMinor === 500n, 'subtractMoney: 1000 - 500 = 500 minor units');

const commission = calculateBasisPoints(money(10000n), 300); // 3% of 100.00
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

// 4. AI Recommendation Tests
console.log('\n--- 4. AI Recommendation Engine Tests ---');
const userCtx = {
  userId: 'u1',
  latitude: 40.6495,
  longitude: 27.8865,
  tier: 'GOLD' as const,
  preferredCategories: ['Yemek'],
};
const candidates = [
  {
    id: 'c1',
    merchantName: 'BigChefs',
    category: 'Yemek',
    discountPercent: 20,
    toinRewardPoints: 250,
    merchantLatitude: 40.6492,
    merchantLongitude: 27.8861,
    rating: 4.8,
  },
];
const recs = recommendCampaigns(userCtx, candidates);
assert(recs.length === 1 && recs[0].aiScore > 70, 'recommendCampaigns: Scores matching category and close proximity high');

// 5. AI Fraud Detection Tests
console.log('\n--- 5. AI Fraud Detection Tests ---');
const riskNormal = evaluateTransactionRisk({
  userId: 'u1',
  merchantId: 'm1',
  amountMinor: 4500n,
  userLatitude: 40.6495,
  userLongitude: 27.8865,
  merchantLatitude: 40.6492,
  merchantLongitude: 27.8861,
});
assert(riskNormal.isRiskFlagged === false && riskNormal.actionRequired === 'ALLOW', 'evaluateTransactionRisk: Normal transaction allowed');

const riskFraud = evaluateTransactionRisk({
  userId: 'u1',
  merchantId: 'm1',
  amountMinor: 15000000n, // ₺150.000
  userLatitude: 40.6495,
  userLongitude: 27.8865,
  merchantLatitude: 41.0000, // 40+ km away
  merchantLongitude: 28.9000,
});
assert(riskFraud.isRiskFlagged === true && riskFraud.actionRequired === 'BLOCK_AND_REVIEW', 'evaluateTransactionRisk: High-risk anomaly blocked');

console.log(`\n🎉 Test Suite Completed: ${passedTests}/${totalTests} tests passed!`);
