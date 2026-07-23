import http from 'http';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: false, dir: process.cwd() });
const handle = app.getRequestHandler();

interface LatencyResult {
  durationMs: number;
  statusCode: number;
  endpoint: string;
}

async function runHttpLoadTest() {
  console.log('⚡ Initializing TORBAA Next.js Production HTTP Server for Full-Scale Load Test...\n');

  await app.prepare();
  
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const PORT = 3099;
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  console.log(`✅ Production HTTP Server listening on http://localhost:${PORT}`);

  const endpoints = [
    { name: 'GET /api/v1/mobile/wallet', path: '/api/v1/mobile/wallet', method: 'GET' },
    { name: 'GET /api/v1/mobile/merchants', path: '/api/v1/mobile/merchants?category=Yemek', method: 'GET' },
    { name: 'GET /api/v1/mobile/campaigns', path: '/api/v1/mobile/campaigns', method: 'GET' },
    { name: 'POST /api/v1/auth/send-otp', path: '/api/v1/auth/send-otp', method: 'POST', body: JSON.stringify({ phone: '5321234567' }) },
    { name: 'POST /api/v1/qr/generate', path: '/api/v1/qr/generate', method: 'POST', body: JSON.stringify({ userId: 'u-load-1', amountMinor: 4500 }) },
    { name: 'POST /api/v1/ai/fraud-check', path: '/api/v1/ai/fraud-check', method: 'POST', body: JSON.stringify({ userId: 'u-load-1', amountMinor: 45000 }) },
  ];

  console.log('\n🚀 Executing 5,000 Concurrent HTTP API Requests across 6 core endpoints...\n');

  const latencies: LatencyResult[] = [];
  const TOTAL_REQUESTS = 5000;
  const CONCURRENCY = 50; // 50 parallel request workers

  const startTime = performance.now();

  let completedRequests = 0;

  async function executeRequest(endpointObj: typeof endpoints[0]): Promise<LatencyResult> {
    const reqStart = performance.now();
    return new Promise((resolve) => {
      const options: http.RequestOptions = {
        hostname: 'localhost',
        port: PORT,
        path: endpointObj.path,
        method: endpointObj.method,
        headers: {
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
        },
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          const reqEnd = performance.now();
          resolve({
            durationMs: reqEnd - reqStart,
            statusCode: res.statusCode || 500,
            endpoint: endpointObj.name,
          });
        });
      });

      req.on('error', () => {
        const reqEnd = performance.now();
        resolve({
          durationMs: reqEnd - reqStart,
          statusCode: 500,
          endpoint: endpointObj.name,
        });
      });

      if (endpointObj.body) {
        req.write(endpointObj.body);
      }
      req.end();
    });
  }

  // Worker loop
  const requestQueue = Array.from({ length: TOTAL_REQUESTS }, (_, i) => endpoints[i % endpoints.length]);

  async function worker() {
    while (requestQueue.length > 0) {
      const task = requestQueue.shift();
      if (!task) break;
      const res = await executeRequest(task);
      latencies.push(res);
      completedRequests++;
    }
  }

  // Run 50 concurrent workers
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const endTime = performance.now();
  const totalDurationSec = (endTime - startTime) / 1000;
  const requestsPerSec = Math.round(TOTAL_REQUESTS / totalDurationSec);

  // Calculate stats
  const sortedDurations = latencies.map((l) => l.durationMs).sort((a, b) => a - b);
  const p50 = sortedDurations[Math.floor(sortedDurations.length * 0.5)].toFixed(2);
  const p90 = sortedDurations[Math.floor(sortedDurations.length * 0.9)].toFixed(2);
  const p95 = sortedDurations[Math.floor(sortedDurations.length * 0.95)].toFixed(2);
  const p99 = sortedDurations[Math.floor(sortedDurations.length * 0.99)].toFixed(2);
  const min = sortedDurations[0].toFixed(2);
  const max = sortedDurations[sortedDurations.length - 1].toFixed(2);
  const avg = (sortedDurations.reduce((a, b) => a + b, 0) / sortedDurations.length).toFixed(2);

  const status200Count = latencies.filter((l) => l.statusCode === 200).length;
  const successRate = ((status200Count / TOTAL_REQUESTS) * 100).toFixed(2);

  console.log('====================================================');
  console.log('🏆 TORBAA FULL HTTP API LOAD TEST REPORT');
  console.log('====================================================');
  console.log(`• Total Requests Processed : ${TOTAL_REQUESTS.toLocaleString()}`);
  console.log(`• Concurrent Workers       : ${CONCURRENCY}`);
  console.log(`• Total Test Time          : ${totalDurationSec.toFixed(2)} seconds`);
  console.log(`• Requests Per Second (RPS): ${requestsPerSec.toLocaleString()} req/sec`);
  console.log(`• HTTP 200 OK Success Rate : ${successRate}% (${status200Count}/${TOTAL_REQUESTS})`);
  console.log('----------------------------------------------------');
  console.log('⏱️ LATENCY PERCENTILES (HTTP End-to-End):');
  console.log(`   - Min Latency           : ${min} ms`);
  console.log(`   - Avg Latency           : ${avg} ms`);
  console.log(`   - Median (p50) Latency  : ${p50} ms`);
  console.log(`   - 90th Percentile (p90) : ${p90} ms`);
  console.log(`   - 95th Percentile (p95) : ${p95} ms`);
  console.log(`   - 99th Percentile (p99) : ${p99} ms`);
  console.log(`   - Max Latency           : ${max} ms`);
  console.log('====================================================\n');

  server.close();
  process.exit(0);
}

runHttpLoadTest().catch((err) => {
  console.error('Load test failed:', err);
  process.exit(1);
});
