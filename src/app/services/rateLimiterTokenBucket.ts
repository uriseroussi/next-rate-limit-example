/**
 * Token Bucket Rate Limiter
 */
class RateLimiter {
  refillRate: number;
  maxTokens: number;
  idToBucket: Map<string, { tokens: number; lastRefill: number }>;

  constructor(config: { refillRate: number; maxTokens: number }) {
    this.refillRate = config.refillRate;
    this.maxTokens = config.maxTokens;
    this.idToBucket = new Map<string, { tokens: number; lastRefill: number }>();
  }

  limit(id: string) {
    const now = Date.now();

    // get bucket or initialize it
    let bucket = this.idToBucket.get(id);
    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: now };
      this.idToBucket.set(id, bucket);
    }

    // refill bucket if needed
    const tokensToRefill = Math.floor(
      (now - bucket.lastRefill) / this.refillRate
    );
    if (tokensToRefill > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToRefill);
      bucket.lastRefill = now;
    }

    // consume a token if there are any
    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
    } else {
      return true;
    }

    return false;
  }
}

export { RateLimiter };
