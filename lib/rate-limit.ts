import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

let _freeTierLimit: Ratelimit | null = null;
let _proTierLimit: Ratelimit | null = null;

export function getFreeTierLimit(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (!_freeTierLimit) {
    _freeTierLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        parseInt(process.env.CONVERSIONS_PER_DAY_FREE ?? "3"),
        "24 h"
      ),
      prefix: "ratelimit:free",
    });
  }
  return _freeTierLimit;
}

export function getProTierLimit(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (!_proTierLimit) {
    _proTierLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, "24 h"),
      prefix: "ratelimit:pro",
    });
  }
  return _proTierLimit;
}

export async function checkRateLimit(
  identifier: string,
  isPro: boolean
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limiter = isPro ? getProTierLimit() : getFreeTierLimit();

  // If Redis is not configured, allow all requests (dev mode)
  if (!limiter) {
    return { success: true, remaining: 999, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
