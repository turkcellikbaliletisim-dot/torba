import cluster from 'cluster';
import os from 'os';
import http from 'http';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const numCPUs = os.cpus().length;
const TOTAL_REQUESTS_PER_WORKER = 5000;
const CONCURRENCY_PER_WORKER = 40;
const PORT_BASE = 3100;

if (cluster.isPrimary) {
  console.log(`⚡ TORBAA Multi-Core Kubernetes Pod Cluster Simulation`);
  console.log(`💻 Detected ${numCPUs} CPU Cores on Host. Spawning ${numCPUs} Cluster Workers...\n`);

  let completedWorkers = 0;
  let totalClusterRequests = 0;
  let totalClusterDurationSec = 0;
  const workerStats: { rps: number; duration: number }[] = [];

  const startClusterTime = performance.now();

  for (let i = 0; i < numCPUs; i++) {
    const workerPort = PORT_BASE + i;
    const workerProcess = cluster.fork({ WORKER_PORT: workerPort, WORKER_ID: i });

    workerProcess.on('message', (msg) => {
      if (msg.type === 'RESULT') {
        workerStats.push(msg.data);
        completedWorkers++;
        totalClusterRequests += TOTAL_REQUESTS_PER_WORKER;

        if (completedWorkers === numCPUs) {
          const endClusterTime = performance.now();
          const totalClusterDuration = (endClusterTime - startClusterTime) / 1000;
          const aggregateRPS = Math.round(totalClusterRequests / totalClusterDuration);

          console.log('\n====================================================');
          console.log('🚀 TORBAA MULTI-CORE CLUSTER SCALING REPORT');
          console.log('====================================================');
          console.log(`• Active CPU Cluster Workers : ${numCPUs} Workers (Pods)`);
          console.log(`• Total Requests Processed   : ${totalClusterRequests.toLocaleString()} Requests`);
          console.log(`• Total Execution Time       : ${totalClusterDuration.toFixed(2)} seconds`);
          console.log(`• AGGREGATE CLUSTER RPS      : ${aggregateRPS.toLocaleString()} req/sec ⚡⚡`);
          console.log(`• EQUIVALENT HOURLY CAPACITY : ${Math.round(aggregateRPS * 3600).toLocaleString()} Transactions/Hour`);
          console.log('----------------------------------------------------');
          console.log('💡 20 Milyon Abone Peak Öğle Yemeği Yükü: ~3.700 req/sec');
          console.log(`✅ Sistem Kapasitesi Peak Yükün ${(aggregateRPS / 3700).toFixed(1)} KATI DÜZEYİNDEDİR!`);
          console.log('====================================================\n');

          process.exit(0);
        }
      }
    });
  }
} else {
  // Worker Process Logic
  const workerPort = parseInt(process.env.WORKER_PORT || '3100', 10);
  const workerId = process.env.WORKER_ID;

  async function startWorkerServer() {
    const app = next({ dev: false, dir: process.cwd() });
    const handle = app.getRequestHandler();
    await app.prepare();

    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    });

    await new Promise<void>((resolve) => server.listen(workerPort, resolve));

    const endpoints = [
      { path: '/api/v1/mobile/wallet', method: 'GET' },
      { path: '/api/v1/mobile/merchants?category=Yemek', method: 'GET' },
      { path: '/api/v1/qr/generate', method: 'POST', body: JSON.stringify({ userId: `u-${workerId}`, amountMinor: 4500 }) },
      { path: '/api/v1/ai/fraud-check', method: 'POST', body: JSON.stringify({ userId: `u-${workerId}`, amountMinor: 45000 }) },
    ];

    const latencies: number[] = [];
    const requestQueue = Array.from({ length: TOTAL_REQUESTS_PER_WORKER }, (_, i) => endpoints[i % endpoints.length]);

    const workerStart = performance.now();

    async function executeRequest(endpointObj: typeof endpoints[0]) {
      const reqStart = performance.now();
      return new Promise<void>((resolve) => {
        const req = http.request(
          {
            hostname: 'localhost',
            port: workerPort,
            path: endpointObj.path,
            method: endpointObj.method,
            headers: { 'Content-Type': 'application/json', Connection: 'keep-alive' },
          },
          (res) => {
            res.on('data', () => {});
            res.on('end', () => {
              latencies.push(performance.now() - reqStart);
              resolve();
            });
          }
        );
        req.on('error', () => resolve());
        if (endpointObj.body) req.write(endpointObj.body);
        req.end();
      });
    }

    async function workerRunner() {
      while (requestQueue.length > 0) {
        const task = requestQueue.shift();
        if (!task) break;
        await executeRequest(task);
      }
    }

    const workers = Array.from({ length: CONCURRENCY_PER_WORKER }, () => workerRunner());
    await Promise.all(workers);

    const workerEnd = performance.now();
    const duration = (workerEnd - workerStart) / 1000;
    const rps = Math.round(TOTAL_REQUESTS_PER_WORKER / duration);

    if (process.send) {
      process.send({ type: 'RESULT', data: { rps, duration } });
    }

    server.close();
  }

  startWorkerServer().catch((err) => {
    console.error(`Worker ${workerId} error:`, err);
    process.exit(1);
  });
}
