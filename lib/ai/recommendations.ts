/**
 * TORBAA AI Recommendation Engine
 * Analyzes user location, past transaction categories, Toin balance, and merchant ratings
 * to score and rank campaigns for personalized discovery.
 */

export interface UserContext {
  userId: string;
  latitude: number;
  longitude: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  preferredCategories: string[];
}

export interface CampaignCandidate {
  id: string;
  merchantName: string;
  category: string;
  discountPercent: number;
  toinRewardPoints: number;
  merchantLatitude: number;
  merchantLongitude: number;
  rating: number;
}

export interface ScoredCampaign extends CampaignCandidate {
  aiScore: number;
  matchReason: string;
}

export function recommendCampaigns(
  user: UserContext,
  campaigns: CampaignCandidate[],
  limit = 10
): ScoredCampaign[] {
  const scored = campaigns.map((campaign) => {
    let score = 50; // Base score
    const reasons: string[] = [];

    // Category affinity matching (+25 pts)
    if (user.preferredCategories.includes(campaign.category)) {
      score += 25;
      reasons.push(`${campaign.category} kategorisindeki ilginize özel`);
    }

    // Distance proximity calculation (+20 pts for < 1km)
    const distKm = calculateDistanceKm(
      user.latitude,
      user.longitude,
      campaign.merchantLatitude,
      campaign.merchantLongitude
    );
    if (distKm < 1.0) {
      score += 20;
      reasons.push('Size çok yakın (1 km içinde)');
    } else if (distKm < 3.0) {
      score += 10;
    }

    // Rating boost (+10 pts for >= 4.7)
    if (campaign.rating >= 4.7) {
      score += 10;
      reasons.push('Yüksek müşteri memnuniyeti');
    }

    // Tier multiplier (+15 pts for Gold/Platinum)
    if (user.tier === 'GOLD' || user.tier === 'PLATINUM') {
      score += 15;
      reasons.push('Üst seviye üyelere özel ekstra ayrıcalık');
    }

    return {
      ...campaign,
      aiScore: Math.min(100, score),
      matchReason: reasons.length > 0 ? reasons.join(' · ') : 'Popüler Fırsat',
    };
  });

  return scored.sort((a, b) => b.aiScore - a.aiScore).slice(0, limit);
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
