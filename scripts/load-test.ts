import { money, addMoney, calculateBasisPoints } from '../lib/domain/money';
import { validateBalancedEntries } from '../lib/domain/ledger';
import { generateSignedQrToken, verifyQrToken } from '../lib/services/qr-token-service';
import { recommendCampaigns } from '../lib/ai/recommendations';
import { evaluateTransactionRisk } from '../lib/ai/fraud-detection';

console.log('⚡ TORBAA High-Concurrency Load & Benchmark Test Suite\n');

// Benchmark Helper
function benchmark(name: string, fn: () => void, iterations: number) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const totalTimeMs = end - start;
  const opsPerSec = Math.round((iterations / totalTimeMs) * 1000);
  const avgLatencyMs = (totalTimeMs / iterations).toFixed(4);

  console.log(`📊 Benchmark: [${name}]`);
  console.log(`   • Iterations: ${iterations.toLocaleString()}`);
  console.log(`   • Total Time: ${totalTimeMs.toFixed(2)} ms`);
  console.log(`   • Throughput: ${opsPerSec.toLocaleString()} ops/sec`);
  console.log(`   • Avg Latency: ${avgLatencyMs} ms/op\n`);
}

// 1. Money & Ledger Engine Load Test
benchmark(
  '1. Money & Ledger Double-Entry Transactions',
  () => {
    const m1 = money(4500n);
    const m2 = money(500n);
    const sum = addMoney(m1, m2);
    const comm = calculateBasisPoints(sum, 300);

    const entries = [
      { walletId: 'w-user', direction: 'DEBIT' as const, amountMinor: sum.amountMinor },
      { walletId: 'w-merchant', direction: 'CREDIT' as const, amountMinor: sum.amountMinor - comm.amountMinor },
      { walletId: 'w-platform', direction: 'CREDIT' as const, amountMinor: comm.amountMinor },
    ];
    validateBalancedEntries(entries);
  },
  100000 // 100k iterations
);

// 2. Cryptographic QR Token HMAC Signature & Verification Load Test
const samplePayload = {
  intentId: 'intent-loadtest-999',
  userId: 'user-loadtest-1',
  branchId: 'branch-loadtest-1',
  amountMinor: 4500n,
};

let sampleQrToken = '';

benchmark(
  '2a. Cryptographic HMAC QR Token Generation',
  () => {
    const { qrToken } = generateSignedQrToken(samplePayload, 60);
    sampleQrToken = qrToken;
  },
  50000 // 50k iterations
);

benchmark(
  '2b. Cryptographic HMAC QR Token Verification (O(1) CPU)',
  () => {
    verifyQrToken(sampleQrToken);
  },
  50000 // 50k iterations
);

// 3. AI Campaign Recommendation Engine Load Test
const userContext = {
  userId: 'user-bench-1',
  latitude: 40.6495,
  longitude: 27.8865,
  tier: 'GOLD' as const,
  preferredCategories: ['Yemek', 'Kafe'],
};

const dummyCampaigns = Array.from({ length: 50 }, (_, i) => ({
  id: `c-${i}`,
  merchantName: `Merchant ${i}`,
  category: i % 2 === 0 ? 'Yemek' : 'Kafe',
  discountPercent: 15 + (i % 10),
  toinRewardPoints: 100 + (i * 10),
  merchantLatitude: 40.6495 + (i * 0.001),
  merchantLongitude: 27.8865 + (i * 0.001),
  rating: 4.5 + (i % 5) * 0.1,
}));

benchmark(
  '3. AI Recommendation Engine (Scoring 50 Candidates/Req)',
  () => {
    recommendCampaigns(userContext, dummyCampaigns, 10);
  },
  10000 // 10k iterations (evaluating 500,000 candidates total)
);

// 4. AI Anti-Fraud Risk Engine Load Test
benchmark(
  '4. AI Anti-Fraud Risk Engine Assessment',
  () => {
    evaluateTransactionRisk({
      userId: 'u-bench',
      merchantId: 'm-bench',
      amountMinor: 45000n,
      userLatitude: 40.6495,
      userLongitude: 27.8865,
      merchantLatitude: 40.6492,
      merchantLongitude: 27.8861,
    });
  },
  50000 // 50k iterations
);

console.log('🚀 TORBAA Load & Benchmark Test Completed Successfully!');
