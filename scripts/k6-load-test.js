import http from 'k6/http';
import { check, sleep } from 'k6';

// Grafana k6 Distributed Load Test Configuration
export const options = {
  stages: [
    { duration: '10s', target: 50 },   // Warm-up to 50 Virtual Users (VUs)
    { duration: '30s', target: 500 },  // Ramp-up to 500 VUs
    { duration: '1m',  target: 2000 }, // Peak load: 2,000 concurrent VUs
    { duration: '20s', target: 0 },    // Cool-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<150', 'p(99)<300'], // 95% of requests < 150ms, 99% < 300ms
    http_req_failed: ['rate<0.01'],               // Less than 1% failure rate
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Scenario 1: Wallet & Balance Query
  const walletRes = http.get(`${BASE_URL}/api/v1/mobile/wallet`);
  check(walletRes, {
    'Wallet status is 200': (r) => r.status === 200,
    'Wallet payload is valid': (r) => r.json('success') === true,
  });

  // Scenario 2: Merchants & Discovery Query
  const merchantRes = http.get(`${BASE_URL}/api/v1/mobile/merchants?category=Yemek`);
  check(merchantRes, {
    'Merchants status is 200': (r) => r.status === 200,
  });

  // Scenario 3: QR Token Generation & Instant Verification
  const qrGenPayload = JSON.stringify({
    userId: `user-k6-${__VU}`,
    branchId: 'branch-balikesir-1',
    amountMinor: 4500,
  });

  const headers = { 'Content-Type': 'application/json' };
  const qrGenRes = http.post(`${BASE_URL}/api/v1/qr/generate`, qrGenPayload, { headers });
  
  check(qrGenRes, {
    'QR Generate status is 200': (r) => r.status === 200,
  });

  if (qrGenRes.status === 200) {
    const qrToken = qrGenRes.json('data.qrToken');
    if (qrToken) {
      const qrVerifyPayload = JSON.stringify({ qrToken });
      const qrVerifyRes = http.post(`${BASE_URL}/api/v1/qr/verify`, qrVerifyPayload, { headers });
      check(qrVerifyRes, {
        'QR Verify status is 200': (r) => r.status === 200,
        'QR Verification is valid': (r) => r.json('success') === true,
      });
    }
  }

  // Scenario 4: AI Anti-Fraud Check
  const fraudPayload = JSON.stringify({
    userId: `user-k6-${__VU}`,
    merchantId: 'm-101',
    amountMinor: 45000,
    userLatitude: 40.6495,
    userLongitude: 27.8865,
    merchantLatitude: 40.6492,
    merchantLongitude: 27.8861,
  });

  const fraudRes = http.post(`${BASE_URL}/api/v1/ai/fraud-check`, fraudPayload, { headers });
  check(fraudRes, {
    'Fraud check status is 200': (r) => r.status === 200,
  });

  sleep(0.5); // 500ms pacing between iterations
}
