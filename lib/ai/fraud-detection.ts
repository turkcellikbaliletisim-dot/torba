/**
 * TORBAA AI Anti-Fraud & Anomalous Transaction Detection Engine
 * Evaluates payment velocity, geofence violations, and sudden high-value spikes.
 */

export interface TransactionAssessmentInput {
  userId: string;
  merchantId: string;
  amountMinor: bigint;
  userLatitude: number;
  userLongitude: number;
  merchantLatitude: number;
  merchantLongitude: number;
  lastTransactionTimeMs?: number;
}

export interface FraudAssessmentResult {
  isRiskFlagged: boolean;
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  actionRequired: 'ALLOW' | 'REQUIRE_OTP' | 'BLOCK_AND_REVIEW';
}

export function evaluateTransactionRisk(
  input: TransactionAssessmentInput
): FraudAssessmentResult {
  let riskScore = 0;
  const reasons: string[] = [];

  // 1. High value check (e.g. > ₺10.000 in a single transaction)
  if (input.amountMinor > 1000000n) {
    riskScore += 35;
    reasons.push('Yüksek tutarlı tekil işlem denemesi (₺10.000+)');
  }

  // 2. Geofence mismatch check (User location vs Merchant location > 10 km during QR scan)
  const distanceKm = calculateDistanceKm(
    input.userLatitude,
    input.userLongitude,
    input.merchantLatitude,
    input.merchantLongitude
  );

  if (distanceKm > 15.0) {
    riskScore += 45;
    reasons.push(`Konum uyuşmazlığı: Kullanıcı mekandan ${distanceKm.toFixed(1)} km uzakta`);
  }

  // 3. Velocity check (Transactions < 30 seconds apart)
  if (input.lastTransactionTimeMs) {
    const elapsedSeconds = (Date.now() - input.lastTransactionTimeMs) / 1000;
    if (elapsedSeconds < 30) {
      riskScore += 40;
      reasons.push(`Mükerrer hızlı işlem denemesi (${Math.round(elapsedSeconds)} sn içinde)`);
    }
  }

  // Risk Level Assignment
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let actionRequired: 'ALLOW' | 'REQUIRE_OTP' | 'BLOCK_AND_REVIEW' = 'ALLOW';

  if (riskScore >= 70) {
    riskLevel = 'CRITICAL';
    actionRequired = 'BLOCK_AND_REVIEW';
  } else if (riskScore >= 40) {
    riskLevel = 'HIGH';
    actionRequired = 'REQUIRE_OTP';
  } else if (riskScore >= 20) {
    riskLevel = 'MEDIUM';
    actionRequired = 'ALLOW';
  }

  return {
    isRiskFlagged: riskScore >= 40,
    riskScore: Math.min(100, riskScore),
    riskLevel,
    reasons,
    actionRequired,
  };
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
