import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitService {
  private readonly attempts = new Map<string, number[]>();

  isAllowed(key: string, limit = 5, windowMs = 60_000): boolean {
    const now = Date.now();
    const timestamps = this.attempts.get(key) ?? [];
    const valid = timestamps.filter((ts) => now - ts < windowMs);

    if (valid.length >= limit) {
      this.attempts.set(key, valid);
      return false;
    }

    valid.push(now);
    this.attempts.set(key, valid);
    return true;
  }
}
