import { RateLimiter } from '@/app/services/rateLimiterFixedWindow';
import { NextRequest, NextResponse } from 'next/server';

const rateLimiter = new RateLimiter({ windowSize: 10000, maxRequests: 10 });

export async function GET(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('X-Forwarded-For') ?? 'unknown';
  const isRateLimited = rateLimiter.limit(ip);

  if (isRateLimited)
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });

  return NextResponse.json({ data: 'success' }, { status: 200 });
}
