import { randomInt } from 'node:crypto';
import type { OtpChallengeRepository, OtpDeliveryGateway } from '@/lib/auth/contracts';
import { hashOtp, verifyOtp } from '@/lib/auth/otp';

export class OtpService {
  constructor(
    private readonly challenges: OtpChallengeRepository,
    private readonly delivery: OtpDeliveryGateway,
    private readonly pepper: string,
  ) {}

  async request(destination: string, purpose: string): Promise<void> {
    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.challenges.create({
      destination,
      purpose,
      codeHash: hashOtp(code, this.pepper),
      expiresAt,
      maxAttempts: 5,
    });

    await this.delivery.send(destination, code, purpose);
  }

  async verify(destination: string, purpose: string, code: string): Promise<boolean> {
    const challenge = await this.challenges.findActive(destination, purpose);
    if (!challenge) return false;
    if (challenge.consumedAt || challenge.expiresAt.getTime() <= Date.now()) return false;
    if (challenge.attemptCount >= challenge.maxAttempts) return false;

    await this.challenges.incrementAttempt(challenge.id);
    const valid = verifyOtp(code, challenge.codeHash, this.pepper);
    if (!valid) return false;

    await this.challenges.consume(challenge.id);
    return true;
  }
}
