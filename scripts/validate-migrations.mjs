import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const migrationsDirectory = path.resolve(process.cwd(), 'database/migrations');
const requiredCoreTables = [
  'users',
  'roles',
  'permissions',
  'merchants',
  'merchant_branches',
  'corporate_companies',
  'corporate_employees',
  'wallets',
  'ledger_transactions',
  'ledger_entries',
  'qr_payment_intents',
  'payments',
  'refunds',
  'audit_logs',
];

function fail(message) {
  console.error(`Migration validation failed: ${message}`);
  process.exitCode = 1;
}

const migrationFiles = (await readdir(migrationsDirectory))
  .filter((file) => /^\d{3}_[a-z0-9_]+\.sql$/.test(file))
  .sort();

if (migrationFiles.length === 0) {
  fail('No migration files were found.');
} else {
  const seenPrefixes = new Set();
  let combinedSql = '';

  for (const file of migrationFiles) {
    const prefix = file.slice(0, 3);
    if (seenPrefixes.has(prefix)) {
      fail(`Duplicate migration prefix ${prefix}.`);
    }
    seenPrefixes.add(prefix);

    const sql = await readFile(path.join(migrationsDirectory, file), 'utf8');
    if (!sql.trim()) {
      fail(`${file} is empty.`);
    }
    if (/\bDROP\s+TABLE\b/i.test(sql)) {
      fail(`${file} contains DROP TABLE. Historical financial schema must be changed safely.`);
    }
    combinedSql += `\n${sql}`;
  }

  for (const table of requiredCoreTables) {
    const pattern = new RegExp(`CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${table}\\b`, 'i');
    if (!pattern.test(combinedSql)) {
      fail(`Required core table ${table} is missing.`);
    }
  }
}

if (!process.exitCode) {
  console.log(`Validated ${migrationFiles.length} migration file(s).`);
}
